import { createHash, randomUUID } from "node:crypto";
import {
  applyPaymentResult,
  assertPayableAmount,
  buildDashboard,
  buildPaymentAttemptView,
  buildPublicDebt,
  debtsFromExpense,
  outstandingForDebt,
  publicPaymentAttemptLimit,
  splitExpense,
  statusForDebt,
} from "./domain";
import { getPaymentProvider } from "./floid-provider";
import {
  getDebtCenterRepository,
  loadDebtCenterStateByPublicToken,
  loadDebtCenterStateForSession,
  mutateDebtCenterState,
  mutateDebtCenterStateByPublicToken,
  resetDebtCenterStateForSession,
} from "./state-repository";
import { debtCenterWorkspaceId } from "./session";
import { PaymentProviderError } from "./payment-provider";
import {
  MAX_ACTIVE_RECURRING_TEMPLATES,
  MAX_OCCURRENCES_PER_TEMPLATE,
  MAX_RECURRING_TEMPLATES,
  nextMonthlyOccurrence,
  parseMonthlyOccurrenceDate,
  recurringFingerprint,
  splitSpecFromExpense,
  validateRecurringTemplateSnapshot,
} from "./recurrence";
import {
  MAX_COLLECTION_CONFIRMATIONS,
  MAX_DEBT_CENTER_DEBTS,
  MAX_DEBT_CENTER_EXPENSES,
  MAX_DEBT_CENTER_GROUPS,
  MAX_DEBT_CENTER_PARTICIPANTS,
} from "./limits.ts";
import type { CollectionMessageKind, DebtCenterCompanionSummary, DebtCenterState, PaymentAttemptStatus, RecurringExpenseTemplate, SharedExpense, SplitMode } from "./types";
import {
  candidatesForEntry,
  hasActivePaymentAttempt,
  latestDecisionForEntry,
  MAX_MOCK_STATEMENTS,
  MAX_MOCK_STATEMENT_ENTRIES,
  MAX_RECONCILIATION_CANDIDATES,
  MAX_RECONCILIATION_DECISIONS,
  MOCK_STATEMENT_FIXTURE_VERSION,
  mockStatementFixture,
  reconciliationOutstanding,
} from "./reconciliation.ts";

export type CreateGroupInput = {
  commandId: string;
  name: string;
  category: "trip" | "home" | "meal" | "activity" | "monthly" | "other";
  participantIds: string[];
  newParticipantNames?: string[];
};

export async function createDebtGroup(sessionId: string, input: CreateGroupInput) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    if (!/^group_cmd_[a-f0-9]{32}$/.test(input.commandId)) throw new Error("INVALID_GROUP_COMMAND_ID");
    const name = input.name.trim().slice(0, 70);
    if (name.length < 2) throw new Error("INVALID_GROUP_NAME");
    const participantIds = [...new Set(input.participantIds)];
    if (!participantIds.includes(state.currentParticipantId)) participantIds.unshift(state.currentParticipantId);
    const newParticipantNames = (input.newParticipantNames ?? []).map((value) => value.trim().slice(0, 60)).filter(Boolean);
    if (participantIds.length + newParticipantNames.length > 30) throw new Error("TOO_MANY_PARTICIPANTS");
    for (const participantId of participantIds) {
      if (!state.participants.some((item) => item.id === participantId)) throw new Error("PARTICIPANT_NOT_FOUND");
    }
    const existing = state.groups.find((item) => item.commandId === input.commandId);
    if (existing) {
      const createdNames = existing.participantIds
        .filter((id) => !participantIds.includes(id))
        .map((id) => state.participants.find((participant) => participant.id === id)?.name ?? "");
      const sameCommand = existing.name === name
        && existing.category === input.category
        && participantIds.every((id) => existing.participantIds.includes(id))
        && JSON.stringify(createdNames) === JSON.stringify(newParticipantNames);
      if (!sameCommand) throw new Error("IDEMPOTENCY_CONFLICT");
      return existing;
    }
    if (state.groups.length >= MAX_DEBT_CENTER_GROUPS) throw new Error("DEBT_CENTER_GROUP_LIMIT_REACHED");
    if (state.participants.length + newParticipantNames.length > MAX_DEBT_CENTER_PARTICIPANTS) throw new Error("DEBT_CENTER_PARTICIPANT_LIMIT_REACHED");
    for (const participantName of newParticipantNames) {
      const id = `person_${randomUUID()}`;
      state.participants.push({
        id,
        name: participantName,
        contact: "Contacto demo · aún no invitado",
        initials: participantName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join(""),
      });
      participantIds.push(id);
    }
    if (participantIds.length < 2) throw new Error("GROUP_NEEDS_PARTICIPANTS");
    const createdAt = new Date().toISOString();
    const group = { id: `group_${randomUUID()}`, commandId: input.commandId, name, category: input.category, currency: "CLP" as const, participantIds, createdAt };
    state.groups.unshift(group);
    return group;
  });
}

export async function getDebtDashboard(sessionId: string) {
  const repository = getDebtCenterRepository();
  const stored = await loadDebtCenterStateForSession(sessionId);
  return buildDashboard(stored.state, repository.kind, "mock_floid");
}

