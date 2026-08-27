import { NextResponse } from "next/server";
import { getLocalBelvoFixture } from "@/lib/server/belvo-sandbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "no-store",
  "X-YOL1-Data-Source": "local-fixture",
};

export async function GET() {
  return NextResponse.json(getLocalBelvoFixture(), { headers: responseHeaders });
}

// Fail closed: this prototype never accepts a body or provider authentication data.
export async function POST() {
  return NextResponse.json(
    { error: "Este laboratorio sólo expone una fixture local mediante GET." },
    { status: 405, headers: { ...responseHeaders, Allow: "GET" } },
  );
}
