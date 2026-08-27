import { createHash } from "node:crypto";
import type {
  DebtCenterState,
  MockStatement,
  MockStatementEntry,
  ReconciliationCandidate,
  ReconciliationDashboard,
  ReconciliationDecision,
  ReconciliationReason,
  SocialDebt,
} from "./types.ts";

export const MOCK_STATEMENT_FIXTURE_VERSION = "mock_statement_v1" as const;
export const MAX_MOCK_STATEMENTS = 3;
export const MAX_MOCK_STATEMENT_ENTRIES = 100;
export const MAX_RECONCILIATION_CANDIDATES = 300;
export const MAX_RECONCILIATION_DECISIONS = 100;

const ACTIVE_PAYMENT_STATUSES = ["creating", "not_started", "pending"];

export function mockStatementFixture(loadedAt: string): { statement: MockStatement; entries: MockStatementEntry[] } {
  const statementId = "mock_statement_august_v1";
  const loadedAtMs = Date.parse(loadedAt);
  const beforeLoad = (minutes: number) => new Date(loadedAtMs - minutes * 60_000).toISOString();
  return {
    statement: {
      id: statementId,
      fixtureVersion: MOCK_STATEMENT_FIXTURE_VERSION,
      accountOwnerParticipantId: "person_felipe",
      accountAlias: "BCI · •••• 4312 · demo",
      periodFrom: "2026-08-26",
      periodTo: "2026-08-27",
      loadedAt,
      loadCommandId: "",
    },
    entries: [
      {
        id: "stmt_entry_exact_nico_5000",
        statementId,
        direction: "credit",
        amount: 5_000,
        currency: "CLP",
        bookedAt: beforeLoad(210),
        descriptor: "Transferencia recibida · referencia YOL1 demo",
        reconciliationRef: "demo_ref_nico_cabana",
      },
      {
        id: "stmt_entry_ambiguous_5000",
        statementId,
        direction: "credit",
        amount: 5_000,
        currency: "CLP",
        bookedAt: beforeLoad(135),
        descriptor: "Transferencia recibida · sin mensaje",
      },
      {
        id: "stmt_entry_debit_5000",
        statementId,
        direction: "debit",
        amount: 5_000,
        currency: "CLP",
        bookedAt: beforeLoad(75),
        descriptor: "Transferencia enviada · no es un abono",
        reconciliationRef: "demo_ref_josefa_cabana",
      },
      {
        id: "stmt_entry_overpay_50000",
        statementId,
        direction: "credit",
        amount: 50_000,
        currency: "CLP",
        bookedAt: beforeLoad(30),
        descriptor: "Transferencia recibida · monto no compatible",
        reconciliationRef: "demo_ref_josefa_cabana",
      },
    ],
  };
}

function opaqueCandidateId(entryId: string, debtId: string) {
  return `recon_candidate_${createHash("sha256").update(`${MOCK_STATEMENT_FIXTURE_VERSION}:${entryId}:${debtId}`).digest("hex").slice(0, 32)}`;
}

export function paidForReconciliation(state: DebtCenterState, debtId: string) {
  return state.settlements
    .filter((settlement) => settlement.debtId === debtId && !(settlement.source === "mock_statement_reconciliation" && settlement.reversedAt))
    .reduce((sum, settlement) => sum + settlement.amount, 0);
}

export function reconciliationOutstanding(state: DebtCenterState, debt: SocialDebt) {
  return Math.max(0, debt.originalAmount - paidForReconciliation(state, debt.id));
}

export function hasActivePaymentAttempt(state: DebtCenterState, debtId: string) {
  return state.paymentAttempts.some((attempt) => attempt.debtId === debtId && ACTIVE_PAYMENT_STATUSES.includes(attempt.status));
}

function normalized(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es");
}

export function candidatesForEntry(state: DebtCenterState, entry: MockStatementEntry, createdAt: string): ReconciliationCandidate[] {
  if (entry.direction !== "credit" || !Number.isSafeInteger(entry.amount) || entry.amount <= 0) return [];
  if (Date.parse(entry.bookedAt) > Date.parse(createdAt)) return [];
  const debts = state.debts.filter((debt) => debt.creditorParticipantId === state.currentParticipantId && debt.status !== "cancelled");
  const candidates = debts.flatMap((debt) => {
    const outstanding = reconciliationOutstanding(state, debt);
    if (outstanding <= 0 || entry.amount > outstanding) return [];
    const debtor = state.participants.find((participant) => participant.id === debt.debtorParticipantId);
    const reasons: ReconciliationReason[] = [];
    if (entry.reconciliationRef && debt.reconciliationRef === entry.reconciliationRef) reasons.push("exact_reference");
    if (entry.amount === outstanding) reasons.push("amount_equals_outstanding");
    else reasons.push("amount_fits_outstanding");
    if (debtor && normalized(entry.descriptor).includes(normalized(debtor.name))) reasons.push("counterparty_hint");
    const scoreBps = reasons.includes("exact_reference") ? 10_000
      : reasons.includes("counterparty_hint") && reasons.includes("amount_equals_outstanding") ? 8_000
        : reasons.includes("counterparty_hint") ? 6_500
          : reasons.includes("amount_equals_outstanding") ? 5_500
            : 3_000;
    return [{
      id: opaqueCandidateId(entry.id, debt.id),
      statementEntryId: entry.id,
      debtId: debt.id,
      amount: entry.amount,
      scoreBps,
      reasons,
      ruleVersion: "reconciliation-rule-v1" as const,
      outstandingAtDetection: outstanding,
      createdAt,
    }];
  });
  return candidates.sort((left, right) => right.scoreBps - left.scoreBps || left.debtId.localeCompare(right.debtId)).slice(0, 3);
}

