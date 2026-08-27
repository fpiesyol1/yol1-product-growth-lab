"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { knowledgeCatalog, YOL1_KNOWLEDGE_VERSION } from "../../../lib/ai/knowledge-catalog";

const IMPROVE_KEY = "yol1-knowledge-improve-v1";

export default function KnowledgeReviewPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [openId, setOpenId] = useState<string | null>(knowledgeCatalog[0]?.id ?? null);
  const [marked, setMarked] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setTheme(window.localStorage.getItem("yol1-lab-theme") === "light" ? "light" : "dark");
      try { setMarked(JSON.parse(window.localStorage.getItem(IMPROVE_KEY) || "[]")); } catch { setMarked([]); }
    });
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => knowledgeCatalog.filter((card) => {
    const haystack = [card.id, card.domain, card.intent, card.canonicalQuestion, ...card.variants].join(" ").toLowerCase();
    return (domain === "all" || card.domain === domain) && haystack.includes(query.trim().toLowerCase());
  }), [domain, query]);

  const toggleMarked = (id: string) => {
    const next = marked.includes(id) ? marked.filter((item) => item !== id) : [...marked, id];
    setMarked(next);
    window.localStorage.setItem(IMPROVE_KEY, JSON.stringify(next));
  };

  const chooseTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("yol1-lab-theme", next);
  };

  return <main className="review-shell knowledge-review-shell" data-theme={theme}>
    <header className="review-header knowledge-review-header">
      <Link href="/" aria-label="Volver al Product Growth Lab"><Image src="/yol1-wordmark-dark.png" alt="YOL1" width={150} height={54} priority /></Link>
      <div><small>PRODUCT GROWTH LAB · INTERNO</small><h1>Conocimiento del Lab</h1><p>Preguntas aprobadas, variantes y límites que usa el ejemplo. Leer o marcar aquí no modifica el chat ni los archivos.</p></div>
      <div className="review-header-actions"><Link href="/review">← Bandeja</Link><button onClick={chooseTheme}>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</button></div>
    </header>

    <section className="knowledge-overview">
      <div><small>VERSIÓN</small><strong>{YOL1_KNOWLEDGE_VERSION}</strong></div>
      <div><small>APROBADAS</small><strong>{knowledgeCatalog.filter((card) => card.status === "approved").length}</strong></div>
      <div><small>VARIANTES</small><strong>{knowledgeCatalog.reduce((total, card) => total + card.variants.length, 0)}</strong></div>
      <div><small>PARA MEJORAR</small><strong>{marked.length}</strong></div>
    </section>

    <section className="knowledge-toolbar" aria-label="Buscar conocimiento">
      <label><span>Buscar pregunta o variante</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej.: Disney, quién me debe, beneficio…" /></label>
      <label><span>Dominio</span><select value={domain} onChange={(event) => setDomain(event.target.value)}><option value="all">Todos</option><option value="finanzas">Finanzas</option><option value="cartola">Cartola</option><option value="cuentas-claras">Cuentas Claras</option><option value="deudas">Deudas</option><option value="ahorrar">Ahorrar</option></select></label>
    </section>

    <p className="knowledge-disclosure">Solo datos ficticios · contenido editorial versionado · sin edición automática</p>
    <section className="knowledge-list" aria-live="polite">
      {visible.length === 0 && <div className="review-empty"><span>⌕</span><h2>No encontré una ficha.</h2><p>Prueba con otra palabra o vuelve a Todos.</p></div>}
      {visible.map((card) => {
        const isOpen = openId === card.id;
        const needsWork = marked.includes(card.id);
        return <article className={`knowledge-card ${needsWork ? "needs-work" : ""}`} key={card.id}>
          <button className="knowledge-card-head" onClick={() => setOpenId(isOpen ? null : card.id)} aria-expanded={isOpen}>
            <span><small>{card.domain.replaceAll("-", " ")} · {card.status}</small><strong>{card.canonicalQuestion}</strong><code>{card.id}</code></span><b>{isOpen ? "−" : "+"}</b>
          </button>
          {isOpen && <div className="knowledge-card-body">
            <div className="knowledge-answer"><p><strong>Qué veo</strong>{card.expectedAnswer.see}</p><p><strong>Qué significa</strong>{card.expectedAnswer.meaning}</p><p><strong>Qué puede hacer ahora</strong>{card.expectedAnswer.next}</p></div>
            <details open><summary>{card.variants.length} variantes y seguimientos</summary><ul>{card.variants.map((variant) => <li key={variant}>{variant}</li>)}</ul></details>
            <div className="knowledge-columns"><div><h3>Evidencia requerida</h3><ul>{card.requiredContext.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>No afirmar</h3><ul>{card.limits.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
            <p className="knowledge-feedback"><strong>Feedback conocido</strong>{card.knownFeedback}</p>
            <div className="knowledge-card-actions"><span>Fuente: {card.source}</span><button className={needsWork ? "marked" : ""} onClick={() => toggleMarked(card.id)}>{needsWork ? "✓ Marcada para mejorar" : "Marcar para mejorar"}</button></div>
          </div>}
        </article>;
      })}
    </section>
  </main>;
}
