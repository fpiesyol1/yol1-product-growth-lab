export type ProjectProductSheet = {
  knownFacts: string[];
  userContributions: string[];
  dataNeeds: string[];
  keyConditions: string[];
  technologyFit: string[];
  continuityLinks: string[];
  pendingDecisions: string[];
};

export type ProjectDraftInput = {
  submissionId: string;
  title: string;
  idea: string;
  problem: string;
  audience: string;
  valueProposition: string;
  assumptions: string[];
  openQuestions: string[];
  references: string[];
  productSheet: ProjectProductSheet;
};

export type SharedProjectDraft = Omit<ProjectDraftInput, "submissionId"> & {
  id: string;
  status: "draft";
  reviewStatus: "new" | "reviewing" | "later" | "resolved" | "learning_ready" | "ignored";
  reviewNote: string;
  createdAt: string;
  expiresAt: string;
};

export type PublicProjectDraft = Omit<SharedProjectDraft, "reviewStatus" | "reviewNote">;
