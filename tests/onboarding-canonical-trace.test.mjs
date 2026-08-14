import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const trace = async () => JSON.parse(await readFile(new URL("lib/onboarding-canonical-trace.json", root), "utf8"));

test("trazabilidad cubre las doce reglas canónicas sin contradicciones", async () => {
  const contract = await trace();
  const ids = contract.rules.map((rule) => rule.id);

  assert.equal(contract.authority_source, "DIRECCION-PRODUCTOS-FELIPE.md");
  assert.equal(contract.scope, "onboarding_kyc_progressive");
  assert.equal(contract.rules.length, 12);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(new Set(contract.rules.map((rule) => rule.status)), new Set(["verified", "open_decision"]));
  assert.equal(contract.rules.filter((rule) => rule.status === "open_decision").length, 1);
  assert.equal(contract.rules.find((rule) => rule.status === "open_decision")?.id, "ONB-CAN-09");
});

test("cada regla apunta a evidencia local existente", async () => {
  const contract = await trace();
  for (const rule of contract.rules) {
    assert.ok(rule.evidence_files.length >= 2, rule.id);
    for (const file of rule.evidence_files) await access(new URL(file, root));
  }
});

test("la ficha pública no afirma que KYC o licencias liberen productos", async () => {
  const portfolio = await readFile(new URL("lib/product-portfolio.ts", root), "utf8");
  const onboarding = portfolio.split('{ id: "kyc"')[1]?.split("},")[0] ?? "";

  assert.match(onboarding, /KYC nunca habilita una capacidad por sí solo/);
  assert.doesNotMatch(onboarding, /KYC y licencias liberan productos|KYC habilita|KYC desbloquea/i);
});
