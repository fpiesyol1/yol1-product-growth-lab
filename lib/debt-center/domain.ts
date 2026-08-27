import { randomUUID } from "node:crypto";
import type {
  DebtCenterState,
  DebtCollectionState,
  DebtDashboard,
  DebtGroup,
  DebtGroupView,
  DebtStatus,
  DebtSummary,
  PaymentAttempt,
  PaymentAttemptStatus,
  PaymentAttemptView,
  PublicDebt,
  RecurringExpenseTemplate,
  RecurringExpenseTemplateView,
  RecurringOccurrence,
  RecurringOccurrenceView,
  SharedExpense,
  SharedExpenseView,
  SocialDebt,
} from "./types";
import { buildReconciliationDashboard } from "./reconciliation.ts";
import { deriveGroupNetting } from "./netting.ts";
export { splitExpense } from "./split.ts";

const ACTIVE_ATTEMPT_STATUSES: PaymentAttemptStatus[] = ["creating", "not_started", "pending"];
const TERMINAL_ATTEMPT_STATUSES: PaymentAttemptStatus[] = ["succeeded", "failed", "closed", "expired", "cancelled"];
export const PUBLIC_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
export const PUBLIC_ATTEMPT_WINDOW_LIMIT = 8;
export const PUBLIC_ATTEMPT_TOTAL_LIMIT = 50;

export type PublicAttemptLimit = {
  code: "PAYMENT_ATTEMPT_RATE_LIMITED" | "PAYMENT_ATTEMPT_LIMIT_REACHED";
  retryAfterSeconds?: number;
};

export function publicPaymentAttemptLimit(state: DebtCenterState, debtId: string, now = Date.now()): PublicAttemptLimit | null {
  const attempts = state.paymentAttempts.filter((attempt) => attempt.debtId === debtId);
  const recentTimes = attempts
    .map((attempt) => Date.parse(attempt.createdAt))
    .filter((createdAt) => Number.isFinite(createdAt) && createdAt > now - PUBLIC_ATTEMPT_WINDOW_MS && createdAt <= now)
    .sort((left, right) => left - right);
  if (recentTimes.length >= PUBLIC_ATTEMPT_WINDOW_LIMIT) {
    return {
      code: "PAYMENT_ATTEMPT_RATE_LIMITED",
      retryAfterSeconds: Math.max(1, Math.ceil((recentTimes[0] + PUBLIC_ATTEMPT_WINDOW_MS - now) / 1000)),
    };
  }
  if (attempts.length >= PUBLIC_ATTEMPT_TOTAL_LIMIT) return { code: "PAYMENT_ATTEMPT_LIMIT_REACHED" };
  return null;
}

export function buildPaymentAttemptView(attempt: PaymentAttempt): PaymentAttemptView {
  return {
    id: attempt.id,
    amount: attempt.amount,
    status: attempt.status,
    providerStep: attempt.providerStep,
    createdAt: attempt.createdAt,
    updatedAt: attempt.updatedAt,
  };
}

export function clp(value: number) {
  if (!Number.isSafeInteger(value)) throw new Error("INVALID_CLP_AMOUNT");
  return value;
}

export function paidForDebt(state: DebtCenterState, debtId: string) {
  return state.settlements
    .filter((settlement) => settlement.debtId === debtId && !(settlement.source === "mock_statement_reconciliation" && settlement.reversedAt))
    .reduce((sum, settlement) => sum + settlement.amount, 0);
}

export function outstandingForDebt(state: DebtCenterState, debt: SocialDebt) {
  return Math.max(0, debt.originalAmount - paidForDebt(state, debt.id));
}

export function statusForDebt(state: DebtCenterState, debt: SocialDebt): DebtStatus {
  if (debt.status === "cancelled") return "cancelled";
  const paid = paidForDebt(state, debt.id);
  if (paid <= 0) return "open";
  return paid >= debt.originalAmount ? "paid" : "partially_paid";
}

