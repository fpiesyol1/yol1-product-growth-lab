import { MockFloidPaymentProvider } from "./mock-floid-provider.ts";
import type { PaymentProvider } from "./payment-provider.ts";

/**
 * Runtime factory for the Product Growth Lab.
 *
 * Floid is represented only by a deterministic simulator in this deliverable.
 * Environment variables cannot switch providers and this module performs no I/O.
 */
export function getPaymentProvider(): PaymentProvider {
  return new MockFloidPaymentProvider();
}
