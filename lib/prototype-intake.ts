import type { SharedFeedbackStatus } from "./feedback-types";

export type ExternalPrototype = {
  id: string;
  title: string;
  summary: string;
  reference: string;
  createdAt: string;
  status: SharedFeedbackStatus;
  reviewNote: string;
};

const STORAGE_KEY = "yol1-lab-external-prototypes-v1";

function read() {
  if (typeof window === "undefined") return [] as ExternalPrototype[];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value as ExternalPrototype[] : [];
  } catch {
    return [] as ExternalPrototype[];
  }
}

export const localPrototypeIntake = {
  list: read,
  submit(input: Omit<ExternalPrototype, "id" | "createdAt" | "status" | "reviewNote">) {
    const record: ExternalPrototype = { ...input, id: window.crypto.randomUUID(), createdAt: new Date().toISOString(), status: "new", reviewNote: "" };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...read()].slice(0, 50)));
    return record;
  },
  setStatus(id: string, status: SharedFeedbackStatus, note = "") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(read().map((item) => item.id === id ? { ...item, status, reviewNote: note } : item)));
  },
};
