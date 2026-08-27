import type { SplitMode } from "./types.ts";

const PREFIX = "yol1-clear-accounts-draft:";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const DRAFT_ID = /^draft_[a-f0-9]{32}$/;
const MAX_SHARE_WEIGHT = 1_000_000;
const MAX_SHARE_WEIGHT_TOTAL = 30_000_000;

/** Legacy consumer shape kept while the composer migrates to splitValues. */
export type ExpenseDraftV1 = {
  schemaVersion: "expense-draft-1";
  createdAt: string;
  title: string;
  amountText: string;
  groupId: string;
  paidBy: string;
  participantIds: string[];
  splitMode: SplitMode;
  amounts: Record<string, number>;
  receiptName: string;
  correctionOfExpenseId?: string;
};

export type ExpenseDraftV2 = Omit<ExpenseDraftV1, "schemaVersion" | "amounts"> & {
  schemaVersion: "expense-draft-2";
  splitValues: Record<string, number>;
};

type SaveExpenseDraftInput = Omit<ExpenseDraftV1, "schemaVersion" | "createdAt" | "amounts"> & {
  amounts?: Record<string, number>;
  splitValues?: Record<string, number>;
};

export function createExpenseDraftId(): `draft_${string}` {
  return `draft_${crypto.randomUUID().replaceAll("-", "")}`;
}

function canonicalSplitValues(participantIds: string[], mode: SplitMode, candidate?: Record<string, number>) {
  if (mode === "equal") return {};
  if (!candidate || Array.isArray(candidate)) throw new Error("INVALID_DRAFT_SPLIT_VALUES");
  return Object.fromEntries(participantIds.map((id) => [id, candidate[id]]));
}

export function saveExpenseDraft(draftId: string, input: SaveExpenseDraftInput) {
  if (!DRAFT_ID.test(draftId)) throw new Error("INVALID_DRAFT_ID");
  const participantIds = input.participantIds.slice(0, 30).map((id) => id.slice(0, 80));
  const splitValues = canonicalSplitValues(participantIds, input.splitMode, input.splitValues ?? input.amounts);
  const draft: ExpenseDraftV2 = {
    schemaVersion: "expense-draft-2",
    createdAt: new Date().toISOString(),
    title: input.title.slice(0, 90),
    amountText: input.amountText.slice(0, 12),
    groupId: input.groupId.slice(0, 80),
    paidBy: input.paidBy.slice(0, 80),
    participantIds,
    splitMode: input.splitMode,
    splitValues,
    receiptName: input.receiptName.slice(0, 120),
    correctionOfExpenseId: input.correctionOfExpenseId?.slice(0, 90),
  };
  sessionStorage.setItem(`${PREFIX}${draftId}`, JSON.stringify(draft));
}

function isSafeText(candidate: unknown, max: number) {
  return typeof candidate === "string" && candidate.length > 0 && candidate.length <= max && !/[\u0000-\u001f]/.test(candidate);
}

function validSplitValues(mode: SplitMode, participantIds: string[], values: Record<string, unknown>) {
  const entries = Object.entries(values);
  if (mode === "equal") return entries.length === 0;
  if (entries.length !== participantIds.length || entries.some(([id]) => !participantIds.includes(id))) return false;
  if (participantIds.some((id) => !Object.prototype.hasOwnProperty.call(values, id))) return false;
  const numbers = participantIds.map((id) => values[id]);
  if (mode === "amount") return numbers.every((value) => Number.isSafeInteger(value) && Number(value) >= 0);
  if (mode === "percentage") return numbers.every((value) => Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= 10_000)
    && numbers.reduce<number>((sum, value) => sum + Number(value), 0) === 10_000;
  const total = numbers.reduce<number>((sum, value) => sum + Number(value), 0);
  return numbers.every((value) => Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= MAX_SHARE_WEIGHT)
    && total > 0 && total <= MAX_SHARE_WEIGHT_TOTAL;
}

export function loadExpenseDraft(draftId: string | null): ExpenseDraftV1 | null {
  if (!draftId || !DRAFT_ID.test(draftId)) return null;
  try {
    const raw = sessionStorage.getItem(`${PREFIX}${draftId}`);
    if (!raw) return null;
    const value = JSON.parse(raw) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("INVALID_DRAFT");
    const draft = value as Record<string, unknown>;
    const createdAt = typeof draft.createdAt === "string" ? Date.parse(draft.createdAt) : Number.NaN;
    const age = Date.now() - createdAt;
    const participantIds = Array.isArray(draft.participantIds) ? draft.participantIds : [];
    const splitMode = String(draft.splitMode) as SplitMode;
    const storedValues = draft.schemaVersion === "expense-draft-2" ? draft.splitValues : draft.amounts;
    const parsedValues = storedValues && typeof storedValues === "object" && !Array.isArray(storedValues) ? storedValues as Record<string, unknown> : null;
    // V1 could retain stale amount inputs after switching back to equal; they never
    // affected the resulting split, so migration safely discards them.
    const splitValues = splitMode === "equal" ? {} : parsedValues;
    const validParticipants = participantIds.length >= 2 && participantIds.length <= 30 && participantIds.every((id) => isSafeText(id, 80)) && new Set(participantIds).size === participantIds.length;
    const valid = (draft.schemaVersion === "expense-draft-1" || draft.schemaVersion === "expense-draft-2")
      && Number.isFinite(createdAt) && age >= 0 && age <= MAX_AGE_MS
      && isSafeText(draft.title, 90) && String(draft.title).trim().length >= 2
      && typeof draft.amountText === "string" && /^\d{1,12}$/.test(draft.amountText)
      && isSafeText(draft.groupId, 80) && isSafeText(draft.paidBy, 80)
      && validParticipants && participantIds.includes(draft.paidBy)
      && (["equal", "amount", "percentage", "shares"] as string[]).includes(splitMode)
      && Boolean(splitValues) && validSplitValues(splitMode, participantIds as string[], splitValues ?? {})
      && typeof draft.receiptName === "string" && draft.receiptName.length <= 120;
    const correctionOfExpenseId = draft.correctionOfExpenseId === undefined ? undefined : typeof draft.correctionOfExpenseId === "string" && /^expense_[a-z0-9-]+$/i.test(draft.correctionOfExpenseId) ? draft.correctionOfExpenseId : null;
    if (!valid || correctionOfExpenseId === null) throw new Error("INVALID_DRAFT");
    return {
      schemaVersion: "expense-draft-1",
      createdAt: draft.createdAt as string,
      title: draft.title as string,
      amountText: draft.amountText as string,
      groupId: draft.groupId as string,
      paidBy: draft.paidBy as string,
      participantIds: participantIds as string[],
      splitMode,
      amounts: Object.fromEntries(Object.entries(splitValues ?? {}).map(([id, amount]) => [id, Number(amount)])),
      receiptName: draft.receiptName as string,
      correctionOfExpenseId,
    };
  } catch {
    sessionStorage.removeItem(`${PREFIX}${draftId}`);
    return null;
  }
}

export function removeExpenseDraft(draftId: string | null) {
  if (draftId && DRAFT_ID.test(draftId)) sessionStorage.removeItem(`${PREFIX}${draftId}`);
}