export async function getDebtCenterCompanionSummary(sessionId: string): Promise<DebtCenterCompanionSummary> {
  const dashboard = await getDebtDashboard(sessionId);
  const currentId = dashboard.currentParticipant.id;
  const receivables = dashboard.debts
    .filter((debt) => debt.creditorParticipantId === currentId && debt.status !== "cancelled" && debt.outstandingAmount > 0)
    .map(({ id, debtorName, expenseTitle, groupName, originalAmount, paidAmount, outstandingAmount, status }) => ({ id, debtorName, expenseTitle, groupName, originalAmount, paidAmount, outstandingAmount, status }));
  const payables = dashboard.debts
    .filter((debt) => debt.debtorParticipantId === currentId && debt.status !== "cancelled" && debt.outstandingAmount > 0)
    .map(({ id, creditorName, expenseTitle, groupName, originalAmount, paidAmount, outstandingAmount, status }) => ({ id, creditorName, expenseTitle, groupName, originalAmount, paidAmount, outstandingAmount, status }));
  const latestReconciledEntry = dashboard.reconciliation.entries
    .filter((entry) => entry.state === "confirmed" && entry.selectedDebtId)
    .sort((left, right) => right.bookedAt.localeCompare(left.bookedAt))[0];
  const latestReconciledDebt = latestReconciledEntry ? dashboard.debts.find((debt) => debt.id === latestReconciledEntry.selectedDebtId) : undefined;
  const latestReconciledCandidate = latestReconciledEntry?.candidates.find((candidate) => candidate.debtId === latestReconciledEntry.selectedDebtId);
  return {
    schemaVersion: "1",
    source: "debt_center_ledger",
    asOf: new Date().toISOString(),
    receivableOutstanding: receivables.reduce((sum, debt) => sum + debt.outstandingAmount, 0),
    payableOutstanding: payables.reduce((sum, debt) => sum + debt.outstandingAmount, 0),
    receivableCount: receivables.length,
    payableCount: payables.length,
    reconciliation: {
      statementLoaded: dashboard.reconciliation.statementLoaded,
      pendingCount: dashboard.reconciliation.pendingCount,
      confirmedCount: dashboard.reconciliation.confirmedCount,
      latestResult: latestReconciledEntry && latestReconciledDebt && latestReconciledCandidate ? {
        debtId: latestReconciledDebt.id,
        debtorName: latestReconciledDebt.debtorName,
        expenseTitle: latestReconciledDebt.expenseTitle,
        amount: latestReconciledCandidate.amount,
        outstandingAmount: latestReconciledDebt.outstandingAmount,
        source: latestReconciledEntry.decisionSource ?? "creator",
      } : undefined,
    },
    receivables,
    payables,
  };
}

export async function resetDebtDemo(sessionId: string) {
  await resetDebtCenterStateForSession(sessionId);
  return getDebtDashboard(sessionId);
}

function reconciliationCommand(pattern: RegExp, commandId: string) {
  if (!pattern.test(commandId)) throw new Error("INVALID_RECONCILIATION_COMMAND_ID");
}

function reconciliationCommandReplay(state: DebtCenterState, commandId: string) {
  return state.reconciliationDecisions.find((item) => item.commandId === commandId);
}

export async function loadMockStatement(sessionId: string, input: { commandId: string; fixtureVersion: string }) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    reconciliationCommand(/^recon_load_cmd_[a-f0-9]{32}$/, input.commandId);
    if (input.fixtureVersion !== MOCK_STATEMENT_FIXTURE_VERSION) throw new Error("INVALID_RECONCILIATION_FIXTURE");
    const priorByCommand = state.mockStatements.find((item) => item.loadCommandId === input.commandId);
    if (priorByCommand) {
      if (priorByCommand.fixtureVersion !== input.fixtureVersion) throw new Error("IDEMPOTENCY_CONFLICT");
      return priorByCommand;
    }
    const naturalReplay = state.mockStatements.find((item) => item.fixtureVersion === input.fixtureVersion);
    if (naturalReplay) return naturalReplay;
    if (state.mockStatements.length >= MAX_MOCK_STATEMENTS) throw new Error("RECONCILIATION_LIMIT_REACHED");
    const loadedAt = new Date().toISOString();
    const fixture = mockStatementFixture(loadedAt);
    if (fixture.statement.accountOwnerParticipantId !== state.currentParticipantId) throw new Error("RECONCILIATION_NOT_OWNED");
    if (state.mockStatementEntries.length + fixture.entries.length > MAX_MOCK_STATEMENT_ENTRIES) throw new Error("RECONCILIATION_LIMIT_REACHED");
    fixture.statement.loadCommandId = input.commandId;
    state.mockStatements.push(fixture.statement);
    state.mockStatementEntries.push(...fixture.entries);

    for (const entry of fixture.entries) {
      const detected = candidatesForEntry(state, entry, loadedAt);
      if (state.reconciliationCandidates.length + detected.length > MAX_RECONCILIATION_CANDIDATES) throw new Error("RECONCILIATION_LIMIT_REACHED");
      state.reconciliationCandidates.push(...detected);
      const exact = detected.filter((candidate) => candidate.reasons.includes("exact_reference"));
      if (exact.length !== 1 || hasActivePaymentAttempt(state, exact[0].debtId)) continue;
      const candidate = exact[0];
      const debt = state.debts.find((item) => item.id === candidate.debtId);
      if (!debt || debt.creditorParticipantId !== state.currentParticipantId || candidate.amount > reconciliationOutstanding(state, debt)) continue;
      if (state.reconciliationDecisions.length >= MAX_RECONCILIATION_DECISIONS) throw new Error("RECONCILIATION_LIMIT_REACHED");
      const decisionId = `recon_decision_${randomUUID()}`;
      const settlementId = `set_${randomUUID()}`;
      state.reconciliationDecisions.push({
        id: decisionId,
        commandId: `recon_auto_${createHash("sha256").update(`${entry.id}:${candidate.id}`).digest("hex").slice(0, 32)}`,
        candidateId: candidate.id,
        statementEntryId: entry.id,
        debtId: debt.id,
        amount: candidate.amount,
        action: "rule_auto_applied",
        decidedByParticipantId: state.currentParticipantId,
        decidedAt: loadedAt,
        settlementId,
      });
      state.settlements.push({
        id: settlementId,
        debtId: debt.id,
        source: "mock_statement_reconciliation",
        reconciliationDecisionId: decisionId,
        statementEntryId: entry.id,
        confirmedByParticipantId: state.currentParticipantId,
        amount: candidate.amount,
        settledAt: entry.bookedAt,
        recordedAt: loadedAt,
      });
      debt.status = statusForDebt(state, debt);
      debt.updatedAt = loadedAt;
      state.activities.unshift({
        id: `act_${randomUUID()}`,
        debtId: debt.id,
        type: "reconciliation_confirmed",
        title: `Abono demo conciliado por $${candidate.amount.toLocaleString("es-CL")}`,
        detail: "Coincidió una referencia exacta del fixture local. Puedes revisar o deshacer esta decisión.",
        occurredAt: loadedAt,
      });
    }
    state.activities.unshift({
      id: `act_${randomUUID()}`,
      type: "statement_loaded",
      title: "Cartola demo cargada",
      detail: "Se analizaron movimientos ficticios con reglas locales. No se conectó ningún banco.",
      occurredAt: loadedAt,
    });
    return fixture.statement;
  });
}

