export type FeedbackKind = "like" | "improve" | "idea";

export type FeedbackSubmission = {
  screen: string;
  kind: FeedbackKind;
  message: string;
  topics: string;
};

export type FeedbackRecord = FeedbackSubmission & {
  id: string;
  createdAt: string;
  status: "new";
};

export interface FeedbackIntakeAdapter {
  submit(input: FeedbackSubmission): FeedbackRecord;
  list(): FeedbackRecord[];
}

const STORAGE_KEY = "yol1-lab-feedback-v1";
const MAX_LOCAL_RECORDS = 30;

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

const readRecords = (): FeedbackRecord[] => {
  if (!canUseStorage()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const localFeedbackIntake: FeedbackIntakeAdapter = {
  submit(input) {
    const record: FeedbackRecord = {
      ...input,
      id: globalThis.crypto?.randomUUID?.() ?? `feedback-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "new",
    };
    if (canUseStorage()) {
      try {
        const records = [record, ...readRecords()].slice(0, MAX_LOCAL_RECORDS);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      } catch {
        // The UI still confirms a session-only draft when browser storage is unavailable.
      }
    }
    return record;
  },
  list: readRecords,
};
