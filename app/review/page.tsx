"use client";

import { FormEvent, useEffect, useState } from "react";
import { listLearningItems, setLearningStatus, type LearningItem, type LearningStatus } from "../../lib/learning-review";
import { getFeedbackServiceStatus, listSharedFeedback, updateSharedFeedback } from "../../lib/shared-feedback-client";
import { DECISION_CONFLICTS, readDecisionResolutions, saveDecisionResolution, type DecisionChoice, type DecisionResolution } from "../../lib/decision-inbox";

const REVIEW_TOKEN_KEY = "yol1-review-token-session-v1";
type InboxMode = "checking" | "local" | "locked" | "shared";

function DecisionInbox() {
  const [resolutions, setResolutions] = useState<Record<string, DecisionResolution>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [contextOpen, setContextOpen] = useState<string | null>(null);
  useEffect(() => {
    setResolutions(readDecisionResolutions());
  }, []);

  const decide = (conflictId: string, choice: DecisionChoice) => {
    if (choice === "context" && contextOpen !== conflictId) {
      setContextOpen(conflictId);
      return;
    }
    const resolution: DecisionResolution = { conflictId, choice, comment: (comments[conflictId] ?? "").trim(), decidedAt: new Date().toISOString() };
    saveDecisionResolution(resolution);
    setResolutions((current) => ({ ...current, [conflictId]: resolution }));
    setContextOpen(null);
  };

  return <section className="decision-inbox" id="decisions" aria-label="Decisiones pendientes">
    <header><div><small>02 · DECISIONES</small><h2>Cuando dos fuentes dicen cosas distintas.</h2></div><p>Elige la que manda o deja el caso abierto. Esta decisión guía el próximo diseño; no cambia ningún producto por sí sola.</p></header>
    <div className="decision-grid">{DECISION_CONFLICTS.map((conflict) => {
      const resolution = resolutions[conflict.id];
      return <article className={resolution ? "resolved" : ""} key={conflict.id}>
        <div className="decision-topic"><small>{conflict.context} · DECISIÓN PENDIENTE</small><h3>{conflict.topic}</h3></div>
        <div className="decision-sources"><div><span>FUENTE A</span><strong>{conflict.sourceA.label}</strong><p>{conflict.sourceA.value}</p><small>{conflict.sourceA.date} · {conflict.sourceA.state}</small></div><div><span>FUENTE B</span><strong>{conflict.sourceB.label}</strong><p>{conflict.sourceB.value}</p><small>{conflict.sourceB.date} · {conflict.sourceB.state}</small></div></div>
        {!resolution ? <><label>Comentario breve (opcional)<input value={comments[conflict.id] ?? ""} onChange={(event) => setComments((current) => ({ ...current, [conflict.id]: event.target.value }))} placeholder="Qué debe quedar registrado" maxLength={220} /></label><div className="decision-actions"><button onClick={() => decide(conflict.id, "a")}>A manda</button><button onClick={() => decide(conflict.id, "b")}>B manda</button><button className={contextOpen === conflict.id ? "selected" : ""} onClick={() => decide(conflict.id, "context")}>{contextOpen === conflict.id ? "Guardar contexto" : "Necesito más contexto"}</button></div></> : <div className="decision-result"><strong>✓ Felipe manda · resolución local visible</strong><span>{resolution.choice === "a" ? "A manda" : resolution.choice === "b" ? "B manda" : "Necesita más contexto"}{resolution.comment ? ` · ${resolution.comment}` : ""}</span><button onClick={() => setResolutions((current) => { const next = { ...current }; delete next[conflict.id]; window.localStorage.setItem("yol1-lab-decisions-v1", JSON.stringify(next)); return next; })}>Revisar decisión</button></div>}
      </article>;
    })}</div>
  </section>;
}

