import { localChatFeedbackIntake } from "./chat-feedback";
import { localFeedbackIntake } from "./feedback-intake";
import type { SharedFeedbackItem, SharedFeedbackStatus } from "./feedback-types";

export type LearningStatus = SharedFeedbackStatus;
export type LearningItem = SharedFeedbackItem;

const TRIAGE_KEY = "yol1-lab-learning-triage-v1";

function readTriage() {
  if (typeof window === "undefined") return {} as Record<string, LearningStatus>;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(TRIAGE_KEY) ?? "{}") as Record<string, LearningStatus | "consider" | "approve" | "discard">;
    return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, value === "consider" || value === "approve" ? "reviewing" : value === "discard" ? "ignored" : value])) as Record<string, LearningStatus>;
  } catch {
    return {} as Record<string, LearningStatus>;
  }
}

export function listLearningItems(): LearningItem[] {
  const triage = readTriage();
  const feedback: LearningItem[] = localFeedbackIntake.list().map((item) => ({
    id: `feedback:${item.id}`,
    source: "feedback",
    label: item.kind === "like" ? "Me gusta" : item.kind === "improve" ? "Mejoraría" : "Idea",
    context: item.screen,
    title: item.message || "Feedback rápido sin comentario",
    body: item.topics ? `Temas: ${item.topics}` : "Sin temas adicionales.",
    createdAt: item.createdAt,
    status: triage[`feedback:${item.id}`] ?? "new",
    reviewNote: "",
    reviewedAt: null,
  }));
  const chat: LearningItem[] = localChatFeedbackIntake.list().map((item) => ({
    id: `chat:${item.id}`,
    source: "chat",
    label: item.rating === "useful" ? "Respuesta útil" : "Respuesta a mejorar",
    context: `Chat · ${item.knowledgeVersion}`,
    title: item.question,
    body: item.answer,
    createdAt: item.createdAt,
    status: triage[`chat:${item.id}`] ?? "new",
    reviewNote: "",
    reviewedAt: null,
  }));
  return [...feedback, ...chat].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function setLearningStatus(id: string, status: LearningStatus) {
  const triage = { ...readTriage(), [id]: status };
  window.localStorage.setItem(TRIAGE_KEY, JSON.stringify(triage));
}
