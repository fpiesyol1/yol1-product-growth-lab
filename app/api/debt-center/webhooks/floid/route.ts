import { noStoreHeaders } from "../../../../../lib/debt-center/http";

export async function POST() {
  return Response.json(
    {
      ok: false,
      error: "FLOID_NETWORK_DISABLED",
      message: "Este Lab sólo usa el simulador local. No recibe webhooks ni llama a Floid.",
    },
    { status: 410, headers: noStoreHeaders() },
  );
}