export async function confirmReconciliationCandidate(sessionId: string, input: { commandId: string; candidateId: string; expectedOutstandingAmount: number }) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    reconciliationCommand(/^recon_confirm_cmd_[a-f0-9]{32}$/, input.commandId);
    const replay = reconciliationCommandReplay(state, input.commandId);
    if (replay) {
      if (replay.candidateId !== input.candidateId || replay.action !== "creator_confirmed") throw new Error("IDEMPOTENCY_CONFLICT");
      return replay;
    }
    const candidate = state.reconciliationCandidates.find((item) => item.id === input.candidateId);
    if (!candidate) throw new Error("RECONCILIATION_CANDIDATE_NOT_FOUND");
    const naturalReplay = state.reconciliationDecisions.find((item) => item.candidateId === candidate.id && (item.action === "creator_confirmed" || item.action === "rule_auto_applied"));
    if (naturalReplay) return naturalReplay;
    const entry = state.mockStatementEntries.find((item) => item.id === candidate.statementEntryId);
    const statement = entry && state.mockStatements.find((item) => item.id === entry.statementId);
    const debt = state.debts.find((item) => item.id === candidate.debtId);
    if (!entry || !statement || !debt) throw new Error("RECONCILIATION_CANDIDATE_NOT_FOUND");
    if (statement.accountOwnerParticipantId !== state.currentParticipantId || debt.creditorParticipantId !== state.currentParticipantId) throw new Error("RECONCILIATION_NOT_OWNED");
    if (state.settlements.some((item) => item.source === "mock_statement_reconciliation" && item.statementEntryId === entry.id && !item.reversedAt)) throw new Error("RECONCILIATION_ENTRY_ALREADY_USED");
    const outstanding = reconciliationOutstanding(state, debt);
    if (!Number.isSafeInteger(input.expectedOutstandingAmount) || outstanding !== input.expectedOutstandingAmount || outstanding !== candidate.outstandingAtDetection || candidate.amount > outstanding || debt.status === "cancelled") throw new Error("RECONCILIATION_CANDIDATE_STALE");
    if (hasActivePaymentAttempt(state, debt.id)) throw new Error("RECONCILIATION_PAYMENT_IN_PROGRESS");
    if (state.reconciliationDecisions.length >= MAX_RECONCILIATION_DECISIONS) throw new Error("RECONCILIATION_LIMIT_REACHED");
    const decidedAt = new Date().toISOString();
    const settlementId = `set_${randomUUID()}`;
    const decision = {
      id: `recon_decision_${randomUUID()}`,
      commandId: input.commandId,
      candidateId: candidate.id,
      statementEntryId: entry.id,
      debtId: debt.id,
      amount: candidate.amount,
      action: "creator_confirmed" as const,
      decidedByParticipantId: state.currentParticipantId,
      decidedAt,
      settlementId,
    };
    state.reconciliationDecisions.push(decision);
    state.settlements.push({
      id: settlementId,
      debtId: debt.id,
      source: "mock_statement_reconciliation",
      reconciliationDecisionId: decision.id,
      statementEntryId: entry.id,
      confirmedByParticipantId: state.currentParticipantId,
      amount: candidate.amount,
      settledAt: entry.bookedAt,
      recordedAt: decidedAt,
    });
    debt.status = statusForDebt(state, debt);
    debt.updatedAt = decidedAt;
    state.activities.unshift({ id: `act_${randomUUID()}`, debtId: debt.id, type: "reconciliation_confirmed", title: `Registraste un abono demo de $${candidate.amount.toLocaleString("es-CL")}`, detail: "Declaración tuya basada en una cartola ficticia. No acredita una transferencia real.", occurredAt: decidedAt });
    return decision;
  });
}

export async function rejectReconciliationEntry(sessionId: string, input: { commandId: string; entryId: string }) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    reconciliationCommand(/^recon_reject_cmd_[a-f0-9]{32}$/, input.commandId);
    const replay = reconciliationCommandReplay(state, input.commandId);
    if (replay) {
      if (replay.statementEntryId !== input.entryId || replay.action !== "creator_rejected") throw new Error("IDEMPOTENCY_CONFLICT");
      return replay;
    }
    const entry = state.mockStatementEntries.find((item) => item.id === input.entryId);
    const statement = entry && state.mockStatements.find((item) => item.id === entry.statementId);
    if (!entry || !statement) throw new Error("RECONCILIATION_ENTRY_NOT_FOUND");
    if (statement.accountOwnerParticipantId !== state.currentParticipantId) throw new Error("RECONCILIATION_NOT_OWNED");
    const latest = latestDecisionForEntry(state, entry.id);
    if (latest?.action === "creator_rejected") return latest;
    if (latest?.action === "creator_confirmed" || latest?.action === "rule_auto_applied") throw new Error("RECONCILIATION_ENTRY_ALREADY_USED");
    if (state.reconciliationDecisions.length >= MAX_RECONCILIATION_DECISIONS) throw new Error("RECONCILIATION_LIMIT_REACHED");
    const decidedAt = new Date().toISOString();
    const decision = { id: `recon_decision_${randomUUID()}`, commandId: input.commandId, statementEntryId: entry.id, action: "creator_rejected" as const, decidedByParticipantId: state.currentParticipantId, decidedAt };
    state.reconciliationDecisions.push(decision);
    state.activities.unshift({ id: `act_${randomUUID()}`, type: "reconciliation_rejected", title: "Descartaste una coincidencia demo", detail: "Ningún saldo cambió. Puedes deshacer esta decisión.", occurredAt: decidedAt });
    return decision;
  });
}

export async function reopenReconciliationEntry(sessionId: string, input: { commandId: string; entryId: string }) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    reconciliationCommand(/^recon_reopen_cmd_[a-f0-9]{32}$/, input.commandId);
    const replay = reconciliationCommandReplay(state, input.commandId);
    if (replay) {
      if (replay.statementEntryId !== input.entryId || replay.action !== "reopened") throw new Error("IDEMPOTENCY_CONFLICT");
      return replay;
    }
    const latest = latestDecisionForEntry(state, input.entryId);
    if (!latest || latest.action !== "creator_rejected") throw new Error("RECONCILIATION_NOT_REJECTED");
    if (latest.decidedByParticipantId !== state.currentParticipantId) throw new Error("RECONCILIATION_NOT_OWNED");
    if (state.reconciliationDecisions.length >= MAX_RECONCILIATION_DECISIONS) throw new Error("RECONCILIATION_LIMIT_REACHED");
    const decidedAt = new Date().toISOString();
    const decision = { id: `recon_decision_${randomUUID()}`, commandId: input.commandId, statementEntryId: input.entryId, action: "reopened" as const, decidedByParticipantId: state.currentParticipantId, decidedAt };
    state.reconciliationDecisions.push(decision);
    state.activities.unshift({ id: `act_${randomUUID()}`, type: "reconciliation_reopened", title: "Volviste a revisar el movimiento demo", detail: "El candidato volvió a quedar pendiente. Ningún saldo cambió.", occurredAt: decidedAt });
    return decision;
  });
}

