"use client";

import { FormEvent, useEffect, useState } from "react";
import { listLearningItems, setLearningStatus, type LearningItem, type LearningStatus } from "../../lib/learning-review";
import { getReviewWorkspace, updateSharedFeedback, updateSharedProjectDraft } from "../../lib/shared-feedback-client";
import { DECISION_CONFLICTS, readDecisionResolutions, saveDecisionResolution, type DecisionChoice, type DecisionResolution } from "../../lib/decision-inbox";
import { localPrototypeIntake, type ExternalPrototype } from "../../lib/prototype-intake";
import type { SharedProjectDraft } from "../../lib/project-draft-types";

const REVIEW_TOKEN_KEY = "yol1-review-token-session-v1";
type InboxMode = "checking" | "local" | "locked" | "shared";

function DecisionInbox() {
  const [resolutions, setResolutions] = useState<Record<string, DecisionResolution>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [contextOpen, setContextOpen] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  useEffect(() => {
    setResolutions(readDecisionResolutions());
    try {
      const stored = JSON.parse(window.localStorage.getItem("yol1-lab-decisions-archived-v1") ?? "[]");
      setArchivedIds(Array.isArray(stored) ? stored.filter((value): value is string => typeof value === "string") : []);
    } catch { setArchivedIds([]); }
  }, []);

  const saveArchive = (ids: string[]) => {
    window.localStorage.setItem("yol1-lab-decisions-archived-v1", JSON.stringify(ids));
    setArchivedIds(ids);
  };

  const decide = (conflictId: string, choice: DecisionChoice) => {
    if (choice === "context" && contextOpen !== conflictId) {
      setContextOpen(conflictId);
      return;
    }
    const resolution: DecisionResolution = { conflictId, choice, comment: (comments[conflictId] ?? "").trim(), decidedAt: new Date().toISOString() };
    saveDecisionResolution(resolution);
    setResolutions((current) => ({ ...current, [conflictId]: resolution }));
    if (!archivedIds.includes(conflictId)) saveArchive([...archivedIds, conflictId]);
    setContextOpen(null);
  };

  const reopen = (conflictId: string) => {
    setResolutions((current) => {
      const next = { ...current };
      delete next[conflictId];
      window.localStorage.setItem("yol1-lab-decisions-v1", JSON.stringify(next));
      return next;
    });
    saveArchive(archivedIds.filter((id) => id !== conflictId));
  };

  const visibleConflicts = showArchive
    ? DECISION_CONFLICTS.filter((conflict) => archivedIds.includes(conflict.id) && resolutions[conflict.id])
    : DECISION_CONFLICTS.filter((conflict) => !resolutions[conflict.id]);

  return <section className="decision-inbox" id="decisions" aria-label="Decisiones pendientes">
    <header><div><small>02 · DECISIONES</small><h2>{showArchive ? "Decisiones archivadas." : "Lo que todavía necesita tu criterio."}</h2></div><div><p>{showArchive ? "Resoluciones tomadas y guardadas fuera de la bandeja activa. Puedes reabrir una si cambia el contexto." : "Elige la fuente que manda o deja el caso abierto. Al tomarla se archiva, sin cambiar ningún producto por sí sola."}</p><button className="decision-archive-toggle" type="button" onClick={() => setShowArchive((current) => !current)}>{showArchive ? "Volver a pendientes" : `Ver archivadas · ${archivedIds.length}`}</button></div></header>
    <div className="decision-grid">{visibleConflicts.length ? visibleConflicts.map((conflict) => {
      const resolution = resolutions[conflict.id];
      return <article className={resolution ? "resolved" : ""} key={conflict.id}>
        <div className="decision-topic"><small>{conflict.context} · DECISIÓN PENDIENTE</small><h3>{conflict.topic}</h3></div>
        <div className="decision-sources"><div><span>FUENTE A</span><strong>{conflict.sourceA.label}</strong><p>{conflict.sourceA.value}</p><small>{conflict.sourceA.date} · {conflict.sourceA.state}</small></div><div><span>FUENTE B</span><strong>{conflict.sourceB.label}</strong><p>{conflict.sourceB.value}</p><small>{conflict.sourceB.date} · {conflict.sourceB.state}</small></div></div>
        {!resolution ? <><label>Comentario breve (opcional)<input value={comments[conflict.id] ?? ""} onChange={(event) => setComments((current) => ({ ...current, [conflict.id]: event.target.value }))} placeholder="Qué debe quedar registrado" maxLength={220} /></label><div className="decision-actions"><button onClick={() => decide(conflict.id, "a")}>A manda</button><button onClick={() => decide(conflict.id, "b")}>B manda</button><button className={contextOpen === conflict.id ? "selected" : ""} onClick={() => decide(conflict.id, "context")}>{contextOpen === conflict.id ? "Guardar contexto" : "Necesito más contexto"}</button></div></> : <div className="decision-result"><strong>✓ Resolución archivada</strong><span>{resolution.choice === "a" ? "A manda" : resolution.choice === "b" ? "B manda" : "Necesita más contexto"}{resolution.comment ? ` · ${resolution.comment}` : ""}</span><button onClick={() => reopen(conflict.id)}>Reabrir decisión</button></div>}
      </article>;
    }) : <p className="decision-empty">{showArchive ? "Todavía no archivaste decisiones." : "No quedan decisiones activas. Las que tomes aparecerán en Archivadas."}</p>}</div>
  </section>;
}

