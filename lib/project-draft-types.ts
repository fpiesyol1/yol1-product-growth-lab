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
};

export type SharedProjectDraft = Omit<ProjectDraftInput, "submissionId"> & {
  id: string;
  status: "draft";
  createdAt: string;
  expiresAt: string;
};
