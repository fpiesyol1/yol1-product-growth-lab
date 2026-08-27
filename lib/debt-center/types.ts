export type DebtStatus = "open" | "partially_paid" | "paid" | "cancelled";
export type PaymentAttemptStatus = "creating" | "not_started" | "pending" | "succeeded" | "failed" | "closed" | "expired" | "cancelled";
export type PaymentProviderKind = "mock_floid" | "floid";
export type SplitMode = "equal" | "amount" | "percentage" | "shares";
export type SplitSpec = {
  version: "split-v2";
  mode: SplitMode;
  participantOrder: string[];
  values?: Array<{ participantId: string; value: number }>;
};

export type DebtParticipant = {
  id: string;
  name: string;
  contact: string;
  initials: string;
};

export type DebtGroup = {
  id: string;
  commandId?: string;
  name: string;
  category: "trip" | "home" | "meal" | "activity" | "monthly" | "other";
  currency: "CLP";
  participantIds: string[];
  createdAt: string;
};

export type SharedExpense = {
  id: string;
  commandId?: string;
  commandFingerprint?: string;
  groupId: string;
  title: string;
  totalAmount: number;
  paidByParticipantId: string;
  splitMode: SplitMode;
  splitSpec?: SplitSpec;
  shares: Array<{ participantId: string; amount: number }>;
  receipt?: { name: string; extraction: "mock"; confidence: number };
  createdByParticipantId?: string;
  lifecycle?: "active" | "cancelled_for_correction";
  correction?: {
    commandId: string;
    reason: "wrong_amount" | "wrong_people" | "duplicate" | "other";
    cancelledAt: string;
    cancelledByParticipantId: string;
    replacementExpenseId?: string;
  };
  correctionOfExpenseId?: string;
  recurrence?: { templateId: string; occurrenceKey: string; scheduledFor: string };
  createdAt: string;
};

export type RecurringExpenseTemplate = {
  id: string;
  commandId: string;
  commandFingerprint: string;
  sourceExpenseId: string;
  groupId: string;
  title: string;
  totalAmount: number;
  paidByParticipantId: string;
  splitSpec: SplitSpec;
  shares: Array<{ participantId: string; amount: number }>;
  cadence: { frequency: "monthly"; dayOfMonth: number };
  nextOccurrenceOn: string;
  status: "active" | "paused" | "archived";
  createdAt: string;
  updatedAt: string;
  lastStatusCommand?: { commandId: string; commandFingerprint: string };
};

export type RecurringOccurrence = {
  id: string;
  templateId: string;
  occurrenceKey: string;
  scheduledFor: string;
  expenseId?: string;
  commandId: string;
  commandFingerprint: string;
  status: "materialized" | "skipped";
  createdAt: string;
};

// Browser-facing projections deliberately exclude durable command ids and
// fingerprints. Those fields belong to persistence/idempotency, not to the UI
// contract.
export type DebtGroupView = Omit<DebtGroup, "commandId">;

export type SharedExpenseView = Omit<SharedExpense, "commandId" | "commandFingerprint" | "correction" | "correctionOfExpenseId"> & {
  correction?: Pick<NonNullable<SharedExpense["correction"]>, "cancelledByParticipantId" | "replacementExpenseId">;
};

export type RecurringExpenseTemplateView = Omit<RecurringExpenseTemplate, "commandId" | "commandFingerprint" | "lastStatusCommand">;
export type RecurringOccurrenceView = Omit<RecurringOccurrence, "commandId" | "commandFingerprint">;