export async function reverseReconciliationDecision(sessionId: string, input: { commandId: string; decisionId: string }) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    reconciliationCommand(/^recon_reverse_cmd_[a-f0-9]{32}$/, input.commandId);
    const replay = reconciliationCommandReplay(state, input.commandId);
    if (replay) {
      if (replay.action !== "reversed") throw new Error("IDEMPOTENCY_CONFLICT");
      return replay;
    }
    const original = state.reconciliationDecisions.find((item) => item.id === input.decisionId && (item.action === "creator_confirmed" || item.action === "rule_auto_applied"));
    if (!original?.settlementId || !original.debtId) throw new Error("RECONCILIATION_DECISION_NOT_FOUND");
    const settlement = state.settlements.find((item) => item.id === original.settlementId);
    const debt = state.debts.find((item) => item.id === original.debtId);
    if (!settlement || settlement.source !== "mock_statement_reconciliation" || !debt) throw new Error("RECONCILIATION_DECISION_NOT_FOUND");
    if (original.decidedByParticipantId !== state.currentParticipantId || debt.creditorParticipantId !== state.currentParticipantId) throw new Error("RECONCILIATION_NOT_OWNED");
    if (settlement.reversedAt) return state.reconciliationDecisions.find((item) => item.id === settlement.reversedByDecisionId) ?? original;
    if (state.reconciliationDecisions.length >= MAX_RECONCILIATION_DECISIONS) throw new Error("RECONCILIATION_LIMIT_REACHED");
    const decidedAt = new Date().toISOString();
    const decision = { id: `recon_decision_${randomUUID()}`, commandId: input.commandId, candidateId: original.candidateId, statementEntryId: original.statementEntryId, debtId: debt.id, amount: original.amount, action: "reversed" as const, decidedByParticipantId: state.currentParticipantId, decidedAt, settlementId: settlement.id };
    state.reconciliationDecisions.push(decision);
    settlement.reversedAt = decidedAt;
    settlement.reversedByDecisionId = decision.id;
    debt.status = statusForDebt(state, debt);
    debt.updatedAt = decidedAt;
    state.activities.unshift({ id: `act_${randomUUID()}`, debtId: debt.id, type: "reconciliation_reversed", title: "Deshiciste un abono registrado", detail: "Sólo cambió el ledger demo. La evidencia permanece en la actividad.", occurredAt: decidedAt });
    return decision;
  });
}

export async function getPublicDebtByToken(publicToken: string) {
  const stored = await loadDebtCenterStateByPublicToken(publicToken);
  return stored ? buildPublicDebt(stored.state, publicToken) : null;
}

export type CreateExpenseInput = {
  commandId: string;
  groupId: string;
  title: string;
  totalAmount: number;
  paidByParticipantId: string;
  participantIds: string[];
  splitMode: SplitMode;
  splitValues?: Record<string, number>;
  receiptName?: string;
  correctionOfExpenseId?: string;
};

export async function createSharedExpense(sessionId: string, input: CreateExpenseInput) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    if (!/^draft_[a-f0-9]{32}$/.test(input.commandId)) throw new Error("INVALID_EXPENSE_COMMAND_ID");
    if (input.participantIds.length > 30) throw new Error("TOO_MANY_PARTICIPANTS");
    const group = state.groups.find((item) => item.id === input.groupId);
    if (!group) throw new Error("GROUP_NOT_FOUND");
    const title = input.title.trim().slice(0, 90);
    if (title.length < 2) throw new Error("INVALID_EXPENSE_TITLE");
    if (!input.participantIds.includes(input.paidByParticipantId)) throw new Error("PAYER_MUST_PARTICIPATE");
    if (input.participantIds.some((id) => !group.participantIds.includes(id))) throw new Error("PARTICIPANT_NOT_IN_GROUP");
    const splitValues = input.splitValues;
    const splitSpec = {
      version: "split-v2" as const,
      mode: input.splitMode,
      participantOrder: [...input.participantIds],
      values: splitValues ? input.participantIds.map((participantId) => ({ participantId, value: splitValues[participantId] })) : undefined,
    };
    const shares = splitExpense(input.totalAmount, input.participantIds, input.splitMode, splitValues);
    const receiptName = input.receiptName?.trim().slice(0, 120) ?? "";
    const commandFingerprint = createHash("sha256").update(JSON.stringify({
      version: "expense-command-v2",
      groupId: input.groupId,
      title,
      totalAmount: input.totalAmount,
      paidByParticipantId: input.paidByParticipantId,
      splitSpec,
      receiptName,
      correctionOfExpenseId: input.correctionOfExpenseId,
    })).digest("hex");
    const existing = state.expenses.find((item) => item.commandId === input.commandId);
    if (existing) {
      const legacySameCommand = existing.groupId === input.groupId
        && existing.title === title
        && existing.totalAmount === input.totalAmount
        && existing.paidByParticipantId === input.paidByParticipantId
        && existing.splitMode === input.splitMode
        && JSON.stringify(existing.shares) === JSON.stringify(shares)
        && (existing.receipt?.name ?? "") === receiptName;
      const sameCommand = existing.commandFingerprint
        ? existing.commandFingerprint === commandFingerprint
        : legacySameCommand && (!existing.splitSpec || JSON.stringify(existing.splitSpec) === JSON.stringify(splitSpec));
      if (!sameCommand) throw new Error("IDEMPOTENCY_CONFLICT");
      return { expense: existing, debts: state.debts.filter((debt) => debt.expenseId === existing.id) };
    }
    if (state.expenses.length >= MAX_DEBT_CENTER_EXPENSES) throw new Error("DEBT_CENTER_EXPENSE_LIMIT_REACHED");
    const correctionSource = input.correctionOfExpenseId ? state.expenses.find((item) => item.id === input.correctionOfExpenseId) : undefined;
    if (input.correctionOfExpenseId && (!correctionSource || correctionSource.lifecycle !== "cancelled_for_correction")) throw new Error("INVALID_EXPENSE_CORRECTION_SOURCE");
    if (correctionSource && (!correctionSource.correction || correctionSource.correction.cancelledByParticipantId !== state.currentParticipantId)) throw new Error("EXPENSE_CORRECTION_NOT_OWNED");
    if (correctionSource && correctionSource.groupId !== input.groupId) throw new Error("EXPENSE_CORRECTION_GROUP_CHANGED");
    if (correctionSource && (correctionSource.correction?.replacementExpenseId || state.expenses.some((item) => item.correctionOfExpenseId === correctionSource.id))) throw new Error("EXPENSE_CORRECTION_ALREADY_REPLACED");
    const projectedDebtCount = shares.filter((share) => share.participantId !== input.paidByParticipantId && share.amount > 0).length;
    if (state.debts.length + projectedDebtCount > MAX_DEBT_CENTER_DEBTS) throw new Error("DEBT_CENTER_DEBT_LIMIT_REACHED");
    const createdAt = new Date().toISOString();
    const expense: SharedExpense = {
      id: `expense_${randomUUID()}`,
      commandId: input.commandId,
      commandFingerprint,
      groupId: group.id,
      title,
      totalAmount: input.totalAmount,
      paidByParticipantId: input.paidByParticipantId,
      splitMode: input.splitMode,
      splitSpec,
      shares,
      receipt: receiptName ? { name: receiptName, extraction: "mock", confidence: 0.92 } : undefined,
      createdByParticipantId: state.currentParticipantId,
      lifecycle: "active",
      correctionOfExpenseId: correctionSource?.id,
      createdAt,
    };
    const debts = debtsFromExpense(expense, createdAt);
    if (correctionSource?.correction) correctionSource.correction.replacementExpenseId = expense.id;
    state.expenses.unshift(expense);
    state.debts.unshift(...debts);
    state.activities.unshift({
      id: `act_${randomUUID()}`,
      type: "expense_created",
      title: `${title} quedó dividido`,
      detail: `$${expense.totalAmount.toLocaleString("es-CL")} entre ${shares.length} personas.`,
      occurredAt: createdAt,
    });
    return { expense, debts };
  });
}

