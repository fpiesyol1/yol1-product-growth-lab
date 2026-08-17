import assert from "node:assert/strict";
import test from "node:test";
import { ONBOARDING_STAGE_META, transitionOnboarding } from "../lib/onboarding-state-machine.ts";

test("la ruta feliz entrega valor, elige objetivo y explica requisitos antes del acceso", () => {
  const events = [
    "VIEW_ACTIVATIONS",
    "SELECT_CAPABILITY",
    "START_PREREGISTRATION",
    "REQUEST_OTP_DEMO",
    "VERIFY_OTP_DEMO",
  ];
  const stages = events.reduce(
    (visited, event) => [...visited, transitionOnboarding(visited.at(-1), event)],
    ["welcome"],
  );

  assert.deepEqual(stages, [
    "welcome",
    "capability_chooser",
    "requirements_explained",
    "channel_select",
    "otp_entry",
    "preregistered_demo",
  ]);
});

test("eventos fuera de orden no adelantan el journey", () => {
  assert.equal(transitionOnboarding("welcome", "VERIFY_OTP_DEMO"), "welcome");
  assert.equal(transitionOnboarding("capability_chooser", "REQUEST_OTP_DEMO"), "capability_chooser");
  assert.equal(transitionOnboarding("requirements_explained", "VERIFY_OTP_DEMO"), "requirements_explained");
  assert.equal(transitionOnboarding("otp_entry", "OPEN_CONSENT_PREVIEW"), "otp_entry");
});

test("cambiar canal y volver conservan estados seguros", () => {
  assert.equal(transitionOnboarding("otp_entry", "CHANGE_CHANNEL"), "channel_select");
  assert.equal(transitionOnboarding("channel_select", "BACK_TO_REQUIREMENTS"), "requirements_explained");
  assert.equal(transitionOnboarding("consent_preview", "BACK_TO_PREREGISTERED"), "preregistered_demo");
});

test("reset explícito vuelve a bienvenida desde cualquier estado", () => {
  for (const stage of Object.keys(ONBOARDING_STAGE_META)) {
    assert.equal(transitionOnboarding(stage, "RESET_DEMO"), "welcome", stage);
  }
});

test("metadata de progreso es nominal, creciente y termina en uno", () => {
  const progress = Object.values(ONBOARDING_STAGE_META).map((meta) => meta.progress);
  assert.equal(new Set(Object.values(ONBOARDING_STAGE_META).map((meta) => meta.label)).size, progress.length);
  assert.ok(progress.every((value, index) => index === 0 || value > progress[index - 1]));
  assert.equal(progress.at(-1), 1);
});
