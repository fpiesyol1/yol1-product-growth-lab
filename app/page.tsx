"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { localFeedbackIntake, type FeedbackKind } from "../lib/feedback-intake";
import { localChatFeedbackIntake, type ChatFeedbackRating } from "../lib/chat-feedback";
import { submitChatResponse, submitGeneralFeedback } from "../lib/shared-feedback-client";

type Tab = "inicio" | "finanzas" | "cartola" | "cobrar" | "ahorrar" | "ganar" | "futuro";
type Theme = "dark" | "light";
type MovementAction = "Ya lo vi" | "Revisar" | "Dividir" | "Cobrar";
type PendingView = "personas" | "grupos";
type SplitMode = "equal" | "custom";
type ChatMessage = { id: string; role: "user" | "assistant"; text: string; mode?: "ai" | "demo" | "knowledge"; feedback?: ChatFeedbackRating; knowledgeVersion?: string };
type MessagePreview = { name: string; alias?: string; amount: string; expense: string; direction: "collect" | "pay" };
type CollectDraft = {
  step: number;
  expense: string;
  amount: number;
  split: SplitMode;
  contacts: string[];
  participants: string[];
  custom: Record<string, number>;
  newContact: string;
};

const tabLabels: Record<Tab, string> = {
  inicio: "Inicio",
  finanzas: "Mis finanzas",
  cartola: "Cartola",
  cobrar: "Cobrar y pagar",
  ahorrar: "Ahorrar",
  ganar: "Ganar",
  futuro: "Experimentos",
};

const movements = [
  { id: "disney-bci", date: "05 AGO", time: "10:43", name: "Disney+", code: "TX-81672", bank: "BCI", amount: -11990, hint: "Mismo monto y comercio en dos fuentes", tone: "warning", ownTransfer: false },
  { id: "disney-mach", date: "05 AGO", time: "10:42", name: "Disney+", code: "TX-81665", bank: "MACH", amount: -11990, hint: "Posible duplicado; falta confirmar", tone: "warning", ownTransfer: false },
  { id: "adam", date: "04 AGO", time: "13:16", name: "Dr. Adam", code: "TX-80811", bank: "BCI", amount: -70000, hint: "Podría ser un gasto compartido", tone: "info", ownTransfer: false },
  { id: "own", date: "02 AGO", time: "09:31", name: "Transferencia propia", code: "TX-79845", bank: "BCI", amount: 17500, hint: "Clasificación simulada y revisable", tone: "muted", ownTransfer: true },
  { id: "liguria", date: "01 AGO", time: "21:06", name: "Rest. Liguria", code: "TX-79122", bank: "BCI", amount: -41600, hint: "Beneficio público encontrado", tone: "good", ownTransfer: false },
];

const initialDraft: CollectDraft = {
  step: 0,
  expense: "Cena de equipo",
  amount: 48000,
  split: "equal",
  contacts: ["Tú", "Josefa", "Martín", "Camila"],
  participants: ["Tú", "Josefa", "Martín"],
  custom: { Tú: 16000, Josefa: 16000, Martín: 16000, Camila: 0 },
  newContact: "",
};