export type CancelExpenseForCorrectionInput = {
  commandId: string;
  expenseId: string;
  reason: "wrong_amount" | "wrong_people" | "duplicate" | "other";
};

export async function cancelExpenseForCorrection(sessionId: string, input: CancelExpenseForCorrectionInput) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    if (!/^correction_cmd_[a-f0-9]{32}$/.test(input.commandId)) throw new Error("INVALID_EXPENSE_CORRECTION_COMMAND_ID");
    if (!["wrong_amount", "wrong_people", "duplicate", "other"].includes(input.reason)) throw new Error("INVALID_EXPENSE_CORRECTION_REASON");
    const expense = state.expenses.find((item) => item.id === input.expenseId);
    if (!expense) throw new Error("EXPENSE_NOT_FOUND");
    if (expense.correction) {
      if (expense.correction.commandId === input.commandId && expense.correction.reason === input.reason) return { expense, debts: state.debts.filter((debt) => debt.expenseId === expense.id) };
      throw new Error("EXPENSE_ALREADY_CANCELLED_FOR_CORRECTION");
    }
    if (expense.createdByParticipantId !== state.currentParticipantId) throw new Error("EXPENSE_CORRECTION_NOT_OWNED");
    const debts = state.debts.filter((debt) => debt.expenseId === expense.id);
    if (debts.some((debt) => hasActivePaymentAttempt(state, debt.id))) throw new Error("EXPENSE_CORRECTION_PAYMENT_IN_PROGRESS");
    const activeSettlements = state.settlements.filter((settlement) => debts.some((debt) => debt.id === settlement.debtId) && !(settlement.source === "mock_statement_reconciliation" && settlement.reversedAt));
    if (activeSettlements.length > 0) throw new Error("EXPENSE_CORRECTION_HAS_PAYMENT");
    if (expense.recurrence || state.recurringTemplates.some((template) => template.sourceExpenseId === expense.id && template.status === "active")) throw new Error("EXPENSE_CORRECTION_RECURRING_ACTIVE");
    const cancelledAt = new Date().toISOString();
    expense.lifecycle = "cancelled_for_correction";
    expense.correction = { commandId: input.commandId, reason: input.reason, cancelledAt, cancelledByParticipantId: state.currentParticipantId };
    debts.forEach((debt) => { debt.status = "cancelled"; debt.updatedAt = cancelledAt; });
    state.activities.unshift({
      id: `act_${randomUUID()}`,
      expenseId: expense.id,
      type: "expense_cancelled_for_correction",
      title: `${expense.title} quedó anulado`,
      detail: "Conservamos el gasto original y cerramos sus links demo. Se preparó una copia local para revisar.",
      occurredAt: cancelledAt,
    });
    return { expense, debts };
  });
}

function assertRecurringTemplateFresh(state: DebtCenterState, template: RecurringExpenseTemplate) {
  const group = state.groups.find((item) => item.id === template.groupId);
  if (!group) throw new Error("RECURRENCE_TEMPLATE_STALE");
  if (!template.splitSpec.participantOrder.includes(template.paidByParticipantId)) throw new Error("RECURRENCE_TEMPLATE_STALE");
  if (template.splitSpec.participantOrder.some((participantId) => !group.participantIds.includes(participantId))) throw new Error("RECURRENCE_TEMPLATE_STALE");
  validateRecurringTemplateSnapshot(template);
}

export type CreateRecurringTemplateInput = {
  commandId: string;
  sourceExpenseId: string;
  nextOccurrenceOn: string;
};

