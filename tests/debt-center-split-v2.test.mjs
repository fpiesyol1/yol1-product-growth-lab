import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { MAX_DEMO_CLP_AMOUNT, splitExpense } from "../lib/debt-center/split.ts";

const people = ["a", "b", "c"];

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

function amounts(result) {
  return result.map((share) => share.amount);
}

function assertMoneyInvariant(result, participantIds, total) {
  assert.deepEqual(result.map((share) => share.participantId), participantIds);
  assert.equal(new Set(result.map((share) => share.participantId)).size, participantIds.length);
  assert.equal(result.reduce((sum, share) => sum + share.amount, 0), total);
  assert.ok(result.every((share) => Number.isSafeInteger(share.amount) && share.amount >= 0));
}

test("equal asigna el residuo CLP por orden estable", () => {
  assert.deepEqual(amounts(splitExpense(100, people, "equal")), [34, 33, 33]);
  assert.deepEqual(amounts(splitExpense(10_001, ["a", "b"], "equal")), [5_001, 5_000]);
  assert.deepEqual(amounts(splitExpense(100, ["c", "b", "a"], "equal")), [34, 33, 33]);
  assert.throws(() => splitExpense(100, people, "equal", { a: 34, b: 33, c: 33 }), /SPLIT_VALUES_NOT_ALLOWED/);
});

test("amount exige claves exactas, enteros y suma idéntica al total", () => {
  const result = splitExpense(100, people, "amount", { a: 50, b: 30, c: 20 });
  assert.deepEqual(amounts(result), [50, 30, 20]);
  assertMoneyInvariant(result, people, 100);

  assert.throws(() => splitExpense(100, people, "amount"), /SPLIT_VALUES_REQUIRED/);
  assert.throws(() => splitExpense(100, people, "amount", { a: 50, b: 50 }), /SPLIT_VALUE_KEYS_MISMATCH/);
  assert.throws(() => splitExpense(100, people, "amount", { a: 50, b: 30, c: 20, intruder: 0 }), /SPLIT_VALUE_KEYS_MISMATCH/);
  assert.throws(() => splitExpense(100, people, "amount", { a: 50, b: 51, c: -1 }), /SPLIT_DOES_NOT_MATCH_TOTAL/);
  assert.throws(() => splitExpense(100, people, "amount", { a: 50, b: 49.5, c: 0.5 }), /INVALID_CLP_AMOUNT/);
  assert.throws(() => splitExpense(100, people, "amount", { a: 50, b: Number.NaN, c: 50 }), /INVALID_CLP_AMOUNT/);
  assert.throws(() => splitExpense(100, people, "amount", { a: 50, b: 40, c: 9 }), /SPLIT_DOES_NOT_MATCH_TOTAL/);
});

test("percentage usa basis points y largest remainder sin perder un peso", () => {
  const thirds = { a: 3_333, b: 3_333, c: 3_334 };
  const hundred = splitExpense(100, people, "percentage", thirds);
  const hundredOne = splitExpense(101, people, "percentage", thirds);
  assert.deepEqual(amounts(hundred), [33, 33, 34]);
  assert.deepEqual(amounts(hundredOne), [34, 33, 34]);
  assert.deepEqual(amounts(splitExpense(101, people, "percentage", { a: 5_000, b: 2_500, c: 2_500 })), [51, 25, 25]);
  assert.deepEqual(amounts(splitExpense(100, people, "percentage", { a: 0, b: 5_000, c: 5_000 })), [0, 50, 50]);
  assertMoneyInvariant(hundred, people, 100);
  assertMoneyInvariant(hundredOne, people, 101);

  assert.throws(() => splitExpense(100, people, "percentage", { a: 3_333, b: 3_333, c: 3_333 }), /PERCENTAGE_TOTAL_MUST_BE_10000/);
  assert.throws(() => splitExpense(100, people, "percentage", { a: 3_334, b: 3_334, c: 3_333 }), /PERCENTAGE_TOTAL_MUST_BE_10000/);
  assert.throws(() => splitExpense(100, people, "percentage", { a: 0, b: 0, c: 0 }), /PERCENTAGE_TOTAL_MUST_BE_10000/);
  assert.throws(() => splitExpense(100, people, "percentage", { a: 3_333.5, b: 3_332.5, c: 3_334 }), /INVALID_PERCENTAGE_BPS/);
  assert.throws(() => splitExpense(100, people, "percentage", { a: Number.NaN, b: 5_000, c: 5_000 }), /INVALID_PERCENTAGE_BPS/);
});

