"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { SharedProjectDraft } from "../../../../lib/project-draft-types";
import { getReviewWorkspace, updateSharedProjectDraft } from "../../../../lib/shared-feedback-client";

const REVIEW_TOKEN_KEY = "yol1-review-token-session-v1";

function Items({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return <section className="project-review-items"><small>{title}</small><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

export default function ProjectReviewPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [project, setProject] = useState<SharedProjectDraft | null>(null);
  const [mode, setMode] = useState<"loading" | "locked" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const token = window.sessionStorage.getItem(REVIEW_TOKEN_KEY) || "";
      if (!token) { setMode("locked"); return; }
      getReviewWorkspace(token).then((workspace) => {
      if (!active) return;
      if (!workspace.authorized) { setMode("locked"); return; }
      const found = workspace.projects.find((item) => item.id === id);
      if (!found) { setMode("error"); setError("No encontramos esta propuesta o ya expiró."); return; }
      setProject(found); setNote(found.reviewNote); setMode("ready");
      }).catch(() => {
        if (!active) return;
        setMode("error"); setError("No pudimos abrir esta propuesta ahora.");
      });
    });
    return () => { active = false; };
  }, [id]);

  const save = async (reviewStatus: SharedProjectDraft["reviewStatus"]) => {
    if (!project) return;
    const token = window.sessionStorage.getItem(REVIEW_TOKEN_KEY) || "";
    setSaving(true); setError("");
    try {
      const saved = await updateSharedProjectDraft(token, project.id, reviewStatus, note.trim());
      setProject(saved); setNote(saved.reviewNote);
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "No pudimos guardar tu lectura."); }
    finally { setSaving(false); }
  };

  if (mode === "loading") return <main className="project-review-shell"><p className="project-review-state">Abriendo propuesta…</p></main>;
  if (mode === "locked") return <main className="project-review-shell"><section className="project-review-state"><small>REVIEWS</small><h1>Entra a la bandeja primero.</h1><p>Esta vista conserva el mismo acceso privado de Reviews.</p><a href="/review">Ir a Reviews →</a></section></main>;
  if (mode === "error" || !project) return <main className="project-review-shell"><section className="project-review-state"><small>PROPUESTA NO DISPONIBLE</small><h1>No pudimos abrirla.</h1><p>{error}</p><a href="/review?tab=prototypes">Volver a propuestas →</a></section></main>;

  const sheet = [
    ["Hechos conocidos", project.productSheet.knownFacts],
    ["Aportes de quien la creó", project.productSheet.userContributions],
    ["Datos necesarios", project.productSheet.dataNeeds],
    ["Condiciones clave", project.productSheet.keyConditions],
    ["Encaje tecnológico", project.productSheet.technologyFit],
    ["Continuidad YOL1", project.productSheet.continuityLinks],
    ["Pendientes", project.productSheet.pendingDecisions],
  ] as const;

  return <main className="project-review-shell">
    <header className="project-review-header"><a href="/review?tab=prototypes">← Propuestas</a><span>REVISIÓN DE PROPUESTA · BORRADOR</span></header>
    <section className="project-review-layout">
      <aside className="project-review-brief">
        <small>QUÉ LLEGÓ AL LAB</small><h1>{project.title}</h1><p className="project-review-summary">{project.valueProposition || project.idea}</p>
        <div className="project-review-facts"><article><small>Problema</small><p>{project.problem}</p></article><article><small>Para quién</small><p>{project.audience}</p></article></div>
        <Items title="Supuestos" items={project.assumptions} />
        {sheet.map(([title, items]) => <Items key={title} title={title} items={items} />)}
        <Items title="Preguntas abiertas" items={project.openQuestions} />
        {project.references.length ? <Items title="Referencias recibidas" items={project.references} /> : null}
      </aside>
      <section className="project-review-preview" aria-label="Mockup de la propuesta">
        <header><div><small>MOCKUP VISUAL</small><h2>{project.prototypeUrl ? "Vista enviada por quien la creó" : "Aún no llegó un mockup navegable"}</h2></div>{project.prototypeUrl ? <a href={project.prototypeUrl} target="_blank" rel="noreferrer">Abrir en otra pestaña ↗</a> : null}</header>
        {project.prototypeUrl ? <iframe src={project.prototypeUrl} title={`Mockup de ${project.title}`} sandbox="allow-scripts" referrerPolicy="no-referrer" loading="lazy" /> : <div className="project-review-no-preview"><span>✦</span><strong>El brief sí llegó. La vista visual, no.</strong><p>Para que aparezca aquí, la persona debe enviar una URL pública HTTPS del mockup al guardar la propuesta. Las rutas de su computador o un canvas privado no se pueden abrir desde YOL1.</p></div>}
      </section>
    </section>
    <section className="project-review-comment"><div><small>TU LECTURA</small><h2>Comentarios y decisión</h2><p>Esto se guarda en la propuesta para que puedas retomarla después o convertirla en aprendizaje.</p></div><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Qué funciona, qué falta y qué debería cambiar…" maxLength={500} /><div className="project-review-actions"><button type="button" onClick={() => save("reviewing")} disabled={saving}>Guardar para evaluar</button><button type="button" onClick={() => save("resolved")} disabled={saving}>Marcar evaluada</button><button type="button" onClick={() => save("later")} disabled={saving}>Después</button><button type="button" className="archive" onClick={() => save("ignored")} disabled={saving}>Archivar</button></div>{error && <p className="project-review-error" role="alert">{error}</p>}</section>
  </main>;
}
