import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildAccessLedger } from "../lib/onboarding-access-ledger.ts";
import { buildOnboardingDemoSnapshot } from "../lib/onboarding-demo-storage.ts";
import { SAFE_ONBOARDING_EVENT_NAMES } from "../lib/onboarding-safety.ts";

const root = new URL("../", import.meta.url);

test("ledger vacío no inventa pre-registro, canal, permiso ni capacidad", () => {
  const rows = buildAccessLedger(null);
  const statuses = rows.map((row) => row.status).join(" | ");

  assert.match(statuses, /Sin pre-registro/);
  assert.match(statuses, /Sin permiso/);
  assert.match(statuses, /No iniciada/);
  assert.match(statuses, /ninguna capacidad real/);
  assert.match(statuses, /Vacíos/);
  assert.doesNotMatch(statuses, /verificado|habilitad|aprobado/i);
});

test("ledger de conexión distingue vista de consentimiento de permiso activo", () => {
  const snapshot = buildOnboardingDemoSnapshot({
    capability: "financial_data_connect",
    channel: "email",
    stage: "consent_preview",
  });
  const rows = buildAccessLedger(snapshot);
  const access = rows.find((row) => row.key === "access");
  const data = rows.find((row) => row.key === "financial_data");

  assert.equal(access?.status, "Pre-registro demo · email");
  assert.equal(data?.status, "Vista de consentimiento revisada · sin permiso");
  assert.equal(data?.action, "open_onboarding");
});

test("ledger de recepción conserva intención pero no infiere KYC ni dinero", () => {
  const snapshot = buildOnboardingDemoSnapshot({
    capability: "receive_value",
    channel: "teléfono",
    stage: "preregistered_demo",
  });
  const rows = buildAccessLedger(snapshot);
  const request = rows.find((row) => row.key === "receive_value");
  const capabilities = rows.find((row) => row.key === "capabilities");

  assert.equal(request?.status, "Intención guardada · requisitos por validar");
  assert.equal(request?.action, "open_bank");
  assert.equal(capabilities?.status, "Sólo exploración · ninguna capacidad real");
  assert.doesNotMatch(JSON.stringify(rows), /identidad verificada|KYC aprobado|dinero habilitado/i);
});

test("perfil deriva el ledger del snapshot y permite borrarlo sin PII", async () => {
  const source = await readFile(new URL("app/page.tsx", root), "utf8");
  const section = source.split("function ProfileMenu")[1]?.split("function ProjectBuilderScreen")[0] ?? "";

  assert.match(source, /buildAccessLedger/);
  assert.match(section, /onClearDemo/);
  assert.match(section, /"preregistration_demo_deleted"/);
  assert.ok(SAFE_ONBOARDING_EVENT_NAMES.includes("preregistration_demo_deleted"));
  assert.match(section, /Accesos y permisos/);
  assert.doesNotMatch(section, /<input|<textarea|RUT|biometr|documento/i);
});

test("borrar desde el ledger reinicia también el estado transitorio de Onboarding", async () => {
  const source = await readFile(new URL("app/page.tsx", root), "utf8");
  const clearSection = source.split("const clearDemoFromLedger")[1]?.split("const go")[0] ?? "";

  assert.match(source, /const \[onboardingResetKey, setOnboardingResetKey\] = useState\(0\)/);
  assert.match(clearSection, /setOnboardingResetKey\(\(current\) => current \+ 1\)/);
  assert.match(source, /<OnboardingFlow key=\{onboardingResetKey\}/);
});
