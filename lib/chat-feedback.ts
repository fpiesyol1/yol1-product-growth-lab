export type ChatFeedbackRating = "useful" | "improve";

type ChatFeedbackRecord = {
  id: string;
  sessionId: string;
  question: string;
  answer: string;
  rating: ChatFeedbackRating;
  knowledgeVersion: string;
  createdAt: string;
};

const STORAGE_KEY = "yol1-lab-chat-feedback-v1";

const readRecords = (): ChatFeedbackRecord[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const localChatFeedbackIntake = {
  submit(input: Omit<ChatFeedbackRecord, "id" | "createdAt">) {
    if (typeof window === "undefined") return;
    const current = readRecords();
    const record: ChatFeedbackRecord = { ...input, id: window.crypto.randomUUID(), createdAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...current].slice(0, 50)));
  },
  list: readRecords,
};

export type { ChatFeedbackRecord };
