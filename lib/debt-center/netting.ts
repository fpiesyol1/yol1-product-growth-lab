import type { DebtGroup, DebtSummary, GroupNettingView } from "./types.ts";

const ACTIVE_PAYMENT_STATUSES = new Set(["creating", "not_started", "pending"]);

function stableFingerprint(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `net_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function deriveGroupNetting(group: DebtGroup, debts: DebtSummary[]): GroupNettingView {
  const memberIds = new Set(group.participantIds);
  const openDebts = debts
    .filter((debt) => debt.groupId === group.id && debt.status !== "cancelled" && debt.outstandingAmount > 0)
    .sort((left, right) => left.id.localeCompare(right.id));

  const balances = new Map(group.participantIds.map((participantId) => [participantId, 0]));
  for (const debt of openDebts) {
    if (!memberIds.has(debt.debtorParticipantId) || !memberIds.has(debt.creditorParticipantId)) throw new Error("INVALID_NETTING_BASIS");
    if (!Number.isSafeInteger(debt.outstandingAmount) || debt.outstandingAmount <= 0) throw new Error("INVALID_NETTING_BASIS");
    const debtorBalance = (balances.get(debt.debtorParticipantId) ?? 0) - debt.outstandingAmount;
    const creditorBalance = (balances.get(debt.creditorParticipantId) ?? 0) + debt.outstandingAmount;
    if (!Number.isSafeInteger(debtorBalance) || !Number.isSafeInteger(creditorBalance)) throw new Error("INVALID_NETTING_BASIS");
    balances.set(debt.debtorParticipantId, debtorBalance);
    balances.set(debt.creditorParticipantId, creditorBalance);
  }

  const participantBalances = [...balances.entries()]
    .map(([participantId, netAmount]) => ({ participantId, netAmount }))
    .sort((left, right) => left.participantId.localeCompare(right.participantId));
  if (participantBalances.reduce((sum, item) => sum + item.netAmount, 0) !== 0) throw new Error("INVALID_NETTING_BASIS");

  const debtors = participantBalances
    .filter((item) => item.netAmount < 0)
    .map((item) => ({ participantId: item.participantId, amount: -item.netAmount }))
    .sort((left, right) => right.amount - left.amount || left.participantId.localeCompare(right.participantId));
  const creditors = participantBalances
    .filter((item) => item.netAmount > 0)
    .map((item) => ({ participantId: item.participantId, amount: item.netAmount }))
    .sort((left, right) => right.amount - left.amount || left.participantId.localeCompare(right.participantId));

  const basis = openDebts.map((debt) => `${debt.id}:${debt.debtorParticipantId}:${debt.creditorParticipantId}:${debt.outstandingAmount}`).join("|");
  const balanceFingerprint = stableFingerprint(`deterministic_balance_greedy_v1|${group.id}|${group.participantIds.slice().sort().join(",")}|${basis}`);
  const transfers: GroupNettingView["transfers"] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = Math.min(debtor.amount, creditor.amount);
    if (amount <= 0 || debtor.participantId === creditor.participantId) throw new Error("INVALID_NETTING_BASIS");
    transfers.push({
      id: stableFingerprint(`${balanceFingerprint}|${transfers.length}|${debtor.participantId}|${creditor.participantId}|${amount}`),
      fromParticipantId: debtor.participantId,
      toParticipantId: creditor.participantId,
      amount,
    });
    debtor.amount -= amount;
    creditor.amount -= amount;
    if (debtor.amount === 0) debtorIndex += 1;
    if (creditor.amount === 0) creditorIndex += 1;
  }
  if (debtorIndex !== debtors.length || creditorIndex !== creditors.length) throw new Error("INVALID_NETTING_BASIS");

  return {
    schemaVersion: "group-netting-v1",
    source: "derived_from_debt_ledger",
    strategy: "deterministic_balance_greedy_v1",
    groupId: group.id,
    currency: "CLP",
    calculatedAt: openDebts.reduce((latest, debt) => debt.updatedAt > latest ? debt.updatedAt : latest, group.createdAt),
    balanceFingerprint,
    basisDebtIds: openDebts.map((debt) => debt.id),
    originalOpenDebtCount: openDebts.length,
    simplifiedTransferCount: transfers.length,
    reducedBy: Math.max(0, openDebts.length - transfers.length),
    participantBalances,
    transfers,
    hasActivePayment: openDebts.some((debt) => debt.paymentAttempts.some((attempt) => ACTIVE_PAYMENT_STATUSES.has(attempt.status))),
  };
}