export function activeAttemptForDebt(state: DebtCenterState, debtId: string) {
  return state.paymentAttempts.find((attempt) => attempt.debtId === debtId && ACTIVE_ATTEMPT_STATUSES.includes(attempt.status));
}

export function assertPayableAmount(state: DebtCenterState, debt: SocialDebt, amount: number) {
  const normalized = clp(amount);
  const outstanding = outstandingForDebt(state, debt);
  if (normalized <= 0) throw new Error("INVALID_PAYMENT_AMOUNT");
  if (normalized > outstanding) throw new Error("PAYMENT_EXCEEDS_OUTSTANDING");
  if (debt.status === "cancelled" || outstanding === 0) throw new Error("DEBT_NOT_PAYABLE");
  if (activeAttemptForDebt(state, debt.id)) throw new Error("ACTIVE_PAYMENT_ATTEMPT_EXISTS");
  return normalized;
}

export function normalizeFloidStatus(status: string): PaymentAttemptStatus {
  switch (status.toUpperCase()) {
    case "NOT_STARTED": return "not_started";
    case "PENDING": return "pending";
    case "SUCCESS": return "succeeded";
    case "FAILED": return "failed";
    case "CLOSED": return "closed";
    case "EXPIRED": return "expired";
    case "CANCELED":
    case "CANCELLED": return "cancelled";
    default: throw new Error("UNKNOWN_FLOID_STATUS");
  }
}

export function applyPaymentResult(
  state: DebtCenterState,
  attemptId: string,
  nextStatus: PaymentAttemptStatus,
  input: { providerPaymentId?: string; providerStep?: string; errorCode?: string; occurredAt?: string } = {},
) {
  const attempt = state.paymentAttempts.find((item) => item.id === attemptId);
  if (!attempt) throw new Error("PAYMENT_ATTEMPT_NOT_FOUND");
  const debt = state.debts.find((item) => item.id === attempt.debtId);
  if (!debt) throw new Error("DEBT_NOT_FOUND");
  const occurredAt = input.occurredAt ?? new Date().toISOString();

  if (attempt.status === nextStatus) return attempt;
  if (TERMINAL_ATTEMPT_STATUSES.includes(attempt.status)) throw new Error("INVALID_PAYMENT_STATUS_TRANSITION");
  if (attempt.status === "creating" && !["not_started", "failed", "closed", "cancelled"].includes(nextStatus)) throw new Error("INVALID_PAYMENT_STATUS_TRANSITION");

  attempt.status = nextStatus;
  attempt.providerStep = input.providerStep ?? (nextStatus === "succeeded" ? "FINISHED" : attempt.providerStep);
  attempt.errorCode = input.errorCode;
  attempt.providerPaymentId = input.providerPaymentId ?? attempt.providerPaymentId;
  attempt.updatedAt = occurredAt;

  if (nextStatus === "succeeded") {
    if (attempt.provider === "floid" && !attempt.providerPaymentId) throw new Error("FLOID_PAYMENT_ID_MISSING");
    const existing = state.settlements.find((item) => item.source === "payment_attempt" && item.paymentAttemptId === attempt.id);
    if (!existing) {
      const outstanding = outstandingForDebt(state, debt);
      if (attempt.amount > outstanding) throw new Error("STALE_PAYMENT_ATTEMPT");
      state.settlements.push({
        id: `set_${randomUUID()}`,
        debtId: debt.id,
        source: "payment_attempt",
        paymentAttemptId: attempt.id,
        amount: attempt.amount,
        providerPaymentId: attempt.providerPaymentId ?? `mock_payment_${attempt.id}`,
        settledAt: occurredAt,
        recordedAt: occurredAt,
      });
      state.activities.unshift({
        id: `act_${randomUUID()}`,
        debtId: debt.id,
        type: "payment_succeeded",
        title: `Abono confirmado por $${attempt.amount.toLocaleString("es-CL")}`,
        detail: outstanding === attempt.amount ? "La deuda quedó pagada." : `Quedan $${(outstanding - attempt.amount).toLocaleString("es-CL")} pendientes.`,
        occurredAt,
      });
    }
  } else if (["failed", "closed", "expired", "cancelled"].includes(nextStatus)) {
    const activityType = nextStatus === "expired" ? "payment_expired" : "payment_failed";
    state.activities.unshift({
      id: `act_${randomUUID()}`,
      debtId: debt.id,
      type: activityType,
      title: nextStatus === "expired" ? "Intento de pago vencido" : "El pago no se completó",
      detail: input.errorCode ?? "Se puede crear un nuevo intento sin alterar la deuda.",
      occurredAt,
    });
  }

  debt.status = statusForDebt(state, debt);
  debt.updatedAt = occurredAt;
  return attempt;
}

