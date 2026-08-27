import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import type { ChatReviewRating, SharedFeedbackInput, SharedFeedbackStatus } from "../../../lib/feedback-types";
import { countRecentFeedback, isFeedbackStorageConfigured, listFeedback, saveFeedback, updateFeedback } from "../../../lib/server/feedback-store";
import { isReviewAuthorized, isReviewConfigured } from "../../../lib/server/review-auth";

export const runtime = "nodejs";

const screens = new Set(["Inicio", "Mis finanzas", "Cartola", "Ahorrar", "Tu plan de deuda", "Experimentos", "Mi banco", "Cuentas Claras"]);
const products = new Set(["Acompañante financiero", "Cuentas Claras", "Onboarding y KYC progresivo", "Home Banking", "Tarjetas", "Remesas", "Construir mi propio producto"]);
const kinds = new Set(["like", "improve", "idea"]);
const ratings = new Set<ChatReviewRating>(["unrated", "useful", "improve"]);
const statuses = new Set<SharedFeedbackStatus>(["new", "reviewing", "later", "resolved", "learning_ready", "ignored", "wrong"]);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function containsSensitiveData(text: string) {
  return /(?:^|\D)(?:\d[ -]?){13,19}(?:\D|$)/.test(text)
    || /\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/.test(text)
    || /\b(?:clave|contraseña|password|cvv|cvc|pin)\s*[:=]/i.test(text)
    || /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
    || /(?:\+?56\s?)?(?:9\s?)?\d{4}[\s-]?\d{4}/.test(text);
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowed = (process.env.YOL1_FEEDBACK_ALLOWED_ORIGIN || "").split(",").map((item) => item.trim()).filter(Boolean);
  return origin === new URL(request.url).origin || allowed.includes(origin);
}

function isKnownFeedbackContext(value: string) {
  if (screens.has(value)) return true;
  const [product, screen, ...rest] = value.split(" · ");
  // Un producto puede tener subpantallas nuevas antes de que el catálogo del
  // servidor las conozca. Validamos que el producto sea conocido y conservamos la
  // etiqueta de pantalla como contexto editorial; no es un permiso ni una ruta.
  return rest.length === 0 && Boolean(screen) && products.has(product);
}

function normalizeInput(value: unknown): SharedFeedbackInput | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const source = body.source === "feedback" || body.source === "chat" ? body.source : null;
  const idempotencyKey = clean(body.idempotencyKey, 80);
  const sessionId = clean(body.sessionId, 100);
  if (!source || !/^[a-zA-Z0-9-]{8,80}$/.test(idempotencyKey) || !/^[a-zA-Z0-9-]{8,100}$/.test(sessionId)) return null;

  const input: SharedFeedbackInput = { source, idempotencyKey, sessionId, website: clean(body.website, 100) };
  if (source === "feedback") {
    const screen = clean(body.screen, 100);
    const kind = clean(body.kind, 20);
    const message = clean(body.message, 700);
    const topics = clean(body.topics, 180);
    if (!isKnownFeedbackContext(screen) || !kinds.has(kind) || ((kind === "improve" || kind === "idea") && !message)) return null;
    return { ...input, screen, kind: kind as SharedFeedbackInput["kind"], message, topics };
  }

  const question = clean(body.question, 700);
  const answer = clean(body.answer, 1200);
  const rating = clean(body.rating, 20) as ChatReviewRating;
  const knowledgeVersion = clean(body.knowledgeVersion, 100);
  if (!question || !answer || !ratings.has(rating)) return null;
  return { ...input, question, answer, rating, knowledgeVersion };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("status") === "1") {
    return NextResponse.json({ storageConfigured: isFeedbackStorageConfigured(), reviewConfigured: isReviewConfigured(), authorized: isReviewAuthorized(request) });
  }
  if (!isReviewAuthorized(request)) return NextResponse.json({ error: "Acceso de revisión requerido." }, { status: 401 });
  try {
    return NextResponse.json({ items: await listFeedback(), mode: "shared" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "La bandeja compartida no está disponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  const input = normalizeInput(body);
  if (!input) return NextResponse.json({ error: "Feedback incompleto o inválido." }, { status: 400 });
  if (input.website) return NextResponse.json({ accepted: true }, { status: 202 });
  const content = [input.message, input.topics, input.question, input.answer].filter(Boolean).join(" ");
  if (containsSensitiveData(content)) return NextResponse.json({ error: "No incluyas datos personales, credenciales, teléfonos ni números de tarjeta." }, { status: 422 });
  if (!isFeedbackStorageConfigured()) return NextResponse.json({ error: "La bandeja compartida aún no está configurada." }, { status: 503 });

  const sessionHash = createHash("sha256").update(input.sessionId).digest("hex");
  try {
    if (await countRecentFeedback(sessionHash) >= 20) return NextResponse.json({ error: "Alcanzaste el límite temporal de feedback." }, { status: 429 });
    const id = await saveFeedback(input, sessionHash);
    return NextResponse.json({ accepted: true, id, mode: "shared" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No pudimos guardar el feedback compartido." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!isReviewAuthorized(request)) return NextResponse.json({ error: "Acceso de revisión requerido." }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  const data = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const id = clean(data.id, 80);
  const status = clean(data.status, 20) as SharedFeedbackStatus;
  const reviewNote = clean(data.reviewNote, 500);
  if (!id || !statuses.has(status) || (status === "wrong" && !reviewNote)) return NextResponse.json({ error: "Equivocado requiere explicar qué está mal." }, { status: 400 });
  try {
    const updated = await updateFeedback(id, status, reviewNote);
    return updated ? NextResponse.json({ updated: true }) : NextResponse.json({ error: "Feedback no encontrado." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "No pudimos actualizar el feedback." }, { status: 503 });
  }
}
