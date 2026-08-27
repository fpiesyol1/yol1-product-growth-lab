import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

async function loadFixtureFactory() {
  const input = await source("lib/server/belvo-sandbox.ts");
  const output = ts.transpileModule(input, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(output, { module: testModule, exports: testModule.exports });
  return testModule.exports.getLocalBelvoFixture;
}

test("el runtime Belvo no contiene adaptador, secretos ni salida de red", async () => {
  const files = await Promise.all([
    source("lib/server/belvo-sandbox.ts"),
    source("app/api/belvo-lab/probe/route.ts"),
    source("app/belvo-lab/belvo-lab-client.tsx"),
    source("app/belvo-lab/page.tsx"),
  ]);
  const runtime = files.join("\n");
  const server = files[0];
  const route = files[1];
  const client = files[2];

  assert.doesNotMatch(runtime, /https?:\/\//i);
  assert.doesNotMatch(runtime, /process\.env|Authorization|Basic\s|Buffer\.from/i);
  assert.doesNotMatch(runtime, /secretId|secretPassword|test_username|test_password/i);
  assert.doesNotMatch(server, /fetch\s*\(|XMLHttpRequest|WebSocket|EventSource/i);
  assert.doesNotMatch(route, /fetch\s*\(|request\.json|request\.text|request\.formData/i);
  assert.deepEqual(client.match(/fetch\s*\(/g), ["fetch("]);
  assert.match(client, /fetch\("\/api\/belvo-lab\/probe"/);
});

test("la API sirve sólo GET local y rechaza POST sin leer el body", async () => {
  const api = await source("app/api/belvo-lab/probe/route.ts");
  assert.match(api, /getLocalBelvoFixture/);
  assert.match(api, /export async function GET\(\)/);
  assert.match(api, /export async function POST\(\)/);
  assert.match(api, /status: 405/);
  assert.match(api, /Allow: "GET"/);
  assert.match(api, /X-YOL1-Data-Source/);
  assert.doesNotMatch(api, /Request|request\.(?:json|text|formData)|secretId|secretPassword/i);
});

test("la fixture es determinista, separada por llamada y no identificable", async () => {
  const getFixture = await loadFixtureFactory();
  const first = JSON.parse(JSON.stringify(getFixture()));
  const second = JSON.parse(JSON.stringify(getFixture()));

  assert.deepEqual(first, second);
  assert.equal(first.verdict, "fixture_ready");
  assert.equal(first.checkedAt, "2026-08-26T12:00:00.000Z");
  assert.equal(first.taxStatus.records, 1);
  assert.equal(first.invoices.records, 4);
  assert.equal(first.invoices.totalAmount, 1_284_900);

  first.invoices.records = 999;
  assert.equal(JSON.parse(JSON.stringify(getFixture())).invoices.records, 4);

  const serialized = JSON.stringify(second);
  assert.doesNotMatch(serialized, /"(?:document_id_number|addresses?|emails?|phones?|rawPayload)":/i);
  assert.doesNotMatch(serialized, /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/);
  assert.doesNotMatch(serialized, /\b\d{7,9}-[\dkK]\b/);
});

test("la UI no pide llaves y explica honestamente el límite", async () => {
  const page = await source("app/belvo-lab/page.tsx");
  const client = await source("app/belvo-lab/belvo-lab-client.tsx");
  const document = await source("BELVO-CHILE-SANDBOX-LAB.md");

  assert.doesNotMatch(client, /<input|type="password"|Secret ID|Secret Password/i);
  assert.match(client, /Cargar fixture local/);
  assert.match(client, /0 red · 0 datos reales/);
  assert.match(client, /NO ES RESPUESTA DE BELVO/);
  assert.match(page, /100% local/);
  assert.match(page, /no demuestra cobertura real/i);
  assert.match(document, /cero red hacia Belvo/i);
  assert.match(document, /no tiene fallback a sandbox o producción/i);
});
