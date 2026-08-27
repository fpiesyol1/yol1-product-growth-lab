import type { PaymentAttemptStatus, PaymentProviderKind } from "./types";

export type CreateProviderPaymentInput = {
  attemptId: string;
  debtId: string;
  amount: number;
  returnUrl: string;
  webhookUrl: string;
  webhookSecret?: string;
  recipient?: {
    account: string;
    id: string;
    name: string;
    accountType: 1 | 2 | 3;
    bank: number;
  };
};

export type ProviderPayment = {
  provider: PaymentProviderKind;
  paymentToken: string;
  paymentUrl: string;
  status: PaymentAttemptStatus;
  step: string;
};

export type ProviderPaymentCheck = {
  paymentToken: string;
  paymentId?: string;
  amount: number;
  status: PaymentAttemptStatus;
  step: string;
  errorCode?: string;
  recipientAccount?: string;
  recipientId?: string;
  recipientBank?: number;
  evidenceHash?: string;
};

export interface PaymentProvider {
  readonly kind: PaymentProviderKind;
  createPayment(input: CreateProviderPaymentInput): Promise<ProviderPayment>;
  checkPayment(paymentToken: string): Promise<ProviderPaymentCheck>;
  cancelPayment?(paymentToken: string): Promise<ProviderPaymentCheck>;
}

export class PaymentProviderError extends Error {
  readonly code: string;
  readonly status: number;
  readonly retryAfterSeconds?: number;

  constructor(code: string, message: string, status = 502, retryAfterSeconds?: number) {
    super(message);
    this.code = code;
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
    this.name = "PaymentProviderError";
  }
}
