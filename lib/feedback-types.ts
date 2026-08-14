// Estados editoriales. Los cuatro primeros ordenan feedback de personas; `wrong`
// queda reservado para correcciones de una respuesta de IA.
export type SharedFeedbackStatus = "new" | "reviewing" | "later" | "resolved" | "ignored" | "wrong";
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
