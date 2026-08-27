import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

async function loadFixtureFactory() {
  const input = await source("lib/server/floid-sandbox.ts");
  const output = ts.transpileModule(input, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(output, { module: testModule, exports: testModule.exports, Date });
  return testModule.exports.getFloidSimulationFixture;
}

test("el side-lab Floid es local, no acepta secretos y no puede salir a red", async () => {
  const files = await Promise.all([
    source("lib/server/floid-sandbox.ts"),
    source("app/api/floid-lab/probe/route.ts"),
    source("app/floid-lab/floid-lab-client.tsx"),
    source("app/floid-lab/page.tsx"),
  ]);
  const executableProbe = files.slice(0, 3).join("\n");
  const server = files[0];
  const route = files[1];
  const client = files[2];

  assert.doesNotMatch(executableProbe, /https?:\/\//i);
  assert.doesNotMatch(executableProbe, /process\.env|Authorization|Bearer\s|Basic\s|client[_-]?secret|api[_-]?token/i);
  assert.doesNotMatch(server, /fetch\s*\(|XMLHttpRequest|WebSocket|EventSource/i);
  assert.doesNotMatch(route, /fetch\s*\(|request\.(?:json|text|formData)/i);
  assert.deepEqual(client.match(/fetch\s*\(/g), ["fetch("]);
  assert.match(client, /fetch\("\/api\/floid-lab\/probe"/);
});

test("la fixture Floid conserva sólo el contrato sintético esperado", async () => {
  const getFixture = await loadFixtureFactory();
  const first = JSON.parse(JSON.stringify(getFixture()));
  const second = JSON.parse(JSON.stringify(getFixture()));

  assert.equal(first.verdict, "module_blocked");
  assert.equal(first.banking.accounts, 1);
  assert.equal(first.banking.cards, 1);
  assert.equal(first.banking.creditLines, 1);
  assert.equal(first.banking.movements, 12);
  assert.equal(first.steps.find((step) => step.id === "network")?.status, "blocked");
  assert.ok(Number.isFinite(Date.parse(first.checkedAt)));

  first.banking.accounts = 999;
  assert.equal(second.banking.accounts, 1);
  const serialized = JSON.stringify(second);
  assert.doesNotMatch(serialized, /password|credential|access[_-]?token|account[_-]?number|rut|email|phone/i);
});

test("la interfaz Floid declara simulación y nunca pide datos bancarios", async () => {
  const page = await source("app/floid-lab/page.tsx");
  const client = await source("app/floid-lab/floid-lab-client.tsx");
  const document = await source("FLOID-CHILE-SANDBOX-LAB.md");

  assert.doesNotMatch(client, /<input|type="password"|client id|client secret|api token/i);
  assert.match(client, /SIMULACIÓN LOCAL/);
  assert.match(client, /Cero credenciales/);
  assert.match(client, /No llama a Floid, no pide claves y no mueve dinero/);
  assert.match(page, /fixture local/i);
  assert.match(document, /(?:sin credenciales|(?:no|tampoco) (?:acepta|solicita|usa)[^.]*credenciales)/i);
  assert.match(document, /(?:no (?:llama endpoints externos|hace `fetch` a Floid)|sin tráfico de red)/i);
});
