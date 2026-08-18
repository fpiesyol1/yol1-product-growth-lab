import { NextResponse } from "next/server";
import type { SharedProjectDraft } from "../../../lib/project-draft-types";
import { isProjectDraftStorageConfigured, listProjectDrafts, updateProjectDraftReview } from "../../../lib/server/project-draft-store";
import { isReviewAuthorized } from "../../../lib/server/review-auth";

export const runtime = "nodejs";

const PROJECT_ID = /^prj_[a-f0-9]{32}$/;
const reviewStatuses = new Set<SharedProjectDraft["reviewStatus"]>(["new", "reviewing", "later", "resolved", "learning_ready", "ignored"]);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: Request) {
  if (!isReviewAuthorized(request)) return NextResponse.json({ error: "Acceso de revisión requerido." }, { status: 401 });
  if (!isProjectDraftStorageConfigured()) return NextResponse.json({ error: "La bandeja compartida de proyectos aún no está configurada." }, { status: 503 });
  try {
    return NextResponse.json({ projects: await listProjectDrafts() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "No pudimos abrir las propuestas compartidas." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!isReviewAuthorized(request)) return NextResponse.json({ error: "Acceso de revisión requerido." }, { status: 401 });
  if (!isProjectDraftStorageConfigured()) return NextResponse.json({ error: "La bandeja compartida de proyectos aún no está configurada." }, { status: 503 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const id = clean(body.id, 40);
    const reviewStatus = clean(body.reviewStatus, 30) as SharedProjectDraft["reviewStatus"];
    const reviewNote = clean(body.reviewNote, 500);
    if (!PROJECT_ID.test(id) || !reviewStatuses.has(reviewStatus)) return NextResponse.json({ error: "Actualización inválida." }, { status: 400 });
    const project = await updateProjectDraftReview(id, reviewStatus, reviewNote);
    if (!project) return NextResponse.json({ error: "La propuesta no existe o expiró." }, { status: 404 });
    return NextResponse.json({ project }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "No pudimos actualizar esta propuesta." }, { status: 503 });
  }
}