export default function ReviewPage() {
  const [items, setItems] = useState<LearningItem[]>([]);
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

  const feedbackItems = items.filter((item) => item.source === "feedback");
  const aiItems = items.filter((item) => item.source === "chat");

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

  const chooseTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("yol1-lab-theme", next);
  };

  return <main className="review-shell" data-theme={theme}>
    <header className="review-header">
      <a href="/" aria-label="Volver al Product Growth Lab"><img src="/yol1-wordmark-dark.png" alt="YOL1" /></a>
      <div><small>PRODUCT GROWTH LAB · INTERNO</small><h1>Bandeja de aprendizaje</h1><p>Separa feedback y respuestas de IA. Tú decides qué revisar, resolver o ignorar; nada cambia el modelo automáticamente.</p></div>
      <div className="review-header-actions"><a href="/review/knowledge">Conocimiento del Lab</a><button onClick={chooseTheme}>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</button>{mode === "shared" && <button onClick={logout}>Cerrar bandeja</button>}</div>
    </header>

    <details className="review-postgres-guide">
      <summary><span>?</span><strong>Cómo funciona Postgres y cómo conectarlo</strong><small>{mode === "shared" ? "CONECTADO" : "GUÍA DE 4 PASOS"}</small></summary>
      <div><p><strong>Piensa en Postgres como una planilla compartida y segura.</strong> Cada comentario es una fila; las columnas guardan tipo, pantalla, texto, estado y tu corrección. A diferencia de localStorage, todas las visitas escriben en la misma tabla.</p><ol><li>En Vercel abre tu proyecto → <b>Storage</b> → <b>Create Database</b>.</li><li>Elige <b>Neon Postgres</b>, un plan y una región cercana; conecta el recurso al proyecto.</li><li>Vercel agregará `DATABASE_URL`. Agrega además `YOL1_REVIEW_TOKEN` con una clave larga y privada.</li><li>Redeploy: la primera escritura crea la tabla `yol1_feedback_items` automáticamente.</li></ol><p className="review-guide-safety">El navegador nunca recibe `DATABASE_URL`. Los visitantes solo pueden enviar; listar y clasificar exige tu clave privada.</p></div>
    </details>

    {mode === "locked" && <section className="review-login"><span>↳</span><div><small>BANDEJA PRIVADA</small><h2>Entra con tu clave de revisión</h2><p>Esta clave es distinta de GitHub, Vercel y OpenAI. Vive como secreto del servidor.</p><form onSubmit={login}><input type="password" value={loginToken} onChange={(event) => setLoginToken(event.target.value)} placeholder="YOL1_REVIEW_TOKEN" aria-label="Clave privada de revisión" autoComplete="current-password" /><button type="submit">Abrir bandeja</button></form>{error && <p className="review-error" role="alert">{error}</p>}</div></section>}

    {mode !== "locked" && <>
      <div className="review-mode"><span>{mode === "shared" ? "BANDEJA COMPARTIDA" : mode === "checking" ? "CONECTANDO…" : "MODO LOCAL · AÚN NO COMPARTIDO"}</span><strong>{mode === "shared" ? "Cada envío llega al equipo." : "Lo que ves no se comparte entre dispositivos todavía."}</strong></div>
      {error && <p className="review-error" role="alert">{error}</p>}

      <section className="review-section" aria-labelledby="feedback-heading">
        <header><div><small>01 · PERSONAS</small><h2 id="feedback-heading">Feedback que dejó la gente.</h2><p>Producto, pantalla y tipo quedan visibles. Tú decides qué se atiende ahora y qué se guarda para después.</p></div><span>{feedbackItems.length} entradas</span></header>
        <div className="kanban-statuses" aria-label="Estados del feedback"><span>Nuevo</span><span>En revisión</span><span>Guardar para después</span><span>Resuelto</span><span>Ignorado</span></div>
        <div className="review-list" aria-live="polite">
          {feedbackItems.length === 0 && <div className="review-empty"><span>✦</span><h3>Aún no llega feedback.</h3><p>Cuando alguien deje una opinión desde una pantalla, aparecerá acá con su contexto.</p></div>}
          {feedbackItems.map((item) => <article className={`review-item status-${item.status}`} key={item.id}>
            <div className="review-item-meta"><span>FEEDBACK · {item.label}</span><strong>{item.context}</strong><time>{new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</time></div>
            <div className="review-item-copy"><h3>{item.title}</h3><p>{item.body}</p>{item.reviewNote && <blockquote><strong>Destino editorial</strong>{item.reviewNote}</blockquote>}</div>
            <div className="review-decision"><div className="review-status review-status-human" aria-label="Estado del feedback"><button className={item.status === "reviewing" ? "selected reviewing" : ""} disabled={savingId === item.id} onClick={() => changeStatus(item.id, "reviewing")}>En revisión</button><button className={item.status === "later" ? "selected later" : ""} disabled={savingId === item.id} onClick={() => changeStatus(item.id, "later")}>Para después</button><button className={item.status === "resolved" ? "selected resolved" : ""} disabled={savingId === item.id} onClick={() => changeStatus(item.id, "resolved")}>Marcar resuelto</button><button className={item.status === "ignored" ? "selected ignored" : ""} disabled={savingId === item.id} onClick={() => changeStatus(item.id, "ignored")}>Ignorar</button></div></div>
          </article>)}
        </div>
      </section>

      <DecisionInbox />

      <section className="review-section review-ai-section" aria-labelledby="ai-heading">
        <header><div><small>03 · IA</small><h2 id="ai-heading">Hallazgos para interpretar.</h2><p>Las respuestas de IA no se mezclan con opiniones de personas. Puedes convertirlas en conocimiento, mejora o descartarlas.</p></div><span>{aiItems.length} hallazgos</span></header>
        <div className="review-list">
          {aiItems.length === 0 && <div className="review-empty"><span>✦</span><h3>No hay respuestas de IA por ordenar.</h3><p>Las que una persona marque como útiles o a mejorar llegarán a este bloque.</p></div>}
          {aiItems.map((item) => <article className={`review-item status-${item.status}`} key={item.id}>
            <div className="review-item-meta"><span>IA · {item.label}</span><strong>{item.context}</strong><time>{new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</time></div>
            <div className="review-item-copy"><h3>{item.title}</h3><p>{item.body}</p>{item.reviewNote && <blockquote><strong>Corrección registrada</strong>{item.reviewNote}</blockquote>}</div>
            <div className="review-decision"><div className="review-status" aria-label="Decisión sobre respuesta de IA"><button className={item.status === "resolved" ? "selected resolved" : ""} disabled={savingId === item.id} onClick={() => changeStatus(item.id, "resolved", "Útil para conocimiento o guía")}>Útil</button><button className={item.status === "wrong" ? "selected wrong" : ""} disabled={savingId === item.id} onClick={() => setWrongOpen(wrongOpen === item.id ? null : item.id)}>Corregir</button><button className={item.status === "ignored" ? "selected ignored" : ""} disabled={savingId === item.id} onClick={() => changeStatus(item.id, "ignored")}>Ignorar</button></div>{wrongOpen === item.id && <form className="wrong-editor" onSubmit={(event) => { event.preventDefault(); void changeStatus(item.id, "wrong", wrongNotes[item.id] ?? item.reviewNote); }}><label>¿Qué debe cambiar?<textarea value={wrongNotes[item.id] ?? item.reviewNote} onChange={(event) => setWrongNotes({ ...wrongNotes, [item.id]: event.target.value })} placeholder="Ej.: confundió resultado mensual con saldo disponible" maxLength={500} required /></label><button type="submit" disabled={savingId === item.id || !(wrongNotes[item.id] ?? item.reviewNote).trim()}>Guardar corrección</button></form>}</div>
          </article>)}
        </div>
      </section>
    </>}
  </main>;
}
