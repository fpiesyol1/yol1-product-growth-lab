import { randomUUID } from "node:crypto";
import { PaymentProviderError } from "./payment-provider.ts";

const COOKIE_NAME = "yol1_cc_demo_session";
const SESSION_ID = /^[a-f0-9]{32}$/;
const MAX_JSON_BYTES = 16_384;

export type DebtCenterSession = {
  id: string;
  isNew: boolean;
};

function cookieValue(request: Request, name: string) {
  const cookies = request.headers.get("cookie") ?? "";
  for (const part of cookies.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) {
      try {
        return decodeURIComponent(value.join("="));
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function getDebtCenterSession(request: Request): DebtCenterSession {
  const existing = cookieValue(request, COOKIE_NAME);
  if (existing && SESSION_ID.test(existing)) return { id: existing, isNew: false };
  return { id: randomUUID().replaceAll("-", ""), isNew: true };
}

export function debtCenterSessionHeaders(session: DebtCenterSession, headers: HeadersInit = {}) {
  const result = new Headers(headers);
  if (session.isNew) {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    result.append("Set-Cookie", `${COOKIE_NAME}=${session.id}; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax${secure}`);
  }
  return result;
}

export function assertSameOriginMutation(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw new PaymentProviderError("CROSS_ORIGIN_REQUEST", "Esta acción demo sólo se acepta desde YOL1.", 403);
  }

  const origin = request.headers.get("origin");
  if (!origin) return;
  const allowedOrigins = new Set([new URL(request.url).origin]);
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      allowedOrigins.add(new URL(configured).origin);
    } catch {
      // A malformed optional URL must not broaden the allowlist.
    }
  }
  if (!allowedOrigins.has(origin)) {
    throw new PaymentProviderError("CROSS_ORIGIN_REQUEST", "Esta acción demo sólo se acepta desde YOL1.", 403);
  }
}

export async function readBoundedJson(request: Request): Promise<Record<string, unknown>> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    throw new PaymentProviderError("REQUEST_TOO_LARGE", "La solicitud demo supera el límite permitido.", 413);
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_JSON_BYTES) {
    throw new PaymentProviderError("REQUEST_TOO_LARGE", "La solicitud demo supera el límite permitido.", 413);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new PaymentProviderError("INVALID_JSON", "La solicitud demo no tiene un formato válido.", 400);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new PaymentProviderError("INVALID_JSON", "La solicitud demo no tiene un formato válido.", 400);
  }
  return parsed as Record<string, unknown>;
}

export function debtCenterWorkspaceId(sessionId: string) {
  if (!SESSION_ID.test(sessionId)) throw new Error("INVALID_DEMO_SESSION");
  return `session_${sessionId}`;
}
