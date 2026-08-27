import test from "node:test";
import assert from "node:assert/strict";

import {
  applyPaymentResult,
  assertPayableAmount,
  buildDashboard,
  buildPaymentAttemptView,
  buildPublicDebt,
  normalizeFloidStatus,
  outstandingForDebt,
  PUBLIC_ATTEMPT_TOTAL_LIMIT,
  PUBLIC_ATTEMPT_WINDOW_LIMIT,
  publicPaymentAttemptLimit,
} from "../lib/debt-center/domain.ts";
import { splitExpense } from "../lib/debt-center/split.ts";
import { createDebtCenterSeed } from "../lib/debt-center/seed.ts";
import { getPaymentProvider } from "../lib/debt-center/floid-provider.ts";

function seedWithAttempt(amount = 5_000) {
  const state = createDebtCenterSeed();
  const debt = state.debts.find((item) => item.originalAmount === 10_000);
  assert.ok(debt);
  const occurredAt = "2026-08-26T04:00:00.000Z";
  const attempt = {
    id: `attempt_${amount}`,
    debtId: debt.id,
    amount,
    provider: "mock_floid",
    providerPaymentToken: `token_${amount}`,
    paymentUrl: "https://example.invalid/pago-demo",
    status: "pending",
    providerStep: "AUTH_METHOD",
    idempotencyKey: `key_${amount}`,
    createdAt: occurredAt,
    updatedAt: occurredAt,
  };
  state.paymentAttempts.unshift(attempt);
  return { state, debt, attempt };
}

test("deuda de $10.000 acepta abono de $5.000 y conserva $5.000 pendientes", () => {
  const { state, debt, attempt } = seedWithAttempt();
  applyPaymentResult(state, attempt.id, "succeeded", { providerPaymentId: "mock_payment_1" });
  assert.equal(outstandingForDebt(state, debt), 5_000);
  assert.equal(state.settlements.length, 2); // incluye el abono semilla de Josefa
  const publicDebt = buildPublicDebt(state, debt.publicToken);
  assert.equal(publicDebt?.paidAmount, 5_000);
  assert.equal(publicDebt?.outstandingAmount, 5_000);
  assert.equal(publicDebt?.status, "partially_paid");
});

test("un segundo abono de $5.000 cierra la deuda y replay no duplica settlement", () => {
  const first = seedWithAttempt();
  applyPaymentResult(first.state, first.attempt.id, "succeeded", { providerPaymentId: "mock_payment_1" });
  const occurredAt = "2026-08-26T04:05:00.000Z";
  first.state.paymentAttempts.unshift({ ...first.attempt, id: "attempt_second", providerPaymentToken: "token_second", idempotencyKey: "key_second", status: "pending", createdAt: occurredAt, updatedAt: occurredAt });
  applyPaymentResult(first.state, "attempt_second", "succeeded", { providerPaymentId: "mock_payment_2" });
  const count = first.state.settlements.filter((item) => item.debtId === first.debt.id).length;
  applyPaymentResult(first.state, "attempt_second", "succeeded", { providerPaymentId: "mock_payment_2" });
  assert.equal(first.state.settlements.filter((item) => item.debtId === first.debt.id).length, count);
  assert.equal(outstandingForDebt(first.state, first.debt), 0);
  assert.equal(buildPublicDebt(first.state, first.debt.publicToken)?.status, "paid");
});

test("sobrepago, monto cero y transición desde terminal se bloquean", () => {
  const { state, debt, attempt } = seedWithAttempt();
  assert.throws(() => assertPayableAmount(state, debt, 10_001), /PAYMENT_EXCEEDS_OUTSTANDING|ACTIVE_PAYMENT_ATTEMPT_EXISTS/);
  assert.throws(() => assertPayableAmount(state, debt, 0), /INVALID_PAYMENT_AMOUNT/);
  applyPaymentResult(state, attempt.id, "failed", { errorCode: "DECLINED" });
  assert.throws(() => applyPaymentResult(state, attempt.id, "succeeded"), /INVALID_PAYMENT_STATUS_TRANSITION/);
});

test("DTO público conserva monto del intento pero no filtra secretos", () => {
  const { state, debt } = seedWithAttempt(2_000);
  const value = buildPublicDebt(state, debt.publicToken);
  assert.equal(value?.activeAttempt?.amount, 2_000);
  const serialized = JSON.stringify(value);
  assert.doesNotMatch(serialized, /providerPaymentToken|paymentUrl|idempotencyKey|providerEvidenceHash/);
});

