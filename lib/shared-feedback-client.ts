import type { FeedbackSubmission } from "./feedback-intake";
import type { ChatReviewRating, SharedFeedbackInput, SharedFeedbackItem, SharedFeedbackStatus } from "./feedback-types";
import type { SharedProjectDraft } from "./project-draft-types";

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

export async function getFeedbackServiceStatus(token = "") {
  const response = await fetch("/api/feedback?status=1", { headers: token ? { Authorization: `Bearer ${token}` } : {}, cache: "no-store" });
  if (!response.ok) return { storageConfigured: false, reviewConfigured: false, authorized: false };
  return response.json() as Promise<{ storageConfigured: boolean; reviewConfigured: boolean; authorized: boolean }>;
}

export async function getReviewWorkspace(token = "") {
  const response = await fetch("/api/review", { headers: token ? { Authorization: `Bearer ${token}` } : {}, cache: "no-store" });
  const payload = await response.json() as {
    storageConfigured?: boolean;
    reviewConfigured?: boolean;
    authorized?: boolean;
    items?: SharedFeedbackItem[];
    projects?: SharedProjectDraft[];
    feedbackAvailable?: boolean;
    projectsAvailable?: boolean;
    error?: string;
  };
  if (!response.ok) throw new Error(payload.error || "No pudimos abrir la bandeja.");
  return {
    storageConfigured: Boolean(payload.storageConfigured),
    reviewConfigured: Boolean(payload.reviewConfigured),
    authorized: Boolean(payload.authorized),
    items: payload.items ?? [],
    projects: payload.projects ?? [],
    feedbackAvailable: payload.feedbackAvailable ?? true,
    projectsAvailable: payload.projectsAvailable ?? true,
  };
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

export async function listSharedProjectDrafts(token: string) {
  const response = await fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  const payload = await response.json() as { projects?: SharedProjectDraft[]; error?: string };
  if (!response.ok || !payload.projects) throw new Error(payload.error || "No pudimos abrir las propuestas compartidas.");
  return payload.projects;
}

export async function updateSharedProjectDraft(token: string, id: string, reviewStatus: SharedProjectDraft["reviewStatus"], reviewNote = "") {
  const response = await fetch("/api/projects", { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ id, reviewStatus, reviewNote }) });
  const payload = await response.json() as { project?: SharedProjectDraft; error?: string };
  if (!response.ok || !payload.project) throw new Error(payload.error || "No pudimos actualizar la propuesta.");
  return payload.project;
}