export type SocialDebt = {
  id: string;
  publicToken: string;
  groupId: string;
  expenseId: string;
  creditorParticipantId: string;
  debtorParticipantId: string;
  originalAmount: number;
  reconciliationRef?: string;
  status: DebtStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaymentAttempt = {
  id: string;
  debtId: string;
  amount: number;
  provider: PaymentProviderKind;
  providerPaymentToken: string;
  providerPaymentId?: string;
  paymentUrl: string;
  status: PaymentAttemptStatus;
  providerStep: string;
  idempotencyKey: string;
  errorCode?: string;
  providerEvidenceHash?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentAttemptView = Pick<PaymentAttempt, "id" | "amount" | "status" | "providerStep" | "createdAt" | "updatedAt">;

export type PaymentAttemptSettlement = {
  id: string;
  debtId: string;
  source: "payment_attempt";
  paymentAttemptId: string;
  amount: number;
  providerPaymentId: string;
  settledAt: string;
  recordedAt: string;
};

export type StatementReconciliationSettlement = {
  id: string;
  debtId: string;
  source: "mock_statement_reconciliation";
  reconciliationDecisionId: string;
  statementEntryId: string;
  confirmedByParticipantId: string;
  amount: number;
  settledAt: string;
  recordedAt: string;
  reversedAt?: string;
  reversedByDecisionId?: string;
};

export type DebtSettlement = PaymentAttemptSettlement | StatementReconciliationSettlement;
export type DebtSettlementView = Pick<DebtSettlement, "id" | "debtId" | "amount" | "settledAt" | "recordedAt" | "source">;

export type MockStatement = {
  id: string;
  fixtureVersion: "mock_statement_v1";
  accountOwnerParticipantId: string;
  accountAlias: string;
  periodFrom: string;
  periodTo: string;
  loadedAt: string;
  loadCommandId: string;
};

export type MockStatementEntry = {
  id: string;
  statementId: string;
  direction: "credit" | "debit";
  amount: number;
  currency: "CLP";
  bookedAt: string;
  descriptor: string;
  reconciliationRef?: string;
};

export type ReconciliationReason = "exact_reference" | "amount_equals_outstanding" | "amount_fits_outstanding" | "counterparty_hint";

export type ReconciliationCandidate = {
  id: string;
  statementEntryId: string;
  debtId: string;
  amount: number;
  scoreBps: number;
  reasons: ReconciliationReason[];
  ruleVersion: "reconciliation-rule-v1";
  outstandingAtDetection: number;
  createdAt: string;
};

export type ReconciliationDecision = {
  id: string;
  commandId: string;
  candidateId?: string;
  statementEntryId: string;
  debtId?: string;
  amount?: number;
  action: "rule_auto_applied" | "creator_confirmed" | "creator_rejected" | "reopened" | "reversed";
  decidedByParticipantId: string;
  decidedAt: string;
  settlementId?: string;
};

export type CollectionMessageKind = "initial" | "follow_up";

export type CollectionShareConfirmation = {
  id: string;
  commandId: string;
  debtId: string;
  messageKind: CollectionMessageKind;
  confirmedByParticipantId: string;
  occurredAt: string;
};

export type DebtCollectionState = {
  state: "to_share" | "shared_by_creator" | "payment_started" | "partially_paid" | "closed";
  lastSharedAt?: string;
  sharedCount: number;
  followUpCount: number;
};

export type DebtActivity = {
  id: string;
  debtId?: string;
  expenseId?: string;
  type: "expense_created" | "expense_cancelled_for_correction" | "recurring_template_created" | "recurring_occurrence_created" | "collection_shared" | "statement_loaded" | "reconciliation_confirmed" | "reconciliation_rejected" | "reconciliation_reopened" | "reconciliation_reversed" | "request_opened" | "payment_started" | "payment_succeeded" | "payment_failed" | "payment_expired";
  title: string;
  detail: string;
  occurredAt: string;
};

export type DebtCenterState = {
  version: 4;
  generationId: string;
  currentParticipantId: string;
  participants: DebtParticipant[];
  groups: DebtGroup[];
  expenses: SharedExpense[];
  debts: SocialDebt[];
  paymentAttempts: PaymentAttempt[];
  settlements: DebtSettlement[];
  activities: DebtActivity[];
  recurringTemplates: RecurringExpenseTemplate[];
  recurringOccurrences: RecurringOccurrence[];
  collectionConfirmations: CollectionShareConfirmation[];
  mockStatements: MockStatement[];
  mockStatementEntries: MockStatementEntry[];
  reconciliationCandidates: ReconciliationCandidate[];
  reconciliationDecisions: ReconciliationDecision[];
};

export type DebtSummary = Omit<SocialDebt, "reconciliationRef"> & {
  groupName: string;
  expenseTitle: string;
  creditorName: string;
  debtorName: string;
  paidAmount: number;
  outstandingAmount: number;
  paymentAttempts: PaymentAttemptView[];
  settlements: DebtSettlementView[];
  collection: DebtCollectionState;
};

export type ReconciliationCandidateView = {
  id: string;
  debtId: string;
  debtorName: string;
  expenseTitle: string;
  groupName: string;
  amount: number;
  outstandingAmount: number;
  score: "good" | "possible";
  reasons: ReconciliationReason[];
  stale: boolean;
};

export type ReconciliationEntryView = {
  entryId: string;
  direction: "credit" | "debit";
  amount: number;
  bookedAt: string;
  descriptor: string;
  state: "needs_review" | "confirmed" | "rejected" | "unmatched" | "reversed";
  candidates: ReconciliationCandidateView[];
  selectedDebtId?: string;
  decisionId?: string;
  decisionSource?: "automatic_rule" | "creator";
  decidedOutstandingBefore?: number;
  decidedOutstandingAfter?: number;
};

export type ReconciliationDashboard = {
  fixtureVersion: "mock_statement_v1";
  statementLoaded: boolean;
  statementId?: string;
  accountAlias?: string;
  loadedAt?: string;
  entries: ReconciliationEntryView[];
  pendingCount: number;
  confirmedCount: number;
  rejectedCount: number;
};

export type GroupNettingView = {
  schemaVersion: "group-netting-v1";
  source: "derived_from_debt_ledger";
  strategy: "deterministic_balance_greedy_v1";
  groupId: string;
  currency: "CLP";
  calculatedAt: string;
  balanceFingerprint: string;
  basisDebtIds: string[];
  originalOpenDebtCount: number;
  simplifiedTransferCount: number;
  reducedBy: number;
  participantBalances: Array<{ participantId: string; netAmount: number }>;
  transfers: Array<{ id: string; fromParticipantId: string; toParticipantId: string; amount: number }>;
  hasActivePayment: boolean;
};

export type DebtDashboard = {
  mode: "simulator";
  storage: "memory" | "neon";
  provider: PaymentProviderKind;
  currentParticipant: DebtParticipant;
  participants: DebtParticipant[];
  groups: DebtGroupView[];
  expenses: SharedExpenseView[];
  debts: DebtSummary[];
  activities: DebtActivity[];
  recurringTemplates: RecurringExpenseTemplateView[];
  recurringOccurrences: RecurringOccurrenceView[];
  reconciliation: ReconciliationDashboard;
  groupNetting: GroupNettingView[];
  totals: { receivable: number; received: number; outstanding: number; openDebts: number };
};

export type DebtCenterCompanionSummary = {
  schemaVersion: "1";
  source: "debt_center_ledger";
  asOf: string;
  receivableOutstanding: number;
  payableOutstanding: number;
  receivableCount: number;
  payableCount: number;
  reconciliation: {
    statementLoaded: boolean;
    pendingCount: number;
    confirmedCount: number;
    latestResult?: { debtId: string; debtorName: string; expenseTitle: string; amount: number; outstandingAmount: number; source: "automatic_rule" | "creator" };
  };
  receivables: Array<Pick<DebtSummary, "id" | "debtorName" | "expenseTitle" | "groupName" | "originalAmount" | "paidAmount" | "outstandingAmount" | "status">>;
  payables: Array<Pick<DebtSummary, "id" | "creditorName" | "expenseTitle" | "groupName" | "originalAmount" | "paidAmount" | "outstandingAmount" | "status">>;
};

export type PublicDebt = {
  publicToken: string;
  debtId: string;
  expenseTitle: string;
  groupName: string;
  creditorName: string;
  debtorName: string;
  originalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: DebtStatus;
  activeAttempt?: PaymentAttemptView;
  lastCompletedAttempt?: { id: string; amount: number; completedAt: string };
};