export async function createRecurringTemplate(sessionId: string, input: CreateRecurringTemplateInput) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    if (!/^rec_template_cmd_[a-f0-9]{32}$/.test(input.commandId)) throw new Error("INVALID_RECURRENCE_COMMAND_ID");
    const occurrenceDate = parseMonthlyOccurrenceDate(input.nextOccurrenceOn);
    const source = state.expenses.find((item) => item.id === input.sourceExpenseId);
    if (!source) throw new Error("EXPENSE_NOT_FOUND");
    if (source.lifecycle === "cancelled_for_correction") throw new Error("EXPENSE_ALREADY_CANCELLED_FOR_CORRECTION");
    const splitSpec = splitSpecFromExpense(source);
    const snapshot = {
      sourceExpenseId: source.id,
      groupId: source.groupId,
      title: source.title,
      totalAmount: source.totalAmount,
      paidByParticipantId: source.paidByParticipantId,
      splitSpec,
      shares: structuredClone(source.shares),
      cadence: { frequency: "monthly" as const, dayOfMonth: occurrenceDate.day },
      nextOccurrenceOn: occurrenceDate.value,
    };
    validateRecurringTemplateSnapshot(snapshot);
    const commandFingerprint = recurringFingerprint({ version: "recurring-template-v1", ...snapshot });
    const existing = state.recurringTemplates.find((item) => item.commandId === input.commandId);
    if (existing) {
      if (existing.commandFingerprint !== commandFingerprint) throw new Error("IDEMPOTENCY_CONFLICT");
      return existing;
    }
    if (state.recurringTemplates.some((item) => item.sourceExpenseId === source.id && item.status !== "archived")) throw new Error("EXPENSE_ALREADY_RECURRING");
    if (state.recurringTemplates.length >= MAX_RECURRING_TEMPLATES || state.recurringTemplates.filter((item) => item.status === "active").length >= MAX_ACTIVE_RECURRING_TEMPLATES) {
      throw new Error("RECURRING_TEMPLATE_LIMIT_REACHED");
    }
    const group = state.groups.find((item) => item.id === source.groupId);
    if (!group || splitSpec.participantOrder.some((participantId) => !group.participantIds.includes(participantId))) throw new Error("RECURRENCE_TEMPLATE_STALE");
    const createdAt = new Date().toISOString();
    const template: RecurringExpenseTemplate = {
      id: `rec_template_${randomUUID()}`,
      commandId: input.commandId,
      commandFingerprint,
      ...snapshot,
      status: "active",
      createdAt,
      updatedAt: createdAt,
    };
    state.recurringTemplates.unshift(template);
    state.activities.unshift({
      id: `act_${randomUUID()}`,
      type: "recurring_template_created",
      title: `${template.title} quedó como gasto habitual`,
      detail: `La siguiente ocurrencia demo está programada para ${template.nextOccurrenceOn}. No se creará automáticamente.`,
      occurredAt: createdAt,
    });
    return template;
  });
}

export type RecurringOccurrenceCommandInput = {
  commandId: string;
  templateId: string;
  expectedOccurrenceKey: string;
};

export async function materializeRecurringOccurrence(sessionId: string, input: RecurringOccurrenceCommandInput) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    if (!/^rec_occ_cmd_[a-f0-9]{32}$/.test(input.commandId)) throw new Error("INVALID_RECURRENCE_COMMAND_ID");
    const occurrenceKey = parseMonthlyOccurrenceDate(input.expectedOccurrenceKey).value;
    const template = state.recurringTemplates.find((item) => item.id === input.templateId);
    if (!template) throw new Error("RECURRING_TEMPLATE_NOT_FOUND");
    const naturalReplay = state.recurringOccurrences.find((item) => item.templateId === template.id && item.occurrenceKey === occurrenceKey);
    if (naturalReplay) {
      if (naturalReplay.status === "skipped") throw new Error("RECURRENCE_OCCURRENCE_SKIPPED");
      const expense = state.expenses.find((item) => item.id === naturalReplay.expenseId);
      if (!expense) throw new Error("RECURRENCE_TEMPLATE_STALE");
      return { template, occurrence: naturalReplay, expense, debts: state.debts.filter((debt) => debt.expenseId === expense.id) };
    }
    if (template.status !== "active") throw new Error("RECURRING_TEMPLATE_NOT_ACTIVE");
    if (occurrenceKey !== template.nextOccurrenceOn) throw new Error("RECURRENCE_OCCURRENCE_STALE");
    if (state.recurringOccurrences.filter((item) => item.templateId === template.id).length >= MAX_OCCURRENCES_PER_TEMPLATE) throw new Error("RECURRENCE_OCCURRENCE_LIMIT_REACHED");
    if (state.recurringOccurrences.some((item) => item.commandId === input.commandId)) throw new Error("IDEMPOTENCY_CONFLICT");
    if (state.expenses.length >= MAX_DEBT_CENTER_EXPENSES) throw new Error("DEBT_CENTER_EXPENSE_LIMIT_REACHED");
    const projectedDebtCount = template.shares.filter((share) => share.participantId !== template.paidByParticipantId && share.amount > 0).length;
    if (state.debts.length + projectedDebtCount > MAX_DEBT_CENTER_DEBTS) throw new Error("DEBT_CENTER_DEBT_LIMIT_REACHED");
    assertRecurringTemplateFresh(state, template);
    const commandFingerprint = recurringFingerprint({ version: "recurring-occurrence-v1", templateId: template.id, templateFingerprint: template.commandFingerprint, occurrenceKey });
    const createdAt = new Date().toISOString();
    const expense: SharedExpense = {
      id: `expense_${randomUUID()}`,
      commandId: `draft_${commandFingerprint.slice(0, 32)}`,
      commandFingerprint,
      groupId: template.groupId,
      title: template.title,
      totalAmount: template.totalAmount,
      paidByParticipantId: template.paidByParticipantId,
      splitMode: template.splitSpec.mode,
      splitSpec: structuredClone(template.splitSpec),
      shares: structuredClone(template.shares),
      createdByParticipantId: state.currentParticipantId,
      lifecycle: "active",
      recurrence: { templateId: template.id, occurrenceKey, scheduledFor: occurrenceKey },
      createdAt,
    };
    const debts = debtsFromExpense(expense, createdAt);
    const occurrence = {
      id: `rec_occ_${randomUUID()}`,
      templateId: template.id,
      occurrenceKey,
      scheduledFor: occurrenceKey,
      expenseId: expense.id,
      commandId: input.commandId,
      commandFingerprint,
      status: "materialized" as const,
      createdAt,
    };
    state.expenses.unshift(expense);
    state.debts.unshift(...debts);
    state.recurringOccurrences.unshift(occurrence);
    template.nextOccurrenceOn = nextMonthlyOccurrence(occurrenceKey);
    template.updatedAt = createdAt;
    state.activities.unshift({
      id: `act_${randomUUID()}`,
      type: "recurring_occurrence_created",
      title: `${template.title} se creó para ${occurrenceKey}`,
      detail: `Se generaron ${debts.length} obligaciones demo. Nada se pagó ni se envió automáticamente.`,
      occurredAt: createdAt,
    });
    return { template, occurrence, expense, debts };
  });
}

