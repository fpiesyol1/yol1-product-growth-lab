"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { listLearningItems, setLearningStatus, type LearningItem, type LearningStatus } from "../../lib/learning-review";
import { getFeedbackServiceStatus, listSharedFeedback, updateSharedFeedback } from "../../lib/shared-feedback-client";

const REVIEW_TOKEN_KEY = "yol1-review-token-session-v1";
const statusLabels: Record<LearningStatus, string> = { new: "Pendiente", approve: "Aprobar", wrong: "Equivocado", discard: "Descartar" };
type InboxMode = "checking" | "local" | "locked" | "shared";

export default function ReviewPage() {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | LearningStatus>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "feedback" | "chat">("all");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mode, setMode] = useState<InboxMode>("checking");
  const [reviewToken, setReviewToken] = useState("");
  const [loginToken, setLoginToken] = useState("");
  const [error, setError] = useState("");
  const [wrongOpen, setWrongOpen] = useState<string | null>(null);
  const [wrongNotes, setWrongNotes] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("yol1-lab-theme");
    setTheme(stored === "light" ? "light" : "dark");
    const token = window.sessionStorage.getItem(REVIEW_TOKEN_KEY) || "";
    setReviewToken(token);
    getFeedbackServiceStatus().then(async (status) => {
      if (!status.storageConfigured || !status.reviewConfigured) {
        setItems(listLearningItems());
        setMode("local");
        return;
      }
      if (!token) {
        setMode("locked");
        return;
      }
      try {
        const shared = await listSharedFeedback(token);
        setItems(shared);
        setMode("shared");
      } catch {
        window.sessionStorage.removeItem(REVIEW_TOKEN_KEY);
        setMode("locked");
      }
    }).catch(() => {
      setItems(listLearningItems());
      setMode("local");
    });
  }, []);

  const visible = useMemo(() => items.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSource = sourceFilter === "all" || item.source === sourceFilter;
    return matchesStatus && matchesSource;
  }), [items, sourceFilter, statusFilter]);

  const counts = useMemo(() => ({
    new: items.filter((item) => item.status === "new").length,
    approve: items.filter((item) => item.status === "approve").length,
    wrong: items.filter((item) => item.status === "wrong").length,
    discard: items.filter((item) => item.status === "discard").length,
  }), [items]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!loginToken.trim()) return;
    setError("");
    try {
      const shared = await listSharedFeedback(loginToken.trim());
      window.sessionStorage.setItem(REVIEW_TOKEN_KEY, loginToken.trim());
      setReviewToken(loginToken.trim());
      setItems(shared);
      setMode("shared");
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
      else setLearningStatus(id, status);
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

  return <main className="review-shell" data-theme={theme}>
    <header className="review-header">
      <a href="/" aria-label="Volver al Product Growth Lab"><img src="/yol1-wordmark-dark.png" alt="YOL1" /></a>
      <div><small>PRODUCT GROWTH LAB · INTERNO</small><h1>Bandeja de aprendizaje</h1><p>Separa feedback y respuestas de IA. Tú decides qué aprobar, corregir o descartar; nada cambia el modelo automáticamente.</p></div>
      <div className="review-header-actions"><a href="/review/knowledge">Conocimiento del Lab</a><button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</button>{mode === "shared" && <button onClick={logout}>Cerrar bandeja</button>}</div>
    </header>

    <details className="review-postgres-guide">
      <summary><span>?</span><strong>Cómo funciona Postgres y cómo conectarlo</strong><small>{mode === "shared" ? "CONECTADO" : "GUÍA DE 4 PASOS"}</small></summary>
      <div><p><strong>Piensa en Postgres como una planilla compartida y segura.</strong> Cada comentario es una fila; las columnas guardan tipo, pantalla, texto, estado y tu corrección. A diferencia de localStorage, todas las visitas escriben en la misma tabla.</p><ol><li>En Vercel abre tu proyecto → <b>Storage</b> → <b>Create Database</b>.</li><li>Elige <b>Neon Postgres</b>, un plan y una región cercana; conecta el recurso al proyecto.</li><li>Vercel agregará `DATABASE_URL`. Agrega además `YOL1_REVIEW_TOKEN` con una clave larga y privada.</li><li>Redeploy: la primera escritura crea la tabla `yol1_feedback_items` automáticamente.</li></ol><p className="review-guide-safety">El navegador nunca recibe `DATABASE_URL`. Los visitantes solo pueden enviar; listar y clasificar exige tu clave privada.</p></div>
    </details>

    {mode === "locked" && <section className="review-login"><span>↳</span><div><small>BANDEJA PRIVADA</small><h2>Entra con tu clave de revisión</h2><p>Esta clave es distinta de GitHub, Vercel y OpenAI. Vive como secreto del servidor.</p><form onSubmit={login}><input type="password" value={loginToken} onChange={(event) => setLoginToken(event.target.value)} placeholder="YOL1_REVIEW_TOKEN" aria-label="Clave privada de revisión" autoComplete="current-password" /><button type="submit">Abrir bandeja</button></form>{error && <p className="review-error" role="alert">{error}</p>}</div></section>}

    {mode !== "locked" && <>
      <section className="review-summary" aria-label="Resumen de revisión">
        <button className={statusFilter === "all" ? "active" : ""} onClick={() => setStatusFilter("all")}><small>TOTAL</small><strong>{items.length}</strong></button>
        <button className={statusFilter === "new" ? "active" : ""} onClick={() => setStatusFilter("new")}><small>PENDIENTES</small><strong>{counts.new}</strong></button>
        <button className={statusFilter === "approve" ? "active" : ""} onClick={() => setStatusFilter("approve")}><small>APROBADAS</small><strong>{counts.approve}</strong></button>
        <button className={statusFilter === "wrong" ? "active" : ""} onClick={() => setStatusFilter("wrong")}><small>EQUIVOCADAS</small><strong>{counts.wrong}</strong></button>
        <button className={statusFilter === "discard" ? "active" : ""} onClick={() => setStatusFilter("discard")}><small>DESCARTADAS</small><strong>{counts.discard}</strong></button>
      </section>

      <div className="review-toolbar"><div className="review-source-filter" aria-label="Separar por tipo"><button className={sourceFilter === "all" ? "selected" : ""} onClick={() => setSourceFilter("all")}>Todo</button><button className={sourceFilter === "feedback" ? "selected" : ""} onClick={() => setSourceFilter("feedback")}>Feedback</button><button className={sourceFilter === "chat" ? "selected" : ""} onClick={() => setSourceFilter("chat")}>Respuestas IA</button></div><span>{mode === "shared" ? "POSTGRES COMPARTIDO" : mode === "checking" ? "CONECTANDO…" : "MODO LOCAL · CONECTA POSTGRES"}</span></div>

      {error && <p className="review-error" role="alert">{error}</p>}
      <section className="review-list" aria-live="polite">
        {visible.length === 0 && <div className="review-empty"><span>✦</span><h2>No hay elementos en esta vista.</h2><p>Vuelve al Lab, deja feedback o conversa con YOL1 para crear una entrada.</p><a href="/">Abrir Product Growth Lab</a></div>}
        {visible.map((item) => <article className={`review-item status-${item.status}`} key={item.id}>
          <div className="review-item-meta"><span>{item.source === "chat" ? "RESPUESTA IA" : "FEEDBACK"}</span><strong>{item.label}</strong><time>{new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</time></div>
          <div className="review-item-copy"><small>{item.context}</small><h2>{item.title}</h2><p>{item.body}</p>{item.reviewNote && <blockquote><strong>Qué estaba mal</strong>{item.reviewNote}</blockquote>}</div>
          <div className="review-decision">
            <div className="review-status" aria-label="Decisión editorial">
              <button className={item.status === "approve" ? "selected approve" : ""} disabled={savingId === item.id} onClick={() => changeStatus(item.id, "approve")}>Aprobar</button>
              <button className={item.status === "wrong" ? "selected wrong" : ""} disabled={savingId === item.id} onClick={() => setWrongOpen(wrongOpen === item.id ? null : item.id)}>Equivocado</button>
              <button className={item.status === "discard" ? "selected discard" : ""} disabled={savingId === item.id} onClick={() => changeStatus(item.id, "discard")}>Descartar</button>
            </div>
            {wrongOpen === item.id && <form className="wrong-editor" onSubmit={(event) => { event.preventDefault(); void changeStatus(item.id, "wrong", wrongNotes[item.id] ?? item.reviewNote); }}><label>¿Qué está mal?<textarea value={wrongNotes[item.id] ?? item.reviewNote} onChange={(event) => setWrongNotes({ ...wrongNotes, [item.id]: event.target.value })} placeholder="Ej.: confundió resultado mensual con saldo disponible" maxLength={500} required /></label><button type="submit" disabled={savingId === item.id || !(wrongNotes[item.id] ?? item.reviewNote).trim()}>Guardar corrección</button></form>}
          </div>
        </article>)}
      </section>
    </>}
  </main>;
}
