"use client";

import { FormEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { localFeedbackIntake, type FeedbackKind } from "../lib/feedback-intake";
import { localChatFeedbackIntake, type ChatFeedbackRating } from "../lib/chat-feedback";
import { submitChatResponse, submitGeneralFeedback } from "../lib/shared-feedback-client";
import { EMPTY_STATE_LIBRARY, PORTFOLIO_PRODUCTS, eventMetadata, getLivingSpec, maturityLabel, simpleEventName, type LivingSpec, type ProductDefinition, type ProductId } from "../lib/product-portfolio";
import { ONBOARDING_STAGE_META, transitionOnboarding, type OnboardingStage, type OnboardingTransition } from "../lib/onboarding-state-machine";
import { buildOnboardingDemoSnapshot, ONBOARDING_DEMO_STORAGE_KEY, parseOnboardingDemoSnapshot, type OnboardingDemoSnapshot } from "../lib/onboarding-demo-storage";
import { buildAccessLedger } from "../lib/onboarding-access-ledger";
import { validateAccessContact, type AccessMethod } from "../lib/onboarding-validation";
import { normalizeKycState, type NormalizedKycState } from "../lib/onboarding-safety";
import type { SharedProjectDraft } from "../lib/project-draft-types";

type Tab = "inicio" | "finanzas" | "cartola" | "cobrar" | "ahorrar" | "ganar" | "banco";
type Theme = "dark" | "light";
type BuilderGuide = "chatgpt" | "claude" | "codex" | "how" | null;
type MovementAction = "Marcar revisado" | "Revisar" | "Preparar reparto" | "Preparar cobro";
type PendingView = "personas" | "grupos";
type SplitMode = "equal" | "custom";
type ChatMessage = { id: string; role: "user" | "assistant"; text: string; mode?: "ai" | "demo" | "knowledge"; feedback?: ChatFeedbackRating; knowledgeVersion?: string };
type MessagePreview = { name: string; alias?: string; amount: string; expense: string; direction: "collect" | "pay" };
type OnboardingCapability = "financial_data_connect" | "receive_value";
type InspectedAction = { eventId: string | null; label: string; productKey?: string; parameters: [string, string][] };
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
  ganar: "Gana más lucas",
  banco: "Mi banco",
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
const YOL1_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yol1-product-growth-lab.vercel.app";
const YOL1_MCP_URL = process.env.NEXT_PUBLIC_MCP_URL?.trim() || `${YOL1_SITE_URL}/api/mcp`;
const BUILDER_START_MESSAGE = "Activa YOL1 para construir un producto, sigue los pasos del MCP y guíame desde mi idea hasta una primera propuesta visual.";
const CODEX_MCP_CONFIG = `[mcp_servers.yol1]
enabled = true
url = "${YOL1_MCP_URL}"`;
const CODEX_MCP_REPAIR = `codex mcp remove yol1
codex mcp add yol1 --url ${YOL1_MCP_URL}`;

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "brand brand-compact" : "brand"}><img src={compact ? "/yol1-icon.png" : "/yol1-wordmark-dark.png"} alt="YOL1" /></div>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("inicio");
  const [productId, setProductId] = useState<ProductId>("companion");
  const [labGuideOpen, setLabGuideOpen] = useState(true);
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
  const [emptyStateIndex, setEmptyStateIndex] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [onboardingStage, setOnboardingStage] = useState<OnboardingStage>("welcome");
  const [demoSnapshot, setDemoSnapshot] = useState<OnboardingDemoSnapshot | null>(null);
  const [onboardingResetKey, setOnboardingResetKey] = useState(0);
  const [bankCapability, setBankCapability] = useState<"direct" | "receive_value">("direct");
  const [projectSubmitOpen, setProjectSubmitOpen] = useState(false);
  const [builderGuide, setBuilderGuide] = useState<BuilderGuide>(null);
  const [sharedProjectId, setSharedProjectId] = useState<string | null>(null);
  const [sharedProject, setSharedProject] = useState<SharedProjectDraft | null>(null);
  const [sharedProjectState, setSharedProjectState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [inspectedAction, setInspectedAction] = useState<InspectedAction | null>(null);
  const appContentRef = useRef<HTMLDivElement>(null);
  const resetAppContentScroll = useCallback(() => {
    if (appContentRef.current) appContentRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("yol1-lab-theme");
    setTheme(stored === "light" || stored === "dark" ? stored : "dark");
    setDemoSnapshot(parseOnboardingDemoSnapshot(window.localStorage.getItem(ONBOARDING_DEMO_STORAGE_KEY)));
    const requestedProduct = new URLSearchParams(window.location.search).get("product");
    const requestedDraft = new URLSearchParams(window.location.search).get("draft");
    if (PORTFOLIO_PRODUCTS.some((product) => product.id === requestedProduct)) {
      setProductId(requestedProduct as ProductId);
      setLabGuideOpen(false);
    }
    if (requestedDraft && /^prj_[a-f0-9]{32}$/.test(requestedDraft)) {
      setProductId("builder");
      setLabGuideOpen(false);
      setSharedProjectId(requestedDraft);
      setSharedProjectState("loading");
    }
  }, []);

  useEffect(() => {
    if (!sharedProjectId) return;
    let active = true;
    fetch(`/api/projects/${encodeURIComponent(sharedProjectId)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as { project?: SharedProjectDraft };
        if (!response.ok || !payload.project) throw new Error("PROJECT_NOT_AVAILABLE");
        if (active) { setSharedProject(payload.project); setSharedProjectState("ready"); }
      })
      .catch(() => { if (active) setSharedProjectState("error"); });
    return () => { active = false; };
  }, [sharedProjectId]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    resetAppContentScroll();
  }, [bankCapability, onboardingStage, productId, resetAppContentScroll, tab]);

  useEffect(() => {
    const phone = document.querySelector<HTMLElement>(".phone");
    if (!phone) return;
    const instrument = () => {
      phone.querySelectorAll<HTMLElement>("button, a[href], [role='button'], input, select, textarea").forEach((control) => {
        if (control.closest("[data-instrumentation-ignore='true']") || control.dataset.eventId) return;
        const label = control.getAttribute("aria-label") || control.getAttribute("name") || control.id || control.className.split(" ")[0] || control.tagName.toLowerCase();
        control.dataset.eventId = /^(input|select|textarea)$/i.test(control.tagName) ? "phone_field_interacted" : "phone_control_interacted";
        control.dataset.controlKey = label.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toLowerCase().slice(0, 80) || "unnamed_control";
        control.dataset.instrumentation = "fallback";
      });
    };
    instrument();
    const observer = new MutationObserver(instrument);
    observer.observe(phone, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [builderGuide, feedbackOpen, onboardingStage, productId, profileOpen, tab]);

  const chooseTheme = (next: Theme) => {
    setTheme(next);
    window.localStorage.setItem("yol1-lab-theme", next);
  };

  const notify = (message: string) => setNotice(message);
  const clearDemoFromLedger = () => {
    window.localStorage.removeItem(ONBOARDING_DEMO_STORAGE_KEY);
    setDemoSnapshot(null);
    setOnboardingStage("welcome");
    setOnboardingResetKey((current) => current + 1);
    setBankCapability("direct");
    notify("Pre-registro demo borrado de este navegador. No había contacto ni OTP guardados.");
  };
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
    notify(`${label}: lo ocultamos por ahora.`);
  };

  const handleMovementAction = (action: MovementAction, movement: typeof movements[number]) => {
    if (action === "Preparar reparto" || action === "Preparar cobro") {
      openCollect(movement.name);
      notify(`${movement.name}: reparto preparado con datos ficticios.`);
      return;
    }
    if (action === "Marcar revisado") {
      setReviewedMovements((items) => items.includes(movement.id) ? items : [...items, movement.id]);
      notify(`${movement.name}: quedó marcado como revisado en esta sesión.`);
      return;
    }
    notify(`${movement.name}: detalle abierto para revisar.`);
  };

  const activeProduct = PORTFOLIO_PRODUCTS.find((product) => product.id === productId) ?? PORTFOLIO_PRODUCTS[0];
  const activeTitle = productId === "companion" ? tabLabels[tab] : activeProduct.name;
  const editorialEyebrow = activeProduct.maturity === "explore" ? "PRODUCTO PARA EXPLORAR" : activeProduct.maturity === "evidence" ? "ESPACIO EN INVESTIGACIÓN" : "PRODUCTO PAUSADO";
  const editorialHeading = productId === "companion"
    ? <>Tu plata,<br /><span>más clara.</span></>
    : productId === "kyc"
      ? <>Explora primero.<br /><span>Activa después.</span></>
      : productId === "builder"
        ? <>El próximo producto<br /><span>lo construyes tú.</span></>
        : <>{activeProduct.name}<br /><span>en investigación.</span></>;
  const chooseProduct = (next: ProductId) => {
    setLabGuideOpen(false);
    setProductId(next);
    setInspectedAction(null);
    const index = PORTFOLIO_PRODUCTS.findIndex((product) => product.id === next);
    setEmptyStateIndex(next === "builder" ? 1 : Math.max(0, index * 2));
    setFeedbackOpen(false);
    setProfileOpen(false);
  };
  const inspectAction = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return;
    const control = target.closest<HTMLElement>("button, a, [role='button'], input, select, textarea");
    if (!control || !control.closest(".phone") || control.closest("[data-instrumentation-ignore='true']")) return;
    const label = control.getAttribute("aria-label") || control.innerText.replace(/\s+/g, " ").trim() || "Acción sin nombre";
    const parameters = Object.entries(control.dataset)
      .filter(([key, value]) => key !== "eventId" && value)
      .map(([key, value]) => [key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`), value] as [string, string]);
    const next = { eventId: control.dataset.eventId ?? null, label, productKey: control.dataset.productKey, parameters };
    setInspectedAction((current) => current?.eventId === next.eventId && current.label === next.label && current.productKey === next.productKey && JSON.stringify(current.parameters) === JSON.stringify(next.parameters) ? current : next);
  };

  if (messagePreview) return <MessagePreviewScreen preview={messagePreview} theme={theme} onBack={() => setMessagePreview(null)} />;

  if (labGuideOpen) return <LabWelcome theme={theme} onTheme={() => chooseTheme(theme === "dark" ? "light" : "dark")} onChooseProduct={chooseProduct} />;

  return (
    <main className="lab-shell" data-theme={theme} onPointerOverCapture={(event) => inspectAction(event.target)} onFocusCapture={(event) => inspectAction(event.target)}>
      <section className="portfolio-rail" aria-label="Portfolio de productos del Lab">
        <nav className="product-selector">
          <button className="lab-guide-tab" onClick={() => setLabGuideOpen(true)}><span aria-hidden="true">✦</span><b>Laboratorio YOL1</b><small>CÓMO USARLO</small></button>
          {PORTFOLIO_PRODUCTS.map((product) => <button key={product.id} className={product.id === productId ? "selected" : ""} onClick={() => chooseProduct(product.id)} data-product-key={product.id} data-maturity={product.maturity} aria-current={product.id === productId ? "page" : undefined}><span aria-hidden="true">{product.icon}</span><b>{product.name}</b><small>{maturityLabel(product)}</small></button>)}
        </nav>
      </section>
      <section className={`lab-intro product-${productId}`}>
        <div className="brand-plate"><Brand /><span>PRODUCT GROWTH LAB · 01</span></div>
        <div className="editorial-copy">
          <p className="eyebrow">{editorialEyebrow}</p>
          <h1>{editorialHeading}</h1>
          <p className="lede">{activeProduct.description}</p>
        </div>
        <FeedbackPanel key={`desktop-feedback-${productId}-${activeTitle}`} product={activeProduct.name} screen={activeTitle} open={true} onToggle={() => undefined} variant="desktop" compact={false} onSubmitted={() => undefined} />
      </section>

      {(productId === "companion" || productId === "kyc" || productId === "builder") ? <section className={`phone-wrap ${productId === "builder" ? "builder-phone-wrap" : ""}`} aria-label={`YOL1 — ${activeTitle}`}>
        <span className="phone-halo" aria-hidden="true" />
        <div className={`phone phone-${productId}`}>
          <div className="phone-notch" />
          <header className="app-top">
            <button className="menu-trigger" data-event-id="profile_menu_opened" onClick={() => setProfileOpen(true)} aria-label="Abrir menú de perfil"><Brand compact /></button>
            <span className="app-section">{activeTitle}</span>
            <div className="header-actions"><button className="feedback-mobile-trigger" data-event-id="feedback_panel_opened" onClick={() => setFeedbackOpen(true)} aria-label={`Dejar feedback sobre ${activeTitle}`}><span aria-hidden="true">✎</span> Feedback</button><button className="theme-toggle" data-event-id="theme_mode_toggled" onClick={() => chooseTheme(theme === "dark" ? "light" : "dark")} aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`} title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}><span aria-hidden="true">{theme === "dark" ? "☀" : "◐"}</span> {theme === "dark" ? "Claro" : "Oscuro"}</button></div>
          </header>
          <div ref={appContentRef} className={`app-content app-${productId === "companion" ? tab : productId === "kyc" ? "onboarding" : "builder"} ${productId === "companion" && tab === "cobrar" && collectDraft.step === 0 ? "collect-home-mode" : ""}`}>
            <>
              {productId === "kyc" && <OnboardingFlow key={onboardingResetKey} stage={onboardingStage} setStage={setOnboardingStage} onSnapshotChange={setDemoSnapshot} onEnterAdvisor={() => { setProductId("companion"); go("inicio", "Ya puedes explorar tu acompañante financiero."); }} onOpenBank={() => { setBankCapability("receive_value"); setProductId("companion"); go("banco", "Handoff demo: revisa los requisitos posibles sin entregar identidad."); }} />}
              {productId === "builder" && <ProjectBuilderScreen guide={builderGuide} onGuide={setBuilderGuide} project={sharedProject} projectState={sharedProjectState} />}
              {productId === "companion" && tab === "inicio" && <Start archived={archivedCards} onArchive={archiveCard} onRestore={(id) => setArchivedCards((cards) => cards.filter((card) => card !== id))} onMove={go} onCollect={openCollect} onLedger={openLedger} onNotice={notify} />}
              {productId === "companion" && tab === "finanzas" && <Finances onLedger={openLedger} onMove={go} onNotice={notify} />}
              {productId === "companion" && tab === "cartola" && <Ledger source={source} setSource={setSource} selected={selectedMovement} setSelected={setSelectedMovement} reviewed={reviewedMovements} onUnreview={(id) => setReviewedMovements((items) => items.filter((item) => item !== id))} notes={movementNotes} setNotes={setMovementNotes} savedNotes={savedMovementNotes} setSavedNotes={setSavedMovementNotes} onAction={handleMovementAction} onNotice={notify} />}
              {productId === "companion" && tab === "cobrar" && <Collect draft={collectDraft} setDraft={setCollectDraft} view={pendingView} setView={setPendingView} onNotice={notify} onPreview={setMessagePreview} />}
              {productId === "companion" && tab === "ahorrar" && <Save onNotice={notify} onLedger={openLedger} onCollect={openCollect} />}
              {productId === "companion" && tab === "ganar" && <EarnMore onBack={() => go("inicio")} />}
              {productId === "companion" && tab === "banco" && <MyBank capability={bankCapability} onNotice={notify} onClearContext={() => setBankCapability("direct")} onResetScroll={resetAppContentScroll} />}
            </>
          </div>
          {notice && <div className="phone-toast" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Cerrar confirmación">×</button></div>}
          <FeedbackPanel key={`mobile-feedback-${productId}-${activeTitle}`} product={activeProduct.name} screen={activeTitle} open={feedbackOpen} onToggle={() => setFeedbackOpen(false)} variant="mobile" onSubmitted={() => undefined} />
          {profileOpen && <ProfileMenu snapshot={demoSnapshot} onClose={() => setProfileOpen(false)} onOnboarding={() => { setProfileOpen(false); setProductId("kyc"); }} onBank={() => { setProfileOpen(false); setProductId("companion"); setBankCapability(demoSnapshot?.selected_capability === "receive_value" ? "receive_value" : "direct"); go("banco"); }} onClearDemo={() => { clearDemoFromLedger(); setProfileOpen(false); }} />}
          {productId === "companion" && <nav className="bottom-nav bottom-nav-six" aria-label="Navegación principal">
            <NavButton icon="⌂" label="Inicio" current={tab === "inicio"} onClick={() => go("inicio")} />
            <NavButton icon="💵" label="Finanzas" current={tab === "finanzas" || tab === "cartola"} onClick={() => go("finanzas")} />
            <NavButton icon="👥" label="Cobrar/pagar" current={tab === "cobrar"} onClick={() => go("cobrar")} />
            <NavButton icon="🪙" label="Ahorrar" current={tab === "ahorrar"} onClick={() => go("ahorrar")} />
            <NavButton icon="✦" label="Ganar" current={tab === "ganar"} onClick={() => go("ganar")} />
            <NavButton icon="⌂" label="Mi banco" current={tab === "banco"} onClick={() => { setBankCapability("direct"); go("banco"); }} />
          </nav>}
        </div>
        {productId === "builder" && <ProjectSubmitPanel open={projectSubmitOpen} onToggle={() => setProjectSubmitOpen((current) => !current)} onSubmitted={() => undefined} />}
      </section> : <ResearchStage product={activeProduct} stateIndex={emptyStateIndex} />}
      {activeProduct.explorable && productId !== "builder" && <ProductSpecPanel product={activeProduct} screen={activeTitle} inspectedAction={inspectedAction} />}
      {productId === "builder" && sharedProjectState === "ready" && sharedProject && <div id="builder-technical-panel"><ProductSpecPanel product={activeProduct} screen={activeTitle} inspectedAction={inspectedAction} /></div>}
      {productId === "builder" && !(sharedProjectState === "ready" && sharedProject) && <BuilderOrientationPanel />}
    </main>
  );
}

function productSpecScreen(product: ProductDefinition, screen: string) {
  if (product.id !== "companion") return "inicio";
  const normalized = screen.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (normalized.includes("finanzas")) return "finanzas";
  if (normalized.includes("cartola")) return "cartola";
  if (normalized.includes("cobrar")) return "cobrar";
  if (normalized.includes("ahorrar")) return "ahorrar";
  if (normalized.includes("ganar")) return "ganar";
  if (normalized.includes("banco")) return "banco";
  return "inicio";
}

function LabWelcome({ theme, onTheme, onChooseProduct }: { theme: Theme; onTheme: () => void; onChooseProduct: (product: ProductId) => void }) {
  return <main className="lab-welcome lab-shell" data-theme={theme}>
    <section className="portfolio-rail lab-welcome-rail" aria-label="Navegación del Laboratorio YOL1">
      <nav className="product-selector">
        <button className="lab-guide-tab selected" aria-current="page"><span aria-hidden="true">✦</span><b>Laboratorio YOL1</b><small>CÓMO USARLO</small></button>
        {PORTFOLIO_PRODUCTS.map((product) => <button key={product.id} onClick={() => onChooseProduct(product.id)} data-product-key={product.id} data-maturity={product.maturity}><span aria-hidden="true">{product.icon}</span><b>{product.name}</b><small>{maturityLabel(product)}</small></button>)}
      </nav>
    </section>
    <header className="lab-welcome-head"><div className="brand-plate"><Brand /><span>PRODUCT GROWTH LAB · 01</span></div><button className="theme-toggle" onClick={onTheme}>{theme === "dark" ? "☀ Claro" : "◐ Oscuro"}</button></header>
    <section className="lab-welcome-hero"><p className="eyebrow">BIENVENIDO AL LABORATORIO YOL1</p><h1>Ideas con forma.<br /><span>Productos con contexto.</span></h1><p>Este es un espacio de trabajo: puedes navegar prototipos, entender qué falta para construirlos y dejar decisiones que el equipo de producto y tecnología pueda retomar.</p></section>
    <section className="lab-welcome-steps" aria-label="Cómo usar el Laboratorio YOL1">
      <article><span>01</span><LabPreview type="explore" /><h2>Explora un producto</h2><p>Elige una pestaña. Las pantallas son mockups interactivos: sus botones responden, pero no conectan bancos, pagos ni servicios reales.</p></article>
      <article><span>02</span><LabPreview type="spec" /><h2>Mira cómo se construye</h2><p>Baja en cada producto explorable. La ficha traduce pantalla a datos, eventos, arquitectura candidata, gates y riesgos de experiencia.</p></article>
      <article><span>03</span><LabPreview type="input" /><h2>Deja una edición útil</h2><p>Marca qué está por validar y deja una propuesta, idea o comentario. Entra a la bandeja de aprendizaje para priorizarlo después.</p></article>
      <article><span>04</span><LabPreview type="builder" /><h2>Construye tu propio producto</h2><p>Conecta ChatGPT, Claude o Codex al MCP de YOL1 y parte por una idea, referencia, foto o dibujo. El Lab te guía para convertirla en propuesta.</p></article>
    </section>
    <section className="lab-welcome-products"><p className="eyebrow">PRODUCTOS DISPONIBLES PARA EXPLORAR</p><div>{PORTFOLIO_PRODUCTS.filter((product) => product.id !== "builder").map((product) => <button key={product.id} onClick={() => onChooseProduct(product.id)}><span>{product.icon}</span><strong>{product.name}</strong><small>{product.explorable ? "Abrir mockup y ficha" : maturityLabel(product)}</small></button>)}</div></section>
  </main>;
}

function LabPreview({ type }: { type: "explore" | "spec" | "input" | "builder" }) {
  if (type === "explore") return <figure className="lab-step-preview lab-preview-explore" aria-label="Vista previa de un mockup interactivo"><div className="lab-preview-phone"><i /><b>Inicio</b><span>Entiende tus finanzas.</span><em>Revisar</em></div></figure>;
  if (type === "spec") return <figure className="lab-step-preview lab-preview-spec" aria-label="Vista previa de una ficha técnica"><small>FICHA DE PRODUCTO</small><b>Contrato de datos</b><i /><i /><i /><span>event_name · user_id · event_at</span></figure>;
  if (type === "input") return <figure className="lab-step-preview lab-preview-input" aria-label="Vista previa de un input de decisión"><small>EXPERIENCIA · POR VALIDAR</small><b>¿Qué mejorarías aquí?</b><span>Idea para esta pantalla…</span><em>Enviar propuesta</em></figure>;
  return <figure className="lab-step-preview lab-preview-builder" aria-label="Vista previa de una conversación que construye un producto"><small>MCP YOL1 · EN CONVERSACIÓN</small><b>Quiero una tarjeta para viajar.</b><span>✦ El Lab prepara la primera vista</span><i /><i /><i /></figure>;
}

function ProductSpecPanel({ product, screen, inspectedAction }: { product: ProductDefinition; screen: string; inspectedAction: InspectedAction | null }) {
  const spec = getLivingSpec(product, productSpecScreen(product, screen));
  const inspectedEvent = inspectedAction?.eventId ?? spec.event;
  const hasEvent = Boolean(inspectedAction ? inspectedAction.eventId : spec.event);
  const metadata = eventMetadata(inspectedEvent, product, screen).map(([key, value]) => [key, key === "event_name" && !hasEvent ? "Sin evento definido" : value] as [string, string]);
  const dataContract = {
    readModel: spec.data.query,
    writeModel: spec.data.store,
    sourceOfTruth: spec.data.sources,
    operationalRecord: "BD operacional por definir · conservar origen, frescura y versión de regla",
    analytics: "CDP / warehouse por definir · enviar sólo evento allowlisted, IDs pseudónimos y consentimiento",
    observability: "Logs estructurados + correlation_id · sin PII, OTP, credenciales ni payloads financieros crudos",
  };
  const implementationReadiness = [
    ["Historia", `Como persona usuaria, puedo abrir ${screen} y entender qué muestra, qué está pendiente y cuál es la siguiente acción sin que la pantalla prometa una operación real.`],
    ["Contrato de pantalla", "El BFF devuelve un read model versionado, limitado a esta vista; la app nunca compone autorizaciones, reglas de riesgo ni fuentes financieras por su cuenta."],
    ["Comando", "Toda escritura usa un endpoint idempotente, con actor, intención, policy_version y correlation_id. Un reintento nunca duplica una solicitud o decisión."],
    ["Observabilidad", `Instrumentar ${spec.event} con IDs pseudónimos, consent_analytics y schema_version. Errores operativos van a logs estructurados; datos sensibles quedan fuera.`],
    ["Definition of ready", `Owner asignado: ${spec.governance.owner}. Fuente y gate confirmados, estados vacío/carga/error/reintento definidos, y rollback o feature flag disponible antes de habilitar acciones materiales.`],
  ];
  const architectureGuide = [
    "React Native: componentes reutilizables, navegación tipada, estado de carga/error/vacío y accesibilidad desde el componente.",
    "BFF / API: contrato versionado por pantalla; valida autorización y devuelve sólo el read model que necesita la vista.",
    "AWS: API Gateway → Lambda por dominio candidato; DynamoDB/RDS según patrón de acceso y auditoría; EventBridge para eventos asíncronos sólo cuando exista una integración aprobada.",
    "Operación: feature flag por capability, trazabilidad con correlation_id, observabilidad y rollback antes de habilitar una acción material.",
  ];
  const sections = [
    { title: "Evento y metadata", content: <><p className="team-spec-inspector"><span>{inspectedAction ? "INSPECCIONANDO ACCIÓN" : "EVENTO BASE DE ESTA PANTALLA"}</span><strong>{inspectedAction?.label ?? simpleEventName(spec.event, product, screen)}</strong></p><p className="team-spec-event">{hasEvent ? simpleEventName(inspectedEvent, product, screen) : "Sin evento definido"}</p><code>{hasEvent ? inspectedEvent : "instrumentación pendiente"}</code>{!hasEvent && inspectedAction && <p className="team-spec-warning">Esta acción aún no tiene <code>data-event-id</code>. La ficha no inventa un evento: queda como deuda de instrumentación.</p>}<dl>{metadata.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>{inspectedAction?.parameters.length ? <><p className="team-spec-parameters-label">Parámetros de esta interacción</p><dl>{inspectedAction.parameters.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></> : null}</> },
    { title: "Contrato de datos", content: <div className="team-spec-contract"><p><b>Read model · consulta la pantalla:</b> {dataContract.readModel.join(" · ")}</p><p><b>Write model · genera o modifica:</b> {dataContract.writeModel.join(" · ")}</p><p><b>System of record · fuentes:</b> {dataContract.sourceOfTruth.join(" · ")}</p><p><b>BD operacional:</b> {dataContract.operationalRecord}</p><p><b>Analítica / CDP / warehouse:</b> {dataContract.analytics}</p><p><b>Observabilidad:</b> {dataContract.observability}</p><div className="team-spec-contract-rule"><strong>Regla de implementación</strong><span>El modelo de lectura, el registro operacional y el evento analítico son contratos distintos. No se replica la fuente completa en la app, ni se usa analítica como fuente de verdad.</span></div><p className="team-spec-note">{spec.data.handling}</p></div> },
    { title: "Arquitectura candidata", content: <><ul>{spec.architecture.map((item) => <li key={item}>{item}</li>)}</ul><div className="team-spec-architecture-guide">{architectureGuide.map((item) => <p key={item}>{item}</p>)}</div><div className="team-spec-readiness"><p className="team-spec-parameters-label">Historia de construcción · para ingeniería</p>{implementationReadiness.map(([label, value]) => <article key={label}><strong>{label}</strong><span>{value}</span></article>)}</div></> },
    { title: "Experiencia, gates y Error capa 8", content: <><ExperienceInputs product={product.name} screen={screen} kyc={`${spec.kyc.state}: ${spec.kyc.reason}`} licenses={`${spec.licenses.state}: ${spec.licenses.reason}`} risks={spec.risks} /><DecisionCapture product={product.name} screen={screen} questions={spec.questions} /></> },
  ];
  return <section className="team-spec" aria-label={`Ficha técnica de ${screen}`}>
    <header><div><p className="eyebrow">FICHA DE PRODUCTO · PARA DESARROLLO</p><h2>{screen}</h2><p>De decisión técnica a experiencia: contrato de datos, arquitectura candidata, instrumentación y QA para que el equipo pueda construir sin adivinar.</p></div><aside><small>OWNER</small><strong>{spec.governance.owner}</strong><small>REVISAR</small><span>{spec.governance.reviewBy}</span></aside></header>
    <div className="team-spec-accordion">{sections.slice(0, 1).map((section) => <details key={section.title} open><summary>{section.title}<span>+</span></summary><div>{section.content}</div></details>)}</div>
    {spec.technicalFlow && <OnboardingTechnicalDeck flow={spec.technicalFlow} />}
    <div className="team-spec-accordion">{sections.slice(1).map((section) => <details key={section.title}><summary>{section.title}<span>+</span></summary><div>{section.content}</div></details>)}</div>
  </section>;
}

type OnboardingTechnicalScreen = NonNullable<LivingSpec["technicalFlow"]>[number];

function OnboardingTechnicalDeck({ flow }: { flow: OnboardingTechnicalScreen[] }) {
  const [selected, setSelected] = useState(0);
  const current = flow[selected];
  const navigate = (direction: -1 | 1) => setSelected((value) => Math.min(flow.length - 1, Math.max(0, value + direction)));
  return <section className="onboarding-technical-deck" aria-label="Ficha de flujo pantalla por pantalla">
    <header><div><p className="eyebrow">FICHA DE FLUJO · ONBOARDING V2</p><h3>Pantallas, bifurcaciones y contrato técnico.</h3><p>Selecciona una pantalla: abajo queda la historia de usuario que un equipo de ingeniería necesita para construirla.</p></div><div className="flow-deck-controls"><button type="button" onClick={() => navigate(-1)} disabled={selected === 0} aria-label="Pantalla anterior">←</button><strong>{String(selected + 1).padStart(2, "0")} / {String(flow.length).padStart(2, "0")}</strong><button type="button" onClick={() => navigate(1)} disabled={selected === flow.length - 1} aria-label="Pantalla siguiente">→</button></div></header>
    <div className="flow-deck-rail" role="tablist" aria-label="Pantallas del onboarding">{flow.map((item, index) => <button key={item.screen} role="tab" aria-selected={selected === index} className={selected === index ? "selected" : ""} onClick={() => setSelected(index)}><span>{item.screen}</span><strong>{item.ui}</strong><small>{item.next}</small></button>)}</div>
    <article className="flow-deck-detail" aria-live="polite"><header><div><p className="eyebrow">{current.screen}</p><h3>{current.ui}</h3><p><b>Bifurcación:</b> {current.next}</p></div><code>{current.command}</code></header><div className="flow-deck-detail-grid"><FlowDetail label="Microservicios / componentes" values={current.services} /><FlowDetail label="Lee" values={current.reads} /><FlowDetail label="Escribe" values={current.writes} /><FlowDetail label="Tablas / colecciones" values={current.records} /><FlowDetail label="Eventos" values={current.events} /></div><div className="flow-deck-qa"><p><b>Error y recuperación:</b> {current.failure}</p><p><b>Definition of done:</b> {current.acceptance}</p></div></article>
  </section>;
}

function FlowDetail({ label, values }: { label: string; values: string[] }) {
  return <section><p>{label}</p><ul>{values.map((value) => <li key={value}>{value}</li>)}</ul></section>;
}

function DecisionCapture({ product, screen, questions }: { product: string; screen: string; questions: string[] }) {
  const [kind, setKind] = useState<FeedbackKind>("idea");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [questionStates, setQuestionStates] = useState<Record<string, "pending" | "answered" | "not_applicable">>({});
  const labels: Record<FeedbackKind, string> = { like: "Comentario", improve: "Propuesta", idea: "Idea" };
  const stateLabels = { pending: "Por validar", answered: "Respondida", not_applicable: "No aplica" } as const;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    const input = { product, screen: `${screen} · decisión técnica`, kind, message: message.trim(), topics: "pregunta técnica" };
    localFeedbackIntake.submit(input);
    setSubmitting(true);
    try {
      const shared = await submitGeneralFeedback({ screen: `${product} · ${screen} · decisión técnica`, kind, message: message.trim(), topics: "pregunta técnica" });
      setConfirmation(shared ? "Propuesta enviada a la bandeja de aprendizaje." : "Guardada en este navegador para revisión.");
    } catch {
      setConfirmation("Guardada en este navegador para revisión.");
    } finally {
      setSubmitting(false);
      setMessage("");
    }
  };
  return <form className="decision-capture" onSubmit={submit}>
    <div className="decision-capture-questions"><p className="team-spec-parameters-label">Preguntas para construir</p>{questions.map((question, index) => {
      const state = questionStates[question] ?? "pending";
      return <article key={question}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{question}</strong><small>{state === "answered" ? "Respuesta/evidencia por conectar a fuente aprobada." : state === "not_applicable" ? "Fuera de alcance de esta pantalla." : "Aún no existe una decisión o evidencia aprobada."}</small></div><button type="button" className={`decision-state decision-${state}`} onClick={() => setQuestionStates((current) => ({ ...current, [question]: state === "pending" ? "answered" : state === "answered" ? "not_applicable" : "pending" }))} aria-label={`Cambiar estado: ${stateLabels[state]}`}>{stateLabels[state]}</button></article>;
    })}</div>
    <p>Convierte una duda en material para BRD, arquitectura o backlog. No incluyas datos personales ni financieros reales.</p>
    <div className="decision-capture-kinds">{(["idea", "improve", "like"] as FeedbackKind[]).map((value) => <button type="button" key={value} className={kind === value ? "selected" : ""} onClick={() => setKind(value)}>{labels[value]}</button>)}</div>
    <label><span>{labels[kind]} para esta pantalla</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={700} required placeholder="Ej.: Propongo persistir el pre-registro sólo después de verificar el canal y conservar un estado recuperable." /></label>
    <button type="submit" disabled={submitting || !message.trim()}>{submitting ? "Guardando…" : "Guardar en bandeja"}</button>
    {confirmation && <p className="decision-capture-confirmation" role="status">✓ {confirmation}</p>}
  </form>;
}

function ExperienceInputs({ product, screen, kyc, licenses, risks }: { product: string; screen: string; kyc: string; licenses: string; risks: string[] }) {
  const items = [
    { key: "experience", title: "Experiencia", body: "Recorrer feliz, vacío, carga, error recuperable, sin permiso y retorno. Cada CTA debe tener salida, confirmación y reversibilidad cuando aplique." },
    { key: "gates", title: "Gates por resolver", body: `KYC: ${kyc} Licencias: ${licenses}` },
    { key: "layer8", title: "Error capa 8", body: risks.join(" · ") },
  ];
  const [open, setOpen] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!open || !message.trim()) return;
    const input = { product, screen: `${screen} · ${open}`, kind: "improve" as FeedbackKind, message: message.trim(), topics: open };
    localFeedbackIntake.submit(input);
    try {
      const shared = await submitGeneralFeedback({ screen: `${product} · ${screen} · ${open}`, kind: "improve", message: message.trim(), topics: open });
      setConfirmation(shared ? "Input enviado a la bandeja de aprendizaje." : "Input guardado localmente para revisión.");
    } catch {
      setConfirmation("Input guardado localmente para revisión.");
    }
    setMessage("");
  };
  return <form className="experience-inputs" onSubmit={submit}>{items.map((item) => <article key={item.key}><div><p>{item.title}</p><span>{item.body}</span></div><button type="button" onClick={() => { setOpen(open === item.key ? null : item.key); setConfirmation(""); }}>{open === item.key ? "Cerrar input" : "Agregar input"}</button>{open === item.key && <label><span>Comentario para {item.title}</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe el problema, una propuesta o la evidencia que falta." maxLength={700} required /><button type="submit">Enviar propuesta</button></label>}</article>)}{confirmation && <p className="decision-capture-confirmation" role="status">✓ {confirmation}</p>}</form>;
}

function WelcomePanel({ kicker, title, body, action, onAction, onBack }: { kicker: string; title: ReactNode; body: string; action: string; onAction: () => void; onBack: () => void }) {
  return <section className="welcome-panel"><button className="back-link" onClick={onBack}>← Volver</button><p className="kicker">{kicker}</p><h2 className="compact-title">{title}</h2><p className="onboarding-copy">{body}</p><div className="onboarding-check muted"><span>○</span><div><strong>Espacio de prueba</strong><small>Esta vista no abre productos financieros ni procesa datos reales.</small></div></div><button className="primary-action" onClick={onAction}>{action} →</button></section>;
}

function OnboardingFlow({ stage, setStage, onSnapshotChange, onEnterAdvisor, onOpenBank }: { stage: OnboardingStage; setStage: (stage: OnboardingStage) => void; onSnapshotChange: (snapshot: OnboardingDemoSnapshot | null) => void; onEnterAdvisor: () => void; onOpenBank: () => void }) {
  const [method, setMethod] = useState<AccessMethod>("teléfono");
  const [contact, setContact] = useState("");
  const [contactTouched, setContactTouched] = useState(false);
  const [otp, setOtp] = useState("");
  const [capability, setCapability] = useState<OnboardingCapability>("financial_data_connect");
  const [otpState, setOtpState] = useState<"entry" | "invalid" | "expired" | "rate_limited" | "contact_exists" | "support_required">("entry");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [supportOpen, setSupportOpen] = useState(false);
  const [e2Result, setE2Result] = useState<"idle" | "pass" | "fail_identity" | "fail_money">("idle");
  const [storageReady, setStorageReady] = useState(false);
  const [welcomeView, setWelcomeView] = useState<"start" | "stability" | "assistant" | "future">("start");
  const selectedIntent = capability === "financial_data_connect" ? "conectar datos" : "recibir dinero";
  const contactValidation = validateAccessContact(method, contact);
  const stageMeta = ONBOARDING_STAGE_META[stage];
  const move = (event: OnboardingTransition) => setStage(transitionOnboarding(stage, event));
  const resetOtp = () => { setOtp(""); setOtpState("entry"); setOtpAttempts(0); };
  const requestSupport = () => { setOtpState("support_required"); setSupportOpen(true); };
  const confirmOtp = () => {
    if (otp === "123456") { setOtpState("entry"); move("VERIFY_OTP_DEMO"); return; }
    const nextAttempts = otpAttempts + 1;
    setOtpAttempts(nextAttempts);
    setOtpState(nextAttempts >= 3 ? "rate_limited" : "invalid");
  };
  const changeMethod = (nextMethod: AccessMethod) => {
    setMethod(nextMethod);
    setContact("");
    setContactTouched(false);
  };
  const requestOtpDemo = (existingContact = false) => {
    setContactTouched(true);
    if (!contactValidation.valid) return;
    resetOtp();
    if (existingContact) setOtpState("contact_exists");
    move("REQUEST_OTP_DEMO");
  };
  useEffect(() => {
    const restored = parseOnboardingDemoSnapshot(window.localStorage.getItem(ONBOARDING_DEMO_STORAGE_KEY));
    if (restored) {
      setCapability(restored.selected_capability);
      setMethod(restored.channel_type);
      setStage(restored.resume_stage);
    }
    onSnapshotChange(restored);
    setStorageReady(true);
  }, [onSnapshotChange, setStage]);
  useEffect(() => {
    if (!storageReady || (stage !== "preregistered_demo" && stage !== "consent_preview")) return;
    const snapshot = buildOnboardingDemoSnapshot({ capability, channel: method, stage });
    window.localStorage.setItem(ONBOARDING_DEMO_STORAGE_KEY, JSON.stringify(snapshot));
    onSnapshotChange(snapshot);
  }, [capability, method, onSnapshotChange, stage, storageReady]);
  const clearDemoPreregistration = () => {
    window.localStorage.removeItem(ONBOARDING_DEMO_STORAGE_KEY);
    onSnapshotChange(null);
    setCapability("financial_data_connect");
    setMethod("teléfono");
    setContact("");
    setContactTouched(false);
    resetOtp();
    setE2Result("idle");
    setSupportOpen(false);
    move("RESET_DEMO");
  };
  return <section className="onboarding-flow" data-stage={stage}>
    <div className="onboarding-progress" aria-label={`Progreso del acceso: ${stageMeta.label}`}><span style={{ width: `${stageMeta.progress * 100}%` }} /></div>
    {stage === "welcome" && <><div className="onboarding-brand"><Brand compact /><span>YOL1</span></div>{welcomeView === "start" && <><p className="kicker">BIENVENIDO A YOL1</p><h2>Tu plata, más clara.<br /><span>Entiende qué está pasando hoy.</span></h2><p className="onboarding-copy">Explora cómo YOL1 puede ayudarte antes de registrarte. Sólo te pediremos un canal si eliges preparar y guardar una ruta concreta.</p><button className="primary-action" data-event-id="onboarding_started" onClick={() => move("VIEW_ACTIVATIONS")}>Explorar YOL1 →</button><div className="onboarding-discovery-menu" aria-label="Lo que puedes conocer sin registrarte"><button onClick={() => setWelcomeView("stability")}><strong>Mi estabilidad financiera</strong><small>Prueba una simulación con datos de ejemplo</small></button><button onClick={() => setWelcomeView("assistant")}><strong>Hablar con el asistente</strong><small>Cuéntale una situación y mira cómo te puede orientar</small></button><button onClick={() => setWelcomeView("future")}><strong>Lo que viene en YOL1</strong><small>Conoce las experiencias que estamos construyendo</small></button></div></>}{welcomeView === "stability" && <WelcomePanel kicker="SIMULACIÓN" title={<>Mira tu estabilidad<br /><span>sin conectar nada.</span></>} body="Elige un escenario o cuéntanos cómo se mueve tu plata. Es una simulación: no usamos datos bancarios reales." action="Ver una simulación de ejemplo" onAction={onEnterAdvisor} onBack={() => setWelcomeView("start")} />}{welcomeView === "assistant" && <WelcomePanel kicker="ASISTENTE FINANCIERO" title={<>Parte por una<br /><span>pregunta cotidiana.</span></>} body="Puedes contar una situación, cargar una cartola cuando exista una ruta aprobada o revisar pendientes con ejemplos del Lab." action="Abrir el asistente" onAction={onEnterAdvisor} onBack={() => setWelcomeView("start")} />}{welcomeView === "future" && <WelcomePanel kicker="YOL1 ESTÁ TOMANDO FORMA" title={<>Un banco que se<br /><span>construye contigo.</span></>} body="Próximamente podrás operar, mover plata y acceder a nuevos productos cuando existan los vehículos, partners y controles necesarios. Hoy te mostramos qué estamos creando y qué falta para llegar ahí." action="Ver productos en construcción" onAction={onEnterAdvisor} onBack={() => setWelcomeView("start")} />}</>}
    {stage === "capability_chooser" && <><button className="back-link" onClick={() => move("BACK_TO_WELCOME")}>← Volver al inicio</button><p className="kicker">EXPLORA YOL1</p><h2 className="compact-title">¿Por dónde partimos?</h2><p className="onboarding-copy">Elige una ruta sin registrarte. Primero te mostramos qué podrías hacer, qué información se necesitaría y qué sigue por validar.</p><div className="onboarding-route-choice"><button className="finance-route" data-event-id="material_action_selected" data-capability-key="financial_data_connect" onClick={() => { setCapability("financial_data_connect"); move("SELECT_CAPABILITY"); }}><span>01</span><strong>Quiero entender mis finanzas</strong><small>Movimientos, cartola y conectar un banco cuando exista una ruta aprobada.</small></button><button className="bank-route" data-event-id="material_action_selected" data-capability-key="receive_value" onClick={() => { setCapability("receive_value"); move("SELECT_CAPABILITY"); }}><span>02</span><strong>Quiero activar mi banco YOL1</strong><small>Conocer la ruta hacia capacidades financieras; la identidad sólo aparece cuando corresponde.</small></button></div></>}
    {stage === "requirements_explained" && <><button className="back-link" onClick={() => move("BACK_TO_CAPABILITY")}>← Elegir otra ruta</button><p className="kicker">{capability === "financial_data_connect" ? "RUTA · ENTENDER MIS FINANZAS" : "RUTA · ACTIVAR MI BANCO YOL1"}</p><h2 className="compact-title">{capability === "financial_data_connect" ? <>Parte con una cartola<br /><span>o con una conversación.</span></> : <>Tu banco se activa<br /><span>paso a paso.</span></>}</h2><p className="onboarding-copy">{capability === "financial_data_connect" ? "Podrás cargar una cartola o revisar cómo funcionaría una conexión de datos. Antes de leer datos reales, te explicaremos fuente, alcance, finalidad y cómo revocar el permiso." : "Para una capacidad financiera real podrían ser necesarios identidad, documento y biometría. Sólo se solicitarían cuando exista producto, partner, política y controles aprobados."}</p><div className="onboarding-check"><span>→</span><div><strong>{capability === "financial_data_connect" ? "El siguiente paso sería un consentimiento" : "El siguiente paso sería revisar requisitos"}</strong><small>{capability === "financial_data_connect" ? "No pedimos claves bancarias ni conectamos una cuenta en esta demo." : "No validamos identidad, biometría ni habilitamos dinero en esta demo."}</small></div></div><button className="primary-action" onClick={() => move("START_PREREGISTRATION")}>{capability === "financial_data_connect" ? "Guardar esta ruta →" : "Ver mi checklist de activación →"}</button></>}
    {stage === "channel_select" && <><button className="back-link" onClick={() => move("BACK_TO_REQUIREMENTS")}>← Volver</button><p className="kicker">EMPECEMOS POR CONOCERNOS</p><h2 className="compact-title">Crea tu espacio YOL1.</h2><p className="onboarding-copy">Elige cómo prefieres registrarte. Esto guarda tu acceso; no crea una cuenta bancaria ni verifica tu identidad financiera.</p><div className="federated-access" aria-label="Opciones de registro social"><button type="button" disabled>Google <small>integración por configurar</small></button><button type="button" disabled>Facebook <small>integración por configurar</small></button><button type="button" disabled>Apple <small>integración por configurar</small></button></div><p className="microcopy">Las opciones sociales son candidatas para Cognito/federación. La demo sólo simula email o teléfono.</p><div className="auth-choice"><button className={method === "teléfono" ? "selected-option" : ""} data-event-id="access_method_selected" data-channel="phone" onClick={() => changeMethod("teléfono")} aria-pressed={method === "teléfono"}>Teléfono</button><button className={method === "email" ? "selected-option" : ""} data-event-id="access_method_selected" data-channel="email" onClick={() => changeMethod("email")} aria-pressed={method === "email"}>Correo electrónico</button></div><label className="onboarding-field" htmlFor="onboarding-contact">{method === "teléfono" ? "Tu número" : "Tu correo electrónico"}<input id="onboarding-contact" type={method === "email" ? "email" : "tel"} autoComplete={method === "email" ? "email" : "tel"} value={contact} onChange={(event) => { setContact(event.target.value); if (contactTouched) setContactTouched(false); }} onBlur={() => setContactTouched(true)} aria-invalid={contactTouched && !contactValidation.valid} aria-describedby={contactTouched && !contactValidation.valid ? "onboarding-contact-help onboarding-contact-error" : "onboarding-contact-help"} placeholder={method === "teléfono" ? "+56 9 1234 5678" : "tu@email.com"} /></label>{contactTouched && !contactValidation.valid && <p id="onboarding-contact-error" className="field-error" role="alert">{contactValidation.error}</p>}<p id="onboarding-contact-help" className="microcopy">Al continuar aceptas los términos aplicables a esta demo. Usaremos el canal sólo para entrar y recuperar tu espacio.</p><button className="primary-action" data-event-id="otp_requested_demo" disabled={!contact.trim()} onClick={() => requestOtpDemo()}>Registrarme con este canal →</button><button className="secondary-action" data-event-id="account_recovery_started" disabled={!contact.trim()} onClick={() => requestOtpDemo(true)}>Recuperar mi acceso</button></>}
    {stage === "otp_entry" && <><button className="back-link" onClick={() => move("CHANGE_CHANNEL")}>← Cambiar {method}</button><p className="kicker">CÓDIGO DE EJEMPLO</p><h2 className="compact-title">Confirma que controlas este canal.</h2><p id="onboarding-otp-help" className="onboarding-copy">Escribe el código de ejemplo para {contact || `tu ${method}`}. Esto no verifica tu identidad. Tu intención de {selectedIntent} sigue guardada en esta demo.</p>
      {(otpState === "entry" || otpState === "invalid") && <><label className="onboarding-field" htmlFor="onboarding-otp">Código de 6 dígitos<input id="onboarding-otp" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 6)); if (otpState === "invalid") setOtpState("entry"); }} aria-invalid={otpState === "invalid"} aria-describedby={otpState === "invalid" ? "onboarding-otp-help onboarding-otp-error" : "onboarding-otp-help"} placeholder="000000" /></label>{otpState === "invalid" && <div id="onboarding-otp-error" className="onboarding-state error" role="alert" data-state="otp_invalid"><strong>Ese código no coincide.</strong><small>Revisa los 6 dígitos. Te quedan {3 - otpAttempts} intentos en esta simulación.</small></div>}<button className="primary-action" disabled={otp.length < 6} data-event-id="otp_submitted_demo" onClick={confirmOtp}>Confirmar canal →</button><button className="secondary-action" onClick={() => setOtp("123456")}>Usar código de ejemplo</button><div className="onboarding-demo-actions"><button data-event-id="otp_recovery_started" onClick={() => setOtpState("expired")}>Simular código vencido</button><button data-event-id="account_recovery_started" onClick={() => setOtpState("contact_exists")}>Simular recuperación</button></div></>}
      {otpState === "expired" && <div className="onboarding-state" role="status" data-state="otp_expired"><strong>El código venció.</strong><small>Puedes generar otro código de ejemplo o cambiar de canal. La intención seleccionada no se pierde.</small><button onClick={resetOtp}>Generar otro código</button><button onClick={() => move("CHANGE_CHANNEL")}>Cambiar canal</button></div>}
      {otpState === "rate_limited" && <div className="onboarding-state error" role="alert" data-state="rate_limited"><strong>Pausa después de varios intentos.</strong><small>No habilitamos más intentos automáticamente. Puedes cambiar de canal o pedir ayuda; tu intención sigue guardada.</small><button onClick={() => move("CHANGE_CHANNEL")}>Cambiar canal</button><button data-event-id="support_route_started" onClick={requestSupport}>Pedir ayuda</button></div>}
      {otpState === "contact_exists" && <div className="onboarding-state" role="status" data-state="contact_exists"><strong>Revisa cómo continuar.</strong><small>Por seguridad, esta demo no confirma si el canal ya tiene un acceso. Puedes continuar con una recuperación simulada sin crear otro pre-registro ni cambiar tu intención.</small><button data-event-id="account_recovery_started" onClick={resetOtp}>Continuar recuperación (demo)</button><button data-event-id="support_route_started" onClick={requestSupport}>Necesito ayuda</button></div>}
      {otpState === "support_required" && <div className="onboarding-state" role="status" data-state="support_required"><strong>Ruta de ayuda preparada.</strong><small>No enviamos datos ni creamos un caso real. Customer Success y sus tiempos siguen por definir.</small><button onClick={() => { setSupportOpen(false); resetOtp(); }}>Volver al código</button></div>}
    </>}
    {stage === "preregistered_demo" && <><p className="kicker">PRE-REGISTRO DEMO LISTO</p><h2 className="compact-title">Tu acceso ya está preparado.</h2><div className="onboarding-check"><span>✓</span><div><strong>Preparación recuperable en este navegador</strong><small>{capability === "financial_data_connect" ? "Al volver, retomaremos aquí antes de revisar un consentimiento específico." : "Al volver, retomaremos aquí antes de revisar los requisitos de Mi banco/KYC."}</small></div></div><div className="onboarding-check muted"><span>○</span><div><strong>Ninguna capacidad de dinero está habilitada</strong><small>Guardamos sólo capacidad, canal y estado demo; no el contacto ni el OTP. No verificamos identidad, abrimos una cuenta ni conectamos un banco.</small></div></div><div className="onboarding-e2"><p className="kicker">COMPRENSIÓN · E2</p><strong>¿Qué habilitó este paso?</strong><div className="e2-options"><button data-event-id="onboarding_e2_answered" onClick={() => setE2Result("pass")}>Un pre-registro recuperable; no una cuenta</button><button data-event-id="onboarding_e2_answered" onClick={() => setE2Result("fail_identity")}>Mi identidad quedó verificada</button><button data-event-id="onboarding_e2_answered" onClick={() => setE2Result("fail_money")}>Ya puedo recibir dinero</button></div>{e2Result === "pass" && <p className="e2-result pass" role="status">Correcto: confirmaste un canal y puedes recuperar esta preparación.</p>}{e2Result === "fail_identity" && <p className="e2-result fail" role="alert">Todavía no: el OTP no verificó tu identidad.</p>}{e2Result === "fail_money" && <p className="e2-result fail" role="alert">Todavía no: ninguna capacidad de dinero quedó habilitada.</p>}</div><button className="primary-action" data-event-id={capability === "financial_data_connect" ? "consent_preview_opened" : "kyc_handoff_opened"} onClick={() => { if (capability === "financial_data_connect") move("OPEN_CONSENT_PREVIEW"); else onOpenBank(); }}>{capability === "financial_data_connect" ? "Revisar consentimiento demo →" : "Ver requisitos en Mi banco →"}</button><button className="secondary-action" onClick={onEnterAdvisor}>Volver al acompañante financiero</button><button className="back-link" data-event-id="preregistration_demo_deleted" onClick={clearDemoPreregistration}>Borrar pre-registro de esta demo</button><p className="microcopy">Si pierdes el canal o una revisión queda pendiente, Customer Success está por definir.</p></>}
    {stage === "consent_preview" && <><button className="back-link" onClick={() => move("BACK_TO_PREREGISTERED")}>← Volver al pre-registro</button><p className="kicker">CONSENTIMIENTO · VISTA PREVIA</p><h2 className="compact-title">El permiso sería específico y revocable.</h2><p className="onboarding-copy">Para conectar datos habría que autorizar una fuente y un alcance concretos. YOL1 no pediría claves bancarias ni asumiría que tu identidad quedó verificada.</p><div className="onboarding-check"><span>→</span><div><strong>Qué habilitaría este permiso</strong><small>Consultar sólo los datos descritos para preparar una explicación personalizada, si existe un proveedor y contrato aprobados.</small></div></div><div className="onboarding-check muted"><span>○</span><div><strong>Qué no ocurrió</strong><small>No conectamos un banco, no leímos datos reales y no activamos una capacidad financiera.</small></div></div><button className="primary-action" onClick={onEnterAdvisor}>Entendido, volver al Acompañante →</button><button className="back-link" data-event-id="preregistration_demo_deleted" onClick={clearDemoPreregistration}>Borrar pre-registro de esta demo</button></>}
    {supportOpen && <aside className="onboarding-support" aria-label="Ayuda de Customer Success"><strong>Customer Success · demo</strong><p>La ruta conservaría tu intención de {selectedIntent} y el estado del pre-registro. Responsable, canal y tiempo de respuesta están por definir.</p><button onClick={() => setSupportOpen(false)}>Cerrar</button></aside>}
  </section>;
}

function MyBank({ capability, onNotice, onClearContext, onResetScroll }: { capability: "direct" | "receive_value"; onNotice: (message: string) => void; onClearContext: () => void; onResetScroll: () => void }) {
  const [view, setView] = useState<"start" | "status">("start");
  const [rawState, setRawState] = useState("requirements_pending");
  const normalizedState: NormalizedKycState = normalizeKycState(rawState);
  useEffect(() => {
    onResetScroll();
  }, [onResetScroll, view]);
  const showFixture = (nextRawState: string) => {
    const normalized = normalizeKycState(nextRawState);
    setRawState(nextRawState);
    setView("status");
    onNotice(`Estado KYC demo: ${normalized}. No habilita capacidades.`);
  };
  if (view === "start") return <section className="bank-flow"><p className="kicker">{capability === "receive_value" ? "HANDOFF · RECIBIR DINERO" : "MI BANCO / KYC · POR VALIDAR"}</p><h2>{capability === "receive_value" ? <>Tu intención llegó.<br /><span>No tus datos de identidad.</span></> : <>La identidad aparece<br /><span>solo con una razón concreta.</span></>}</h2><p>{capability === "receive_value" ? "El pre-registro confirmó un canal y conservó la intención de recibir dinero. La capacidad sigue no disponible: faltan vehículo, partner, contrato, controles y política aprobados." : "RUT, número de serie o biometría podrían corresponder únicamente cuando una acción material, partner y fundamento aprobados los requieran."}</p>{capability === "receive_value" && <div className="onboarding-check"><span>→</span><div><strong>Contexto recibido</strong><small>Capability: recibir dinero · canal verificado sólo en demo · disponibilidad: no disponible.</small></div></div>}<div className="onboarding-check muted"><span>○</span><div><strong>En esta demo no pedimos identidad</strong><small>No abrimos una cuenta, conectamos un banco ni habilitamos transferencias.</small></div></div><button className="primary-action" data-event-id="kyc_requirements_viewed" onClick={() => showFixture("requirements_pending")}>Ver requisitos pendientes →</button><div className="onboarding-demo-actions" aria-label="Fixtures de estado KYC"><button data-event-id="kyc_requirements_viewed" onClick={() => showFixture("failed_recoverable")}>Simular error recuperable</button><button data-event-id="kyc_requirements_viewed" onClick={() => showFixture("partner_new_state")}>Simular estado desconocido</button></div>{capability === "receive_value" && <button className="secondary-action" onClick={() => { setView("start"); onClearContext(); }}>Salir del handoff demo</button>}</section>;
  const isUnknown = rawState !== normalizedState;
  const content = normalizedState === "requirements_pending"
    ? { kicker: "REQUISITOS PENDIENTES", title: "Todavía no corresponde pedir más datos.", body: "Faltan capacidad, vehículo, contrato y política aprobados. La acción permanece no disponible." }
    : normalizedState === "failed_recoverable"
      ? { kicker: "ERROR RECUPERABLE · DEMO", title: "Este paso se puede volver a intentar.", body: "No perdimos la intención ni pedimos nueva identidad. Un flujo real necesitaría razón normalizada, límites y soporte." }
      : { kicker: "REVISIÓN · FALLBACK SEGURO", title: "Este estado necesita revisión.", body: "El proveedor devolvió un estado que YOL1 no reconoce. Lo tratamos como revisión, nunca como verificación o capacidad habilitada." };
  return <section className="bank-flow" data-kyc-state={normalizedState}><button className="back-link" onClick={() => setView("start")}>← Volver</button><p className="kicker">{content.kicker}</p><h2 className="compact-title">{content.title}</h2><p>{content.body}</p><div className="onboarding-check muted"><span>{isUnknown ? "?" : "○"}</span><div><strong>Estado normalizado: {normalizedState}</strong><small>{isUnknown ? "Fixture desconocido degradado a revisión; el valor crudo no se expone." : "Estado local sintético; no existe respuesta de proveedor."}</small></div></div><button className="primary-action" onClick={() => setView("start")}>Volver a Mi banco</button><button className="secondary-action" data-event-id="support_route_started" onClick={() => onNotice("Customer Success demo: owner, canal y SLA por definir; no se creó un caso.")}>Pedir ayuda (demo)</button><p className="microcopy">Ningún estado demo verifica identidad ni habilita dinero. Customer Success sigue por definir.</p></section>;
}

function ProfileMenu({ snapshot, onClose, onOnboarding, onBank, onClearDemo }: { snapshot: OnboardingDemoSnapshot | null; onClose: () => void; onOnboarding: () => void; onBank: () => void; onClearDemo: () => void }) {
  const rows = buildAccessLedger(snapshot);
  const act = (action: (typeof rows)[number]["action"]) => {
    if (action === "open_onboarding") onOnboarding();
    if (action === "open_bank") onBank();
    if (action === "clear_demo") onClearDemo();
  };
  return <aside className="profile-menu" aria-label="Menú de perfil"><div className="profile-menu-head"><div><small>TU PERFIL</small><strong>Accesos y permisos</strong></div><button onClick={onClose} aria-label="Cerrar menú">×</button></div><p>Este ledger muestra sólo el estado local; no necesitas completar datos por adelantado.</p><div className="profile-checklist">{rows.map((row) => { const content = <><span>{row.mark}</span><div><strong>{row.label}</strong><small>{row.status}</small></div></>; return row.action ? <button key={row.key} className={`ledger-row state-${row.mark === "✓" ? "ready" : "pending"}`} data-event-id={row.action === "clear_demo" ? "preregistration_demo_deleted" : undefined} onClick={() => act(row.action)}>{content}</button> : <div key={row.key} className="ledger-row state-empty">{content}</div>; })}</div></aside>;
}

function ProjectBuilderScreen({ guide, onGuide, project, projectState }: { guide: BuilderGuide; onGuide: (guide: BuilderGuide) => void; project: SharedProjectDraft | null; projectState: "idle" | "loading" | "ready" | "error" }) {
  if (guide) return <BuilderGuideScreen guide={guide} onBack={() => onGuide(null)} />;
  if (projectState === "loading") return <section className="builder-project-state" aria-live="polite"><span>✦</span><p className="kicker">ABRIENDO BORRADOR</p><h2>Trayendo tu propuesta al Lab…</h2><p>No estamos leyendo tu conversación; sólo el borrador que decidiste guardar.</p></section>;
  if (projectState === "error") return <section className="builder-project-state is-error" role="alert"><span>!</span><p className="kicker">BORRADOR NO DISPONIBLE</p><h2>No pudimos abrir esta propuesta.</h2><p>El enlace puede estar incompleto, haber expirado o la bandeja compartida puede estar temporalmente fuera de servicio.</p><button type="button" className="builder-project-new" onClick={() => window.location.assign("/?product=builder")}>Volver a Construir mi propio producto</button></section>;
  if (projectState === "ready" && project) return <ProjectDraftPreview project={project} onHow={() => onGuide("how")} />;
  return <section className="builder-phone-empty" aria-label="Vista previa de proyecto en construcción">
    <div className="builder-phone-art" aria-hidden="true"><span>✦</span><i /><i /><i /></div>
    <p className="kicker">LAB DE PRODUCTO · TU ZONA DE EXPERIMENTOS</p>
    <h2>Tu idea entra acá.<br /><span>Tu producto empieza a tomar forma.</span></h2>
    <p className="builder-main-copy">Conecta tu IA, conversa, manda referencias o dibujos y trae al Lab sólo la versión que decidas guardar como borrador.</p>
    <div className="builder-promise"><b>Este teléfono es editable por propuesta.</b><span>El resto del Lab queda intacto mientras exploras.</span></div>
    <div className="builder-connect-grid" aria-label="Elegir una guía de IA">
      <button onClick={() => onGuide("chatgpt")} data-event-id="builder_guide_viewed" data-client="chatgpt"><span>01</span><strong>Ver guía para<br />ChatGPT</strong><small>Piloto disponible</small></button>
      <button onClick={() => onGuide("claude")} data-event-id="builder_guide_viewed" data-client="claude"><span>02</span><strong>Ver guía para<br />Claude</strong><small>Piloto disponible</small></button>
      <button onClick={() => onGuide("codex")} data-event-id="builder_guide_viewed" data-client="codex"><span>03</span><strong>Ver guía para<br />Codex</strong><small>Configuración remota segura</small></button>
    </div>
    <div className="builder-idea-examples"><small>DESPUÉS, PUEDES PARTIR ASÍ</small><p>“Diseña una tarjeta de crédito con beneficios para la gente que come siempre afuera.”</p><p>“Quiero resolver un problema de viajes con amigos. Te mando una referencia.”</p></div>
    <button className="builder-how-button" onClick={() => onGuide("how")} data-event-id="builder_how_viewed">Cómo ocupar <span>→</span></button>
    <small className="builder-phone-disclaimer">YOL1 no lee tu conversación ni publica nada automáticamente. La propuesta pasa a revisión cuando tú decides traerla al Lab.</small>
  </section>;
}

function ProjectDraftPreview({ project, onHow }: { project: SharedProjectDraft; onHow: () => void }) {
  const sheetSections = [
    ["HECHOS CONOCIDOS", project.productSheet.knownFacts],
    ["APORTES DE LA PERSONA", project.productSheet.userContributions],
    ["DATOS NECESARIOS", project.productSheet.dataNeeds],
    ["CONDICIONES CLAVE", project.productSheet.keyConditions],
    ["ENCAJE TECNOLÓGICO", project.productSheet.technologyFit],
    ["CONTINUIDAD YOL1", project.productSheet.continuityLinks],
    ["DECISIONES PENDIENTES", project.productSheet.pendingDecisions],
  ] as const;
  const hasProductSheet = sheetSections.some(([, items]) => items.length > 0);
  return <section className="builder-project-preview" aria-label={`Borrador ${project.title}`}>
    <div className="builder-project-status"><span>PROPUESTA TRAÍDA AL LAB</span><b>En borrador</b></div>
    <p className="kicker">CONSTRUIR MI PROPIO PRODUCTO</p>
    <h2>{project.title}</h2>
    <p className="builder-project-idea">{project.idea}</p>
    <div className="builder-project-facts">
      <article><small>PROBLEMA</small><p>{project.problem}</p></article>
      <article><small>PARA QUIÉN</small><p>{project.audience}</p></article>
      <article><small>PROPUESTA DE VALOR</small><p>{project.valueProposition}</p></article>
    </div>
    {(project.assumptions.length > 0 || project.openQuestions.length > 0) && <div className="builder-project-columns">
      {project.assumptions.length > 0 && <article><small>SUPUESTOS</small><ul>{project.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></article>}
      {project.openQuestions.length > 0 && <article><small>PREGUNTAS ABIERTAS</small><ul>{project.openQuestions.map((item) => <li key={item}>{item}</li>)}</ul></article>}
    </div>}
    {hasProductSheet && <details className="builder-product-sheet"><summary><span>FICHA DE PRODUCTO</span><b>Ver lo aprendido +</b></summary><div>{sheetSections.filter(([, items]) => items.length > 0).map(([title, items]) => <article key={title}><small>{title}</small><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></details>}
    <button className="builder-how-button" onClick={onHow}>Cómo seguir mejorándola <span>→</span></button>
    <a className="builder-technical-link" href="#builder-technical-panel">Ver decisiones y base técnica <span>↓</span></a>
    <button type="button" className="builder-project-new" onClick={() => window.location.assign("/?product=builder")}>Empezar otra idea</button>
    <small className="builder-phone-disclaimer">Este enlace muestra un borrador compartido por 90 días. No está publicado y no cambió ninguna otra pantalla del Lab.</small>
  </section>;
}

function BuilderOrientationPanel() {
  const examples = [
    { title: "Explicar una compra rechazada", prompt: "Quiero mejorar cómo YOL1 explica una compra con tarjeta rechazada y guía a la persona para resolverla sin angustia." },
    { title: "Encontrar beneficios útiles", prompt: "Quiero que una persona entienda dónde le conviene usar los beneficios de YOL1 cerca de ella, sin prometer descuentos no confirmados." },
    { title: "Simplificar un pago recurrente", prompt: "Quiero explorar una forma simple y segura de preparar el pago de una cuenta o cuota recurrente, como propuesta y no como pago real." },
    { title: "Ordenar el mes financiero", prompt: "Quiero ayudar a una persona a ordenar sus tareas financieras del mes y decidir cuál atender primero." },
  ];
  const [selectedExample, setSelectedExample] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText(examples[selectedExample].prompt);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };
  const qa = [
    { title: "¿Se siente YOL1?", good: "Usa el lenguaje, navegación y sistema visual vigentes.", improve: "Parece una plantilla genérica o cambia el look & feel." },
    { title: "¿Es honesto?", good: "Separa hechos, propuestas y puntos por validar junto a cada afirmación.", improve: "Promete pagos, beneficios, integraciones o resultados sin evidencia." },
    { title: "¿Funciona más allá del caso feliz?", good: "Incluye vacío, carga, error, reintento y recuperación cuando corresponde.", improve: "Sólo muestra el camino ideal y deja a la persona sin salida." },
    { title: "¿Deja una decisión clara?", good: "Termina con una pregunta simple que mejora la próxima versión.", improve: "Entrega muchas preguntas o una ficha técnica sin prioridad." },
  ];
  return <section className="builder-orientation" aria-labelledby="builder-orientation-title">
    <header className="builder-orientation-head">
      <div><p className="eyebrow">ANTES DE CONSTRUIR</p><h2 id="builder-orientation-title">Empieza con una idea.<br /><span>YOL1 te ayuda a darle forma.</span></h2></div>
      <p>No necesitas preparar un brief ni saber de diseño o tecnología. Describe una necesidad: recibirás una primera propuesta visual para conversar, probar y mejorar.</p>
    </header>
    <div className="builder-orientation-steps" aria-label="Recorrido para construir un producto">
      <article><span>01</span><strong>Cuenta la idea</strong><p>Una frase, una foto, un dibujo o una referencia es suficiente para empezar.</p></article>
      <article><span>02</span><strong>Recibe una propuesta</strong><p>La IA muestra el flujo y declara los supuestos sin frenarte con un formulario.</p></article>
      <article><span>03</span><strong>Mejora conversando</strong><p>Pide cambios concretos y revisa una iteración visual en cada vuelta.</p></article>
      <article><span>04</span><strong>Guarda si tiene forma</strong><p>Sólo una confirmación explícita crea un borrador revisable en el Lab.</p></article>
    </div>
    <div className="builder-orientation-grid">
      <section className="builder-example-lab" aria-labelledby="builder-examples-title">
        <p className="eyebrow">PRUEBA CON UN EJEMPLO</p><h3 id="builder-examples-title">No necesitas encontrar las palabras perfectas.</h3>
        <div className="builder-example-tabs" role="list">{examples.map((example, index) => <button key={example.title} type="button" className={selectedExample === index ? "selected" : ""} onClick={() => { setSelectedExample(index); setCopyState("idle"); }} aria-pressed={selectedExample === index}>{example.title}</button>)}</div>
        <div className="builder-example-ready"><small>MENSAJE LISTO PARA CHATGPT, CLAUDE O CODEX</small><p>{examples[selectedExample].prompt}</p><button type="button" onClick={copyExample}>{copyState === "copied" ? "Mensaje copiado ✓" : "Copiar este ejemplo"}</button>{copyState === "failed" && <span role="alert">No se pudo copiar. Selecciona el texto manualmente.</span>}</div>
      </section>
      <aside className="builder-receive-card"><p className="eyebrow">QUÉ VAS A RECIBIR</p><h3>Una propuesta para decidir, no una caja negra.</h3><ul><li><b>Una vista interactiva</b><span>El producto aparece primero, listo para recorrer.</span></li><li><b>Supuestos y riesgos visibles</b><span>Lo no confirmado se muestra donde importa.</span></li><li><b>Alternativas y recuperación</b><span>No se diseña sólo el caso feliz.</span></li><li><b>Una próxima decisión</b><span>Una pregunta simple para mejorar la siguiente versión.</span></li></ul></aside>
    </div>
    <section className="builder-qa" aria-labelledby="builder-qa-title"><header><div><p className="eyebrow">QA ANTES DE MOSTRARTE UNA VERSIÓN</p><h3 id="builder-qa-title">YOL1 revisa esto contigo.</h3></div><p>La IA aplica este control silenciosamente. Puedes abrir cada criterio para entender qué debería cuidar.</p></header><div>{qa.map((item, index) => <details key={item.title} open={index === 0}><summary>{item.title}<span>+</span></summary><section><p><b>Bien resuelto</b>{item.good}</p><p><b>Necesita mejorar</b>{item.improve}</p></section></details>)}</div></section>
    <footer className="builder-orientation-limits"><p className="eyebrow">LÍMITES HONESTOS</p><div><p><b>Tu conversación no se sincroniza automáticamente.</b> El MCP entrega contexto, pero no copia el chat ni controla tu cuenta.</p><p><b>Nada se publica solo.</b> Guardar conserva únicamente el resumen estructurado que tú confirmes como borrador.</p><p><b>Los artefactos viven en tu cliente.</b> ChatGPT, Claude o Codex pueden generarlos si esa función está disponible; no se instalan dentro del MCP.</p></div></footer>
  </section>;
}

function BuilderGuideScreen({ guide, onBack }: { guide: Exclude<BuilderGuide, null>; onBack: () => void }) {
  const screenRef = useRef<HTMLElement>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "url" | "config" | "repair" | "prompt" | "failed">("idle");
  const isHow = guide === "how";
  const isCodex = guide === "codex";
  const provider = guide === "chatgpt" ? "ChatGPT" : guide === "claude" ? "Claude" : "Codex";
  const providerPath = guide === "claude" ? "Settings → Connectors → Add custom connector" : guide === "codex" ? "Settings → MCP servers → Add server" : "Settings → Apps → Advanced settings → Developer mode";
  const newChatDestination = guide === "claude" ? "un chat nuevo en Cowork" : guide === "codex" ? "una tarea nueva" : "un chat nuevo";
  const copyUrl = async () => {
    try { await navigator.clipboard.writeText(YOL1_MCP_URL); setCopyStatus("url"); } catch { setCopyStatus("failed"); }
  };
  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(BUILDER_START_MESSAGE); setCopyStatus("prompt"); } catch { setCopyStatus("failed"); }
  };
  const copyCodexConfig = async () => {
    try { await navigator.clipboard.writeText(CODEX_MCP_CONFIG); setCopyStatus("config"); } catch { setCopyStatus("failed"); }
  };
  const copyCodexRepair = async () => {
    try { await navigator.clipboard.writeText(CODEX_MCP_REPAIR); setCopyStatus("repair"); } catch { setCopyStatus("failed"); }
  };
  useEffect(() => { screenRef.current?.closest(".app-content")?.scrollTo({ top: 0 }); }, [guide]);
  if (isHow) return <section ref={screenRef} className="builder-how-screen" aria-label="Cómo ocupar YOL1 MCP">
    <button className="back-link" onClick={onBack}>← Volver</button>
    <p className="kicker">CÓMO SACARLE PROVECHO</p><h2>Parte simple.<br /><span>Mejora en conjunto.</span></h2>
    <div className="builder-demo-window" aria-label="Demostración de una conversación externa y una pantalla incorporada manualmente">
      <div className="builder-demo-head"><span>CHAT EXTERNO · EJEMPLO</span><i /><i /><i /></div>
      <div className="builder-demo-chat"><p className="user">“Diseña una tarjeta de crédito con beneficios para comer afuera.”</p><p className="assistant">¿Para quién, en qué momento y qué beneficio debería importar primero?</p><p className="tool">↳ Trae una foto, un link o un dibujo si tienes una referencia.</p></div>
      <div className="builder-demo-preview"><small>BORRADOR EN EL LAB</small><strong>Tarjeta para<br />salir a comer</strong><span>Propuesta revisable · no publicada</span></div>
    </div>
    <ol className="builder-how-list"><li><strong>Describe la idea en simple.</strong> Puedes partir con una necesidad, no con una solución perfecta.</li><li><strong>Déjate guiar.</strong> La IA pregunta por persona, momento, pantalla y límite antes de dibujar.</li><li><strong>Manda referencias.</strong> Una foto, link, croquis o comentario como “haz el botón más visible” acelera la iteración.</li><li><strong>Revisa el borrador.</strong> Lo que veas en Construir es una propuesta, no un cambio al resto del Lab.</li><li><strong>Envía cuando tenga forma.</strong> La publicación y cualquier integración se revisan por separado.</li></ol>
    <div className="builder-example-prompt"><small>EJEMPLO PARA PROBAR</small><p>“Diseña un producto de tarjeta de crédito que tenga beneficios para comer afuera. Parte preguntándome lo mínimo para entender a quién ayuda y muéstrame una primera versión.”</p></div>
    <small className="builder-install-note">La conversación no se sincroniza con YOL1. El teléfono muestra únicamente una propuesta que decidas incorporar de forma explícita.</small>
  </section>;
  return <section ref={screenRef} className="builder-install-screen" aria-label={`Guía de YOL1 para ${provider}`}>
    <button className="back-link" onClick={onBack}>← Volver</button>
    <p className="kicker">CONFIGURACIÓN ÚNICA · {provider.toUpperCase()}</p><h2>Conecta.<br /><span>Habla. Construye.</span></h2>
    <p className="builder-guide-intro">Conecta YOL1 una sola vez. Después sólo necesitas contar tu idea con tus propias palabras: YOL1 carga el contexto y las reglas sin pedirte conocimientos técnicos.</p>
    <div className="builder-install-steps">
      <article><span>01</span><div><strong>{isCodex ? "Abre MCP servers" : "Busca Conectores / MCP"}</strong><small>En {provider}, abre <b>{providerPath}</b>. {isCodex ? "Esta ruta evita editar archivos manualmente." : "Si el nombre cambia, busca “connector”, “MCP” o “custom integration”."}</small></div><i className="guide-ui guide-menu" aria-hidden="true"><b /><b /><b /></i></article>
      <article><span>02</span><div><strong>{isCodex ? "Elige Streamable HTTP" : "Pega solo estos dos campos"}</strong><small><b>Nombre:</b> YOL1<br /><b>URL:</b> <code>{YOL1_MCP_URL}</code><br />{isCodex ? <><b>No elijas STDIO ni pegues la URL en command.</b> Si comienza con https://, siempre va en URL.</> : "No agregues argumentos, environment ni working directory."}</small></div><i className="guide-ui guide-connector" aria-hidden="true">＋</i></article>
      <article><span>03</span><div><strong>Guarda y abre {newChatDestination}</strong><small>{isCodex ? <>Pulsa <b>Restart</b>. En la tarea nueva, abre <b>/mcp</b> y confirma que YOL1 esté conectado antes de pegar el mensaje.</> : <>Habilita <b>YOL1</b> y pega el mensaje activador que aparece abajo. Después cuenta tu idea y sigue los pasos: YOL1 te irá guiando hasta una primera propuesta.</>}</small></div><i className="guide-ui guide-link" aria-hidden="true">YOL1</i></article>
    </div>
    {isCodex && <section className="codex-ready-check" aria-label="Resultado esperado de la conexión YOL1"><small>RESULTADO ESPERADO</small><strong>YOL1 · conectado · 7 herramientas</strong><p>En <b>/mcp</b> debe aparecer como <code>streamable_http</code>. Si ves <code>stdio</code> o una URL dentro de <code>command</code>, todavía no quedó bien instalado.</p></section>}
    {isCodex && <div className="codex-help-stack">
      <details className="codex-config-fallback"><summary>Instalar con config.toml <span>+</span></summary><div><p>Pega este bloque exacto en <code>~/.codex/config.toml</code>. Para esta URL remota la clave correcta es <b>url</b>, nunca <b>command</b>.</p><pre>{CODEX_MCP_CONFIG}</pre><button type="button" onClick={copyCodexConfig}>{copyStatus === "config" ? "Configuración copiada ✓" : "Copiar configuración Codex"}</button></div></details>
      <details className="codex-config-fallback codex-repair"><summary>Ya lo instalé y no aparece <span>+</span></summary><div><p>Esto elimina sólo la entrada YOL1 mal configurada y la vuelve a registrar como servidor remoto con la CLI oficial.</p><pre>{CODEX_MCP_REPAIR}</pre><button type="button" onClick={copyCodexRepair}>{copyStatus === "repair" ? "Reparación copiada ✓" : "Copiar reparación segura"}</button></div></details>
    </div>}
    <button className="builder-copy-url" onClick={copyUrl}>{copyStatus === "url" ? "URL MCP copiada ✓" : "Copiar URL de YOL1"}</button>
    <a className="builder-open-lab" href={`${YOL1_SITE_URL}/?product=builder`} target="_blank" rel="noreferrer">Abrir la vista del Lab ahora ↗</a>
    <div className="builder-paste-box"><small>04 · PEGA ESTA FRASE PARA ACTIVAR YOL1</small><p>{BUILDER_START_MESSAGE}</p></div>
    <button className="builder-copy-template" onClick={copyPrompt}>{copyStatus === "prompt" ? "Mensaje de inicio copiado ✓" : "Copiar mensaje de inicio"}</button>
    {copyStatus === "failed" && <small className="builder-copy-status" role="alert">No pudimos copiar. Selecciona el contenido correspondiente y cópialo manualmente.</small>}
    <small className="builder-install-note">{isCodex ? "Codex comparte la configuración entre la app, CLI y extensión del mismo host. Una tarea ya abierta puede conservar las herramientas anteriores: después de Restart, comienza una nueva." : "No necesitas renombrar el conector ni instalar “v0.2”."} YOL1 no lee tu conversación ni recibe cambios automáticamente. El Lab muestra solo una propuesta que decidas enviar a revisión.</small>
  </section>;
}

function ProjectSubmitPanel({ open, onToggle, onSubmitted }: { open: boolean; onToggle: () => void; onSubmitted: () => void }) {
  const [idea, setIdea] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [fit, setFit] = useState("");
  const [notice, setNotice] = useState("");
  const [lastDraftId, setLastDraftId] = useState<string | null>(null);

  const submitProject = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !title.trim() || !purpose.trim() || !fit.trim()) return;
    const message = `${title.trim()}\n\nBusca hacer: ${purpose.trim()}\n\nPor qué tiene sentido con YOL1: ${fit.trim()}\n\nIdea de trabajo: ${idea.trim() || "Sin idea inicial adjunta."}`.slice(0, 700);
    const record = localFeedbackIntake.submit({ product: "Construir mi propio producto", screen: "Propuesta de producto", kind: "idea", message, topics: `Propuesta de ${name.trim()}` });
    onSubmitted();
    setLastDraftId(record.id);
    setNotice("Borrador guardado sólo en este navegador. No se envió a una bandeja compartida.");
    setName(""); setTitle(""); setPurpose(""); setFit(""); setIdea("");
  };
  const removeLastDraft = () => {
    if (!lastDraftId) return;
    localFeedbackIntake.remove(lastDraftId);
    setLastDraftId(null);
    setNotice("Borrador local eliminado de este navegador.");
  };

  return <section className={`project-submit-panel ${open ? "is-open" : ""}`} aria-label="Preparar proyecto para revisión local">
    {!open ? <button className="project-submit-trigger" onClick={onToggle}>Enviar proyecto <span>→</span></button> : <>
      <header><div><small>CUANDO YA TENGA FORMA</small><h2>Prepáralo para revisión.</h2></div><button onClick={onToggle} aria-label="Cerrar formulario">×</button></header>
      <form onSubmit={submitProject}>
        <label>Tu nombre<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Cómo te identificamos" maxLength={80} required /></label>
        <label>Nombre o título del proyecto<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej.: Viajes sin cuentas pendientes" maxLength={120} required /></label>
        <label>¿Qué busca hacer?<textarea value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="Qué problema resuelve y para quién" maxLength={500} required /></label>
        <label>¿Por qué tiene sentido con YOL1?<textarea value={fit} onChange={(event) => setFit(event.target.value)} placeholder="Cómo conecta con la propuesta de valor" maxLength={500} required /></label>
        <label className="project-optional">Resumen editorial o referencia que decidiste copiar <textarea value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Opcional: resumen, link o decisiones abiertas; no pegues el chat completo ni datos sensibles" maxLength={700} /></label>
        <button className="project-submit-action">Guardar borrador local</button>
      </form>
      <p>En este prototipo, guardar conserva un borrador sólo en el almacenamiento local de este navegador. No publica, crea branch, sincroniza el chat ni cambia una pantalla automáticamente.</p>
      {notice && <p className="project-submit-notice" role="status">{notice}</p>}
      {lastDraftId && <button className="project-submit-undo" type="button" onClick={removeLastDraft}>Borrar este borrador local</button>}
    </>}
  </section>;
}

function ResearchStage({ product, stateIndex }: { product: ProductDefinition; stateIndex: number }) {
  const stageLabel = maturityLabel(product);
  const availabilityLabel = product.maturity === "paused" ? "SIN TRABAJO ACTIVO" : "SIN FLUJO DISPONIBLE";
  return <section className="research-stage" aria-label={`${product.name}, en investigación`}>
    <span className="research-halo" aria-hidden="true" />
    <div className="research-phone" aria-label={`${product.name} en investigación`}>
      <div className="research-notch" />
      <header><Brand compact /><span>{product.name} · {stageLabel}</span><small>{availabilityLabel}</small></header>
      <ResearchProduct product={product} stateIndex={stateIndex} />
    </div>
  </section>;
}

function ResearchProduct({ product, stateIndex }: { product: ProductDefinition; stateIndex: number }) {
  const fixedState: Record<Exclude<ProductId, "companion">, number> = { kyc: 1, banking: 0, cards: 2, remittances: 5, builder: 3 };
  const empty = EMPTY_STATE_LIBRARY[fixedState[product.id as Exclude<ProductId, "companion">] ?? (stateIndex % EMPTY_STATE_LIBRARY.length)];
  const stageLabel = maturityLabel(product);
  const availabilityLabel = product.maturity === "paused" ? "SIN TRABAJO ACTIVO" : "SIN FLUJO DISPONIBLE";
  return <section className={`product-empty product-${product.id} gesture-${empty.gesture}`} aria-label={`${product.name}, en investigación`}>
    <div className="empty-status"><span>{stageLabel}</span><small>{availabilityLabel}</small></div>
    <div className="empty-gesture" aria-hidden="true">
      {empty.gesture === "dog" ? <div className="tail-dog"><i className="dog-ear" /><i className="dog-eye" /><i className="dog-body" /><i className="dog-tail" /><i className="dog-paw" /></div> : empty.gesture === "cat" ? <div className="typing-cat"><i className="cat-head" /><i className="cat-ear left" /><i className="cat-ear right" /><i className="cat-eye left" /><i className="cat-eye right" /><i className="cat-paw left" /><i className="cat-paw right" /><i className="cat-keyboard" /></div> : empty.gesture === "robot" ? <div className="idea-robot"><i className="robot-head" /><i className="robot-eye left" /><i className="robot-eye right" /><i className="robot-arm left" /><i className="robot-arm right" /><i className="robot-note note-one" /><i className="robot-note note-two" /><i className="robot-note note-three" /></div> : empty.gesture === "coffee" ? <img className="empty-photo" src="/felipe-coffee-break.png" alt="Máquina de café en pausa" /> : <span>{empty.icon}</span>}
    </div>
    <p className="kicker">{empty.eyebrow}</p>
    <h2>{empty.title}</h2>
    <p>{empty.body}</p>
  </section>;
}

function MessagePreviewScreen({ preview, theme, onBack }: { preview: MessagePreview; theme: Theme; onBack: () => void }) {
  const initialMessage = preview.direction === "collect"
    ? `Hola ${preview.name}, tengo pendiente ${preview.amount} por ${preview.expense}. Este es un texto de ejemplo: todavía no envié una solicitud ni un enlace de pago.`
    : `Hola ${preview.name}, tengo pendiente pagarte ${preview.amount} por ${preview.expense}. Este es un texto de ejemplo: todavía no inicié un pago.`;
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
        <button onClick={() => setCopyNotice("Este es solo un texto de ejemplo. No usamos el portapapeles ni abrimos otra app.")}>Ver texto de ejemplo</button>
      </div>
      {copyNotice && <p className="message-copy-notice" role="status">{copyNotice}</p>}
      <p className="message-production-note">En producción, compartir requeriría tu consentimiento explícito, un link generado en servidor y un partner de pagos autorizado.</p>
    </section>
  </main>;
}

function FeedbackPanel({ product, screen, open, onToggle, variant, compact = false, onSubmitted }: { product: string; screen: string; open: boolean; onToggle: () => void; variant: "desktop" | "mobile"; compact?: boolean; onSubmitted: () => void }) {
  const [kind, setKind] = useState<FeedbackKind>("like");
  const [message, setMessage] = useState("");
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
    const input = { product, screen, kind, message: message.trim(), topics: "" };
    localFeedbackIntake.submit(input);
    onSubmitted();
    setSubmitting(true);
    try {
      const shared = await submitGeneralFeedback({ screen: `${product} · ${screen}`, kind, message: message.trim(), topics: "" });
      setConfirmation(shared ? `Enviado a la bandeja compartida · ${screen}` : `Guardado localmente · ${screen}`);
    } catch {
      setConfirmation(`Guardado en este navegador; la bandeja compartida aún no está disponible.`);
    } finally {
      setSubmitting(false);
    }
    setMessage("");
  };

  const panelHeading = <>
      <span className="feedback-mark">✦</span>
      <span><small>{compact ? "TENGO UNA IDEA" : "TU OPINIÓN IMPORTA"}</small><strong>{compact ? "Déjala aquí" : "Deja tu feedback acá."}</strong></span>
      {variant === "mobile" && <b>{open ? "−" : "+"}</b>}
    </>;

  return <aside className={`feedback-panel feedback-${variant} ${open ? "feedback-open" : "feedback-closed"}`} data-instrumentation-ignore="true" aria-label="Feedback del Product Growth Lab">
    {variant === "desktop" ? <div className="feedback-panel-head">{panelHeading}</div> : <button className="feedback-panel-head" onClick={onToggle} aria-expanded={open}>{panelHeading}</button>}
    {!open && <p className="feedback-peek">Estás viendo <strong>{screen}</strong>. Cuéntanos qué funciona y qué cambiarías.</p>}
    {open && <form className="feedback-form" onSubmit={submitFeedback}>
      {!compact && <><p className="feedback-select-label">Selecciona qué quieres dejar</p><div className="feedback-kinds" aria-label="Tipo de feedback">{([
        ["like", "Me gusta"],
        ["improve", "Mejoraría"],
        ["idea", "Idea"],
      ] as [FeedbackKind, string][]).map(([value, label]) => <button type="button" key={value} className={kind === value ? "selected" : ""} onClick={() => { setKind(value); setConfirmation(""); }}>{label}</button>)}</div></>}
      <label>{compact ? "¿Qué producto o problema deberíamos trabajar?" : prompts[kind].label}<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={compact ? "Ej.: Quiero una forma simple de…" : prompts[kind].placeholder} required={compact || requiresMessage} maxLength={700} /></label>
      {!compact && <p className="feedback-privacy">Se guarda para revisión por parte del equipo creador. No incluyas datos financieros ni personales.</p>}
      <button className="feedback-submit" type="submit" disabled={submitting || ((compact || requiresMessage) && !message.trim())}>{submitting ? "Enviando…" : compact ? "Guardar idea" : "Enviar feedback"}</button>
      {confirmation && <p className="feedback-confirmation" role="status">✓ {confirmation}</p>}
    </form>}
  </aside>;
}

function NavButton({ icon, label, current, onClick }: { icon: string; label: string; current: boolean; onClick: () => void }) {
  return <button className={current ? "nav-active" : ""} data-event-id="companion_navigation_selected" data-destination={label} onClick={onClick}><span aria-hidden="true">{icon}</span><small>{label}</small></button>;
}

function Start({ archived, onArchive, onRestore, onMove, onCollect, onLedger, onNotice }: { archived: string[]; onArchive: (id: string, label: string) => void; onRestore: (id: string) => void; onMove: (target: Tab) => void; onCollect: (expense?: string) => void; onLedger: (filter?: string, selected?: string) => void; onNotice: (message: string) => void }) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: "welcome", role: "assistant", text: "Hola. Puedo ayudarte a entender el mes, ordenar pendientes o revisar una oportunidad del ejemplo.", mode: "demo" }]);
  const [chatBusy, setChatBusy] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(false);
  // La demo debe estar disponible desde el primer render. Si el servidor confirma
  // que existe IA configurada, recién entonces se ofrece la elección informada.
  const [aiChoice, setAiChoice] = useState<"pending" | "ai" | "demo">("demo");
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
        setAiChoice(configured && storedChoice === "ai" ? "ai" : "demo");
      })
      .catch(() => setAiChoice("demo"));
  }, []);
  const actionCards = [
    { id: "disney", tag: "CARGO DUDOSO", title: "Disney+ aparece dos veces", detail: "Mismo monto · 1 minuto", amount: "$11.990", tone: "alert", actions: [{ label: "Ignorar", run: () => onArchive("disney", "Disney+") }, { label: "Revisar", run: () => onLedger("General", "disney-bci") }] },
    { id: "maria", tag: "POR COBRAR", title: "María te debe del almuerzo", detail: "Pendiente desde el viernes", amount: "$18.000", tone: "social", actions: [{ label: "Preparar cobro", run: () => onMove("cobrar") }, { label: "Ignorar", run: () => onArchive("maria", "Cobro de María") }] },
    { id: "camila", tag: "POR PAGAR", title: "Le debes a Camila", detail: "Depto agosto · @camila", amount: "$42.000", tone: "social", actions: [{ label: "Preparar pago", run: () => onMove("cobrar") }, { label: "Ignorar", run: () => onArchive("camila", "Deuda con Camila") }] },
    { id: "benefit", tag: "BENEFICIO", title: "Tu tarjeta tiene restaurantes con descuento", detail: "BCI Visa · ejemplo de esta semana", amount: "20%", tone: "benefit", actions: [{ label: "Ignorar", run: () => onArchive("benefit", "Beneficio") }, { label: "Revisar", run: () => onMove("ahorrar") }] },
    { id: "liguria", tag: "PARA DIVIDIR", title: "La cuenta de Liguria parece compartida", detail: "Boleta mayor a tu consumo habitual", amount: "$41.600", tone: "split", actions: [{ label: "Ignorar", run: () => onArchive("liguria", "Cuenta de Liguria") }, { label: "Revisar", run: () => onLedger("General", "liguria") }, { label: "Preparar reparto", run: () => onCollect("Liguria") }] },
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
    <section className="home-value"><h2>Entiende tus finanzas.<br /><span>Simplifica tu vida.</span></h2></section>
    <div className="home-section-title"><div><h3>Tienes {visibleCards.length === 1 ? "una cosa" : `${visibleCards.length} cosas`} para revisar</h3></div>{visibleCards.length > 0 && <small>{carouselIndex + 1} de {visibleCards.length}</small>}</div>
    {visibleCards.length ? <><div className="action-carousel" aria-label="Acciones pendientes" ref={carouselRef} onScroll={(event) => {
      const container = event.currentTarget;
      const firstCard = container.firstElementChild as HTMLElement | null;
      const step = (firstCard?.offsetWidth ?? container.clientWidth) + 10;
      setCarouselIndex(Math.min(visibleCards.length - 1, Math.max(0, Math.round(container.scrollLeft / Math.max(step, 1)))));
    }}>
      {visibleCards.map((card) => <article className={`action-card action-${card.tone}`} key={card.id}>
        <div className="action-card-top"><span>{card.tag}</span><b>{card.amount}</b></div><h3>{card.title}</h3><p>{card.detail}</p>
        <div className="action-buttons">{card.actions.map((action) => <button key={action.label} onClick={action.run}>{action.label}</button>)}</div>
      </article>)}
    </div><div className="carousel-dots" aria-label={`Pendiente ${carouselIndex + 1} de ${visibleCards.length}`}>{visibleCards.map((card, index) => <button key={card.id} className={index === carouselIndex ? "active" : ""} onClick={() => (carouselRef.current?.children[index] as HTMLElement | undefined)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })} aria-label={`Ver pendiente ${index + 1}: ${card.title}`} />)}</div></> : <div className="all-clear"><strong>Todo revisado por ahora.</strong><span>Puedes seguir preguntándole a YOL1.</span></div>}
    {archivedLabels.length > 0 && <div className="reviewed-strip"><span>✓ {archivedLabels.length} {archivedLabels.length === 1 ? "revisada" : "revisadas"} en esta sesión</span><button onClick={() => onRestore(archivedLabels[archivedLabels.length - 1].id)}>Deshacer última</button></div>}

    <section className="finance-chat">
      <div className="chat-heading"><div><span className="chat-orb">Y</span><div><h3>Pregúntale a YOL1</h3><small>Cuéntame un poco más de tus finanzas y las analizamos juntos.</small></div></div></div>
      {aiConfigured && aiChoice === "pending" && <div className="chat-consent"><strong>¿Cómo quieres conversar?</strong><p>Con IA, tu texto se procesa en OpenAI desde el servidor. La pregunta y respuesta pueden guardarse en la bandeja del Lab para revisión. No incluyas datos personales, claves ni finanzas reales.</p><div><button onClick={() => chooseAiMode("ai")}>Usar IA</button><button onClick={() => chooseAiMode("demo")}>Seguir en demo</button></div></div>}
      {aiConfigured && aiChoice !== "pending" && <button className="chat-mode-link" onClick={() => setAiChoice("pending")}>Cambiar modo · {aiChoice === "ai" ? "IA" : "demo"}</button>}
      <div className="chat-suggestions">{["¿Qué cambió este mes?", "¿A quién le debo?", "¿Quién me debe?", "¿Qué beneficio tengo?", "¿Cuánto podría ahorrar?", "¿Qué pasó con Disney+?"].map((suggestion) => <button key={suggestion} disabled={chatBusy || aiChoice === "pending"} onClick={() => answer(suggestion)}>{suggestion}</button>)}</div>
      <div className="chat-thread" aria-live="polite">{messages.slice(-8).map((message) => <article key={message.id} className={message.role}><p>{message.text}</p>{message.role === "assistant" && message.id !== "welcome" && <div className="chat-rating"><span>{message.mode === "ai" ? "IA" : message.mode === "knowledge" ? "APROBADA" : "DEMO"}</span><button className={message.feedback === "useful" ? "selected" : ""} onClick={() => rateAnswer(message, "useful")}>Útil</button><button className={message.feedback === "improve" ? "selected" : ""} onClick={() => rateAnswer(message, "improve")}>Mejoraría</button></div>}</article>)}{chatBusy && <p className="chat-thinking">YOL1 está pensando…</p>}</div>
      <form className="chat-compose" onSubmit={submitChat}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder={aiChoice === "pending" ? "Elige cómo conversar para empezar" : "Pregunta sobre tus finanzas…"} aria-label="Pregunta financiera" maxLength={700} disabled={chatBusy || aiChoice === "pending"} /><button type="submit" aria-label="Enviar pregunta" disabled={chatBusy || aiChoice === "pending"}>↑</button></form>
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
      const thirdAction: MovementAction | null = movement.ownTransfer || movement.name === "Disney+" ? null : movement.amount > 0 ? "Preparar cobro" : "Preparar reparto";
      const isReviewed = reviewed.includes(movement.id);
      return <article className={`movement${selected === movement.id ? " selected" : ""}${isReviewed ? " reviewed" : ""}`} key={movement.id}>
        <button className="row-main" onClick={() => setSelected(selected === movement.id ? null : movement.id)} aria-expanded={selected === movement.id}><time>{movement.date}<small>{movement.time}</small></time><span><strong>{movement.name}</strong><small className={movement.tone}>{movement.bank}</small>{isReviewed && <em>✓ Revisado</em>}</span><b className={movement.amount > 0 ? "positive" : ""}>{movement.amount > 0 ? "+" : "−"}{money.format(Math.abs(movement.amount))}</b></button>
        <p className={`movement-hint ${movement.tone}`}>{movement.hint}</p>
        <div className="row-actions"><button onClick={() => { if (isReviewed) { onUnreview(movement.id); onNotice(`${movement.name}: volvió a pendientes de revisión.`); } else onAction("Marcar revisado", movement); }}>{isReviewed ? "Deshacer" : "Marcar revisado"}</button><button onClick={() => reviewMovement(movement)}>Revisar</button>{thirdAction && <button onClick={() => onAction(thirdAction, movement)}>{thirdAction}</button>}</div>
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
      <section className="pending-lane"><div className="lane-heading"><div><small>POR COBRAR</small><strong>$228.000</strong></div><button onClick={() => setDraft({ ...initialDraft, step: 1 })}>＋ Nuevo gasto compartido</button></div><div className="pending-lane-track">{receivableRows.map((row) => <article className={selectedPending === row.id ? "pending-item pending-item-open" : "pending-item"} key={row.id}><button className="pending-main" onClick={() => setSelectedPending(selectedPending === row.id ? null : row.id)}><span className="pending-avatar">{row.name[0]}</span><span><strong>{row.name}</strong><small>{row.alias ? `${row.alias} · ` : ""}{row.meta}</small></span><b>{row.amount}</b></button>{selectedPending === row.id && <div className="pending-actions"><button onClick={() => onNotice(`Recordatorio preparado para ${row.name}. No se envió nada.`)}>Recordar</button><button onClick={() => onPreview({ name: row.name, alias: row.alias, amount: row.amount, expense: row.meta, direction: "collect" })}>Preparar cobro</button><button onClick={() => { setSettled([...settled, row.id]); setSelectedPending(null); onNotice(`${row.name}: pendiente marcado como resuelto. YOL1 buscará una coincidencia solo en las cartolas ficticias.`); }}>Marcar como resuelto</button></div>}</article>)}</div></section>
      <section className="pending-lane"><div className="lane-heading"><div><small>POR PAGAR</small><strong>$42.000</strong></div><button onClick={() => { setPayableDraftAdded(true); onNotice("Borrador de deuda pendiente guardado en esta sesión. No se cargó ni transfirió dinero."); }}>＋ Agregar deuda pendiente</button></div><div className="pending-lane-track">{payableDraftAdded && <div className="lane-state"><span>✓ Borrador guardado</span><button onClick={() => setPayableDraftAdded(false)}>Deshacer</button></div>}{payableRows.map((row) => <article className={selectedPending === row.id ? "pending-item pending-item-open" : "pending-item"} key={row.id}><button className="pending-main" onClick={() => setSelectedPending(selectedPending === row.id ? null : row.id)}><span className="pending-avatar">{row.name[0]}</span><span><strong>{row.name}</strong><small>{row.alias ? `${row.alias} · ` : ""}{row.meta}</small></span><b>{row.amount}</b></button>{selectedPending === row.id && <div className="pending-actions"><button onClick={() => onNotice(`Recordatorio personal creado para pagar a ${row.name}.`)}>Recordarme</button><button onClick={() => onPreview({ name: row.name, alias: row.alias, amount: row.amount, expense: row.meta, direction: "pay" })}>Preparar pago</button><button onClick={() => { setSettled([...settled, row.id]); setSelectedPending(null); onNotice(`${row.name}: pendiente marcado como resuelto; YOL1 revisará si aparece una coincidencia ficticia.`); }}>Marcar como resuelto</button></div>}</article>)}</div></section>
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

function EarnMore({ onBack }: { onBack: () => void }) {
  return <section className="empty-state earn-more"><span className="empty-icon">＋</span><p className="kicker">GANA MÁS LUCAS</p><h2>Ideas para ganar más,<br />sin vender humo.</h2><p>Este espacio va a ordenar oportunidades que sean relevantes para ti. Todavía no activa programas ni promete ingresos.</p><button className="primary-action" onClick={onBack}>Volver al acompañante</button></section>;
}

function Future({ votes, setVotes, onNotice }: { votes: Record<string, boolean>; setVotes: (votes: Record<string, boolean>) => void; onNotice: (message: string) => void }) {
  const capabilities = [
    { id: "alerts", title: "Alertas que tú controlas", detail: "Elegir qué señales importan y con qué frecuencia recibirlas." },
    { id: "compare", title: "Comparar con referencias agregadas", detail: "Solo existiría con muestra suficiente y población comparable visible." },
  ];
  return <><section className="future-heading"><p className="kicker">EXPERIMENTOS POR EXPLORAR</p><h2 className="compact-title">¿Qué te serviría<br />de verdad?</h2><p>Ideas para aprender antes de construir. No son roadmap ni capacidades disponibles.</p></section>{Object.values(votes).some(Boolean) && <p className="vote-state">✓ Tu interés queda marcado durante esta sesión</p>}<div className="roadmap-list">{capabilities.map((item, index) => <article key={item.id}><span className="experiment-number">0{index + 1}</span><div><span className="experiment-status">POR EXPLORAR</span><h3>{item.title}</h3><p>{item.detail}</p></div><button className={votes[item.id] ? "voted" : ""} onClick={() => { setVotes({ ...votes, [item.id]: !votes[item.id] }); onNotice(votes[item.id] ? "Feedback retirado en esta sesión." : "Feedback guardado durante esta sesión demo."); }}>{votes[item.id] ? "✓ Me interesa" : "Me interesa"}</button></article>)}</div><a className="knowledge-review-link" href="/review/knowledge"><span>INTERNO · CONTENIDO APROBADO</span><strong>Conocimiento del Lab</strong><small>Ver preguntas, variantes y fichas para mejorar →</small></a><section className="scope-box"><strong>Fuera de este MVP</strong><p>No estamos desarrollando banca, remesas, pagos reales ni una capa operativa de propuestas.</p></section></>;
}
