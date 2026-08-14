import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = new URL("../", import.meta.url);

async function loadCommonJs(path, dependencies = {}) {
  const input = await readFile(new URL(path, root), "utf8");
  const output = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports, require: (id) => dependencies[id], Set, Math, String, RegExp });
  return module.exports;
}

const catalog = await loadCommonJs("lib/ai/knowledge-catalog.ts");
const router = await loadCommonJs("lib/ai/knowledge-router.ts", { "./knowledge-catalog": catalog });
const cases = JSON.parse(await readFile(new URL("evals/knowledge-router-cases.json", root), "utf8"));

test("cada ficha aprobada mantiene diez variantes trazables", () => {
  assert.equal(catalog.knowledgeCatalog.length, 6);
  assert.equal(catalog.YOL1_KNOWLEDGE_VERSION, "lab-kb-2026-08-14.1");
  for (const card of catalog.knowledgeCatalog) {
    assert.equal(card.status, "approved");
    assert.equal(card.variants.length, 10, card.id);
    assert.match(card.source, /^knowledge\//);
  }
});

test("el conocimiento aprobado usa el mismo cierre de pendientes que la interfaz", () => {
  const pendingCards = catalog.knowledgeCatalog.filter((card) => ["collect-receivables-001", "collect-payables-001"].includes(card.id));
  assert.equal(pendingCards.length, 2);
  for (const card of pendingCards) {
    assert.match(card.expectedAnswer.next, /marcar el pendiente como resuelto/i);
    assert.doesNotMatch(card.expectedAnswer.next, /Ya me pagaron|Ya pagué/);
  }
});

test("15 consultas rutean a ficha, regla o fallback sin inventar", () => {
  assert.ok(cases.length >= 12);
  for (const evaluation of cases) {
    const result = router.routeKnowledge(evaluation.input);
    assert.equal(result.kind, evaluation.expectedKind, evaluation.input);
    if (evaluation.expectedId) assert.equal(result.knowledgeId, evaluation.expectedId, evaluation.input);
    if (result.kind === "approved") {
      assert.match(result.text, /Qué veo:/);
      assert.match(result.text, /Qué significa:/);
      assert.match(result.text, /Qué puedes hacer ahora:/);
    }
    if (result.kind === "fallback") {
      assert.match(result.text, /No alcancé a ubicar/);
      assert.match(result.text, /No voy a inventar/);
      assert.ok(result.suggestions.length >= 2);
    }
  }
});

test("el resultado mensual usa una operación determinista sobre datos ficticios", () => {
  assert.deepEqual({ ...router.calculateLabMonthResult() }, { income: 2450000, expenses: 1620000, result: 830000 });
});
