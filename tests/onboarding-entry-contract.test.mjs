import assert from "node:assert/strict";
import test from "node:test";
import { buildOnboardingHref, DEFAULT_ONBOARDING_ENTRY, parseOnboardingEntry, resolveOnboardingReturn } from "../lib/onboarding-entry-contract.ts";

test("entrada directa degrada a un retorno seguro", () => {
  assert.deepEqual(parseOnboardingEntry("?return_to=https://evil.example&draft_id=draft_nico_10000"), DEFAULT_ONBOARDING_ENTRY);
  assert.equal(resolveOnboardingReturn(DEFAULT_ONBOARDING_ENTRY), "/?product=companion&tab=inicio");
});

test("handoff de Cuentas Claras exige un draft opaco", () => {
  const draftId = `draft_${"a".repeat(32)}`;
  const entry = parseOnboardingEntry(`?entry_v=1&entry_context=clear_accounts&requested_job=save_clear_accounts_draft&return_to=clear_accounts_draft&draft_id=${draftId}&rut=11111111-1`);
  assert.equal(entry.draft_id, draftId);
  assert.equal(resolveOnboardingReturn(entry), `/?product=clear_accounts&intent=resume_draft&draftId=${draftId}`);
  assert.doesNotMatch(buildOnboardingHref(entry), /rut|amount|contact/i);
});

test("un draft semántico o una combinación inválida no se conserva", () => {
  assert.deepEqual(parseOnboardingEntry("?entry_v=1&entry_context=clear_accounts&requested_job=save_clear_accounts_draft&return_to=clear_accounts_draft&draft_id=draft_liguria_41600"), DEFAULT_ONBOARDING_ENTRY);
  assert.deepEqual(parseOnboardingEntry("?entry_v=1&entry_context=companion&requested_job=save_clear_accounts_draft&return_to=clear_accounts_draft&draft_id=draft_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), DEFAULT_ONBOARDING_ENTRY);
});
