import { createHash } from "node:crypto";
import { splitExpense } from "./split.ts";
import type { DebtCenterState, DebtSettlement, RecurringExpenseTemplate, SharedExpense, SplitSpec } from "./types.ts";

export const MAX_RECURRING_TEMPLATES = 50;
export const MAX_ACTIVE_RECURRING_TEMPLATES = 20;
export const MAX_OCCURRENCES_PER_TEMPLATE = 60;

export function recurringFingerprint(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function parseMonthlyOccurrenceDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error("INVALID_RECURRENCE_DATE");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isSafeInteger(year) || year < 2020 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 28) {
    throw new Error("INVALID_RECURRENCE_DATE");
  }
  return { year, month, day, value: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` };
}

export function nextMonthlyOccurrence(value: string) {
  const current = parseMonthlyOccurrenceDate(value);
  const year = current.month === 12 ? current.year + 1 : current.year;
  const month = current.month === 12 ? 1 : current.month + 1;
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(current.day).padStart(2, "0")}`;
}

export function splitSpecFromExpense(expense: SharedExpense): SplitSpec {
  if (expense.splitSpec) return structuredClone(expense.splitSpec);
  const participantOrder = expense.shares.map((share) => share.participantId);
  if (expense.splitMode === "equal") return { version: "split-v2", mode: "equal", participantOrder };
  if (expense.splitMode === "amount") {
    return {
      version: "split-v2",
      mode: "amount",
      participantOrder,
      values: expense.shares.map((share) => ({ participantId: share.participantId, value: share.amount })),
    };
  }
  throw new Error("RECURRENCE_TEMPLATE_STALE");
}

export function validateRecurringTemplateSnapshot(template: Pick<RecurringExpenseTemplate, "totalAmount" | "splitSpec" | "shares">) {
  const values = template.splitSpec.values
    ? Object.fromEntries(template.splitSpec.values.map(({ participantId, value }) => [participantId, value]))
    : undefined;
  const calculated = splitExpense(template.totalAmount, template.splitSpec.participantOrder, template.splitSpec.mode, values);
  if (JSON.stringify(calculated) !== JSON.stringify(template.shares)) throw new Error("RECURRENCE_TEMPLATE_STALE");
  return calculated;
}

function isValidSettlement(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  const common = typeof item.id === "string" && typeof item.debtId === "string" && Number.isSafeInteger(item.amount) && typeof item.settledAt === "string" && typeof item.recordedAt === "string";
  if (!common) return false;
  if (item.source === "payment_attempt") return typeof item.paymentAttemptId === "string" && typeof item.providerPaymentId === "string";
  if (item.source === "mock_statement_reconciliation") {
    return typeof item.reconciliationDecisionId === "string" && typeof item.statementEntryId === "string" && typeof item.confirmedByParticipantId === "string";
  }
  return false;
}

export function migrateDebtCenterState(value: unknown): DebtCenterState {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("INVALID_DEBT_CENTER_STATE");
  const state = value as Record<string, unknown>;
  if (state.version === 4) {
    if (!Array.isArray(state.recurringTemplates) || !Array.isArray(state.recurringOccurrences)) throw new Error("INVALID_DEBT_CENTER_STATE");
    if (!Array.isArray(state.collectionConfirmations)) throw new Error("INVALID_DEBT_CENTER_STATE");
    if (!Array.isArray(state.mockStatements) || !Array.isArray(state.mockStatementEntries) || !Array.isArray(state.reconciliationCandidates) || !Array.isArray(state.reconciliationDecisions)) throw new Error("INVALID_DEBT_CENTER_STATE");
    if (typeof state.generationId !== "string" || !state.generationId) throw new Error("INVALID_DEBT_CENTER_STATE");
    if (!Array.isArray(state.settlements) || !state.settlements.every(isValidSettlement)) throw new Error("INVALID_DEBT_CENTER_STATE");
    return structuredClone(value) as DebtCenterState;
  }
  if (state.version === 3) {
    if (!Array.isArray(state.recurringTemplates) || !Array.isArray(state.recurringOccurrences) || !Array.isArray(state.collectionConfirmations)) throw new Error("INVALID_DEBT_CENTER_STATE");
    const legacy = structuredClone(value) as Record<string, unknown>;
    const settlements = Array.isArray(legacy.settlements) ? legacy.settlements.map((item) => {
      const settlement = item as Record<string, unknown>;
      return {
        ...settlement,
        source: "payment_attempt",
        recordedAt: typeof settlement.settledAt === "string" ? settlement.settledAt : new Date(0).toISOString(),
      } as DebtSettlement;
    }) : [];
    return {
      ...(legacy as Omit<DebtCenterState, "version" | "settlements" | "mockStatements" | "mockStatementEntries" | "reconciliationCandidates" | "reconciliationDecisions">),
      version: 4,
      generationId: typeof legacy.generationId === "string" && legacy.generationId ? legacy.generationId : "legacy",
      settlements,
      mockStatements: [],
      mockStatementEntries: [],
      reconciliationCandidates: [],
      reconciliationDecisions: [],
    };
  }
  if (state.version === 2) {
    if (!Array.isArray(state.recurringTemplates) || !Array.isArray(state.recurringOccurrences)) throw new Error("INVALID_DEBT_CENTER_STATE");
    return migrateDebtCenterState({
      ...(structuredClone(value) as Record<string, unknown>),
      version: 3,
      generationId: "legacy",
      collectionConfirmations: [],
    });
  }
  if (state.version === 1) {
    return migrateDebtCenterState({
      ...(structuredClone(value) as Record<string, unknown>),
      version: 3,
      generationId: "legacy",
      recurringTemplates: [],
      recurringOccurrences: [],
      collectionConfirmations: [],
    });
  }
  throw new Error("UNSUPPORTED_DEBT_CENTER_STATE_VERSION");
}
