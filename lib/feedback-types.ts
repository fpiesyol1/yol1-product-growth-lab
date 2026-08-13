export type SharedFeedbackStatus = "new" | "approve" | "wrong" | "discard";
export type ChatReviewRating = "unrated" | "useful" | "improve";

export type SharedFeedbackInput = {
  idempotencyKey: string;
  sessionId: string;
  source: "feedback" | "chat";
  screen?: string;
  kind?: "like" | "improve" | "idea";
  message?: string;
  topics?: string;
  question?: string;
  answer?: string;
  rating?: ChatReviewRating;
  knowledgeVersion?: string;
  website?: string;
};

export type SharedFeedbackItem = {
  id: string;
  source: "feedback" | "chat";
  label: string;
  context: string;
  title: string;
  body: string;
  status: SharedFeedbackStatus;
  reviewNote: string;
  createdAt: string;
  reviewedAt: string | null;
};
