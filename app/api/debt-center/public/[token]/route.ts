import { createPayin, getPublicDebtByToken } from "../../../../../lib/debt-center/service";
import { assertDebtCenterSimulatorEnabled, debtCenterErrorResponse, noStoreHeaders } from "../../../../../lib/debt-center/http";
import { assertSameOriginMutation, readBoundedJson } from "../../../../../lib/debt-center/session";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    assertDebtCenterSimulatorEnabled();
    const { token } = await context.params;
    const debt = await getPublicDebtByToken(token);
    if (!debt) return Response.json({ ok: false, error: "DEBT_NOT_FOUND" }, { status: 404, headers: noStoreHeaders() });
    return Response.json({ ok: true, debt }, { headers: noStoreHeaders() });
  } catch (error) {
    return debtCenterErrorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    assertDebtCenterSimulatorEnabled();
    assertSameOriginMutation(request);
    const { token } = await context.params;
    const body = await readBoundedJson(request);
    const idempotencyKey = request.headers.get("idempotency-key")?.trim() || String(body.idempotencyKey ?? "");
    if (!idempotencyKey || idempotencyKey.length > 120) {
      return Response.json({ ok: false, error: "IDEMPOTENCY_KEY_REQUIRED", message: "Falta identificar este intento demo." }, { status: 400 });
    }
    const result = await createPayin({
      publicToken: token,
      amount: Number(body.amount),
      idempotencyKey,
      origin: process.env.NODE_ENV === "development"
        ? new URL(request.url).origin
        : new URL(process.env.NEXT_PUBLIC_SITE_URL ?? request.url).origin,
    });
    return Response.json({ ok: true, ...result }, { status: 201, headers: noStoreHeaders() });
  } catch (error) {
    return debtCenterErrorResponse(error);
  }
}
