import test from "node:test";
import assert from "node:assert/strict";

import { debtCenterErrorResponse } from "../lib/debt-center/http.ts";
import { PaymentProviderError } from "../lib/debt-center/payment-provider.ts";

test("un límite temporal devuelve 429, Retry-After y nunca cachea la respuesta", async () => {
  const response = debtCenterErrorResponse(new PaymentProviderError(
    "PAYMENT_ATTEMPT_RATE_LIMITED",
    "Espera antes de probar otra vez.",
    429,
    321,
  ));
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "321");
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "PAYMENT_ATTEMPT_RATE_LIMITED",
    message: "Espera antes de probar otra vez.",
  });
});

test("los errores públicos no incluyen campos internos del intento", async () => {
  const response = debtCenterErrorResponse(new Error("INVALID_PAYMENT_AMOUNT"));
  const serialized = JSON.stringify(await response.json());
  assert.doesNotMatch(serialized, /providerPaymentToken|paymentUrl|idempotencyKey|providerEvidenceHash/);
});
