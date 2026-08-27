export type DebtHealthStage = "summary" | "evidence" | "plan";
export type PlanItemState = "pending" | "user_marked" | "confirmed" | "reopened";

export type DebtHealthObligation = {
  id: string;
  institutionAlias: string;
  productType: string;
  reportedBalance: number;
  reportAsOf: string;
  delinquency: "current" | "late";
  knownInstallment: number | null;
  nextDueAt: string | null;
  costCoverage: { cae: "known" | "missing"; ctc: "known" | "missing"; rate: "known" | "missing"; insurance: "known" | "missing" };
};

export type DebtHealthEvidence = {
  amount: number;
  occurredAt: string;
  sourceLabel: string;
  movementRef: string;
  matchState: "none" | "candidate" | "user_confirmed" | "creditor_confirmed" | "contradicted";
};

export type DebtHealthReadModel = {
  schemaVersion: "debt-health-demo-1";
  source: "synthetic_fixture";
  coverageState: "partial" | "complete";
  obligations: DebtHealthObligation[];
  evidence: DebtHealthEvidence;
};

export const DEBT_HEALTH_DEMO: DebtHealthReadModel = {
  schemaVersion: "debt-health-demo-1",
  source: "synthetic_fixture",
  coverageState: "partial",
  obligations: [
    { id: "formal_card", institutionAlias: "Banco demo A", productType: "Tarjeta", reportedBalance: 560_000, reportAsOf: "2026-08-19T12:00:00.000Z", delinquency: "current", knownInstallment: 75_000, nextDueAt: "2026-09-05", costCoverage: { cae: "missing", ctc: "missing", rate: "known", insurance: "missing" } },
    { id: "formal_consumer", institutionAlias: "Cooperativa demo", productType: "Crédito de consumo", reportedBalance: 1_240_000, reportAsOf: "2026-08-19T12:00:00.000Z", delinquency: "current", knownInstallment: 118_000, nextDueAt: "2026-09-10", costCoverage: { cae: "known", ctc: "missing", rate: "known", insurance: "known" } },
    { id: "formal_line", institutionAlias: "Banco demo B", productType: "Línea de crédito", reportedBalance: 190_000, reportAsOf: "2026-08-19T12:00:00.000Z", delinquency: "current", knownInstallment: null, nextDueAt: null, costCoverage: { cae: "missing", ctc: "missing", rate: "missing", insurance: "missing" } },
  ],
  evidence: { amount: 75_000, occurredAt: "2026-08-22T14:10:00.000Z", sourceLabel: "Cartola demo", movementRef: "formal-payment-demo", matchState: "candidate" },
};

export function buildDebtHealthSummary(model: DebtHealthReadModel) {
  const reportedBalance = model.obligations.reduce((sum, item) => sum + item.reportedBalance, 0);
  const knownMonthlyPressure = model.obligations.reduce((sum, item) => sum + (item.knownInstallment ?? 0), 0);
  const missingCosts = model.obligations.some((item) => Object.values(item.costCoverage).includes("missing"));
  return {
    obligationCount: model.obligations.length,
    reportedBalance,
    knownMonthlyPressure,
    lateCount: model.obligations.filter((item) => item.delinquency === "late").length,
    conclusion: model.coverageState === "partial" || missingCosts || model.obligations.some((item) => item.knownInstallment === null) ? "missing_information" as const : "complete" as const,
  };
}

export function matchPaymentEvidence(obligation: DebtHealthObligation, evidence: DebtHealthEvidence) {
  if (evidence.amount === obligation.knownInstallment && Date.parse(evidence.occurredAt) > Date.parse(obligation.reportAsOf)) return "candidate" as const;
  return "none" as const;
}

export function transitionPlanItem(state: PlanItemState, event: "mark" | "confirm" | "reopen"): PlanItemState {
  if (event === "mark" && (state === "pending" || state === "reopened")) return "user_marked";
  if (event === "confirm" && state === "user_marked") return "confirmed";
  if (event === "reopen" && (state === "user_marked" || state === "confirmed")) return "reopened";
  return state;
}
