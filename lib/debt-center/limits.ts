import type { DebtCenterState } from "./types.ts";
import { MAX_MOCK_STATEMENTS, MAX_MOCK_STATEMENT_ENTRIES, MAX_RECONCILIATION_CANDIDATES, MAX_RECONCILIATION_DECISIONS } from "./reconciliation.ts";

export const DEBT_CENTER_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_DEBT_CENTER_GROUPS = 25;
export const MAX_DEBT_CENTER_PARTICIPANTS = 100;
export const MAX_DEBT_CENTER_EXPENSES = 250;
export const MAX_DEBT_CENTER_DEBTS = 500;
export const MAX_DEBT_CENTER_ACTIVITIES = 500;
export const MAX_COLLECTION_CONFIRMATIONS = 1_000;
// Leave headroom for a terminal payment transition or an audit entry so an
// aggregate that was accepted once can still be closed safely.
export const MAX_DEBT_CENTER_STATE_BYTES = 900 * 1024;
export const DEBT_CENTER_PAYMENT_TRANSITION_RESERVE_BYTES = 100 * 1024;
export const MAX_DEBT_CENTER_ACTIVE_PAYMENT_BYTES = MAX_DEBT_CENTER_STATE_BYTES - DEBT_CENTER_PAYMENT_TRANSITION_RESERVE_BYTES;

export function prepareDebtCenterStateForStorage(state: DebtCenterState) {
  if (state.activities.length > MAX_DEBT_CENTER_ACTIVITIES) {
    state.activities = state.activities.slice(0, MAX_DEBT_CENTER_ACTIVITIES);
  }
  return state;
}

export function assertDebtCenterStateWithinLimits(state: DebtCenterState) {
  if (state.groups.length > MAX_DEBT_CENTER_GROUPS) throw new Error("DEBT_CENTER_GROUP_LIMIT_REACHED");
  if (state.participants.length > MAX_DEBT_CENTER_PARTICIPANTS) throw new Error("DEBT_CENTER_PARTICIPANT_LIMIT_REACHED");
  if (state.expenses.length > MAX_DEBT_CENTER_EXPENSES) throw new Error("DEBT_CENTER_EXPENSE_LIMIT_REACHED");
  if (state.debts.length > MAX_DEBT_CENTER_DEBTS) throw new Error("DEBT_CENTER_DEBT_LIMIT_REACHED");
  if (state.collectionConfirmations.length > MAX_COLLECTION_CONFIRMATIONS) throw new Error("COLLECTION_CONFIRMATION_LIMIT_REACHED");
  if (state.mockStatements.length > MAX_MOCK_STATEMENTS
    || state.mockStatementEntries.length > MAX_MOCK_STATEMENT_ENTRIES
    || state.reconciliationCandidates.length > MAX_RECONCILIATION_CANDIDATES
    || state.reconciliationDecisions.length > MAX_RECONCILIATION_DECISIONS) {
    throw new Error("RECONCILIATION_LIMIT_REACHED");
  }
  const bytes = new TextEncoder().encode(JSON.stringify(state)).byteLength;
  const activePaymentCount = state.paymentAttempts.filter((attempt) => ["creating", "not_started", "pending"].includes(attempt.status)).length;
  const operationalLimit = MAX_DEBT_CENTER_STATE_BYTES - activePaymentCount * DEBT_CENTER_PAYMENT_TRANSITION_RESERVE_BYTES;
  if (bytes > operationalLimit) throw new Error("DEBT_CENTER_STATE_LIMIT_REACHED");
  if (bytes > MAX_DEBT_CENTER_STATE_BYTES) throw new Error("DEBT_CENTER_STATE_LIMIT_REACHED");
}