type BoardId = "feedback" | "prototypes" | "training";
type BoardItem = Pick<LearningItem, "id" | "label" | "context" | "title" | "body" | "status" | "reviewNote" | "createdAt"> & { source: "feedback" | "chat" | "prototype"; reviewLink?: string; intentSummary?: string; references?: string[]; pendingQuestions?: string[] };

const BOARD_COPY: Record<BoardId, { eyebrow: string; title: string; body: string; emptyTitle: string; emptyBody: string }> = {
  feedback: { eyebrow: "01 · FEEDBACKS E IDEAS", title: "Lo que las personas ven y proponen.", body: "Cada entrada conserva la pantalla y el tipo de feedback. Decide qué vale la pena investigar antes de cambiar producto o tecnología.", emptyTitle: "Aún no llega feedback.", emptyBody: "Cuando alguien deje una idea, mejora o comentario desde una pantalla, aterriza aquí con su contexto." },
  prototypes: { eyebrow: "02 · PROPUESTAS QUE TOMAN FORMA", title: "Prototipos y referencias que llegan desde afuera.", body: "Guarda un link, una captura o una idea ya materializada. Primero evalúala; sólo después se convierte en conocimiento o trabajo de producto.", emptyTitle: "Todavía no hay propuestas externas.", emptyBody: "Agrega una referencia para revisarla con el mismo rigor que una idea del Lab." },
  training: { eyebrow: "03 · ENTRENAMIENTO IA", title: "Respuestas que pueden mejorar el criterio del equipo.", body: "Una respuesta de IA no aprende sola: la evaluamos, explicamos el contexto y recién entonces queda lista para entrenar modelos locales o guías.", emptyTitle: "No hay hallazgos de IA por ordenar.", emptyBody: "Las respuestas que una persona marque como útiles o a mejorar llegarán a este Kanban." },
};