function summarizeDebt(state: DebtCenterState, debt: SocialDebt): DebtSummary {
  const expense = state.expenses.find((item) => item.id === debt.expenseId);
  const group = state.groups.find((item) => item.id === debt.groupId);
  const creditor = state.participants.find((item) => item.id === debt.creditorParticipantId);
  const debtor = state.participants.find((item) => item.id === debt.debtorParticipantId);
  const settlements = state.settlements.filter((item) => item.debtId === debt.id);
  const paymentAttempts = state.paymentAttempts.filter((item) => item.debtId === debt.id);
  const activePaymentAttempts = paymentAttempts.filter((item) => ACTIVE_ATTEMPT_STATUSES.includes(item.status));
  const shareConfirmations = state.collectionConfirmations
    .filter((item) => item.debtId === debt.id)
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
  const paidAmount = settlements
    .filter((item) => !(item.source === "mock_statement_reconciliation" && item.reversedAt))
    .reduce((sum, item) => sum + item.amount, 0);
  const debtStatus = statusForDebt(state, debt);
  const collectionState: DebtCollectionState["state"] = debtStatus === "paid"
    ? "closed"
    : paidAmount > 0
      ? "partially_paid"
      : activePaymentAttempts.length > 0
        ? "payment_started"
        : shareConfirmations.length > 0
          ? "shared_by_creator"
          : "to_share";
  const { reconciliationRef: _reconciliationRef, ...publicDebt } = debt;
  void _reconciliationRef;
  return {
    ...publicDebt,
    status: debtStatus,
    groupName: group?.name ?? "Grupo",
    expenseTitle: expense?.title ?? "Gasto compartido",
    creditorName: creditor?.name ?? "Acreedor",
    debtorName: debtor?.name ?? "Deudor",
    paidAmount,
    outstandingAmount: Math.max(0, debt.originalAmount - paidAmount),
    paymentAttempts: paymentAttempts.map(buildPaymentAttemptView),
    settlements: settlements
      .filter((item) => !(item.source === "mock_statement_reconciliation" && item.reversedAt))
      .map(({ id, debtId, source, amount, settledAt, recordedAt }) => ({ id, debtId, source, amount, settledAt, recordedAt })),
    collection: {
      state: collectionState,
      lastSharedAt: shareConfirmations[0]?.occurredAt,
      sharedCount: shareConfirmations.length,
      followUpCount: shareConfirmations.filter((item) => item.messageKind === "follow_up").length,
    },
  };
}

export function buildDebtGroupView(group: DebtGroup): DebtGroupView {
  const { commandId: _commandId, ...view } = group;
  void _commandId;
  return view;
}

export function buildSharedExpenseView(expense: SharedExpense): SharedExpenseView {
  const {
    commandId: _commandId,
    commandFingerprint: _commandFingerprint,
    correctionOfExpenseId: _correctionOfExpenseId,
    correction,
    ...view
  } = expense;
  void _commandId;
  void _commandFingerprint;
  void _correctionOfExpenseId;
  return correction ? {
    ...view,
    correction: {
      cancelledByParticipantId: correction.cancelledByParticipantId,
      replacementExpenseId: correction.replacementExpenseId,
    },
  } : view;
}

export function buildRecurringTemplateView(template: RecurringExpenseTemplate): RecurringExpenseTemplateView {
  const { commandId: _commandId, commandFingerprint: _commandFingerprint, lastStatusCommand: _lastStatusCommand, ...view } = template;
  void _commandId;
  void _commandFingerprint;
  void _lastStatusCommand;
  return view;
}

