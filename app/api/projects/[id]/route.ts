import { NextResponse } from "next/server";
import { getProjectDraft, isProjectDraftStorageConfigured } from "../../../../lib/server/project-draft-store";

export const runtime = "nodejs";

const PROJECT_ID = /^prj_[a-f0-9]{32}$/;

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!PROJECT_ID.test(id)) return NextResponse.json({ error: "Borrador inválido." }, { status: 400 });
  if (!isProjectDraftStorageConfigured()) return NextResponse.json({ error: "La bandeja de proyectos aún no está configurada." }, { status: 503 });
  try {
    const project = await getProjectDraft(id);
    if (!project) return NextResponse.json({ error: "El borrador no existe o ya expiró." }, { status: 404 });
    return NextResponse.json({ project }, { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } });
  } catch {
    return NextResponse.json({ error: "No pudimos abrir el borrador." }, { status: 503 });
  }
}
