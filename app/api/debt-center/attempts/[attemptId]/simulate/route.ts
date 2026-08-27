import { simulatePaymentResult } from "../../../../../../lib/debt-center/service";
import { assertDebtCenterSimulatorEnabled, debtCenterErrorResponse, noStoreHeaders } from "../../../../../../lib/debt-center/http";
import type { PaymentAttemptStatus } from "../../../../../../lib/debt-center/types";
import { assertSameOriginMutation, readBoundedJson } from "../../../../../../lib/debt-center/session";

type RouteContext = { params: Promise<{ attemptId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    assertDebtCenterSimulatorEnabled();
    assertSameOriginMutation(request);
    const { attemptId } = await context.params;
    const rawBody = await readBoundedJson(request);
    const body = rawBody as { publicToken?: string; status?: PaymentAttemptStatus; errorCode?: string };
    if (!body.status || !body.publicToken) return Response.json({ ok: false, error: "SIMULATION_CONTEXT_REQUIRED" }, { status: 400 });
    const result = await simulatePaymentResult(attemptId, body.publicToken, body.status, body.errorCode);
    return Response.json({ ok: true, ...result }, { headers: noStoreHeaders() });
  } catch (error) {
    return debtCenterErrorResponse(error);
  }
}