export async function pauseRecurringTemplate(sessionId: string, input: { commandId: string; templateId: string }) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    if (!/^rec_pause_cmd_[a-f0-9]{32}$/.test(input.commandId)) throw new Error("INVALID_RECURRENCE_COMMAND_ID");
    const template = state.recurringTemplates.find((item) => item.id === input.templateId);
    if (!template) throw new Error("RECURRING_TEMPLATE_NOT_FOUND");
    const fingerprint = recurringFingerprint({ version: "recurring-template-pause-v1", templateId: template.id });
    const reused = state.recurringTemplates.find((item) => item.lastStatusCommand?.commandId === input.commandId);
    if (reused && (reused.id !== template.id || reused.lastStatusCommand?.commandFingerprint !== fingerprint)) throw new Error("IDEMPOTENCY_CONFLICT");
    if (template.status === "archived") throw new Error("RECURRING_TEMPLATE_NOT_ACTIVE");
    if (template.status === "paused") return template;
    template.status = "paused";
    template.updatedAt = new Date().toISOString();
    template.lastStatusCommand = { commandId: input.commandId, commandFingerprint: fingerprint };
    return template;
  });
}

export async function skipRecurringOccurrence(sessionId: string, input: RecurringOccurrenceCommandInput) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    if (!/^rec_skip_cmd_[a-f0-9]{32}$/.test(input.commandId)) throw new Error("INVALID_RECURRENCE_COMMAND_ID");
    const occurrenceKey = parseMonthlyOccurrenceDate(input.expectedOccurrenceKey).value;
    const template = state.recurringTemplates.find((item) => item.id === input.templateId);
    if (!template) throw new Error("RECURRING_TEMPLATE_NOT_FOUND");
    const naturalReplay = state.recurringOccurrences.find((item) => item.templateId === template.id && item.occurrenceKey === occurrenceKey);
    if (naturalReplay) {
      if (naturalReplay.status === "materialized") throw new Error("RECURRENCE_OCCURRENCE_ALREADY_MATERIALIZED");
      return { template, occurrence: naturalReplay };
    }
    if (template.status !== "active") throw new Error("RECURRING_TEMPLATE_NOT_ACTIVE");
    if (occurrenceKey !== template.nextOccurrenceOn) throw new Error("RECURRENCE_OCCURRENCE_STALE");
    if (state.recurringOccurrences.filter((item) => item.templateId === template.id).length >= MAX_OCCURRENCES_PER_TEMPLATE) throw new Error("RECURRENCE_OCCURRENCE_LIMIT_REACHED");
    if (state.recurringOccurrences.some((item) => item.commandId === input.commandId)) throw new Error("IDEMPOTENCY_CONFLICT");
    const commandFingerprint = recurringFingerprint({ version: "recurring-occurrence-skip-v1", templateId: template.id, templateFingerprint: template.commandFingerprint, occurrenceKey });
    const createdAt = new Date().toISOString();
    const occurrence = {
      id: `rec_occ_${randomUUID()}`,
      templateId: template.id,
      occurrenceKey,
      scheduledFor: occurrenceKey,
      commandId: input.commandId,
      commandFingerprint,
      status: "skipped" as const,
      createdAt,
    };
    state.recurringOccurrences.unshift(occurrence);
    template.nextOccurrenceOn = nextMonthlyOccurrence(occurrenceKey);
    template.updatedAt = createdAt;
    return { template, occurrence };
  });
}

export async function confirmCollectionShared(sessionId: string, input: { commandId: string; debtId: string; messageKind: CollectionMessageKind }) {
  return mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
    if (!/^collection_share_cmd_[a-f0-9]{32}$/.test(input.commandId)) throw new Error("INVALID_COLLECTION_COMMAND_ID");
    if (input.messageKind !== "initial" && input.messageKind !== "follow_up") throw new Error("INVALID_COLLECTION_MESSAGE_KIND");
    const existing = state.collectionConfirmations.find((item) => item.commandId === input.commandId);
    if (existing) {
      if (existing.debtId !== input.debtId || existing.messageKind !== input.messageKind || existing.confirmedByParticipantId !== state.currentParticipantId) {
        throw new Error("IDEMPOTENCY_CONFLICT");
      }
      return existing;
    }
    const debt = state.debts.find((item) => item.id === input.debtId);
    if (!debt) throw new Error("DEBT_NOT_FOUND");
    if (debt.creditorParticipantId !== state.currentParticipantId) throw new Error("COLLECTION_NOT_OWNED");
    if (outstandingForDebt(state, debt) <= 0 || debt.status === "cancelled") throw new Error("DEBT_NOT_COLLECTABLE");
    const prior = state.collectionConfirmations.filter((item) => item.debtId === debt.id);
    const initial = prior.find((item) => item.messageKind === "initial");
    if (input.messageKind === "initial" && initial) return initial;
    if (input.messageKind === "follow_up" && prior.length === 0) throw new Error("COLLECTION_FOLLOW_UP_REQUIRES_INITIAL");
    if (state.collectionConfirmations.length >= MAX_COLLECTION_CONFIRMATIONS) throw new Error("COLLECTION_CONFIRMATION_LIMIT_REACHED");
    const occurredAt = new Date().toISOString();
    const confirmation = {
      id: `collection_share_${randomUUID()}`,
      commandId: input.commandId,
      debtId: debt.id,
      messageKind: input.messageKind,
      confirmedByParticipantId: state.currentParticipantId,
      occurredAt,
    };
    state.collectionConfirmations.unshift(confirmation);
    state.activities.unshift({
      id: `act_${randomUUID()}`,
      debtId: debt.id,
      type: "collection_shared",
      title: input.messageKind === "initial" ? "Marcaste el cobro como compartido" : "Marcaste un seguimiento como compartido",
      detail: "Declarado por ti. YOL1 no confirma entrega, lectura ni envío en WhatsApp.",
      occurredAt,
    });
    return confirmation;
  });
}