const BOARD_EXAMPLES: Record<BoardId, BoardItem[]> = {
  feedback: [
    { id: "example:feedback:cartola", source: "feedback", label: "EJEMPLO · IDEA", context: "Acompañante · Cartola", title: "Explicar por qué una clasificación es revisable", body: "Una persona quiere entender qué evidencia hizo que un movimiento apareciera como transferencia propia y cómo corregir el criterio.", status: "new", reviewNote: "", createdAt: "2026-08-18T10:00:00.000Z" },
    { id: "example:feedback:onboarding", source: "feedback", label: "EJEMPLO · MEJORARÍA", context: "Onboarding · Registro", title: "Separar crear acceso de validar identidad", body: "El primer paso debería permitir entrar rápido y explicar con claridad cuándo se pedirán datos adicionales.", status: "reviewing", reviewNote: "Cruzar con Cognito, política OTP y la capacidad que se quiere habilitar.", createdAt: "2026-08-18T09:30:00.000Z" },
    { id: "example:feedback:tarjetas", source: "feedback", label: "EJEMPLO · IDEA", context: "Tarjetas · Pagar", title: "Acceso rápido a datos y beneficios antes de pagar", body: "La tarjeta se abre para pagar o revisar un movimiento; el beneficio relevante debe aparecer en ese momento.", status: "resolved", reviewNote: "Buen insight de intención. Validar con datos de uso y restricciones del emisor antes de diseñar la oferta.", createdAt: "2026-08-18T09:00:00.000Z" },
  ],
  prototypes: [
    { id: "example:prototype:credit", source: "prototype", label: "EJEMPLO · PROTOTIPO", context: "Referencia externa", title: "Flujo de pago de crédito en cinco pantallas", body: "Una propuesta visual para revisar foco, estados de error y el cierre de una cuota.", status: "reviewing", reviewNote: "Evaluar sólo el patrón de confirmación; no asumir que datos o pagos están integrados.", createdAt: "2026-08-18T10:00:00.000Z" },
    { id: "example:prototype:onboarding-recovery", source: "prototype", label: "EJEMPLO · REFERENCIA", context: "Onboarding · Recuperación", title: "Recuperación clara ante un OTP vencido", body: "Referencia para evaluar si la persona entiende el error, conserva su intención y puede cambiar de canal o pedir ayuda.", status: "resolved", reviewNote: "Conservar la recuperación sin reinicio; la política OTP y el SLA de soporte siguen por definir.", createdAt: "2026-08-18T09:00:00.000Z" },
  ],
  training: [
    { id: "example:training:copy", source: "chat", label: "EJEMPLO · RESPUESTA IA", context: "Asistente · Copy", title: "Propuesta de explicación para un gate de identidad", body: "La IA propone explicar el beneficio concreto antes de pedir una verificación, sin prometer una capacidad aún no disponible.", status: "resolved", reviewNote: "Útil como principio editorial. Falta adaptar el texto final al producto y a Compliance.", createdAt: "2026-08-18T10:00:00.000Z" },
  ],
};