export function buildRecurringOccurrenceView(occurrence: RecurringOccurrence): RecurringOccurrenceView {
  const { commandId: _commandId, commandFingerprint: _commandFingerprint, ...view } = occurrence;
  void _commandId;
  void _commandFingerprint;
  return view;
}

export function buildDashboard(state: DebtCenterState, storage: "memory" | "neon", provider: "mock_floid" | "floid"): DebtDashboard {
  const debts = state.debts.map((debt) => summarizeDebt(state, debt));
  const currentParticipant = state.participants.find((item) => item.id === state.currentParticipantId);
  if (!currentParticipant) throw new Error("CURRENT_PARTICIPANT_NOT_FOUND");
  const receivableDebts = debts.filter((debt) => debt.creditorParticipantId === currentParticipant.id && debt.status !== "cancelled");
  return {
    mode: "simulator",
    storage,
    provider,
    currentParticipant,
    participants: state.participants,
    groups: state.groups.map(buildDebtGroupView),
    expenses: state.expenses.map(buildSharedExpenseView),
    debts,
    activities: state.activities.slice(0, 30),
    recurringTemplates: state.recurringTemplates.map(buildRecurringTemplateView),
    recurringOccurrences: state.recurringOccurrences.map(buildRecurringOccurrenceView),
    reconciliation: buildReconciliationDashboard(state),
    groupNetting: state.groups.flatMap((group) => {
      try {
        return [deriveGroupNetting(group, debts)];
      } catch {
        return [];
      }
    }),
    totals: {
      receivable: receivableDebts.reduce((sum, debt) => sum + debt.originalAmount, 0),
      received: receivableDebts.reduce((sum, debt) => sum + debt.paidAmount, 0),
      outstanding: receivableDebts.reduce((sum, debt) => sum + debt.outstandingAmount, 0),
      openDebts: receivableDebts.filter((debt) => debt.outstandingAmount > 0).length,
    },
  };
}

export function buildPublicDebt(state: DebtCenterState, publicToken: string): PublicDebt | null {
  const debt = state.debts.find((item) => item.publicToken === publicToken);
  if (!debt) return null;
  const summary = summarizeDebt(state, debt);
  const lastCompleted = state.settlements
    .filter((item) => item.debtId === debt.id && item.source === "payment_attempt")
    .sort((left, right) => right.settledAt.localeCompare(left.settledAt))[0];
  return {
    publicToken,
    debtId: debt.id,
    expenseTitle: summary.expenseTitle,
    groupName: summary.groupName,
    creditorName: summary.creditorName,
    debtorName: summary.debtorName,
    originalAmount: summary.originalAmount,
    paidAmount: summary.paidAmount,
    outstandingAmount: summary.outstandingAmount,
    status: summary.status,
    activeAttempt: (() => {
      const attempt = activeAttemptForDebt(state, debt.id);
      return attempt ? buildPaymentAttemptView(attempt) : undefined;
    })(),
    lastCompletedAttempt: lastCompleted && lastCompleted.source === "payment_attempt"
      ? { id: lastCompleted.paymentAttemptId, amount: lastCompleted.amount, completedAt: lastCompleted.settledAt }
      : undefined,
  };
}

export function debtsFromExpense(expense: SharedExpense, createdAt = new Date().toISOString()): SocialDebt[] {
  return expense.shares
    .filter((share) => share.participantId !== expense.paidByParticipantId && share.amount > 0)
    .map((share) => ({
      id: `debt_${randomUUID()}`,
      publicToken: `pay_${randomUUID().replaceAll("-", "")}`,
      groupId: expense.groupId,
      expenseId: expense.id,
      creditorParticipantId: expense.paidByParticipantId,
      debtorParticipantId: share.participantId,
      originalAmount: share.amount,
      reconciliationRef: `recon_${randomUUID().replaceAll("-", "")}`,
      status: "open",
      createdAt,
      updatedAt: createdAt,
    }));
}
