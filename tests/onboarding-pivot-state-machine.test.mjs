import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PIVOT_ONBOARDING_STAGE_META, transitionPivotOnboarding } from "../lib/onboarding-pivot-state-machine.ts";

const root = new URL("../", import.meta.url);

test("el pivote entrega valor, confirma canal y pide perfil antes de navegar", () => {
  const events = ["COMPLETE_VALUE_CAROUSEL", "REQUEST_OTP_DEMO", "VERIFY_OTP_DEMO", "SUBMIT_PROFILE_DEMO"];
  const stages = events.reduce((visited, event) => [...visited, transitionPivotOnboarding(visited.at(-1), event)], ["welcome"]);
  assert.deepEqual(stages, ["welcome", "channel_select", "otp_entry", "profile_basics", "workspace_ready"]);
});

test("la verificación completa es opcional y termina en revisión", () => {
  const events = ["CONTINUE_FULL_KYC", "START_DOCUMENT_DEMO", "CONFIRM_DOCUMENT_DEMO", "CONFIRM_BIOMETRIC_DEMO"];
  const stages = events.reduce((visited, event) => [...visited, transitionPivotOnboarding(visited.at(-1), event)], ["workspace_ready"]);
  assert.deepEqual(stages, ["workspace_ready", "kyc_intro", "document_check", "biometric_check", "kyc_review"]);
  assert.equal(transitionPivotOnboarding("kyc_intro", "BACK_TO_WORKSPACE"), "workspace_ready");
});

test("OTP o biometría fuera de orden no adelantan el pivote", () => {
  assert.equal(transitionPivotOnboarding("welcome", "VERIFY_OTP_DEMO"), "welcome");
  assert.equal(transitionPivotOnboarding("channel_select", "SUBMIT_PROFILE_DEMO"), "channel_select");
  assert.equal(transitionPivotOnboarding("workspace_ready", "CONFIRM_BIOMETRIC_DEMO"), "workspace_ready");
});

test("todos los estados vuelven a bienvenida con reset explícito", () => {
  for (const stage of Object.keys(PIVOT_ONBOARDING_STAGE_META)) {
    assert.equal(transitionPivotOnboarding(stage, "RESET_DEMO"), "welcome", stage);
  }
});

test("runtime, PRD y ficha pública describen el mismo pivote sin inferir capability", async () => {
  const [page, flow, portfolio, prd] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/onboarding-progressive.tsx", root), "utf8"),
    readFile(new URL("lib/product-portfolio.ts", root), "utf8"),
    readFile(new URL("PRD-ONBOARDING-KYC-PROGRESIVO.md", root), "utf8"),
  ]);
  const kycSpec = portfolio.split('if (product.id === "kyc")')[1]?.split('if (product.id === "builder")')[0] ?? "";

  assert.match(page, /ONBOARDING_PROGRESSIVE_PIVOT = true/);
  assert.match(flow, /buildOnboardingDemoSnapshot\(\{ capability: "none"/);
  assert.doesNotMatch(flow, /buildOnboardingDemoSnapshot\(\{ capability: "financial_data_connect"/);
  assert.match(kycSpec, /01 · Historias de valor/);
  assert.match(kycSpec, /04 · Perfil declarado/);
  assert.match(kycSpec, /snapshot neutral de acceso; sin nombre, RUT ni capability/);
  assert.doesNotMatch(kycSpec, /02 · Elegir objetivo/);
  assert.match(prd, /manda el pivote activo sólo para esta prueba local/i);
  assert.match(prd, /no se asignan al perfil declarado por defecto/i);
});
