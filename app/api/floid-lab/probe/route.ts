import { NextResponse } from "next/server";
import { getFloidSimulationFixture } from "@/lib/server/floid-sandbox";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(getFloidSimulationFixture(), {
    headers: { "Cache-Control": "no-store" },
  });
}