test("shares reparte proporciones con desempate determinista", () => {
  const equalParts = splitExpense(100, people, "shares", { a: 1, b: 1, c: 1 });
  const weighted = splitExpense(100, people, "shares", { a: 1, b: 2, c: 3 });
  assert.deepEqual(amounts(equalParts), [34, 33, 33]);
  assert.deepEqual(amounts(weighted), [17, 33, 50]);
  assert.deepEqual(amounts(splitExpense(101, ["a", "b"], "shares", { a: 1, b: 2 })), [34, 67]);
  assert.deepEqual(amounts(splitExpense(100, people, "shares", { a: 0, b: 1, c: 1 })), [0, 50, 50]);
  assertMoneyInvariant(equalParts, people, 100);
  assertMoneyInvariant(weighted, people, 100);

  assert.throws(() => splitExpense(100, people, "shares", { a: 0, b: 0, c: 0 }), /INVALID_SHARE_WEIGHT/);
  assert.throws(() => splitExpense(100, people, "shares", { a: -1, b: 1, c: 1 }), /INVALID_SHARE_WEIGHT/);
  assert.throws(() => splitExpense(100, people, "shares", { a: 1.5, b: 1, c: 1 }), /INVALID_SHARE_WEIGHT/);
  assert.throws(() => splitExpense(100, people, "shares", { a: Number.NaN, b: 1, c: 1 }), /INVALID_SHARE_WEIGHT/);
  assert.throws(() => splitExpense(100, people, "shares", { a: 1_000_001, b: 1, c: 1 }), /SHARE_WEIGHT_LIMIT_EXCEEDED/);
});

test("todos los modos protegen límites, participantes y overflow", () => {
  for (const invalid of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => splitExpense(invalid, ["a", "b"], "equal"), /INVALID_CLP_AMOUNT|INVALID_EXPENSE/);
  }
  assert.throws(() => splitExpense(MAX_DEMO_CLP_AMOUNT + 1, ["a", "b"], "equal"), /EXPENSE_AMOUNT_EXCEEDS_LIMIT/);
  assert.throws(() => splitExpense(100, ["a"], "equal"), /INVALID_EXPENSE/);
  assert.throws(() => splitExpense(100, Array.from({ length: 31 }, (_, index) => `p${index}`), "equal"), /INVALID_EXPENSE/);
  assert.throws(() => splitExpense(100, ["a", "a"], "equal"), /DUPLICATE_PARTICIPANT/);
  assert.throws(() => splitExpense(100, ["a", "b"], "mystery"), /INVALID_SPLIT_MODE/);

  const boundaryPeople = Array.from({ length: 30 }, (_, index) => `p${index}`);
  const boundary = splitExpense(MAX_DEMO_CLP_AMOUNT, boundaryPeople, "shares", Object.fromEntries(boundaryPeople.map((id) => [id, 1_000_000])));
  assertMoneyInvariant(boundary, boundaryPeople, MAX_DEMO_CLP_AMOUNT);
});

test("API acepta cuatro modos explícitos y nunca degrada un valor desconocido a equal", async () => {
  const route = await source("app/api/debt-center/route.ts");
  assert.match(route, /const splitMode = String\(body\.splitMode\)/);
  assert.match(route, /\["equal", "amount", "percentage", "shares"\]\.includes\(splitMode\)/);
  assert.match(route, /throw new Error\("INVALID_SPLIT_MODE"\)/);
  assert.match(route, /splitMode: splitMode as "equal" \| "amount" \| "percentage" \| "shares"/);
  assert.match(route, /const rawSplitValues = body\.splitValues \?\? legacySplitValues/);
  assert.match(route, /splitValues: rawSplitValues as Record<string, number> \| undefined/);
  assert.doesNotMatch(route, /body\.splitMode === "amount" \? "amount" : "equal"/);
});

