import type { CreateProviderPaymentInput, PaymentProvider, ProviderPaymentCheck } from "./payment-provider";

export class MockFloidPaymentProvider implements PaymentProvider {
  readonly kind = "mock_floid" as const;

  async createPayment(input: CreateProviderPaymentInput) {
    return {
      provider: this.kind,
      paymentToken: `mock_floid_${input.attemptId}`,
      paymentUrl: input.returnUrl,
      status: "not_started" as const,
      step: "LANDING",
    };
  }

  async checkPayment(paymentToken: string): Promise<ProviderPaymentCheck> {
    return {
      paymentToken,
      amount: 0,
      status: "not_started",
      step: "LANDING",
    };
  }
}
