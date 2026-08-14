import assert from "node:assert/strict";
import test from "node:test";
import {
  buildOnboardingDemoSnapshot,
  ONBOARDING_DEMO_SCHEMA_VERSION,
  parseOnboardingDemoSnapshot,
} from "../lib/onboarding-demo-storage.ts";

test("snapshot contiene sólo estado demo no sensible", () => {
  const snapshot = buildOnboardingDemoSnapshot({
    capability: "financial_data_connect",
    channel: "email",
    stage: "consent_preview",
  });

  assert.deepEqual(snapshot, {
    schema_version: ONBOARDING_DEMO_SCHEMA_VERSION,
    selected_capability: "financial_data_connect",
    preregistration_state: "created_demo",
    channel_type: "email",
    resume_stage: "consent_preview",
    consent_preview_seen: true,
  });
  assert.doesNotMatch(JSON.stringify(snapshot), /persona@|\+569|123456|rut|serial|document|biometric/i);
});

test("receive_value nunca restaura una vista de consentimiento incompatible", () => {
  const snapshot = buildOnboardingDemoSnapshot({
    capability: "receive_value",
    channel: "teléfono",
    stage: "consent_preview",
  });

  assert.equal(snapshot.resume_stage, "preregistered_demo");
  assert.equal(snapshot.consent_preview_seen, false);
});

test("parser rechaza schema antiguo, estados incompletos y JSON inválido", () => {
  assert.equal(parseOnboardingDemoSnapshot("not-json"), null);
  assert.equal(parseOnboardingDemoSnapshot(JSON.stringify({ schema_version: "onboarding-demo-0.2" })), null);
  assert.equal(parseOnboardingDemoSnapshot(JSON.stringify({ schema_version: ONBOARDING_DEMO_SCHEMA_VERSION })), null);
});

test("parser sanea propiedades extra y PII de un snapshot manipulado", () => {
  const parsed = parseOnboardingDemoSnapshot(JSON.stringify({
    schema_version: ONBOARDING_DEMO_SCHEMA_VERSION,
    selected_capability: "receive_value",
    preregistration_state: "created_demo",
    channel_type: "email",
    resume_stage: "preregistered_demo",
    consent_preview_seen: false,
    email: "persona@example.com",
    phone: "+56911111111",
    otp: "123456",
    rut: "12.345.678-9",
  }));

  assert.deepEqual(parsed, {
    schema_version: ONBOARDING_DEMO_SCHEMA_VERSION,
    selected_capability: "receive_value",
    preregistration_state: "created_demo",
    channel_type: "email",
    resume_stage: "preregistered_demo",
    consent_preview_seen: false,
  });
});
