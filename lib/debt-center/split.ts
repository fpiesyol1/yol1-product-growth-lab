import type { SplitMode } from "./types.ts";

export const MAX_DEMO_CLP_AMOUNT = 100_000_000;
const MAX_PARTICIPANTS = 30;
const MAX_SHARE_WEIGHT = 1_000_000;
const MAX_SHARE_WEIGHT_TOTAL = 30_000_000;

function clp(value: number) {
  if (!Number.isSafeInteger(value)) throw new Error("INVALID_CLP_AMOUNT");
  return value;
}

function assertExactKeys(participantIds: string[], allocations?: Record<string, number>) {
  if (!allocations || Array.isArray(allocations)) throw new Error("SPLIT_VALUES_REQUIRED");
  const keys = Object.keys(allocations);
  if (
    keys.length !== participantIds.length
    || keys.some((key) => !participantIds.includes(key))
    || participantIds.some((participantId) => !Object.prototype.hasOwnProperty.call(allocations, participantId))
  ) throw new Error("SPLIT_VALUE_KEYS_MISMATCH");
}

function allocateByWeights(total: number, participantIds: string[], weights: number[]) {
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  if (!Number.isSafeInteger(weightTotal) || weightTotal <= 0) throw new Error("INVALID_SPLIT_WEIGHT");
  const denominator = BigInt(weightTotal);
  const numerators = weights.map((weight) => BigInt(total) * BigInt(weight));
  const base = numerators.map((numerator) => Number(numerator / denominator));
  let remainder = total - base.reduce((sum, value) => sum + value, 0);
  const order = weights
    .map((_, index) => ({ index, remainder: numerators[index] % denominator }))
    .sort((left, right) => left.remainder === right.remainder ? left.index - right.index : left.remainder > right.remainder ? -1 : 1);
  for (let cursor = 0; remainder > 0; cursor += 1, remainder -= 1) base[order[cursor].index] += 1;
  return participantIds.map((participantId, index) => ({ participantId, amount: base[index] }));
}

export function splitExpense(totalAmount: number, participantIds: string[], mode: SplitMode, allocations?: Record<string, number>) {
  const total = clp(totalAmount);
  if (total > MAX_DEMO_CLP_AMOUNT) throw new Error("EXPENSE_AMOUNT_EXCEEDS_LIMIT");
  if (total <= 0 || participantIds.length < 2 || participantIds.length > MAX_PARTICIPANTS) throw new Error("INVALID_EXPENSE");
  if (new Set(participantIds).size !== participantIds.length) throw new Error("DUPLICATE_PARTICIPANT");

  if (mode === "amount") {
    assertExactKeys(participantIds, allocations);
    const shares = participantIds.map((participantId) => ({ participantId, amount: clp(allocations![participantId]) }));
    if (shares.some((share) => share.amount < 0) || shares.reduce((sum, share) => sum + share.amount, 0) !== total) throw new Error("SPLIT_DOES_NOT_MATCH_TOTAL");
    return shares;
  }

  if (mode === "percentage") {
    assertExactKeys(participantIds, allocations);
    const basisPoints = participantIds.map((participantId) => {
      const basisPoint = allocations![participantId];
      if (!Number.isSafeInteger(basisPoint) || basisPoint < 0 || basisPoint > 10_000) throw new Error("INVALID_PERCENTAGE_BPS");
      return basisPoint;
    });
    if (basisPoints.reduce((sum, value) => sum + value, 0) !== 10_000) throw new Error("PERCENTAGE_TOTAL_MUST_BE_10000");
    return allocateByWeights(total, participantIds, basisPoints);
  }

  if (mode === "shares") {
    assertExactKeys(participantIds, allocations);
    const weights = participantIds.map((participantId) => {
      const weight = allocations![participantId];
      if (!Number.isSafeInteger(weight) || weight < 0) throw new Error("INVALID_SHARE_WEIGHT");
      if (weight > MAX_SHARE_WEIGHT) throw new Error("SHARE_WEIGHT_LIMIT_EXCEEDED");
      return weight;
    });
    const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
    if (weightTotal === 0) throw new Error("INVALID_SHARE_WEIGHT");
    if (weightTotal > MAX_SHARE_WEIGHT_TOTAL) throw new Error("SHARE_WEIGHT_LIMIT_EXCEEDED");
    return allocateByWeights(total, participantIds, weights);
  }

  if (mode !== "equal") throw new Error("INVALID_SPLIT_MODE");
  if (allocations !== undefined) throw new Error("SPLIT_VALUES_NOT_ALLOWED");

  const base = Math.floor(total / participantIds.length);
  const remainder = total - base * participantIds.length;
  return participantIds.map((participantId, index) => ({ participantId, amount: base + (index < remainder ? 1 : 0) }));
}
