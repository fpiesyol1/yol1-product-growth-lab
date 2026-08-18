import { NextResponse } from "next/server";
import { isFeedbackStorageConfigured, listFeedback } from "../../../lib/server/feedback-store";
import { isProjectDraftStorageConfigured, listProjectDrafts } from "../../../lib/server/project-draft-store";
import { isReviewAuthorized, isReviewConfigured } from "../../../lib/server/review-auth";

export const runtime = "nodejs";

/** Una lectura inicial compacta: evita tres Functions al abrir Reviews. */
export async function GET(request: Request) {
  const reviewConfigured = isReviewConfigured();
  const authorized = isReviewAuthorized(request);
  const storageConfigured = isFeedbackStorageConfigured() && isProjectDraftStorageConfigured();
  if (!reviewConfigured || !authorized || !storageConfigured) {
    return NextResponse.json({ storageConfigured, reviewConfigured, authorized }, { headers: { "Cache-Control": "no-store" } });
  }

  const [feedback, projects] = await Promise.allSettled([listFeedback(), listProjectDrafts()]);
  return NextResponse.json({
    storageConfigured,
    reviewConfigured,
    authorized,
    mode: "shared",
    items: feedback.status === "fulfilled" ? feedback.value : [],
    projects: projects.status === "fulfilled" ? projects.value : [],
    feedbackAvailable: feedback.status === "fulfilled",
    projectsAvailable: projects.status === "fulfilled",
  }, { headers: { "Cache-Control": "no-store" } });
}