export type CreatePayinInput = {
  publicToken: string;
  amount: number;
  idempotencyKey: string;
  origin: string;
};

export async function createPayin(input: CreatePayinInput) {
  if (!/^[a-zA-Z0-9_-]{8,120}$/.test(input.idempotencyKey)) throw new Error("INVALID_IDEMPOTENCY_KEY");
  const attemptId = `attempt_${randomUUID()}`;
  const provider = getPaymentProvider();
  const reservation = await mutateDebtCenterStateByPublicToken(input.publicToken, (state) => {
    const debt = state.debts.find((item) => item.publicToken === input.publicToken);
    if (!debt) throw new Error("DEBT_NOT_FOUND");
    const amount = input.amount;
    const existing = state.paymentAttempts.find((item) => item.debtId === debt.id && item.idempotencyKey === input.idempotencyKey);
    if (existing) {
      if (existing.amount !== amount) throw new Error("IDEMPOTENCY_CONFLICT");
      return { attempt: existing, created: false, debtId: debt.id };
    }
    const limit = publicPaymentAttemptLimit(state, debt.id);
    if (limit?.code === "PAYMENT_ATTEMPT_RATE_LIMITED") {
      throw new PaymentProviderError(
        limit.code,
        "Hiciste varios intentos seguidos en este cobro demo. Espera un momento antes de probar otra vez.",
        429,
        limit.retryAfterSeconds,
      );
    }
    if (limit?.code === "PAYMENT_ATTEMPT_LIMIT_REACHED") {
      throw new PaymentProviderError(
        limit.code,
        "Este cobro alcanzó el límite total de intentos de la demo. Reinicia Cuentas Claras para comenzar de nuevo.",
        429,
      );
    }
    assertPayableAmount(state, debt, amount);
    const occurredAt = new Date().toISOString();
    const attempt = {
      id: attemptId,
      debtId: debt.id,
      amount,
      provider: provider.kind,
      providerPaymentToken: "",
      paymentUrl: "",
      status: "creating" as const,
      providerStep: "CREATING",
      idempotencyKey: input.idempotencyKey,
      createdAt: occurredAt,
      updatedAt: occurredAt,
    };
    state.paymentAttempts.unshift(attempt);
    return { attempt, created: true, debtId: debt.id };
  });

  if (!reservation.result.created) {
    if (reservation.result.attempt.status === "creating") throw new Error("PAYMENT_CREATION_IN_PROGRESS");
    return { attempt: buildPaymentAttemptView(reservation.result.attempt), publicDebt: buildPublicDebt(reservation.state, input.publicToken) };
  }

  const simulationUrl = `${input.origin}/pagar/${encodeURIComponent(input.publicToken)}?attempt=${encodeURIComponent(attemptId)}`;
  try {
    const providerPayment = await provider.createPayment({
      attemptId,
      debtId: reservation.result.debtId,
      amount: reservation.result.attempt.amount,
      returnUrl: simulationUrl,
      webhookUrl: `${input.origin}/api/debt-center/webhooks/floid`,
    });
    const mutation = await mutateDebtCenterStateByPublicToken(input.publicToken, (state) => {
      const attempt = state.paymentAttempts.find((item) => item.id === attemptId);
      if (!attempt) throw new Error("PAYMENT_ATTEMPT_NOT_FOUND");
      attempt.providerPaymentToken = providerPayment.paymentToken;
      attempt.paymentUrl = providerPayment.paymentUrl;
      attempt.status = providerPayment.status;
      attempt.providerStep = providerPayment.step;
      attempt.updatedAt = new Date().toISOString();
      state.activities.unshift({
        id: `act_${randomUUID()}`,
        debtId: attempt.debtId,
        type: "payment_started",
        title: `Pago por $${attempt.amount.toLocaleString("es-CL")} iniciado`,
        detail: "Simulador inspirado en el flujo Floid · no mueve dinero ni llama servicios externos.",
        occurredAt: attempt.updatedAt,
      });
      return attempt;
    });
    return { attempt: buildPaymentAttemptView(mutation.result), publicDebt: buildPublicDebt(mutation.state, input.publicToken) };
  } catch (error) {
    await mutateDebtCenterStateByPublicToken(input.publicToken, (state) => {
      const attempt = state.paymentAttempts.find((item) => item.id === attemptId);
      if (attempt && attempt.status === "creating") applyPaymentResult(state, attempt.id, "failed", { errorCode: error instanceof Error ? error.message : "PROVIDER_CREATE_FAILED" });
      return attempt;
    });
    throw error;
  }
}

export async function simulatePaymentResult(attemptId: string, publicToken: string, status: PaymentAttemptStatus, errorCode?: string) {
  if (!(["pending", "succeeded", "failed", "expired", "closed", "cancelled"] as PaymentAttemptStatus[]).includes(status)) throw new Error("INVALID_SIMULATION_STATUS");
  const mutation = await mutateDebtCenterStateByPublicToken(publicToken, (state) => {
    const attempt = state.paymentAttempts.find((item) => item.id === attemptId);
    if (!attempt) throw new Error("PAYMENT_ATTEMPT_NOT_FOUND");
    const debt = state.debts.find((item) => item.id === attempt.debtId);
    if (!debt || debt.publicToken !== publicToken) throw new Error("PAYMENT_ATTEMPT_NOT_FOUND");
    if (attempt.provider !== "mock_floid") throw new Error("SIMULATION_ONLY");
    if (attempt.status === "succeeded" && status !== "succeeded") throw new Error("SETTLED_PAYMENT_IS_FINAL");
    return applyPaymentResult(state, attemptId, status, {
      providerPaymentId: status === "succeeded" ? `mock_payment_${attemptId}` : undefined,
      providerStep: status === "pending" ? "AUTH_METHOD" : status === "succeeded" ? "FINISHED" : "FINISHED",
      errorCode,
    });
  });
  const debt = mutation.state.debts.find((item) => item.id === mutation.result.debtId);
  return { attempt: buildPaymentAttemptView(mutation.result), publicDebt: debt ? buildPublicDebt(mutation.state, debt.publicToken) : null };
}
