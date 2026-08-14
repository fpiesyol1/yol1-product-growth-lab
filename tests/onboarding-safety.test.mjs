import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildSafeOnboardingEvent, normalizeKycState, SAFE_ONBOARDING_EVENT_NAMES } from "../lib/onboarding-safety.ts";

const root = new URL("../", import.meta.url);

test("estados KYC canónicos se conservan", () => {
  for (const state of ["not_required", "requirements_pending", "in_progress", "review", "failed_recoverable", "declined", "verified"]) {
    assert.equal(normalizeKycState(state), state);
  }
});

test("cualquier estado KYC desconocido degrada a review", () => {
  for (const state of ["approved", "APPROVED", "success", "new_partner_state", "", null, undefined, 200, { status: "verified" }]) {
    assert.equal(normalizeKycState(state), "review", String(state));
  }
});

test("eventos fuera de allowlist no producen payload", () => {
  assert.equal(buildSafeOnboardingEvent("account_opened", { capability_key: "receive_value" }), null);
  assert.equal(buildSafeOnboardingEvent("money_received", { amount: 1000 }), null);
  assert.equal(buildSafeOnboardingEvent("kyc_approved", { rut: "12.345.678-9" }), null);
});

test("builder conserva sólo propiedades aprobadas y primitivas", () => {
  const event = buildSafeOnboardingEvent("kyc_handoff_opened", {
    anonymous_id: "anon-demo-1",
    screen_key: "preregistered_demo",
    capability_key: "receive_value",
    availability_state: "not_available",
    policy_version: "demo-0.2",
    extra: "discard",
    nested: { secret: true },
  });

  assert.deepEqual(event, {
    event: "kyc_handoff_opened",
    anonymous_id: "anon-demo-1",
    screen_key: "preregistered_demo",
    capability_key: "receive_value",
    availability_state: "not_available",
    policy_version: "demo-0.2",
  });
});

test("builder elimina PII, OTP y respuesta cruda aunque se entreguen", () => {
  const event = buildSafeOnboardingEvent("otp_verified_demo", {
    channel: "email",
    attempt_bucket: "1",
    email: "persona@example.com",
    phone: "+56911111111",
    otp: "123456",
    rut: "12.345.678-9",
    serial: "ABC123",
    document: "base64-secret",
    biometrics: "fixture",
    raw_provider_response: "approved",
  });

  assert.deepEqual(event, { event: "otp_verified_demo", channel: "email", attempt_bucket: "1" });
});

test("todos los data-event literales de Onboarding y Mi banco están allowlisted", async () => {
  const source = await readFile(new URL("app/page.tsx", root), "utf8");
  const section = source.split("function OnboardingFlow")[1]?.split("function ProfileMenu")[0] ?? "";
  const events = [...section.matchAll(/data-event="([^"]+)"/g)].map((match) => match[1]);

  assert.ok(events.length >= 12);
  for (const event of events) assert.ok(SAFE_ONBOARDING_EVENT_NAMES.includes(event), event);
  for (const event of ["consent_preview_opened", "kyc_handoff_opened"]) {
    assert.ok(SAFE_ONBOARDING_EVENT_NAMES.includes(event));
    assert.match(section, new RegExp(event));
  }
});

test("eventos de recuperación seguros tampoco aceptan contacto crudo", () => {
  for (const eventName of ["otp_recovery_started", "account_recovery_started", "support_route_started", "preregistration_demo_deleted"]) {
    const event = buildSafeOnboardingEvent(eventName, {
      reason_code: "demo_fixture",
      surface: "otp_entry",
      capability_key: "receive_value",
      email: "persona@example.com",
      phone: "+56911111111",
      contact: "persona@example.com",
      otp: "123456",
    });
    assert.ok(event, eventName);
    assert.doesNotMatch(JSON.stringify(event), /persona@|\+569|123456/);
  }
});
