import { NextResponse } from "next/server";
import type { PublicProjectDraft, SharedProjectDraft } from "../../../../lib/project-draft-types";
import { getProjectDraft, isProjectDraftStorageConfigured } from "../../../../lib/server/project-draft-store";

export const runtime = "nodejs";

const PROJECT_ID = /^prj_[a-f0-9]{32}$/;

function toPublicProjectDraft(project: SharedProjectDraft): PublicProjectDraft {
  return {
    id: project.id,
    title: project.title,
    idea: project.idea,
    problem: project.problem,
    audience: project.audience,
    valueProposition: project.valueProposition,
    assumptions: project.assumptions,
    openQuestions: project.openQuestions,
    references: project.references,
    productSheet: project.productSheet,
    status: project.status,
    createdAt: project.createdAt,
    expiresAt: project.expiresAt,
  };
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!PROJECT_ID.test(id)) return NextResponse.json({ error: "Borrador inválido." }, { status: 400 });
  if (!isProjectDraftStorageConfigured()) return NextResponse.json({ error: "La bandeja de proyectos aún no está configurada." }, { status: 503 });
  try {
    const project = await getProjectDraft(id);
    if (!project) return NextResponse.json({ error: "El borrador no existe o ya expiró." }, { status: 404 });
    return NextResponse.json({ project: toPublicProjectDraft(project) }, { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } });
  } catch {
    return NextResponse.json({ error: "No pudimos abrir el borrador." }, { status: 503 });
  }
}
