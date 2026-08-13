import type { FeedbackSubmission } from "./feedback-intake";
import type { ChatReviewRating, SharedFeedbackInput, SharedFeedbackItem, SharedFeedbackStatus } from "./feedback-types";

const SESSION_KEY = "yol1-lab-feedback-session-v1";

function sessionId() {
  const current = window.localStorage.getItem(SESSION_KEY);
  if (current) return current;
  const created = window.crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

async function submit(input: Omit<SharedFeedbackInput, "sessionId">) {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, sessionId: sessionId(), website: "" }),
  });
  const payload = await response.json() as { error?: string; mode?: "shared" };
  if (!response.ok) throw new Error(payload.error || "No pudimos compartir el feedback.");
  return payload.mode === "shared";
}

export function submitGeneralFeedback(input: FeedbackSubmission) {
  return submit({ source: "feedback", ...input, idempotencyKey: window.crypto.randomUUID() });
}

export function submitChatResponse(input: { id: string; question: string; answer: string; rating: ChatReviewRating; knowledgeVersion: string }) {
  return submit({ source: "chat", idempotencyKey: input.id, question: input.question, answer: input.answer, rating: input.rating, knowledgeVersion: input.knowledgeVersion });
}

export async function getFeedbackServiceStatus() {
  const response = await fetch("/api/feedback?status=1", { cache: "no-store" });
  if (!response.ok) return { storageConfigured: false, reviewConfigured: false };
  return response.json() as Promise<{ storageConfigured: boolean; reviewConfigured: boolean }>;
}

export async function listSharedFeedback(token: string) {
  const response = await fetch("/api/feedback", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  const payload = await response.json() as { items?: SharedFeedbackItem[]; error?: string };
  if (!response.ok || !payload.items) throw new Error(payload.error || "No pudimos abrir la bandeja.");
  return payload.items;
}

export async function updateSharedFeedback(token: string, id: string, status: SharedFeedbackStatus, reviewNote = "") {
  const response = await fetch("/api/feedback", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id, status, reviewNote }),
  });
  const payload = await response.json() as { error?: string };
  if (!response.ok) throw new Error(payload.error || "No pudimos actualizar el feedback.");
}
