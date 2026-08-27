import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const input = await readFile(new URL("lib/debt-health-demo.ts", root), "utf8");
const output = ts.transpileModule(input, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const testModule = { exports: {} };
vm.runInNewContext(output, { module: testModule, exports: testModule.exports, require: () => ({}) });

const {
  DEBT_HEALTH_DEMO,
  buildDebtHealthSummary,
  matchPaymentEvidence,
  transitionPlanItem,
} = testModule.exports;

test("un reporte anterior y un pago posterior sólo producen un candidato", () => {
  const obligation = DEBT_HEALTH_DEMO.obligations[0];
  const before = structuredClone(obligation);
  assert.equal(matchPaymentEvidence(obligation, DEBT_HEALTH_DEMO.evidence), "candidate");
  assert.deepEqual(structuredClone(obligation), before, "la coincidencia no debe alterar saldo ni mora");
  assert.equal(DEBT_HEALTH_DEMO.evidence.matchState, "candidate");
});

test("una coincidencia sin monto o fecha compatibles no confirma nada", () => {
  const obligation = DEBT_HEALTH_DEMO.obligations[0];
  assert.equal(matchPaymentEvidence(obligation, { ...DEBT_HEALTH_DEMO.evidence, amount: 74_999 }), "none");
  assert.equal(matchPaymentEvidence(obligation, { ...DEBT_HEALTH_DEMO.evidence, occurredAt: obligation.reportAsOf }), "none");
});

test("cobertura parcial obliga a declarar información faltante", () => {
  const summary = buildDebtHealthSummary(DEBT_HEALTH_DEMO);
  assert.equal(summary.conclusion, "missing_information");
  assert.equal(summary.obligationCount, 3);
  assert.equal(summary.lateCount, 0);
  assert.equal(summary.reportedBalance, 1_990_000);
  assert.equal(summary.knownMonthlyPressure, 193_000);
});

test("marcar un paso es reversible y no equivale a confirmarlo", () => {
  const marked = transitionPlanItem("pending", "mark");
  assert.equal(marked, "user_marked");
  assert.equal(transitionPlanItem(marked, "reopen"), "reopened");
  assert.equal(transitionPlanItem("pending", "confirm"), "pending");
  assert.equal(transitionPlanItem(marked, "confirm"), "confirmed");
});