const money = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "brand brand-compact" : "brand"}><img src={compact ? "/yol1-icon.png" : "/yol1-wordmark-dark.png"} alt="YOL1" /></div>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("inicio");
  const [theme, setTheme] = useState<Theme>("dark");
  const [source, setSource] = useState("General");
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [archivedCards, setArchivedCards] = useState<string[]>([]);
  const [reviewedMovements, setReviewedMovements] = useState<string[]>([]);
  const [movementNotes, setMovementNotes] = useState<Record<string, string>>({});
  const [savedMovementNotes, setSavedMovementNotes] = useState<string[]>([]);
  const [experimentVotes, setExperimentVotes] = useState<Record<string, boolean>>({});
  const [collectDraft, setCollectDraft] = useState<CollectDraft>(initialDraft);
  const [pendingView, setPendingView] = useState<PendingView>("personas");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [messagePreview, setMessagePreview] = useState<MessagePreview | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("yol1-lab-theme");
    const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    setTheme(stored === "light" || stored === "dark" ? stored : systemTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const chooseTheme = (next: Theme) => {
    setTheme(next);
    window.localStorage.setItem("yol1-lab-theme", next);
  };

  const notify = (message: string) => setNotice(message);
  const go = (next: Tab, message?: string) => {
    setTab(next);
    if (message) notify(message);
  };

  const openLedger = (filter = "General", selected?: string) => {
    setSource(filter);
    setSelectedMovement(selected ?? null);
    go("cartola");
  };

  const openCollect = (expense?: string) => {
    if (expense) setCollectDraft((draft) => ({ ...draft, step: 1, expense }));
    go("cobrar");
  };

  const archiveCard = (id: string, label: string) => {
    setArchivedCards((cards) => cards.includes(id) ? cards : [...cards, id]);
    notify(`${label}: quedó como “Ya lo vi” durante esta sesión demo.`);
  };

  const handleMovementAction = (action: MovementAction, movement: typeof movements[number]) => {
    if (action === "Dividir" || action === "Cobrar") {
      openCollect(movement.name);
      notify(`${movement.name}: reparto preparado con datos ficticios.`);
      return;
    }
    if (action === "Ya lo vi") {
      setReviewedMovements((items) => items.includes(movement.id) ? items : [...items, movement.id]);
      notify(`${movement.name}: quedó marcado como revisado en esta sesión.`);
      return;
    }
    notify(`${movement.name}: detalle abierto para revisar.`);
  };

  const activeTitle = tabLabels[tab];

  if (messagePreview) return <MessagePreviewScreen preview={messagePreview} theme={theme} onBack={() => setMessagePreview(null)} />;

  return (
    <main className="lab-shell" data-theme={theme}>
      <section className="lab-intro">
        <div className="brand-plate"><Brand /><span>PRODUCT GROWTH LAB · 01</span></div>
        <div className="editorial-copy">
          <p className="eyebrow">FINANZAS QUE AYUDAN A VIVIR</p>
          <h1>Tu plata,<br /><span>más clara.</span></h1>
          <p className="lede">Entiende tus finanzas y simplifica tu vida financiera.</p>
          <div className="editorial-rule"><span>YOL1 explica</span><span>Tú decides</span><span>Nada se ejecuta</span></div>
        </div>
        <div className="module-map" aria-label="Módulos del MVP">
          {(Object.keys(tabLabels) as Tab[]).map((item) => <button key={item} className={tab === item ? "module-active" : ""} onClick={() => go(item)}>{tabLabels[item]}</button>)}
        </div>
        <div className="lab-status"><span className="status-dot" /><span>Ejemplo con datos ficticios · sin bancos, pagos ni envíos reales.</span></div>
        <FeedbackPanel screen={activeTitle} open={true} onToggle={() => undefined} variant="desktop" />
      </section>

      <section className="phone-wrap" aria-label={`YOL1 — ${activeTitle}`}>
        <span className="phone-halo" aria-hidden="true" />
        <div className="phone">
          <div className="phone-notch" />
          <header className="app-top">
            <Brand compact />
            <span className="app-section">{activeTitle}</span>
            <div className="header-actions"><span className="demo-pill">DATOS FICTICIOS</span><button className="feedback-mobile-trigger" onClick={() => setFeedbackOpen(true)} aria-label={`Dejar feedback sobre ${activeTitle}`}><span aria-hidden="true">✎</span> Feedback</button><button className="theme-toggle" onClick={() => chooseTheme(theme === "dark" ? "light" : "dark")} aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`} title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}><span aria-hidden="true">{theme === "dark" ? "☀" : "◐"}</span> {theme === "dark" ? "Claro" : "Oscuro"}</button></div>
          </header>
          <div className={`app-content app-${tab} ${tab === "cobrar" && collectDraft.step === 0 ? "collect-home-mode" : ""}`}>
            {tab === "inicio" && <Start archived={archivedCards} onArchive={archiveCard} onRestore={(id) => setArchivedCards((cards) => cards.filter((card) => card !== id))} onMove={go} onCollect={openCollect} onLedger={openLedger} onNotice={notify} />}
            {tab === "finanzas" && <Finances onLedger={openLedger} onMove={go} onNotice={notify} />}
            {tab === "cartola" && <Ledger source={source} setSource={setSource} selected={selectedMovement} setSelected={setSelectedMovement} reviewed={reviewedMovements} onUnreview={(id) => setReviewedMovements((items) => items.filter((item) => item !== id))} notes={movementNotes} setNotes={setMovementNotes} savedNotes={savedMovementNotes} setSavedNotes={setSavedMovementNotes} onAction={handleMovementAction} onNotice={notify} />}
            {tab === "cobrar" && <Collect draft={collectDraft} setDraft={setCollectDraft} view={pendingView} setView={setPendingView} onNotice={notify} onPreview={setMessagePreview} />}
            {tab === "ahorrar" && <Save onNotice={notify} onLedger={openLedger} onCollect={openCollect} />}
            {tab === "ganar" && <ComingSoon onBack={() => go("inicio")} />}
            {tab === "futuro" && <Future votes={experimentVotes} setVotes={setExperimentVotes} onNotice={notify} />}
          </div>
          {notice && <div className="phone-toast" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Cerrar confirmación">×</button></div>}
          <FeedbackPanel screen={activeTitle} open={feedbackOpen} onToggle={() => setFeedbackOpen(false)} variant="mobile" />
          <nav className="bottom-nav" aria-label="Navegación principal">
            <NavButton icon="⌂" label="Inicio" current={tab === "inicio"} onClick={() => go("inicio")} />
            <NavButton icon="💵" label="Finanzas" current={tab === "finanzas" || tab === "cartola"} onClick={() => go("finanzas")} />
            <NavButton icon="👥" label="Cobrar/pagar" current={tab === "cobrar"} onClick={() => go("cobrar")} />
            <NavButton icon="🪙" label="Ahorrar" current={tab === "ahorrar"} onClick={() => go("ahorrar")} />
            <NavButton icon="🧪" label="Experimentos" current={tab === "ganar" || tab === "futuro"} onClick={() => go("futuro")} />
          </nav>
        </div>
      </section>
    </main>
  );
}

function MessagePreviewScreen({ preview, theme, onBack }: { preview: MessagePreview; theme: Theme; onBack: () => void }) {
  const initialMessage = preview.direction === "collect"
    ? `Hola ${preview.name}, me debes ${preview.amount} por ${preview.expense}. Sigue este link si quieres pagar con tu banco o descarga YOL1.`
    : `Hola ${preview.name}, tengo pendiente pagarte ${preview.amount} por ${preview.expense}. Estoy revisando el detalle en YOL1.`;
  const [message, setMessage] = useState(initialMessage);
  const [copyNotice, setCopyNotice] = useState("");
  return <main className="message-preview-shell" data-theme={theme} aria-label="Vista previa de mensaje ficticio">
    <section className="message-preview-stage">
      <p className="message-context-note"><strong>Vista previa del mensaje</strong><span>Sigues dentro de YOL1. Nada se envió.</span></p>
      <header className="message-preview-top"><div><small>VISTA PREVIA DE MENSAJE</small><strong>{preview.name} {preview.alias}</strong></div><span>DEMO · NO ENVIADO</span></header>
      <div className="message-date">HOY · EJEMPLO</div>
      <div className="message-bubble">
        <textarea aria-label="Mensaje ficticio ajustable" value={message} onChange={(event) => setMessage(event.target.value)} />
        {preview.direction === "collect" && <code>https://paga.yol1.example/s/demo-2841</code>}
        <time>10:42 ✓</time>
      </div>
      <div className="message-demo-note"><strong>Este enlace es ficticio y no se puede abrir.</strong><span>No inicia pagos, no conecta bancos y no envía nada por WhatsApp.</span></div>
      <div className="message-preview-actions">
        <button className="message-back" onClick={onBack}>← Volver a YOL1</button>
        <button onClick={() => setCopyNotice("Así se vería al compartir. No usamos el portapapeles ni abrimos otra app.")}>Ver cómo se compartiría</button>
      </div>
      {copyNotice && <p className="message-copy-notice" role="status">{copyNotice}</p>}
      <p className="message-production-note">En producción, compartir requeriría tu consentimiento explícito, un link generado en servidor y un partner de pagos autorizado.</p>
    </section>
  </main>;
}

function FeedbackPanel({ screen, open, onToggle, variant }: { screen: string; open: boolean; onToggle: () => void; variant: "desktop" | "mobile" }) {
  const [kind, setKind] = useState<FeedbackKind>("like");
  const [message, setMessage] = useState("");
  const [topics, setTopics] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const requiresMessage = kind !== "like";
  const prompts: Record<FeedbackKind, { label: string; placeholder: string }> = {
    like: { label: "¿Qué te gustó? (opcional)", placeholder: "Ej.: entendí rápido qué revisar" },
    improve: { label: "¿Qué cambiarías?", placeholder: "Cuéntanos qué no funcionó o qué simplificarías" },
    idea: { label: "¿Qué deberíamos considerar?", placeholder: "Describe la idea o situación que falta contemplar" },
  };

  const submitFeedback = async (event: FormEvent) => {
    event.preventDefault();
    if (requiresMessage && !message.trim()) return;
    const input = { screen, kind, message: message.trim(), topics: topics.trim() };
    localFeedbackIntake.submit(input);
    setSubmitting(true);
    try {
      const shared = await submitGeneralFeedback(input);
      setConfirmation(shared ? `Enviado a la bandeja compartida · ${screen}` : `Guardado localmente · ${screen}`);
    } catch {
      setConfirmation(`Guardado en este navegador; la bandeja compartida aún no está disponible.`);
    } finally {
      setSubmitting(false);
    }
    setMessage("");
    setTopics("");
  };

  const panelHeading = <>
      <span className="feedback-mark">✦</span>
      <span><small>AYÚDANOS A MEJORAR</small><strong>Feedback</strong></span>
      {variant === "mobile" && <b>{open ? "−" : "+"}</b>}
    </>;

  return <aside className={`feedback-panel feedback-${variant} ${open ? "feedback-open" : "feedback-closed"}`} aria-label="Feedback del Product Growth Lab">
    {variant === "desktop" ? <div className="feedback-panel-head">{panelHeading}</div> : <button className="feedback-panel-head" onClick={onToggle} aria-expanded={open}>{panelHeading}</button>}
    {!open && <p className="feedback-peek">Estás viendo <strong>{screen}</strong>. Cuéntanos qué funciona y qué cambiarías.</p>}
    {open && <form className="feedback-form" onSubmit={submitFeedback}>
      <div className="feedback-context"><span>PANTALLA</span><strong>{screen}</strong></div>
      <div className="feedback-kinds" aria-label="Tipo de feedback">{([
        ["like", "Me gusta"],
        ["improve", "Mejoraría"],
        ["idea", "Idea"],
      ] as [FeedbackKind, string][]).map(([value, label]) => <button type="button" key={value} className={kind === value ? "selected" : ""} onClick={() => { setKind(value); setConfirmation(""); }}>{label}</button>)}</div>
      <label>{prompts[kind].label}<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={prompts[kind].placeholder} required={requiresMessage} maxLength={700} /></label>
      <label>Temas clave (opcional)<input value={topics} onChange={(event) => setTopics(event.target.value)} placeholder="Ej.: claridad, confianza, navegación" maxLength={180} /></label>
      <p className="feedback-privacy">Se guarda para revisión cuando la bandeja compartida está activa. No incluyas datos financieros ni personales.</p>
      <button className="feedback-submit" type="submit" disabled={submitting || (requiresMessage && !message.trim())}>{submitting ? "Enviando…" : "Enviar feedback"}</button>
      {confirmation && <p className="feedback-confirmation" role="status">✓ {confirmation}</p>}
    </form>}
  </aside>;
}

function NavButton({ icon, label, current, onClick }: { icon: string; label: string; current: boolean; onClick: () => void }) {
  return <button className={current ? "nav-active" : ""} onClick={onClick}><span aria-hidden="true">{icon}</span><small>{label}</small></button>;
}

function Start({ archived, onArchive, onRestore, onMove, onCollect, onLedger, onNotice }: { archived: string[]; onArchive: (id: string, label: string) => void; onRestore: (id: string) => void; onMove: (target: Tab) => void; onCollect: (expense?: string) => void; onLedger: (filter?: string, selected?: string) => void; onNotice: (message: string) => void }) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: "welcome", role: "assistant", text: "Hola. Puedo ayudarte a entender el mes, ordenar pendientes o revisar una oportunidad del ejemplo.", mode: "demo" }]);
  const [chatBusy, setChatBusy] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [aiChoice, setAiChoice] = useState<"pending" | "ai" | "demo">("pending");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const sessionId = useRef("");
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    sessionId.current = window.sessionStorage.getItem("yol1-lab-chat-session") || window.crypto.randomUUID();
    window.sessionStorage.setItem("yol1-lab-chat-session", sessionId.current);
    const storedChoice = window.sessionStorage.getItem("yol1-lab-ai-choice");
    fetch("/api/chat")
      .then((response) => response.json())
      .then((status: { configured?: boolean }) => {
        const configured = status.configured === true;
        setAiConfigured(configured);
        setAiChoice(configured && storedChoice === "ai" ? "ai" : configured && storedChoice === "demo" ? "demo" : configured ? "pending" : "demo");
      })
      .catch(() => setAiChoice("demo"));
  }, []);
  const actionCards = [
    { id: "disney", tag: "CARGO DUDOSO", title: "Disney+ aparece dos veces", detail: "Mismo monto · 1 minuto", amount: "$11.990", tone: "alert", third: "Ver cargos", review: () => onLedger("General", "disney-bci"), act: () => onLedger("General", "disney-bci") },
    { id: "maria", tag: "POR COBRAR", title: "María te debe del almuerzo", detail: "Pendiente desde el viernes", amount: "$18.000", tone: "social", third: "Cobrar", review: () => onMove("cobrar"), act: () => onMove("cobrar") },
    { id: "camila", tag: "POR PAGAR", title: "Le debes a Camila", detail: "Depto agosto · @camila", amount: "$42.000", tone: "social", third: "Pagar", review: () => onMove("cobrar"), act: () => onMove("cobrar") },
    { id: "benefit", tag: "BENEFICIO", title: "Tu tarjeta tiene restaurantes con descuento", detail: "BCI Visa · ejemplo de esta semana", amount: "20%", tone: "benefit", third: "Ver beneficio", review: () => onMove("ahorrar"), act: () => onMove("ahorrar") },
    { id: "liguria", tag: "PARA DIVIDIR", title: "La cuenta de Liguria parece compartida", detail: "Boleta mayor a tu consumo habitual", amount: "$41.600", tone: "split", third: "Dividir", review: () => onLedger("General", "liguria"), act: () => onCollect("Liguria") },
  ];
  const visibleCards = actionCards.filter((card) => !archived.includes(card.id));
  const archivedLabels = actionCards.filter((card) => archived.includes(card.id));

  useEffect(() => {
    setCarouselIndex((current) => Math.min(current, Math.max(visibleCards.length - 1, 0)));
  }, [visibleCards.length]);

  const chooseAiMode = (choice: "ai" | "demo") => {
    setAiChoice(choice);
    window.sessionStorage.setItem("yol1-lab-ai-choice", choice);
  };

  const answer = async (question: string) => {
    if (chatBusy || aiChoice === "pending") return;
    const userMessage: ChatMessage = { id: window.crypto.randomUUID(), role: "user", text: question };
    const history = [...messages, userMessage].slice(-12);
    setMessages(history);
    setChatInput("");
    setChatBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiConsent: aiChoice === "ai",
          messages: history.map(({ role, text }) => ({ role, text })),
        }),
      });
      const payload = await response.json() as { message?: ChatMessage; knowledgeVersion?: string; error?: string; degraded?: boolean };
      if (!response.ok || !payload.message) throw new Error(payload.error || "No response");
      const assistantMessage = { ...payload.message, knowledgeVersion: payload.knowledgeVersion };
      setMessages((current) => [...current, assistantMessage]);
      void submitChatResponse({
        id: assistantMessage.id,
        question,
        answer: assistantMessage.text,
        rating: "unrated",
        knowledgeVersion: assistantMessage.knowledgeVersion ?? "sin-versión",
      }).catch(() => undefined);
      if (payload.degraded) onNotice("La IA no respondió; seguimos en modo demo local.");
    } catch {
      setMessages((current) => [...current, { id: window.crypto.randomUUID(), role: "assistant", mode: "demo", text: "No pude responder ahora. Puedes seguir recorriendo el ejemplo; no se ejecutó ni guardó ninguna acción." }]);
    } finally {
      setChatBusy(false);
    }
  };

  const rateAnswer = (message: ChatMessage, rating: ChatFeedbackRating) => {
    const index = messages.findIndex((candidate) => candidate.id === message.id);
    const question = [...messages.slice(0, index)].reverse().find((candidate) => candidate.role === "user")?.text ?? "Inicio de conversación";
    localChatFeedbackIntake.submit({
      sessionId: sessionId.current,
      question,
      answer: message.text,
      rating,
      knowledgeVersion: message.knowledgeVersion ?? "welcome",
    });
    void submitChatResponse({
      id: message.id,
      question,
      answer: message.text,
      rating,
      knowledgeVersion: message.knowledgeVersion ?? "welcome",
    }).then(() => onNotice(rating === "useful" ? "Respuesta aprobada por la persona y enviada a revisión." : "Corrección enviada a la bandeja compartida.")).catch(() => onNotice("Feedback guardado en este navegador; la bandeja compartida no respondió."));
    setMessages((current) => current.map((candidate) => candidate.id === message.id ? { ...candidate, feedback: rating } : candidate));
  };

  const submitChat = (event: FormEvent) => {
    event.preventDefault();
    if (chatInput.trim()) answer(chatInput.trim());
  };

  return <>
    <section className="home-value"><p className="kicker">TU PLATA, MÁS SIMPLE</p><h2>Entiende tus finanzas.<br /><span>Simplifica tu vida.</span></h2></section>
    <div className="home-section-title"><div><span>{visibleCards.length.toString().padStart(2, "0")}</span><h3>Tienes {visibleCards.length === 1 ? "una cosa" : `${visibleCards.length} cosas`} para revisar</h3></div>{visibleCards.length > 0 && <small>{carouselIndex + 1} de {visibleCards.length}</small>}</div>
    {visibleCards.length ? <><div className="action-carousel" aria-label="Acciones pendientes" ref={carouselRef} onScroll={(event) => {
      const container = event.currentTarget;
      const firstCard = container.firstElementChild as HTMLElement | null;
      const step = (firstCard?.offsetWidth ?? container.clientWidth) + 10;
      setCarouselIndex(Math.min(visibleCards.length - 1, Math.max(0, Math.round(container.scrollLeft / Math.max(step, 1)))));
    }}>
      {visibleCards.map((card) => <article className={`action-card action-${card.tone}`} key={card.id}>
        <div className="action-card-top"><span>{card.tag}</span><b>{card.amount}</b></div><h3>{card.title}</h3><p>{card.detail}</p>
        <div className="action-buttons"><button onClick={() => onArchive(card.id, card.title)}>Ya lo vi</button><button onClick={card.review}>Revisar</button><button onClick={card.act}>{card.third}</button></div>
      </article>)}
    </div><div className="carousel-dots" aria-label={`Pendiente ${carouselIndex + 1} de ${visibleCards.length}`}>{visibleCards.map((card, index) => <button key={card.id} className={index === carouselIndex ? "active" : ""} onClick={() => (carouselRef.current?.children[index] as HTMLElement | undefined)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })} aria-label={`Ver pendiente ${index + 1}: ${card.title}`} />)}</div></> : <div className="all-clear"><strong>Todo revisado por ahora.</strong><span>Puedes seguir preguntándole a YOL1.</span></div>}
    {archivedLabels.length > 0 && <div className="reviewed-strip"><span>✓ {archivedLabels.length} {archivedLabels.length === 1 ? "revisada" : "revisadas"} en esta sesión</span><button onClick={() => onRestore(archivedLabels[archivedLabels.length - 1].id)}>Deshacer última</button></div>}

    <section className="finance-chat">
      <div className="chat-heading"><div><span className="chat-orb">Y</span><div><small>DATOS FICTICIOS</small><h3>Pregúntale a YOL1</h3></div></div><span>{aiChoice === "ai" ? "IA activa" : aiChoice === "pending" ? "Elige modo" : "Demo local"}</span></div>
      {aiConfigured && aiChoice === "pending" && <div className="chat-consent"><strong>¿Cómo quieres conversar?</strong><p>Con IA, tu texto se procesa en OpenAI desde el servidor. La pregunta y respuesta pueden guardarse en la bandeja del Lab para revisión. No incluyas datos personales, claves ni finanzas reales.</p><div><button onClick={() => chooseAiMode("ai")}>Usar IA</button><button onClick={() => chooseAiMode("demo")}>Seguir en demo</button></div></div>}
      {aiConfigured && aiChoice !== "pending" && <button className="chat-mode-link" onClick={() => setAiChoice("pending")}>Cambiar modo · {aiChoice === "ai" ? "IA" : "demo"}</button>}
      <div className="chat-suggestions">{["¿Qué cambió este mes?", "¿A quién le debo?", "¿Quién me debe?", "¿Qué beneficio tengo?", "¿Cuánto podría ahorrar?", "¿Qué pasó con Disney+?"].map((suggestion) => <button key={suggestion} disabled={chatBusy || aiChoice === "pending"} onClick={() => answer(suggestion)}>{suggestion}</button>)}</div>
      <div className="chat-thread" aria-live="polite">{messages.slice(-8).map((message) => <article key={message.id} className={message.role}><p>{message.text}</p>{message.role === "assistant" && message.id !== "welcome" && <div className="chat-rating"><span>{message.mode === "ai" ? "IA" : message.mode === "knowledge" ? "APROBADA" : "DEMO"}</span><button className={message.feedback === "useful" ? "selected" : ""} onClick={() => rateAnswer(message, "useful")}>Útil</button><button className={message.feedback === "improve" ? "selected" : ""} onClick={() => rateAnswer(message, "improve")}>Mejoraría</button></div>}</article>)}{chatBusy && <p className="chat-thinking">YOL1 está pensando…</p>}</div>
      <form className="chat-compose" onSubmit={submitChat}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder={aiChoice === "pending" ? "Elige IA o demo para empezar" : "Pregunta sobre el ejemplo…"} aria-label="Pregunta financiera sobre datos ficticios" maxLength={700} disabled={chatBusy || aiChoice === "pending"} /><button type="submit" aria-label="Enviar pregunta" disabled={chatBusy || aiChoice === "pending"}>↑</button></form>
      <p className="chat-privacy">Ejemplo ficticio · preguntas y respuestas pueden guardarse para revisión · no compartas datos personales o financieros reales.</p>
    </section>
  </>;
}

function Finances({ onLedger, onMove, onNotice }: { onLedger: (filter?: string, selected?: string) => void; onMove: (target: Tab) => void; onNotice: (message: string) => void }) {
  const sources = [
    { id: "BCI", logo: "BCI", name: "Cuenta corriente", detail: "Actualizada hace 8 min" },
    { id: "MACH", logo: "M", name: "Cuenta digital", detail: "Actualizada hace 12 min" },
  ];
  return <>
    <section className="finance-hero compact-finance"><p className="kicker">AGOSTO · EJEMPLO</p><span>Resultado del mes</span><strong>+$830.000</strong><small>Lo que te entró menos lo que gastaste según este ejemplo · no es saldo bancario</small></section>
    <div className="control-heading"><h3>Tus cuentas</h3></div>
    <div className="source-carousel" aria-label="Fuentes ficticias registradas">{sources.map((item) => <button className="source-card" key={item.id} onClick={() => onLedger(item.id)}><span className="source-logo">{item.logo}</span><span><strong>{item.name}</strong><small>{item.detail}</small></span><b>→</b></button>)}</div>
    <div className="accounts-under"><div className="source-actions"><button onClick={() => onNotice("Agregar banco es una simulación: no se conecta ninguna cuenta.")}>＋ Agregar banco</button><button onClick={() => onNotice("Agregar cartola es una simulación: no se carga ningún archivo.")}>↑ Agregar cartola</button></div><button className="ledger-link" onClick={() => onLedger("General")}>∑ Ver cartola general →</button></div>
    <div className="metrics"><Metric label="Te entró" value="$2.450.000" note="Este mes" onClick={() => onLedger("Te entró")} /><Metric label="Gastaste" value="$1.620.000" note="Este mes" onClick={() => onLedger("Gastaste")} /><Metric label="Por cobrar" value="$228.000" note="2 personas" onClick={() => onMove("cobrar")} /><Metric label="Por pagar" value="$42.000" note="1 persona" onClick={() => onMove("cobrar")} /></div>
    <section className="recent-movements"><div className="control-heading"><h3>Últimos movimientos</h3><button onClick={() => onLedger("General")}>Ver todos</button></div>{movements.slice(0, 4).map((movement) => <button className="recent-row" key={movement.id} onClick={() => onLedger("General", movement.id)}><time>{movement.time}</time><span><strong>{movement.name}</strong><small>{movement.bank}</small></span><b className={movement.amount > 0 ? "positive" : ""}>{movement.amount > 0 ? "+" : "−"}{money.format(Math.abs(movement.amount))}</b></button>)}</section>
    <button className="finance-rule" onClick={() => onNotice("Criterio marcado para revisar; nada cambia sin confirmación.")}>Ejemplo · BCI + MACH · agosto · transferencias propias excluidas por regla revisable</button>
  </>;
}

function Metric({ label, value, note, onClick }: { label: string; value: string; note: string; onClick: () => void }) {
  return <button className="metric" onClick={onClick}><small>{label}</small><strong>{value}</strong><span>{note} →</span></button>;
}

function Ledger({ source, setSource, selected, setSelected, reviewed, onUnreview, notes, setNotes, savedNotes, setSavedNotes, onAction, onNotice }: { source: string; setSource: (source: string) => void; selected: string | null; setSelected: (id: string | null) => void; reviewed: string[]; onUnreview: (id: string) => void; notes: Record<string, string>; setNotes: (notes: Record<string, string>) => void; savedNotes: string[]; setSavedNotes: (ids: string[]) => void; onAction: (action: MovementAction, movement: typeof movements[number]) => void; onNotice: (message: string) => void }) {
  const filtered = useMemo(() => movements.filter((movement) => {
    if (source === "General") return true;
    if (source === "Te entró") return movement.amount > 0 && !movement.ownTransfer;
    if (source === "Gastaste") return movement.amount < 0;
    return movement.bank === source;
  }), [source]);
  const ledgerTitle = source === "General" ? "Cartola general" : source === "Te entró" || source === "Gastaste" ? `${source} este mes` : `Cartola ${source}`;
  const reviewMovement = (movement: typeof movements[number]) => { setSelected(movement.id); onAction("Revisar", movement); };
  return <>
    <div className="section-heading"><div><p className="kicker">PRECISIÓN Y EVIDENCIA</p><h2 className="compact-title">{ledgerTitle}</h2></div><span className="count-pill">{filtered.length}</span></div>
    <div className="filter-row" aria-label="Navegar cartolas">{["General", "BCI", "MACH"].map((filter) => <button key={filter} className={source === filter ? "filter-active" : ""} onClick={() => { setSource(filter); setSelected(null); }}>{filter}</button>)}</div>
    <div className="table-head"><span>FECHA</span><span>MOVIMIENTO</span><span>MONTO</span></div>
    <div className="ledger">{filtered.map((movement) => {
      const thirdAction: MovementAction = movement.amount > 0 && !movement.ownTransfer ? "Cobrar" : "Dividir";
      const isReviewed = reviewed.includes(movement.id);
      return <article className={`movement${selected === movement.id ? " selected" : ""}${isReviewed ? " reviewed" : ""}`} key={movement.id}>
        <button className="row-main" onClick={() => setSelected(selected === movement.id ? null : movement.id)} aria-expanded={selected === movement.id}><time>{movement.date}<small>{movement.time}</small></time><span><strong>{movement.name}</strong><small className={movement.tone}>{movement.bank}</small>{isReviewed && <em>✓ Revisado</em>}</span><b className={movement.amount > 0 ? "positive" : ""}>{movement.amount > 0 ? "+" : "−"}{money.format(Math.abs(movement.amount))}</b></button>
        <p className={`movement-hint ${movement.tone}`}>{movement.hint}</p>
        <div className="row-actions"><button onClick={() => { if (isReviewed) { onUnreview(movement.id); onNotice(`${movement.name}: volvió a pendientes de revisión.`); } else onAction("Ya lo vi", movement); }}>{isReviewed ? "Deshacer" : "Ya lo vi"}</button><button onClick={() => reviewMovement(movement)}>Revisar</button><button onClick={() => onAction(thirdAction, movement)}>{thirdAction}</button></div>
        {selected === movement.id && <><div className="movement-detail-meta"><span>Banco <strong>{movement.bank}</strong></span><span>Código <code>{movement.code}</code></span><span>Hora <strong>{movement.time}</strong></span></div><section className="movement-assistant"><div><span>Y</span><div><small>ASISTENTE DEMO</small><strong>{movement.name === "Disney+" ? "Hay una coincidencia que vale revisar" : "Revisa el contexto antes de decidir"}</strong></div></div><p>{movement.name === "Disney+" ? "Vimos el mismo comercio y monto con un minuto de diferencia en dos fuentes. Podrían ser compras válidas. Revisa tu suscripción, forma de pago y condiciones antes de marcar una acción." : "Esta señal usa datos ficticios y no ejecuta cambios. Puedes dejar una nota para recordarte el siguiente paso."}</p><label>Nota propia<input value={notes[movement.id] ?? ""} onChange={(event) => { setNotes({ ...notes, [movement.id]: event.target.value }); setSavedNotes(savedNotes.filter((id) => id !== movement.id)); }} placeholder="Ej.: revisar suscripción" /></label><button onClick={() => { if (!(notes[movement.id] ?? "").trim()) return onNotice("Escribe una nota antes de guardarla."); setSavedNotes(savedNotes.includes(movement.id) ? savedNotes : [...savedNotes, movement.id]); onNotice(`Nota guardada durante esta sesión para ${movement.name}.`); }}>{savedNotes.includes(movement.id) ? "✓ Nota guardada" : "Guardar nota del ejemplo"}</button></section></>}
      </article>;
    })}</div>
    <div className="ledger-rule"><strong>Regla revisable</strong><span>Esta transferencia está clasificada en la simulación como propia. Puedes abrirla para ver el código y corregir el criterio.</span><button onClick={() => setSelected("own")}>Revisar</button></div>
  </>;
}

function Collect({ draft, setDraft, view, setView, onNotice, onPreview }: { draft: CollectDraft; setDraft: (draft: CollectDraft | ((draft: CollectDraft) => CollectDraft)) => void; view: PendingView; setView: (view: PendingView) => void; onNotice: (message: string) => void; onPreview: (preview: MessagePreview) => void }) {
  const [selectedPending, setSelectedPending] = useState<string | null>(null);
  const [settled, setSettled] = useState<string[]>([]);
  const [payableDraftAdded, setPayableDraftAdded] = useState(false);
  const [splitAutoFilled, setSplitAutoFilled] = useState(false);
  const update = (patch: Partial<CollectDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const peopleRows = [
    { id: "josefa", name: "Josefa", alias: "@josefa", direction: "collect" as const, amount: "$210.000", meta: "Viaje a Pucón" },
    { id: "maria", name: "María", alias: "@maria", direction: "collect" as const, amount: "$18.000", meta: "Almuerzo viernes" },
    { id: "camila", name: "Camila", alias: "@camila", direction: "pay" as const, amount: "$42.000", meta: "Depto agosto" },
  ];
  const groupRows = [
    { id: "pucon", name: "Viaje a Pucón", alias: undefined, direction: "collect" as const, amount: "$210.000", meta: "Josefa · Martín · tú" },
    { id: "almuerzo", name: "Almuerzo viernes", alias: undefined, direction: "collect" as const, amount: "$18.000", meta: "María" },
    { id: "depto", name: "Depto agosto", alias: undefined, direction: "pay" as const, amount: "$42.000", meta: "Camila" },
  ];
  const rows = (view === "personas" ? peopleRows : groupRows).filter((row) => !settled.includes(row.id));
  const receivableRows = rows.filter((row) => row.direction === "collect");
  const payableRows = rows.filter((row) => row.direction === "pay");
  const participants = draft.participants;
  const equalAmount = Math.round(draft.amount / Math.max(participants.length, 1));
  const assigned = participants.reduce((sum, person) => sum + (draft.custom[person] ?? 0), 0);
  const distributeRemaining = () => {
    const remaining = draft.amount - assigned;
    if (remaining <= 0 || participants.length === 0) return;
    const each = Math.floor(remaining / participants.length);
    const extra = remaining - each * participants.length;
    const next = { ...draft.custom };
    participants.forEach((person, index) => { next[person] = (next[person] ?? 0) + each + (index < extra ? 1 : 0); });
    update({ custom: next });
    setSplitAutoFilled(true);
    onNotice("La diferencia se repartió por igual entre las personas seleccionadas.");
  };

  if (draft.step === 0) return <div className="collect-home">
    <section className="collect-hero"><p className="kicker">COBRAR Y PAGAR · EJEMPLO</p><h2 className="compact-title">Lo pendiente,<br />por ambos lados.</h2><div className="pending-totals"><span><small>ME DEBEN</small><strong>$228.000</strong></span><span><small>LE DEBO</small><strong>$42.000</strong></span></div></section>
    <div className="pending-view"><button className={view === "personas" ? "selected-option" : ""} onClick={() => setView("personas")}>Por persona</button><button className={view === "grupos" ? "selected-option" : ""} onClick={() => setView("grupos")}>Por grupo / gasto</button></div>
    <div className="pending-board">
      <section className="pending-lane"><div className="lane-heading"><div><small>POR COBRAR</small><strong>$228.000</strong></div><button onClick={() => setDraft({ ...initialDraft, step: 1 })}>＋ Nuevo gasto compartido</button></div><div className="pending-lane-track">{receivableRows.map((row) => <article className={selectedPending === row.id ? "pending-item pending-item-open" : "pending-item"} key={row.id}><button className="pending-main" onClick={() => setSelectedPending(selectedPending === row.id ? null : row.id)}><span className="pending-avatar">{row.name[0]}</span><span><strong>{row.name}</strong><small>{row.alias ? `${row.alias} · ` : ""}{row.meta}</small></span><b>{row.amount}</b></button>{selectedPending === row.id && <div className="pending-actions"><button onClick={() => onNotice(`Recordatorio preparado para ${row.name}. No se envió nada.`)}>Recordar</button><button onClick={() => onPreview({ name: row.name, alias: row.alias, amount: row.amount, expense: row.meta, direction: "collect" })}>Enviar cobro</button><button onClick={() => { setSettled([...settled, row.id]); setSelectedPending(null); onNotice(`${row.name}: marcado “ya me pagaron”. YOL1 buscará una coincidencia solo en las cartolas ficticias.`); }}>Ya me pagaron</button></div>}</article>)}</div></section>
      <section className="pending-lane"><div className="lane-heading"><div><small>POR PAGAR</small><strong>$42.000</strong></div><button onClick={() => { setPayableDraftAdded(true); onNotice("Borrador de deuda pendiente guardado en esta sesión. No se cargó ni transfirió dinero."); }}>＋ Agregar deuda pendiente</button></div><div className="pending-lane-track">{payableDraftAdded && <div className="lane-state"><span>✓ Borrador guardado</span><button onClick={() => setPayableDraftAdded(false)}>Deshacer</button></div>}{payableRows.map((row) => <article className={selectedPending === row.id ? "pending-item pending-item-open" : "pending-item"} key={row.id}><button className="pending-main" onClick={() => setSelectedPending(selectedPending === row.id ? null : row.id)}><span className="pending-avatar">{row.name[0]}</span><span><strong>{row.name}</strong><small>{row.alias ? `${row.alias} · ` : ""}{row.meta}</small></span><b>{row.amount}</b></button>{selectedPending === row.id && <div className="pending-actions"><button onClick={() => onNotice(`Recordatorio personal creado para pagar a ${row.name}.`)}>Recordarme</button><button onClick={() => onPreview({ name: row.name, alias: row.alias, amount: row.amount, expense: row.meta, direction: "pay" })}>Simular pago</button><button onClick={() => { setSettled([...settled, row.id]); setSelectedPending(null); onNotice(`${row.name}: pago marcado en el ejemplo; YOL1 revisará si aparece una coincidencia ficticia.`); }}>Ya pagué</button></div>}</article>)}</div></section>
    </div>
    <div className="reconcile-note"><span>↻</span><p><strong>Revisar si este pago ya quedó resuelto</strong>Cuando marcas un pago, YOL1 busca una coincidencia en las cartolas ficticias antes de cerrarlo.</p></div>
  </div>;

  const goBack = () => update({ step: Math.max(0, draft.step - 1) });
  return <>
    <button className="back-link" onClick={goBack}>← {draft.step === 1 ? "Volver a pendientes" : "Atrás"}</button>
    <div className="progress" aria-label={`Paso ${Math.min(draft.step, 4)} de 4`}><span style={{ width: `${Math.min(draft.step, 4) * 25}%` }} /></div>
    {draft.step === 1 && <section className="flow-step"><p className="kicker">PASO 1 DE 4</p><h2 className="compact-title">Nuevo gasto</h2><label>¿Qué pagaste?<input value={draft.expense} onChange={(event) => update({ expense: event.target.value })} /></label><label>Monto total<input type="number" min="0" value={draft.amount} onChange={(event) => update({ amount: Number(event.target.value) })} /></label><button className="primary-action" onClick={() => update({ step: 2 })}>Elegir personas →</button></section>}
    {draft.step === 2 && <section className="flow-step"><p className="kicker">PASO 2 DE 4</p><h2 className="compact-title">¿Quiénes participaron?</h2><div className="participants">{draft.contacts.map((person) => <label key={person}><input type="checkbox" checked={participants.includes(person)} onChange={() => update({ participants: participants.includes(person) ? participants.filter((item) => item !== person) : [...participants, person] })} /><span className="avatar">{person[0]}</span><strong>{person}</strong><small>{person === "Tú" ? "Pagaste tú" : "Contacto demo"}</small></label>)}</div><div className="new-contact"><input value={draft.newContact} onChange={(event) => update({ newContact: event.target.value })} placeholder="Crear contacto demo" /><button onClick={() => { const name = draft.newContact.trim(); if (!name) return; update({ contacts: [...draft.contacts, name], participants: [...participants, name], custom: { ...draft.custom, [name]: 0 }, newContact: "" }); onNotice(`${name}: contacto ficticio agregado.`); }}>＋</button></div><button className="primary-action" disabled={participants.length < 2} onClick={() => update({ step: 3 })}>Definir división →</button></section>}
    {draft.step === 3 && <section className="flow-step"><p className="kicker">PASO 3 DE 4</p><h2 className="compact-title">Divide {money.format(draft.amount)}</h2><div className="segmented"><button className={draft.split === "equal" ? "selected-option" : ""} onClick={() => update({ split: "equal" })}>Partes iguales</button><button className={draft.split === "custom" ? "selected-option" : ""} onClick={() => update({ split: "custom" })}>Montos distintos</button></div>{draft.split === "custom" && <p className="split-help">Los montos deben sumar el total porque este ejemplo reparte el gasto completo.</p>}<div className="split-list">{participants.map((person) => <label key={person}><span>{person}</span>{draft.split === "equal" ? <strong>{money.format(equalAmount)}</strong> : <input type="number" min="0" value={draft.custom[person] ?? 0} onChange={(event) => { setSplitAutoFilled(false); update({ custom: { ...draft.custom, [person]: Number(event.target.value) } }); }} />}</label>)}</div>{draft.split === "custom" && <><p className={assigned === draft.amount ? "sum-ok" : "sum-warn"}>Asignado: {money.format(assigned)} de {money.format(draft.amount)} {assigned === draft.amount ? "✓" : assigned < draft.amount ? `· faltan ${money.format(draft.amount - assigned)}` : `· sobra ${money.format(assigned - draft.amount)}`}</p>{assigned < draft.amount && <button className="secondary-action" onClick={distributeRemaining}>Repartir lo que falta</button>}{splitAutoFilled && assigned === draft.amount && <p className="split-confirmation">✓ Diferencia repartida por igual</p>}</>}<button className="primary-action" disabled={draft.split === "custom" && assigned !== draft.amount} onClick={() => update({ step: 4 })}>Revisar reparto →</button></section>}
    {draft.step === 4 && <section className="flow-step"><p className="kicker">PASO 4 DE 4</p><h2 className="compact-title">Confirma el reparto</h2><div className="summary-card"><span>{draft.expense}</span><strong>{money.format(draft.amount)}</strong><small>{draft.split === "equal" ? "Partes iguales" : "Montos personalizados"}</small></div><div className="split-list compact">{participants.filter((person) => person !== "Tú").map((person) => <div key={person}><span>{person}</span><strong>{money.format(draft.split === "equal" ? equalAmount : draft.custom[person] ?? 0)}</strong></div>)}</div><div className="consent-box"><strong>Confirmación de demo</strong><span>Guardar ordena el reparto solo durante esta sesión. No cobra, paga ni contacta a nadie.</span></div><button className="primary-action" onClick={() => { const recipient = participants.find((person) => person !== "Tú") ?? "Contacto demo"; const amount = money.format(draft.split === "equal" ? equalAmount : draft.custom[recipient] ?? 0); update({ step: 5 }); onPreview({ name: recipient, amount, expense: draft.expense, direction: "collect" }); }}>Guardar y ver mensaje demo →</button></section>}
    {draft.step === 5 && <section className="success-step"><span className="success-mark">✓</span><p className="kicker">REPARTO GUARDADO</p><h2 className="compact-title">Quedó ordenado.</h2><p>El estado vive solo durante esta sesión demo. No existe link, pago ni mensaje real.</p><button className="primary-action" onClick={() => update({ step: 0 })}>Volver a pendientes</button></section>}
  </>;
}

function Save({ onNotice, onLedger, onCollect }: { onNotice: (message: string) => void; onLedger: (filter?: string, selected?: string) => void; onCollect: (expense?: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [purchasePreview, setPurchasePreview] = useState(false);
  const swipeStart = useRef<number | null>(null);
  const opportunities = [
    { id: "duplicate", tag: "REVISAR", title: "Dos cargos de Disney+", value: "$0–$11.990 estimados", tone: "warn-bg", conclusion: "Vale la pena revisarlo, pero no sabemos si es un duplicado.", signal: "Mismo comercio y monto con un minuto de diferencia.", source: "BCI + MACH · 5 ago", certainty: "Media", estimate: "$0 si ambos son válidos; hasta $11.990 si confirmas un duplicado", reversible: "Solo revisar y marcar; YOL1 no disputa ni recupera fondos", disclosure: "YOL1 no recibe compensación en esta simulación; cualquier relación futura se declarará aquí.", action: "Ver movimientos" },
    { id: "benefit", tag: "BENEFICIO BCI", title: "20% en restaurantes · BCI Visa", value: "$0–$12.000 estimados", tone: "good-bg", conclusion: "Puede convenirte, pero confirma el día, el local y el tope.", signal: "En el ejemplo comiste recientemente en Liguria y tienes una tarjeta BCI Visa con un beneficio ficticio esta semana.", source: "Locales de ejemplo: Liguria, Baco y Ambrosía · jueves · tope ficticio $12.000", certainty: "Alta solo si se cumplen día, local, tarjeta y tope", estimate: "Entre $0 y $12.000 según compra y condiciones", reversible: "Revisar locales y condiciones; no se activa ni compra nada", disclosure: "YOL1 no recibe compensación en esta simulación; cualquier relación futura se declarará aquí.", action: "Revisar beneficio" },
    { id: "alternative", tag: "CUENTAS Y SERVICIOS", title: "Tu plan móvil podría costar menos", value: "$0–$4.000/mes estimados", tone: "info-bg", conclusion: "Podría costar menos, pero compara cobertura y permanencia primero.", signal: "Una alternativa ficticia tiene menor precio de lista y prestaciones comparables.", source: "Comparación demo · sin datos personales", certainty: "Media; precio, cobertura y permanencia deben verificarse", estimate: "Entre $0 y $4.000 mensuales después de validar condiciones", reversible: "Comparar primero; YOL1 no cambia proveedores", disclosure: "YOL1 no recibe compensación en esta simulación; cualquier relación futura se declarará aquí.", action: "Simular compra" },
    { id: "split", tag: "PARA DIVIDIR", title: "Liguria podría haber sido compartido", value: "$41.600 · gasto observado", tone: "info-bg", conclusion: "Solo tú puedes confirmar si pagaste por otras personas.", signal: "El monto supera tu consumo individual habitual en restaurantes dentro del ejemplo.", source: "Cartola BCI ficticia · 1 ago", certainty: "Baja; solo tú sabes si pagaste por otras personas", estimate: "No es ahorro: podría convertirse en un pendiente por cobrar", reversible: "Preparar un reparto y confirmarlo antes de guardar", disclosure: "YOL1 no contactará ni cobrará a nadie.", action: "Sí, dividir" },
  ];
  const dismiss = (id: string, title: string) => { setHidden([...hidden, id]); setOpen(null); onNotice(`${title}: ignorado durante esta sesión. Puedes recuperarlo aquí mismo.`); };
  const act = (id: string, action: string) => {
    if (id === "duplicate") return onLedger("General", "disney-bci");
    if (id === "split") return onCollect("Liguria");
    if (id === "alternative") return setPurchasePreview(true);
    onNotice(`${action}: condiciones ficticias abiertas; no se activó ni compró nada.`);
  };
  return <><section className="save-heading"><p className="kicker">POTENCIAL DE ESTE EJEMPLO</p><strong className="saving-total">$0–$28.000</strong><h2 className="compact-title">Ya entendimos cómo se mueve tu plata.<br /><span>Ahora te guiamos para hacerla rendir mejor.</span></h2><p>Rango estimado, no ahorro real ni garantizado.</p></section>{hidden.length > 0 && <div className="ignored-strip"><span>✓ {hidden.length} {hidden.length === 1 ? "oportunidad ignorada" : "oportunidades ignoradas"}</span><button onClick={() => setHidden((items) => items.slice(0, -1))}>Recuperar última</button></div>}<p className="swipe-hint swipe-hint-top">Usa el botón Ignorar. También puedes deslizar a la izquierda.</p><div className="opportunity-list">{opportunities.filter((item) => !hidden.includes(item.id)).map((item, index) => <article key={item.id} className={`opportunity ${open === item.id ? "opportunity-open" : ""}`} onPointerDown={(event) => { swipeStart.current = event.clientX; }} onPointerUp={(event) => { if (swipeStart.current !== null && event.clientX - swipeStart.current < -70) dismiss(item.id, item.title); swipeStart.current = null; }}><button className="opportunity-toggle" onClick={() => setOpen(open === item.id ? null : item.id)}><span className="opportunity-index">0{index + 1}</span><span><span className={`issue-tag ${item.tone}`}>{item.tag}</span><strong>{item.title}</strong><small>{item.value}</small></span><b>{open === item.id ? "−" : "+"}</b></button><button className="opportunity-dismiss" onClick={() => dismiss(item.id, item.title)} aria-label={`Ignorar ${item.title}`}>Ignorar</button>{open === item.id && <div className="opportunity-detail"><p className="opportunity-conclusion">{item.conclusion}</p><details className="opportunity-evidence"><summary>Ver por qué</summary><dl><div><dt>Evidencia</dt><dd>{item.signal}</dd></div><div><dt>Fuente</dt><dd>{item.source}</dd></div><div><dt>Certeza</dt><dd>{item.certainty}</dd></div><div><dt>Estimación</dt><dd>{item.estimate}</dd></div><div><dt>Acción</dt><dd>{item.reversible}</dd></div><div><dt>Disclosure</dt><dd>{item.disclosure}</dd></div></dl></details><div className="opportunity-actions"><button onClick={() => act(item.id, item.action)}>{item.action} →</button><button onClick={() => dismiss(item.id, item.title)}>Ignorar</button></div></div>}</article>)}</div>{purchasePreview && <section className="purchase-sheet"><div><p className="kicker">COMPRA SIMULADA</p><button onClick={() => setPurchasePreview(false)}>×</button></div><h3>Plan móvil alternativo</h3><strong>$14.990 / mes</strong><ul><li>Precio y prestaciones ficticias</li><li>Falta revisar cobertura y permanencia</li><li>YOL1 no recibe compensación en esta simulación</li></ul><button onClick={() => { setPurchasePreview(false); onNotice("Simulación cerrada: no se abrió un comercio, no se contrató el plan y no se inició un pago real."); }}>Confirmar simulación</button><small>No abre un comercio ni inicia un pago real.</small></section>}</>;
}

function ComingSoon({ onBack }: { onBack: () => void }) {
  return <section className="empty-state"><span className="empty-icon">＋</span><p className="kicker">GANAR</p><h2>Próximamente</h2><p>Este módulo no tiene flujo ni representa una capacidad disponible.</p><button className="primary-action" onClick={onBack}>Volver al inicio</button></section>;
}

function Future({ votes, setVotes, onNotice }: { votes: Record<string, boolean>; setVotes: (votes: Record<string, boolean>) => void; onNotice: (message: string) => void }) {
  const capabilities = [
    { id: "alerts", title: "Alertas que tú controlas", detail: "Elegir qué señales importan y con qué frecuencia recibirlas." },
    { id: "compare", title: "Comparar con referencias agregadas", detail: "Solo existiría con muestra suficiente y población comparable visible." },
  ];
  return <><section className="future-heading"><p className="kicker">EXPERIMENTOS POR EXPLORAR</p><h2 className="compact-title">¿Qué te serviría<br />de verdad?</h2><p>Ideas para aprender antes de construir. No son roadmap ni capacidades disponibles.</p></section>{Object.values(votes).some(Boolean) && <p className="vote-state">✓ Tu interés queda marcado durante esta sesión</p>}<div className="roadmap-list">{capabilities.map((item, index) => <article key={item.id}><span className="experiment-number">0{index + 1}</span><div><span className="experiment-status">POR EXPLORAR</span><h3>{item.title}</h3><p>{item.detail}</p></div><button className={votes[item.id] ? "voted" : ""} onClick={() => { setVotes({ ...votes, [item.id]: !votes[item.id] }); onNotice(votes[item.id] ? "Feedback retirado en esta sesión." : "Feedback guardado durante esta sesión demo."); }}>{votes[item.id] ? "✓ Me interesa" : "Me interesa"}</button></article>)}</div><a className="knowledge-review-link" href="/review/knowledge"><span>INTERNO · CONTENIDO APROBADO</span><strong>Conocimiento del Lab</strong><small>Ver preguntas, variantes y fichas para mejorar →</small></a><section className="scope-box"><strong>Fuera de este MVP</strong><p>No estamos desarrollando banca, remesas, pagos reales ni una capa operativa de propuestas.</p></section></>;
}
