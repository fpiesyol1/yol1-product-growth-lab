import { localChatFeedbackIntake } from "./chat-feedback";
import { localFeedbackIntake } from "./feedback-intake";
import type { SharedFeedbackItem, SharedFeedbackStatus } from "./feedback-types";

export type LearningStatus = SharedFeedbackStatus;
export type LearningItem = SharedFeedbackItem;

const TRIAGE_KEY = "yol1-lab-learning-triage-v1";

type LocalTriageRecord = { status: LearningStatus; reviewNote: string; reviewedAt: string | null };

function readTriage() {
  if (typeof window === "undefined") return {} as Record<string, LocalTriageRecord>;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(TRIAGE_KEY) ?? "{}") as Record<string, LocalTriageRecord | LearningStatus | "consider" | "approve" | "discard">;
    return Object.fromEntries(Object.entries(parsed).map(([key, value]) => {
      const legacyStatus = typeof value === "string" ? value : value.status;
      const status = legacyStatus === "consider" || legacyStatus === "approve" ? "reviewing" : legacyStatus === "discard" ? "ignored" : legacyStatus;
      return [key, { status, reviewNote: typeof value === "string" ? "" : value.reviewNote ?? "", reviewedAt: typeof value === "string" ? null : value.reviewedAt ?? null }];
    })) as Record<string, LocalTriageRecord>;
  } catch {
    return {} as Record<string, LocalTriageRecord>;
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
    status: triage[`feedback:${item.id}`]?.status ?? "new",
    reviewNote: triage[`feedback:${item.id}`]?.reviewNote ?? "",
    reviewedAt: triage[`feedback:${item.id}`]?.reviewedAt ?? null,
  }));
  const chat: LearningItem[] = localChatFeedbackIntake.list().map((item) => ({
    id: `chat:${item.id}`,
    source: "chat",
    label: item.rating === "useful" ? "Respuesta útil" : "Respuesta a mejorar",
    context: `Chat · ${item.knowledgeVersion}`,
    title: item.question,
    body: item.answer,
    createdAt: item.createdAt,
    status: triage[`chat:${item.id}`]?.status ?? "new",
    reviewNote: triage[`chat:${item.id}`]?.reviewNote ?? "",
    reviewedAt: triage[`chat:${item.id}`]?.reviewedAt ?? null,
  }));
  return [...feedback, ...chat].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function setLearningStatus(id: string, status: LearningStatus, reviewNote = "") {
  const triage = { ...readTriage(), [id]: { status, reviewNote, reviewedAt: new Date().toISOString() } };
  window.localStorage.setItem(TRIAGE_KEY, JSON.stringify(triage));
}
