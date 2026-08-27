import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { buildPublicDebt } from "../lib/debt-center/domain.ts";
import { createDebtCenterSeed } from "../lib/debt-center/seed.ts";

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("create_group conserva un comando durable y corta el replay antes de crear participantes", async () => {
  const service = await source("lib/debt-center/service.ts");
  const groupBlock = service.slice(service.indexOf("export async function createDebtGroup"), service.indexOf("export async function getDebtDashboard"));
  const replayGuard = groupBlock.indexOf("const existing = state.groups.find((item) => item.commandId === input.commandId)");
  const participantCreation = groupBlock.indexOf("for (const participantName of newParticipantNames)");

  assert.match(groupBlock, /\^group_cmd_\[a-f0-9\]\{32\}\$/);
  assert.ok(replayGuard >= 0 && replayGuard < participantCreation, "el replay debe resolverse antes de crear participantes");
  assert.match(groupBlock, /if \(!sameCommand\) throw new Error\("IDEMPOTENCY_CONFLICT"\);\s+return existing;/);
  assert.match(groupBlock, /commandId: input\.commandId/);
});

test("create_expense devuelve gasto y deudas existentes antes de duplicar efectos", async () => {
  const service = await source("lib/debt-center/service.ts");
  const expenseBlock = service.slice(service.indexOf("export async function createSharedExpense"), service.indexOf("export type CreatePayinInput"));
  const replayGuard = expenseBlock.indexOf("const existing = state.expenses.find((item) => item.commandId === input.commandId)");
  const expenseInsert = expenseBlock.indexOf("state.expenses.unshift(expense)");
  const debtInsert = expenseBlock.indexOf("state.debts.unshift(...debts)");
  const activityInsert = expenseBlock.indexOf("state.activities.unshift(");

  assert.match(expenseBlock, /\^draft_\[a-f0-9\]\{32\}\$/);
  assert.ok(replayGuard >= 0 && replayGuard < expenseInsert && replayGuard < debtInsert && replayGuard < activityInsert);
  assert.match(expenseBlock, /if \(!sameCommand\) throw new Error\("IDEMPOTENCY_CONFLICT"\);\s+return \{ expense: existing, debts: state\.debts\.filter/);
  assert.match(expenseBlock, /commandId: input\.commandId/);
});

test("UI y API conservan el mismo commandId durante reintentos de grupo y gasto", async () => {
  const [page, route] = await Promise.all([
    source("app/cuentas-claras/page.tsx"),
    source("app/api/debt-center/route.ts"),
  ]);

  assert.match(page, /const \[commandId\] = useState\(\(\) => resumedDraftId \?\? createExpenseDraftId\(\)\)/);
  assert.match(page, /action: "create_expense", commandId, groupId/);
  assert.match(page, /const \[commandId\] = useState\(\(\) => `group_cmd_\$\{crypto\.randomUUID\(\)\.replaceAll\("-", ""\)\}`\)/);
  assert.match(page, /action: "create_group", commandId, name/);
  assert.ok((route.match(/commandId: String\(body\.commandId \?\? ""\)/g) ?? []).length >= 2);
});

test("DTO del pagador expone sólo el contrato mínimo y nunca valores secretos", () => {
    const state = createDebtCenterSeed();
    const debt = state.debts.find((item) => item.originalAmount === 10_000);
    assert.ok(debt);
    const attempt = {
      id: "attempt_public_dto",
      debtId: debt.id,
      amount: 5_000,
      provider: "mock_floid",
      providerPaymentToken: "SENTINEL_PROVIDER_TOKEN",
      providerPaymentId: "SENTINEL_PROVIDER_PAYMENT_ID",
      paymentUrl: "https://sentinel.invalid/private-payment-url",
      status: "pending",
      providerStep: "AUTH_METHOD",
      idempotencyKey: "SENTINEL_IDEMPOTENCY_KEY",
      errorCode: "SENTINEL_ERROR_CODE",
      providerEvidenceHash: "SENTINEL_EVIDENCE_HASH",
      createdAt: "2026-08-26T12:00:00.000Z",
      updatedAt: "2026-08-26T12:00:00.000Z",
    };
    state.paymentAttempts.unshift(attempt);
    state.participants.forEach((participant, index) => {
      participant.contact = `SENTINEL_CONTACT_${index}`;
    });
    state.settlements.push({
      id: "settlement_private",
      debtId: debt.id,
      source: "payment_attempt",
      paymentAttemptId: attempt.id,
      amount: 1,
      providerPaymentId: "SENTINEL_SETTLEMENT_PROVIDER_ID",
      settledAt: "2026-08-26T12:01:00.000Z",
      recordedAt: "2026-08-26T12:01:00.000Z",
    });

    const dto = buildPublicDebt(state, debt.publicToken);
    assert.ok(dto);
    assert.deepEqual(Object.keys(dto).sort(), [
      "activeAttempt",
      "creditorName",
      "debtId",
      "debtorName",
      "expenseTitle",
      "groupName",
      "lastCompletedAttempt",
      "originalAmount",
      "outstandingAmount",
      "paidAmount",
      "publicToken",
      "status",
    ]);
    assert.deepEqual(Object.keys(dto.activeAttempt ?? {}).sort(), [
      "amount",
      "createdAt",
      "id",
      "providerStep",
      "status",
      "updatedAt",
    ]);
    assert.deepEqual(Object.keys(dto.lastCompletedAttempt ?? {}).sort(), [
      "amount",
      "completedAt",
      "id",
    ]);
    assert.deepEqual(dto.lastCompletedAttempt, {
      id: attempt.id,
      amount: 1,
      completedAt: "2026-08-26T12:01:00.000Z",
    });
    const serialized = JSON.stringify(dto);
    assert.doesNotMatch(serialized, /SENTINEL_/);
    assert.doesNotMatch(serialized, /providerPaymentToken|providerPaymentId|paymentUrl|idempotencyKey|providerEvidenceHash|contact|settlement/i);
});