test("idempotencia persiste y compara splitSpec además de los pesos CLP derivados", async () => {
  const [service, types] = await Promise.all([
    source("lib/debt-center/service.ts"),
    source("lib/debt-center/types.ts"),
  ]);
  const expenseBlock = service.slice(service.indexOf("export async function createSharedExpense"), service.indexOf("export type CreatePayinInput"));
  assert.match(expenseBlock, /version: "split-v2" as const/);
  assert.match(expenseBlock, /participantOrder: \[\.\.\.input\.participantIds\]/);
  assert.match(expenseBlock, /values: splitValues \? input\.participantIds\.map/);
  assert.match(expenseBlock, /const commandFingerprint = createHash\("sha256"\)[\s\S]*version: "expense-command-v2"[\s\S]*splitSpec,[\s\S]*\.digest\("hex"\)/);
  assert.match(expenseBlock, /existing\.commandFingerprint\s*\? existing\.commandFingerprint === commandFingerprint/);
  assert.match(expenseBlock, /JSON\.stringify\(existing\.splitSpec\) === JSON\.stringify\(splitSpec\)/);
  assert.match(expenseBlock, /if \(!sameCommand\) throw new Error\("IDEMPOTENCY_CONFLICT"\)/);
  assert.match(expenseBlock, /commandFingerprint,[\s\S]*splitSpec,[\s\S]*shares,/);
  assert.match(types, /export type SplitSpec = \{[\s\S]*version: "split-v2";[\s\S]*participantOrder: string\[\];[\s\S]*values\?: Array/);
});

test("UI usa el calculador común y transporta los cuatro modos sin reinterpretarlos", async () => {
  const page = await source("app/cuentas-claras/page.tsx");
  assert.match(page, /import \{ splitExpense \} from "\.\.\/\.\.\/lib\/debt-center\/split"/);
  assert.match(page, /\(\["equal", "amount", "percentage", "shares"\] as SplitMode\[\]\)\.map/);
  assert.match(page, /splitExpense\(amount, participantIds, splitMode, canonicalSplitValues\)/);
  assert.match(page, /splitMode, splitValues: canonicalSplitValues/);
  assert.match(page, /inputMode="decimal" aria-label=\{`Porcentaje de \$\{person\.name\}`\}/);
  assert.match(page, /inputMode="numeric" aria-label=\{`Partes de \$\{person\.name\}`\}/);
  assert.match(page, /placeholder="0"/);
  assert.doesNotMatch(page, /aria-label=\{`(?:Porcentaje|Partes) de \$\{person\.name\}`\}[^>]*min=\{?1/);
  assert.match(page, /initialDraft\.splitMode === "percentage" \? formatBasisPoints\(value\) : String\(value\)/);
});

test("errores Split V2 tienen estado y mensaje públicos en vez de 500 genérico", async () => {
  const http = await source("lib/debt-center/http.ts");
  const publicCodes = [
    "INVALID_SPLIT_MODE",
    "SPLIT_VALUES_REQUIRED",
    "SPLIT_VALUES_NOT_ALLOWED",
    "SPLIT_VALUE_KEYS_MISMATCH",
    "INVALID_PERCENTAGE_BPS",
    "PERCENTAGE_TOTAL_MUST_BE_10000",
    "INVALID_SHARE_WEIGHT",
    "SHARE_WEIGHT_LIMIT_EXCEEDED",
  ];
  for (const code of publicCodes) {
    assert.equal((http.match(new RegExp(`${code}:`, "g")) ?? []).length, 2, `${code} debe existir en status y safe message`);
  }
});
