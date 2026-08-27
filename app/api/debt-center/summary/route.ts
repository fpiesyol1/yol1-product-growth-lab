import { getDebtCenterCompanionSummary } from "../../../../lib/debt-center/service";
import { assertDebtCenterSimulatorEnabled, debtCenterErrorResponse, noStoreHeaders } from "../../../../lib/debt-center/http";
import { debtCenterSessionHeaders, getDebtCenterSession } from "../../../../lib/debt-center/session";

export async function GET(request: Request) {
  try {
    assertDebtCenterSimulatorEnabled();
    const session = getDebtCenterSession(request);
    const summary = await getDebtCenterCompanionSummary(session.id);
    return Response.json({ ok: true, summary }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
  } catch (error) {
    return debtCenterErrorResponse(error);
  }
}