function BoardCard({ item, onChange, selectable = false, selected = false, onToggle }: { item: BoardItem; onChange: (status: LearningStatus, note: string) => void; selectable?: boolean; selected?: boolean; onToggle?: () => void }) {
  const [note, setNote] = useState(item.reviewNote);
  const [showNote, setShowNote] = useState(Boolean(item.reviewNote));
  const [showContext, setShowContext] = useState(false);
  const actions: Array<[string, LearningStatus, "primary" | "quiet" | "archive"]> = item.status === "new" ? [["Evaluar", "reviewing", "primary"], ["Después", "later", "quiet"], ["Archivar", "ignored", "archive"]]
    : item.status === "reviewing" ? [["Marcar evaluada", "resolved", "primary"], ["Después", "later", "quiet"], ["Archivar", "ignored", "archive"]]
      : item.status === "resolved" ? [["Preparar aprendizaje", "learning_ready", "primary"], ["Reabrir", "reviewing", "quiet"]]
        : item.status === "learning_ready" ? [["Reabrir", "reviewing", "quiet"], ["Archivar", "ignored", "archive"]]
          : [["Recuperar", "reviewing", "primary"]];
  return <article className={`board-card status-${item.status} ${selected ? "is-selected" : ""}`}>
    <header><span>{item.label}</span><small title={item.context}>{item.context}</small>{selectable && <button className="board-card-select" type="button" onClick={onToggle} aria-pressed={selected}>{selected ? "Seleccionada" : "Unir"}</button>}</header>
    <div className="board-card-copy"><h3>{item.title}</h3><p>{item.body}</p></div>
    <div className="board-card-tools">{item.reviewLink && <a href={item.reviewLink}>Revisar propuesta →</a>}{(item.intentSummary || item.references?.length || item.pendingQuestions?.length) && <button type="button" onClick={() => setShowContext((current) => !current)}>{showContext ? "Cerrar contexto" : "Contexto"}</button>}<button type="button" onClick={() => setShowNote((current) => !current)}>{showNote ? "Cerrar nota" : "Nota"}</button></div>
    {showContext && <div className="board-card-context">{item.intentSummary && <p><strong>Qué quiso construir</strong>{item.intentSummary}</p>}{item.references?.length ? <p><strong>Referencias</strong>{item.references.join(" · ")}</p> : null}{item.pendingQuestions?.length ? <p><strong>Pendientes</strong>{item.pendingQuestions.join(" · ")}</p> : null}</div>}
    {showNote && <label><span>Tu lectura</span><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Qué vale, qué falta validar o dónde aplicarlo." maxLength={500} /></label>}
    <div className="board-card-actions">{actions.map(([label, status, tone]) => <button className={tone} key={label} type="button" onClick={() => onChange(status, note)}>{label}</button>)}</div>
  </article>;
}

function ReviewBoard({ board, items, onChange }: { board: BoardId; items: BoardItem[]; onChange: (item: BoardItem, status: LearningStatus, note: string) => void }) {
  const copy = BOARD_COPY[board];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [knowledgeTitle, setKnowledgeTitle] = useState("");
  const columns: Array<{ status: LearningStatus; title: string; detail: string }> = [
    { status: "new", title: "Bandeja de entrada", detail: "Prioriza, manda al backlog o archiva." },
    { status: "reviewing", title: "Por evaluar", detail: "Contrasta evidencia, producto y factibilidad." },
    { status: "resolved", title: "Evaluados", detail: "La decisión ya tiene una lectura explícita." },
    { status: "learning_ready", title: "Listos para aprender", detail: "Material para MD, guía o entrenamiento local." },
  ];
  const evaluated = items.filter((item) => item.status === "resolved");
  const selectedItems = evaluated.filter((item) => selectedIds.includes(item.id));
  const toggleSelection = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  const exportKnowledge = () => {
    if (!selectedItems.length) return;
    const title = knowledgeTitle.trim() || `Aprendizajes · ${BOARD_COPY[board].title}`;
    const markdown = [`# ${title}`, "", `> Generado desde la bandeja YOL1 · ${new Date().toISOString().slice(0, 10)}`, `> Origen: ${BOARD_COPY[board].eyebrow}`, "", "## Síntesis", "", "Este documento reúne tarjetas evaluadas. Requiere revisión humana antes de tratarlo como conocimiento aprobado o de usarlo para entrenamiento.", "", "## Tarjetas incluidas", "", ...selectedItems.flatMap((item, index) => [`### ${index + 1}. ${item.title}`, "", `- **Origen:** ${item.label}`, `- **Contexto:** ${item.context}`, `- **Feedback recibido:** ${item.body}`, `- **Lectura del equipo:** ${item.reviewNote || "Sin comentario adicional."}`, ""])].join("\n");
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "aprendizajes-yol1"}.md`; link.click(); URL.revokeObjectURL(url);
  };
  return <section className="review-board" aria-label={copy.title}>
    <header><div><small>{copy.eyebrow}</small><h2>{copy.title}</h2><p>{copy.body}</p></div><span>{items.length} entradas</span></header>
    <div className="review-kanban">{columns.map((column) => { const columnItems = items.filter((item) => item.status === column.status); return <section key={column.status} className="review-kanban-column"><header><strong>{column.title}</strong><small>{column.detail}</small><b>{columnItems.length}</b></header>{columnItems.length ? columnItems.map((item) => <BoardCard key={item.id} item={item} selectable={column.status === "resolved"} selected={selectedIds.includes(item.id)} onToggle={() => toggleSelection(item.id)} onChange={(status, note) => onChange(item, status, note)} />) : <p className="review-kanban-empty">Sin entradas todavía.</p>}</section>; })}</div>
    <section className="knowledge-exporter"><div><small>VISTA DE SÍNTESIS · EVALUADOS</small><h3>Une tarjetas y conviértelas en conocimiento.</h3><p>Selecciona las que comparten tema —por ejemplo, onboarding— y descarga un Markdown con cada feedback y tu comentario editorial.</p></div><label><span>Nombre del aprendizaje</span><input value={knowledgeTitle} onChange={(event) => setKnowledgeTitle(event.target.value)} placeholder="Ej.: Aprendizajes de feedback sobre onboarding" maxLength={120} /></label><div><strong>{selectedItems.length} seleccionadas</strong><button type="button" onClick={exportKnowledge} disabled={!selectedItems.length}>Descargar conocimiento .md</button></div></section>
    {(items.some((item) => item.status === "later") || items.some((item) => item.status === "ignored")) && <details className="review-board-archive"><summary>Backlog y archivo <span>{items.filter((item) => item.status === "later" || item.status === "ignored").length}</span></summary><div>{items.filter((item) => item.status === "later" || item.status === "ignored").map((item) => <BoardCard key={item.id} item={item} onChange={(status, note) => onChange(item, status, note)} />)}</div></details>}
  </section>;
}

export default function ReviewPage() {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [exampleChanges, setExampleChanges] = useState<Record<string, Pick<BoardItem, "status" | "reviewNote">>>({});
  const [activeBoard, setActiveBoard] = useState<BoardId>("feedback");
  const [prototypes, setPrototypes] = useState<ExternalPrototype[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SharedProjectDraft[]>([]);
  const [prototypeTitle, setPrototypeTitle] = useState("");
  const [prototypeSummary, setPrototypeSummary] = useState("");
  const [prototypeReference, setPrototypeReference] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mode, setMode] = useState<InboxMode>("checking");
  const [reviewToken, setReviewToken] = useState("");
  const [loginToken, setLoginToken] = useState("");
  const [error, setError] = useState("");
  const [wrongOpen, setWrongOpen] = useState<string | null>(null);
  const [wrongNotes, setWrongNotes] = useState<Record<string, string>>({});
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const board = new URLSearchParams(window.location.search).get("tab");
    if (board === "prototypes" || board === "training") setActiveBoard(board);
    const stored = window.localStorage.getItem("yol1-lab-theme");
    setTheme(stored === "light" ? "light" : "dark");
    setPrototypes(localPrototypeIntake.list());
    const token = window.sessionStorage.getItem(REVIEW_TOKEN_KEY) || "";
    setReviewToken(token);
    getReviewWorkspace(token).then((status) => {
      if (!status.reviewConfigured) {
        setItems(listLearningItems());
        setMode("local");
        return;
      }
      if (!token || !status.authorized) {
        setMode("locked");
        return;
      }
      if (!status.storageConfigured) {
        setItems(listLearningItems());
        setMode("local");
        return;
      }
      setItems(status.items);
      setSharedProjects(status.projects);
      if (!status.feedbackAvailable && !status.projectsAvailable) setError("No pudimos abrir el contenido compartido.");
      else if (!status.feedbackAvailable) setError("Abrimos las propuestas, pero el feedback compartido no está disponible.");
      else if (!status.projectsAvailable) setError("Abrimos el feedback, pero las propuestas compartidas no están disponibles.");
      setMode("shared");
    }).catch(() => {
      setItems(listLearningItems());
      setMode("local");
    });
  }, []);

  const feedbackItems = items.filter((item) => item.source === "feedback");
  const aiItems = items.filter((item) => item.source === "chat");
  const prototypeItems: BoardItem[] = [...sharedProjects.map((item) => ({ id: item.id, source: "prototype" as const, label: "PROPUESTA COMPARTIDA", context: `${item.audience} · ${item.problem}`, title: item.title, body: item.valueProposition || item.idea, status: item.reviewStatus, reviewNote: item.reviewNote, createdAt: item.createdAt, reviewLink: `/review/project/${item.id}`, intentSummary: item.idea, references: item.references, pendingQuestions: item.openQuestions })), ...prototypes.map((item) => ({ id: item.id, source: "prototype" as const, label: "PROTOTIPO EXTERNO", context: item.reference || "Referencia por ordenar", title: item.title, body: item.summary, status: item.status, reviewNote: item.reviewNote, createdAt: item.createdAt }))];
  const applyExampleChanges = (examples: BoardItem[]) => examples.map((item) => ({ ...item, ...exampleChanges[item.id] }));
  const feedbackBoardItems = (feedbackItems.length ? feedbackItems : applyExampleChanges(BOARD_EXAMPLES.feedback)) as BoardItem[];
  const trainingBoardItems = (aiItems.length ? aiItems : applyExampleChanges(BOARD_EXAMPLES.training)) as BoardItem[];
  const visiblePrototypeItems = prototypeItems.length ? prototypeItems : applyExampleChanges(BOARD_EXAMPLES.prototypes);
  const currentBoardItems = activeBoard === "feedback" ? feedbackBoardItems : activeBoard === "prototypes" ? visiblePrototypeItems : trainingBoardItems;

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!loginToken.trim()) return;
    setError("");
    try {
      const status = await getReviewWorkspace(loginToken.trim());
      if (!status.authorized) throw new Error("Clave incorrecta.");
      window.sessionStorage.setItem(REVIEW_TOKEN_KEY, loginToken.trim());
      setReviewToken(loginToken.trim());
      if (status.storageConfigured) {
        setItems(status.items);
        setSharedProjects(status.projects);
        if (!status.feedbackAvailable && !status.projectsAvailable) setError("Clave correcta, pero no pudimos abrir el contenido compartido.");
        else if (!status.feedbackAvailable) setError("Abrimos las propuestas, pero el feedback compartido no está disponible.");
        else if (!status.projectsAvailable) setError("Abrimos el feedback, pero las propuestas compartidas no están disponibles.");
        setMode("shared");
      } else {
        setItems(listLearningItems());
        setMode("local");
      }
      setLoginToken("");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Clave incorrecta.");
    }
  };

  const changeStatus = async (id: string, status: LearningStatus, note = "") => {
    if (status === "wrong" && !note.trim()) {
      setWrongOpen(id);
      return;
    }
    setSavingId(id);
    setError("");
    try {
      if (mode === "shared") await updateSharedFeedback(reviewToken, id, status, note.trim());
      else setLearningStatus(id, status, note.trim());
      setItems((current) => current.map((item) => item.id === id ? { ...item, status, reviewNote: note.trim(), reviewedAt: new Date().toISOString() } : item));
      setWrongOpen(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "No pudimos actualizar el estado.");
    } finally {
      setSavingId(null);
    }
  };

  const logout = () => {
    window.sessionStorage.removeItem(REVIEW_TOKEN_KEY);
    setReviewToken("");
    setItems([]);
    setMode("locked");
  };

  const chooseTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("yol1-lab-theme", next);
  };

  const updateBoardItem = (item: BoardItem, status: LearningStatus, note: string) => {
    if (item.id.startsWith("example:")) {
      setExampleChanges((current) => ({ ...current, [item.id]: { status, reviewNote: note.trim() } }));
      return;
    }
    if (item.source === "prototype") {
      if (item.id.startsWith("prj_") && mode === "shared") {
        void updateSharedProjectDraft(reviewToken, item.id, status as SharedProjectDraft["reviewStatus"], note.trim()).then((project) => setSharedProjects((current) => current.map((value) => value.id === project.id ? project : value))).catch((updateError) => setError(updateError instanceof Error ? updateError.message : "No pudimos actualizar la propuesta."));
        return;
      }
      localPrototypeIntake.setStatus(item.id, status, note.trim());
      setPrototypes(localPrototypeIntake.list());
      return;
    }
    void changeStatus(item.id, status, note);
  };

  const addPrototype = (event: FormEvent) => {
    event.preventDefault();
    if (!prototypeTitle.trim() || !prototypeSummary.trim()) return;
    localPrototypeIntake.submit({ title: prototypeTitle.trim(), summary: prototypeSummary.trim(), reference: prototypeReference.trim() });
    setPrototypes(localPrototypeIntake.list());
    setPrototypeTitle(""); setPrototypeSummary(""); setPrototypeReference("");
  };

  return <main className="review-shell" data-theme={theme}>
    <header className="review-header">
      <a href="/" aria-label="Volver al Product Growth Lab"><img src="/yol1-wordmark-dark.png" alt="YOL1" /></a>
      <div><small>PRODUCT GROWTH LAB · INTERNO</small><h1>Bandeja de aprendizaje</h1></div>
      <div className="review-header-actions"><button onClick={chooseTheme}>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</button>{mode === "shared" && <button onClick={logout}>Cerrar bandeja</button>}</div>
    </header>

    {mode === "locked" && <section className="review-login"><span>↳</span><div><small>ACCESO AL LAB</small><h2>Entra a tu bandeja</h2><p>En desarrollo local puedes usar la clave liviana del Lab. El espacio compartido exige la clave privada configurada en el servidor.</p><form onSubmit={login}><input type="password" value={loginToken} onChange={(event) => setLoginToken(event.target.value)} placeholder="Clave de acceso" aria-label="Clave de acceso a revisión" autoComplete="current-password" /><button type="submit">Entrar</button></form>{error && <p className="review-error" role="alert">{error}</p>}</div></section>}

    {mode !== "locked" && <>
      <div className="review-mode"><span>{mode === "shared" ? "BANDEJA COMPARTIDA" : mode === "checking" ? "CONECTANDO…" : "MODO LOCAL · AÚN NO COMPARTIDO"}</span><strong>{mode === "shared" ? "Cada envío llega al equipo." : "Lo que ves no se comparte entre dispositivos todavía."}</strong></div>
      {error && <p className="review-error" role="alert">{error}</p>}
      <nav className="review-board-tabs" aria-label="Bandejas de aprendizaje">{(["feedback", "prototypes", "training"] as BoardId[]).map((board) => <button key={board} type="button" className={activeBoard === board ? "selected" : ""} onClick={() => setActiveBoard(board)}><small>{BOARD_COPY[board].eyebrow}</small><strong>{board === "feedback" ? "Feedbacks e ideas" : board === "prototypes" ? "Propuestas que toman forma" : "Entrenamiento IA"}</strong></button>)}</nav>
      {activeBoard === "prototypes" && <form className="prototype-intake" onSubmit={addPrototype}><div><small>AGREGAR REFERENCIA</small><strong>Trae una propuesta externa a la bandeja.</strong><p>Puede ser un link, una captura o un prototipo creado con otra herramienta.</p></div><label>Título<input value={prototypeTitle} onChange={(event) => setPrototypeTitle(event.target.value)} placeholder="Ej.: Nueva forma de dividir gastos" required maxLength={120} /></label><label>Qué aporta<textarea value={prototypeSummary} onChange={(event) => setPrototypeSummary(event.target.value)} placeholder="Qué problema resuelve o qué vale la pena evaluar." required maxLength={500} /></label><label>Link o referencia (opcional)<input value={prototypeReference} onChange={(event) => setPrototypeReference(event.target.value)} placeholder="https://… o nombre del archivo" maxLength={240} /></label><button type="submit">Agregar a bandeja</button></form>}
      <ReviewBoard board={activeBoard} items={currentBoardItems} onChange={updateBoardItem} />
      <DecisionInbox />
    </>}
  </main>;
}