test("dashboard e intento público nunca exponen secretos del proveedor", () => {
  const { state, attempt } = seedWithAttempt(5_000);
  const dashboard = buildDashboard(state, "memory", "mock_floid");
  const publicAttempt = buildPaymentAttemptView(attempt);
  const serialized = JSON.stringify({ dashboard, publicAttempt });
  assert.doesNotMatch(serialized, /providerPaymentToken|paymentUrl|idempotencyKey|providerEvidenceHash/);
  assert.equal(publicAttempt.id, attempt.id);
  assert.equal(publicAttempt.amount, 5000);
});

test("estados Floid y reparto CLP mantienen contrato estricto", () => {
  assert.equal(normalizeFloidStatus("SUCCESS"), "succeeded");
  assert.equal(normalizeFloidStatus("CANCELED"), "cancelled");
  assert.throws(() => normalizeFloidStatus("MAYBE"), /UNKNOWN_FLOID_STATUS/);
  assert.deepEqual(splitExpense(10_000, ["a", "b"], "equal"), [{ participantId: "a", amount: 5_000 }, { participantId: "b", amount: 5_000 }]);
  assert.throws(() => splitExpense(10_000, ["a", "b"], "amount", { a: 4_000, b: 5_000 }), /SPLIT_DOES_NOT_MATCH_TOTAL/);
});

test("Floid permanece simulado aunque el entorno intente activar llamadas externas", async () => {
  const originalFetch = globalThis.fetch;
  let externalCalls = 0;
  globalThis.fetch = async () => { externalCalls += 1; throw new Error("NETWORK_MUST_NOT_RUN"); };
  process.env.DEBT_PAYMENT_PROVIDER = "floid";
  process.env.YOL1_ENABLE_FLOID_CALLS = "true";
  process.env.FLOID_PAYIN_SANDBOX = "true";
  process.env.FLOID_PAYIN_API_TOKEN = "must-not-be-read";
  try {
    const provider = getPaymentProvider();
    assert.equal(provider.kind, "mock_floid");
    const created = await provider.createPayment({ attemptId: "attempt_no_network", debtId: "debt_demo", amount: 5_000, returnUrl: "https://example.invalid/return", webhookUrl: "https://example.invalid/webhook" });
    assert.equal(created.provider, "mock_floid");
    assert.equal(externalCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.DEBT_PAYMENT_PROVIDER;
    delete process.env.YOL1_ENABLE_FLOID_CALLS;
    delete process.env.FLOID_PAYIN_SANDBOX;
    delete process.env.FLOID_PAYIN_API_TOKEN;
  }
});

test("el límite público usa intentos persistidos y calcula Retry-After", () => {
  const { state, debt, attempt } = seedWithAttempt();
  const now = Date.parse("2026-08-26T05:00:00.000Z");
  state.paymentAttempts = Array.from({ length: PUBLIC_ATTEMPT_WINDOW_LIMIT }, (_, index) => ({
    ...attempt,
    id: `attempt_rate_${index}`,
    idempotencyKey: `rate-key-${index}`,
    status: "failed",
    createdAt: new Date(now - 60_000 * (index + 1)).toISOString(),
    updatedAt: new Date(now - 60_000 * (index + 1)).toISOString(),
  }));
  const limit = publicPaymentAttemptLimit(state, debt.id, now);
  assert.equal(limit?.code, "PAYMENT_ATTEMPT_RATE_LIMITED");
  assert.ok(Number.isInteger(limit?.retryAfterSeconds));
  assert.ok(limit.retryAfterSeconds > 0 && limit.retryAfterSeconds <= 15 * 60);
});

test("el simulador impone un techo durable de intentos por deuda", () => {
  const { state, debt, attempt } = seedWithAttempt();
  const now = Date.parse("2026-08-26T05:00:00.000Z");
  state.paymentAttempts = Array.from({ length: PUBLIC_ATTEMPT_TOTAL_LIMIT }, (_, index) => ({
    ...attempt,
    id: `attempt_total_${index}`,
    idempotencyKey: `total-key-${index}`,
    status: "failed",
    createdAt: new Date(now - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
  }));
  assert.deepEqual(publicPaymentAttemptLimit(state, debt.id, now), { code: "PAYMENT_ATTEMPT_LIMIT_REACHED" });
});