export function latestDecisionForEntry(state: DebtCenterState, entryId: string): ReconciliationDecision | undefined {
  return state.reconciliationDecisions.findLast((decision) => decision.statementEntryId === entryId);
}

export function buildReconciliationDashboard(state: DebtCenterState): ReconciliationDashboard {
  const statement = state.mockStatements.find((item) => item.fixtureVersion === MOCK_STATEMENT_FIXTURE_VERSION);
  if (!statement) return { fixtureVersion: MOCK_STATEMENT_FIXTURE_VERSION, statementLoaded: false, entries: [], pendingCount: 0, confirmedCount: 0, rejectedCount: 0 };
  const entries: ReconciliationDashboard["entries"] = state.mockStatementEntries.filter((entry) => entry.statementId === statement.id).map((entry) => {
    const decision = latestDecisionForEntry(state, entry.id);
    const decidedCandidate = decision?.candidateId
      ? state.reconciliationCandidates.find((candidate) => candidate.id === decision.candidateId)
      : undefined;
    const candidates = state.reconciliationCandidates.filter((candidate) => candidate.statementEntryId === entry.id).map((candidate) => {
      const debt = state.debts.find((item) => item.id === candidate.debtId);
      const expense = debt ? state.expenses.find((item) => item.id === debt.expenseId) : undefined;
      const group = debt ? state.groups.find((item) => item.id === debt.groupId) : undefined;
      const debtor = debt ? state.participants.find((item) => item.id === debt.debtorParticipantId) : undefined;
      const outstanding = debt ? reconciliationOutstanding(state, debt) : 0;
      return {
        id: candidate.id,
        debtId: candidate.debtId,
        debtorName: debtor?.name ?? "Persona demo",
        expenseTitle: expense?.title ?? "Gasto compartido",
        groupName: group?.name ?? "Grupo",
        amount: candidate.amount,
        outstandingAmount: outstanding,
        score: candidate.scoreBps >= 8_000 ? "good" as const : "possible" as const,
        reasons: candidate.reasons,
        stale: !debt || debt.status === "cancelled" || candidate.amount > outstanding || outstanding !== candidate.outstandingAtDetection || hasActivePaymentAttempt(state, candidate.debtId),
      };
    });
    const stateLabel: ReconciliationDashboard["entries"][number]["state"] = decision?.action === "creator_confirmed" || decision?.action === "rule_auto_applied" ? "confirmed"
      : decision?.action === "creator_rejected" ? "rejected"
        : decision?.action === "reversed" ? "reversed"
          : candidates.length ? "needs_review" : "unmatched";
    return {
      entryId: entry.id,
      direction: entry.direction,
      amount: entry.amount,
      bookedAt: entry.bookedAt,
      descriptor: entry.descriptor,
      state: stateLabel,
      candidates,
      selectedDebtId: decision?.debtId,
      decisionId: decision?.id,
      decisionSource: decision?.action === "rule_auto_applied" ? "automatic_rule" : decision ? "creator" : undefined,
      decidedOutstandingBefore: decidedCandidate?.outstandingAtDetection,
      decidedOutstandingAfter: decidedCandidate && decision?.amount !== undefined
        ? Math.max(0, decidedCandidate.outstandingAtDetection - decision.amount)
        : undefined,
    };
  });
  return {
    fixtureVersion: MOCK_STATEMENT_FIXTURE_VERSION,
    statementLoaded: true,
    statementId: statement.id,
    accountAlias: statement.accountAlias,
    loadedAt: statement.loadedAt,
    entries,
    pendingCount: entries.filter((entry) => entry.state === "needs_review").length,
    confirmedCount: entries.filter((entry) => entry.state === "confirmed").length,
    rejectedCount: entries.filter((entry) => entry.state === "rejected").length,
  };
}
