"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CollectionMessageKind, DebtDashboard, DebtSummary, SplitMode } from "../../lib/debt-center/types";
import { splitExpense } from "../../lib/debt-center/split";
import styles from "./cuentas-claras.module.css";
import overrides from "./cuentas-claras-overrides.module.css";
import waStyles from "./whatsapp-preview.module.css";
import { createExpenseDraftId, loadExpenseDraft, removeExpenseDraft, saveExpenseDraft, type ExpenseDraftV1 } from "../../lib/debt-center/draft-storage";
import { ONBOARDING_DEMO_STORAGE_KEY, parseOnboardingDemoSnapshot } from "../../lib/onboarding-demo-storage";
import { buildOnboardingHref } from "../../lib/onboarding-entry-contract";

type Tab = "home" | "groups" | "activity";
type Composer = "expense" | "group" | null;
type HandoffContext = { intent: "view_receivables" | "review_debt" | "review_reconciliation" | "create_expense"; returnHref: string };
type CollectionDraft = { debtId: string; messageKind: CollectionMessageKind };
type CollectionConfirmationDraft = CollectionDraft & { commandId: string };

const allowedCompanionReturns: Record<string, string> = {
  companion_inicio: "/?product=companion&tab=inicio",
  companion_finanzas: "/?product=companion&tab=finanzas",
  companion_cartola: "/?product=companion&tab=cartola",
  companion_cartola_liguria: "/?product=companion&tab=cartola&selected=liguria",
  companion_ahorrar: "/?product=companion&tab=ahorrar",
  companion: "/?product=companion",
};

function initialHandoff(): { handoff: HandoffContext | null; composer: Composer; debtId: string | null; expenseDraftId: string | null } {
  if (typeof window === "undefined") return { handoff: null as HandoffContext | null, composer: null as Composer, debtId: null as string | null, expenseDraftId: null };
  const params = new URLSearchParams(window.location.search);
  const resumeDraftId = params.get("intent") === "resume_draft" && /^draft_[a-f0-9]{32}$/.test(params.get("draftId") ?? "") ? params.get("draftId") : null;
  if (params.get("source") !== "companion") return { handoff: null, composer: resumeDraftId || params.get("new") === "expense" ? "expense" as Composer : null, debtId: null, expenseDraftId: resumeDraftId };
  const rawIntent = params.get("intent");
  const intent: HandoffContext["intent"] = rawIntent === "review_debt" || rawIntent === "review_reconciliation" || rawIntent === "create_expense" ? rawIntent : "view_receivables";
  const candidateDebtId = params.get("debtId");
  const candidateDraftId = /^draft_[a-f0-9]{32}$/.test(params.get("draftId") ?? "") ? params.get("draftId") : null;
  return {
    handoff: { intent, returnHref: allowedCompanionReturns[params.get("returnTo") ?? ""] ?? allowedCompanionReturns.companion },
    composer: intent === "create_expense" && params.get("new") === "expense" ? "expense" : null,
    debtId: intent === "review_debt" && candidateDebtId && /^debt_[a-z0-9_]+$/i.test(candidateDebtId) ? candidateDebtId : null,
    expenseDraftId: intent === "create_expense" ? candidateDraftId : null,
  };
}

const money = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const categoryLabel = { trip: "Viaje", home: "Casa", meal: "Comida", activity: "Actividad", monthly: "Mensual", other: "Otro" };
const splitModeLabel: Record<SplitMode, string> = { equal: "Partes iguales", amount: "Montos exactos", percentage: "Porcentaje", shares: "Partes proporcionales" };

function parseDigits(value: string) {
  return /^\d+$/.test(value) ? Number(value) : Number.NaN;
}

function parsePercentageBasisPoints(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!/^(?:100(?:\.0{1,2})?|\d{1,2}(?:\.\d{1,2})?)$/.test(normalized)) return Number.NaN;
  const [whole, decimal = ""] = normalized.split(".");
  return Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
}

function formatBasisPoints(value: number) {
  const whole = Math.floor(value / 100);
  const decimals = String(value % 100).padStart(2, "0").replace(/0+$/, "");
  return decimals ? `${whole},${decimals}` : String(whole);
}

function distributedIntegers(total: number, participantIds: string[]) {
  if (!participantIds.length) return {};
  const base = Math.floor(total / participantIds.length);
  const remainder = total - base * participantIds.length;
  return Object.fromEntries(participantIds.map((id, index) => [id, base + (index < remainder ? 1 : 0)]));
}

function nextMonthlyReviewDate() {
  const now = new Date();
  const day = Math.min(now.getDate(), 28);
  return new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, day)).toISOString().slice(0, 10);
}

function readableDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("es-CL", { day: "numeric", month: "long", timeZone: "UTC" });
}

function collectionMessageBody(debt: DebtSummary, messageKind: CollectionMessageKind) {
  return messageKind === "follow_up"
    ? `Hola ${debt.debtorName}, te vuelvo a compartir la cuenta de ${debt.expenseTitle}. En YOL1 quedan ${money.format(debt.outstandingAmount)} pendientes. Si algo no coincide, dime y lo revisamos.`
    : `Hola ${debt.debtorName}, te comparto el cobro demo de ${debt.expenseTitle} por ${money.format(debt.outstandingAmount)}.`;
}

function useDialogFocus(onClose: () => void, enabled = true, restoreFocus = true) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!enabled) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const triggerLabel = dialog.getAttribute("aria-labelledby") === "group-title" ? "grupo" : "gasto";
    const previousFocus = activeElement && !dialog.contains(activeElement)
      ? activeElement
      : [...document.querySelectorAll<HTMLButtonElement>("button")].find((button) => !dialog.contains(button) && button.textContent?.toLocaleLowerCase("es").includes(triggerLabel)) ?? null;
    const previousScrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;
    const anchorDialogToViewport = window.matchMedia("(max-width: 720px)").matches;
    if (anchorDialogToViewport && previousScrollY !== 0) window.scrollTo({ top: 0, behavior: "auto" });
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = anchorDialogToViewport ? "0px" : `-${previousScrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    const overlay = dialog.parentElement;
    const previousOverlayHeight = overlay?.style.height ?? "";
    const previousOverlayMaxHeight = overlay?.style.maxHeight ?? "";
    const previousOverlayBottom = overlay?.style.bottom ?? "";
    const fitOverlayToViewport = () => {
      if (!overlay) return;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const overlayTop = Math.max(0, overlay.getBoundingClientRect().top);
      const availableHeight = Math.max(0, Math.floor(viewportHeight - overlayTop));
      overlay.style.height = `${availableHeight}px`;
      overlay.style.maxHeight = `${availableHeight}px`;
      overlay.style.bottom = "auto";
    };
    fitOverlayToViewport();
    window.addEventListener("resize", fitOverlayToViewport);
    window.visualViewport?.addEventListener("resize", fitOverlayToViewport);
    window.visualViewport?.addEventListener("scroll", fitOverlayToViewport);
    const shell = overlay?.parentElement;
    const background = shell ? [...shell.children].filter((element) => element !== overlay) as HTMLElement[] : [];
    const previousBackground = background.map((element) => ({ element, inert: element.inert, hidden: element.getAttribute("aria-hidden") }));
    background.forEach((element) => { element.inert = true; element.setAttribute("aria-hidden", "true"); });
    const focusable = () => [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    queueMicrotask(() => (dialog.querySelector<HTMLElement>("[data-dialog-initial]") ?? focusable()[0])?.focus());
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); return; }
      const first = items[0];
      const last = items.at(-1) ?? first;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener("keydown", handleKey);
    return () => {
      dialog.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", fitOverlayToViewport);
      window.visualViewport?.removeEventListener("resize", fitOverlayToViewport);
      window.visualViewport?.removeEventListener("scroll", fitOverlayToViewport);
      if (overlay) {
        overlay.style.height = previousOverlayHeight;
        overlay.style.maxHeight = previousOverlayMaxHeight;
        overlay.style.bottom = previousOverlayBottom;
      }
      previousBackground.forEach(({ element, inert, hidden }) => {
        element.inert = inert;
        if (hidden === null) element.removeAttribute("aria-hidden"); else element.setAttribute("aria-hidden", hidden);
      });
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo({ top: previousScrollY, behavior: "auto" });
      queueMicrotask(() => {
        if (!shell?.querySelector('[role="dialog"]')) {
          previousBackground.forEach(({ element, inert, hidden }) => {
            element.inert = inert;
            if (hidden === null) element.removeAttribute("aria-hidden"); else element.setAttribute("aria-hidden", hidden);
          });
        }
        if (!restoreFocus) return;
        if (previousFocus?.isConnected && previousFocus !== document.body && previousFocus !== document.documentElement) previousFocus.focus();
        else document.querySelector<HTMLElement>("[data-focus-fallback]")?.focus();
      });
    };
  }, [enabled, restoreFocus]);
  return dialogRef;
}

function statusLabel(debt: DebtSummary) {
  if (debt.status === "paid") return "Pagado";
  if (debt.status === "partially_paid") return `Abonado · faltan ${money.format(debt.outstandingAmount)}`;
  return "Pendiente";
}

function collectionStatusLabel(debt: DebtSummary) {
  if (debt.collection.state === "closed") return "Cuenta cerrada";
  if (debt.collection.state === "partially_paid") return `Abonó ${money.format(debt.paidAmount)} · faltan ${money.format(debt.outstandingAmount)}`;
  if (debt.collection.state === "payment_started") return "Pago demo iniciado";
  if (debt.collection.state === "shared_by_creator") return "Compartido por ti · sin abono confirmado";
  return "Por compartir";
}

function ClearAccountsApp() {
  const initialContext = initialHandoff();
  const initialResumedDraft = typeof window === "undefined" ? null : loadExpenseDraft(initialContext.expenseDraftId);
  const [dashboard, setDashboard] = useState<DebtDashboard | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [composer, setComposer] = useState<Composer>(initialContext.expenseDraftId && !initialResumedDraft ? null : initialContext.composer);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(initialContext.debtId);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [preferredGroupId, setPreferredGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(initialContext.expenseDraftId && !initialResumedDraft ? "No pudimos recuperar ese borrador. Puedes crear uno nuevo sin perder otras cuentas." : "");
  const [search, setSearch] = useState("");
  const [shareDraft, setShareDraft] = useState<CollectionDraft | null>(null);
  const [shareConfirmation, setShareConfirmation] = useState<CollectionConfirmationDraft | null>(null);
  const [createdExpenseId, setCreatedExpenseId] = useState<string | null>(null);
  const [recurringSuggestionExpenseId, setRecurringSuggestionExpenseId] = useState<string | null>(null);
  const [recurringSourceExpenseId, setRecurringSourceExpenseId] = useState<string | null>(null);
  const [selectedRecurringTemplateId, setSelectedRecurringTemplateId] = useState<string | null>(null);
  const [reconciliationOpen, setReconciliationOpen] = useState(initialContext.handoff?.intent === "review_reconciliation");
  const [correctionExpenseId, setCorrectionExpenseId] = useState<string | null>(null);
  const [preparedDebtIds, setPreparedDebtIds] = useState<string[]>([]);
  const [handoff] = useState<HandoffContext | null>(initialContext.handoff);
  const [expenseDraftId, setExpenseDraftId] = useState(initialContext.expenseDraftId);
  const [resumedDraft, setResumedDraft] = useState<ExpenseDraftV1 | null>(initialResumedDraft);
  const workspaceRef = useRef<HTMLElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const focusCollectionNoticeRef = useRef(false);
  const collectionFlowScrollYRef = useRef(0);

  const load = useCallback(async () => {
    try {
      setError("");
      const response = await fetch("/api/debt-center", { cache: "no-store" });
      const payload = await response.json() as { ok: boolean; dashboard?: DebtDashboard; message?: string };
      if (!response.ok || !payload.dashboard) throw new Error(payload.message || "No pudimos cargar Cuentas Claras.");
      setDashboard(payload.dashboard);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No pudimos cargar Cuentas Claras.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => void load()); }, [load]);
  useEffect(() => {
    const refresh = () => void load();
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [load]);
  useEffect(() => {
    if (initialContext.expenseDraftId && !initialResumedDraft) window.history.replaceState({}, "", "/?product=clear_accounts");
  }, [initialContext.expenseDraftId, initialResumedDraft]);
  useEffect(() => {
    if (!notice || !focusCollectionNoticeRef.current) return;
    focusCollectionNoticeRef.current = false;
    noticeRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: collectionFlowScrollYRef.current, behavior: "auto" });
  }, [notice]);

  const selectedDebt = dashboard?.debts.find((debt) => debt.id === selectedDebtId) ?? null;
  const selectedDebtExpense = dashboard?.expenses.find((expense) => expense.id === selectedDebt?.expenseId) ?? null;
  const shareDebt = dashboard?.debts.find((debt) => debt.id === shareDraft?.debtId) ?? null;
  const confirmationDebt = dashboard?.debts.find((debt) => debt.id === shareConfirmation?.debtId) ?? null;
  const createdExpense = dashboard?.expenses.find((expense) => expense.id === createdExpenseId) ?? null;
  const recurringSuggestionExpense = dashboard?.expenses.find((expense) => expense.id === recurringSuggestionExpenseId) ?? null;
  const recurringSourceExpense = dashboard?.expenses.find((expense) => expense.id === recurringSourceExpenseId) ?? null;
  const selectedRecurringTemplate = dashboard?.recurringTemplates.find((template) => template.id === selectedRecurringTemplateId) ?? null;
  const correctionExpense = dashboard?.expenses.find((expense) => expense.id === correctionExpenseId) ?? null;
  const correctionDebts = dashboard?.debts.filter((debt) => debt.expenseId === correctionExpenseId) ?? [];
  const createdDebts = dashboard?.debts.filter((debt) => debt.expenseId === createdExpenseId) ?? [];
  const selectedDebtDirection = selectedDebt?.creditorParticipantId === dashboard?.currentParticipant.id ? "receivable" : "payable";
  const currentId = dashboard?.currentParticipant.id;
  const receivables = dashboard?.debts.filter((debt) => debt.creditorParticipantId === currentId && debt.status !== "cancelled") ?? [];
  const payables = dashboard?.debts.filter((debt) => debt.debtorParticipantId === currentId && debt.status !== "cancelled") ?? [];
  const filteredGroups = dashboard?.groups.filter((group) => group.name.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es"))) ?? [];

  const prepareCorrectionDraft = (expense: DebtDashboard["expenses"][number]) => {
    const draftId = createExpenseDraftId();
    const splitValues = expense.splitMode === "equal" ? undefined : Object.fromEntries((expense.splitSpec?.values ?? []).map((item) => [item.participantId, item.value]));
    saveExpenseDraft(draftId, { title: expense.title, amountText: String(expense.totalAmount), groupId: expense.groupId, paidBy: expense.paidByParticipantId, participantIds: expense.shares.map((share) => share.participantId), splitMode: expense.splitMode, splitValues, receiptName: expense.receipt?.name ?? "", correctionOfExpenseId: expense.id });
    const draft = loadExpenseDraft(draftId);
    if (!draft) {
      setError("No pudimos preparar la copia. Vuelve a intentarlo desde el gasto anulado.");
      return;
    }
    setPreferredGroupId(expense.groupId);
    setExpenseDraftId(draftId);
    setResumedDraft(draft);
    setComposer("expense");
    setNotice("");
  };

  const copyDebtLink = async (debt: DebtSummary, messageKind: CollectionMessageKind) => {
    try {
      const url = `${window.location.origin}/pagar/${debt.publicToken}`;
      await navigator.clipboard.writeText(`${collectionMessageBody(debt, messageKind)} ${url}`);
      setPreparedDebtIds((current) => current.includes(debt.id) ? current : [...current, debt.id]);
      setShareDraft(null);
      setShareConfirmation({ debtId: debt.id, messageKind, commandId: `collection_share_cmd_${crypto.randomUUID().replaceAll("-", "")}` });
    } catch {
      setError("Tu navegador no permitió copiar. Abre la vista del pagador y copia la dirección manualmente.");
    }
  };

  const confirmShared = async (debt: DebtSummary, confirmation: CollectionConfirmationDraft) => {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/debt-center", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "confirm_collection_shared", commandId: confirmation.commandId, debtId: debt.id, messageKind: confirmation.messageKind }) });
      const payload = await response.json() as { dashboard?: DebtDashboard; message?: string };
      if (!response.ok || !payload.dashboard) throw new Error(payload.message || "No pudimos guardar esta confirmación.");
      setDashboard(payload.dashboard);
      setShareConfirmation(null);
      focusCollectionNoticeRef.current = true;
      setNotice(`Anotado por ti: ${confirmation.messageKind === "follow_up" ? "seguimiento" : "cobro"} compartido. Esto no confirma entrega ni lectura.`);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No pudimos guardar esta confirmación.");
    } finally {
      setBusy(false);
    }
  };

  const dismissShareConfirmation = () => {
    setShareConfirmation(null);
    focusCollectionNoticeRef.current = true;
    setNotice("Mensaje copiado. YOL1 no sabe si lo compartiste; no registramos un envío.");
    window.requestAnimationFrame(() => {
      noticeRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: collectionFlowScrollYRef.current, behavior: "auto" });
    });
  };

  const resetDemo = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/debt-center", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reset_demo" }) });
      const payload = await response.json() as { dashboard?: DebtDashboard; message?: string };
      if (!response.ok || !payload.dashboard) throw new Error(payload.message || "No se pudo reiniciar.");
      setDashboard(payload.dashboard);
      setSelectedDebtId(null);
      setReconciliationOpen(false);
      setNotice("Demo reiniciada: volvió el caso Nico $10.000 y Josefa con abono parcial.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No se pudo reiniciar.");
    } finally {
      setBusy(false);
    }
  };

  const openReconciliation = async () => {
    if (!dashboard || busy) return;
    if (dashboard.reconciliation.statementLoaded) { setReconciliationOpen(true); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/debt-center", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "load_mock_statement", commandId: `recon_load_cmd_${crypto.randomUUID().replaceAll("-", "")}`, fixtureVersion: "mock_statement_v1" }) });
      const payload = await response.json() as { dashboard?: DebtDashboard; message?: string };
      if (!response.ok || !payload.dashboard) throw new Error(payload.message || "No pudimos cargar la cartola demo.");
      setDashboard(payload.dashboard);
      setReconciliationOpen(true);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No pudimos cargar la cartola demo.");
    } finally { setBusy(false); }
  };

  if (loading) return <main className={`${styles.centerState} cc-center-state`}><span className={styles.loader} /><h1>Ordenando las cuentas demo…</h1><p>No se está conectando ningún banco.</p></main>;
  if (error && !dashboard) return <main className={`${styles.centerState} cc-center-state`}><span className={styles.errorMark}>!</span><h1>No pudimos abrir Cuentas Claras</h1><p>{error}</p><button onClick={() => { setLoading(true); void load(); }}>Intentar de nuevo</button><Link href="/">Volver al Lab</Link></main>;

  return <main className={`${styles.mobileStandalone} ${overrides.surfaceApp} ${waStyles.shell} cc-app`}>
    <section ref={workspaceRef} className={`${styles.workspace} cc-workspace`}>
      <header className={`${styles.topbar} cc-topbar cc-actionbar`}><div><span className="cc-simulation-pill">SIMULACIÓN · NO MUEVE DINERO</span></div><div className={styles.topActions}><button className={styles.secondaryButton} onClick={() => setComposer("group")}>Grupo</button><button data-focus-fallback className={styles.primaryButton} onClick={() => { setPreferredGroupId(null); setComposer("expense"); }}>＋ Gasto</button></div></header>

      {handoff && !composer && <div className={styles.handoffBanner}><span>✦</span><p><strong>Desde Acompañante financiero</strong>{handoff.intent === "review_debt" ? selectedDebt ? "Abrimos el pendiente exacto que estabas revisando." : "Este pendiente cambió o ya no está disponible. Te mostramos las cuentas actuales." : "Aquí viven los acuerdos y cobros compartidos."}</p><button type="button" onClick={() => { const navigateEvent = new CustomEvent("yol1:lab-navigate", { cancelable: true, detail: { href: handoff.returnHref } }); if (window.dispatchEvent(navigateEvent)) window.location.assign(handoff.returnHref); }}>Volver</button></div>}

      {notice && <div ref={noticeRef} className={styles.notice} role="status" tabIndex={-1}><span>✓</span><p>{notice}</p><button onClick={() => setNotice("")} aria-label="Cerrar mensaje">×</button></div>}
      {error && <div className={styles.inlineError} role="alert"><span>!</span><p>{error}</p><button onClick={() => setError("")}>Cerrar</button></div>}

      {tab === "home" && dashboard && <HomeView dashboard={dashboard} receivables={receivables} payables={payables} recurringSuggestion={recurringSuggestionExpense} onDebt={setSelectedDebtId} onGroups={() => setTab("groups")} onReconciliation={() => void openReconciliation()} onRecurring={(templateId) => { setNotice(""); setSelectedRecurringTemplateId(templateId); }} onPrepareRecurring={(expenseId) => { setRecurringSuggestionExpenseId(null); setRecurringSourceExpenseId(expenseId); }} onDismissRecurring={() => setRecurringSuggestionExpenseId(null)} />}
      {tab === "groups" && dashboard && <GroupsView dashboard={dashboard} groups={filteredGroups} search={search} setSearch={setSearch} selectedGroupId={selectedGroupId} setSelectedGroupId={setSelectedGroupId} onDebt={setSelectedDebtId} onRecurring={(templateId) => { setNotice(""); setSelectedRecurringTemplateId(templateId); }} onExpense={(groupId) => { setPreferredGroupId(groupId); setComposer("expense"); }} onResumeCorrection={(expenseId) => { const expense = dashboard.expenses.find((item) => item.id === expenseId); if (expense) prepareCorrectionDraft(expense); }} onGroup={() => setComposer("group")} />}
      {tab === "activity" && dashboard && <ActivityView dashboard={dashboard} busy={busy} onReset={resetDemo} />}
    </section>

    <nav className={`${styles.mobileNav} cc-nav`} aria-label="Navegación móvil">
      <button className={tab === "home" ? styles.navActive : ""} aria-current={tab === "home" ? "page" : undefined} onClick={() => setTab("home")}><span>⌂</span>Inicio</button>
      <button className={tab === "groups" ? styles.navActive : ""} aria-current={tab === "groups" ? "page" : undefined} onClick={() => setTab("groups")}><span>◎</span>Grupos</button>
      <button className={tab === "activity" ? styles.navActive : ""} aria-current={tab === "activity" ? "page" : undefined} onClick={() => setTab("activity")}><span>↻</span>Actividad</button>
    </nav>

    {createdExpense && dashboard && !selectedDebt && !shareDebt && !shareConfirmation && !composer && <ExpenseCreatedFollowup expense={createdExpense} debts={createdDebts} currentParticipantId={dashboard.currentParticipant.id} preparedDebtIds={preparedDebtIds} onDebt={setSelectedDebtId} onClose={(offerRecurring) => { setCreatedExpenseId(null); if (offerRecurring && !createdExpense.recurrence && !dashboard.recurringTemplates.some((template) => template.sourceExpenseId === createdExpense.id)) setRecurringSuggestionExpenseId(createdExpense.id); }} />}
    {recurringSourceExpense && dashboard && !createdExpense && <RecurringSetup expense={recurringSourceExpense} groupName={dashboard.groups.find((group) => group.id === recurringSourceExpense.groupId)?.name ?? "Grupo"} onClose={() => setRecurringSourceExpenseId(null)} onSaved={(next) => { setDashboard(next); setRecurringSourceExpenseId(null); setNotice("Gasto habitual guardado. No se creó ninguna deuda nueva."); }} />}
    {selectedRecurringTemplate && dashboard && <RecurringDueSheet dashboard={dashboard} template={selectedRecurringTemplate} groupName={dashboard.groups.find((group) => group.id === selectedRecurringTemplate.groupId)?.name ?? "Grupo"} onClose={() => setSelectedRecurringTemplateId(null)} onUpdated={(next, message) => { setDashboard(next); setSelectedRecurringTemplateId(null); setNotice(message); }} onMaterialized={(next, expenseId) => { setDashboard(next); setSelectedRecurringTemplateId(null); setNotice(""); setCreatedExpenseId(expenseId); setPreparedDebtIds([]); }} />}
    {reconciliationOpen && dashboard && <ReconciliationSheet dashboard={dashboard} onClose={() => setReconciliationOpen(false)} onUpdated={(next, message) => { setDashboard(next); setNotice(message); }} />}
    {selectedDebt && <DebtSheet debt={selectedDebt} direction={selectedDebtDirection} onClose={() => setSelectedDebtId(null)} onCorrect={selectedDebtExpense?.createdByParticipantId === dashboard?.currentParticipant.id ? () => { setCorrectionExpenseId(selectedDebt.expenseId); setSelectedDebtId(null); } : undefined} onCopy={() => { collectionFlowScrollYRef.current = window.scrollY; workspaceRef.current?.scrollTo({ top: 0, behavior: "auto" }); setShareDraft({ debtId: selectedDebt.id, messageKind: selectedDebt.collection.lastSharedAt ? "follow_up" : "initial" }); setSelectedDebtId(null); }} />}
    {correctionExpense && dashboard && <ExpenseCorrectionSheet expense={correctionExpense} debts={correctionDebts} recurringActive={Boolean(correctionExpense.recurrence) || dashboard.recurringTemplates.some((template) => template.sourceExpenseId === correctionExpense.id && template.status === "active")} onClose={() => setCorrectionExpenseId(null)} onCancelled={(nextDashboard) => {
      setDashboard(nextDashboard); setCorrectionExpenseId(null); prepareCorrectionDraft(correctionExpense);
    }} />}
    {shareDebt && shareDraft && <WhatsAppPreview debt={shareDebt} messageKind={shareDraft.messageKind} onClose={() => setShareDraft(null)} onCopy={() => void copyDebtLink(shareDebt, shareDraft.messageKind)} />}
    {confirmationDebt && shareConfirmation && <CollectionShareConfirmation debt={confirmationDebt} messageKind={shareConfirmation.messageKind} busy={busy} onClose={dismissShareConfirmation} onConfirm={() => void confirmShared(confirmationDebt, shareConfirmation)} />}
    {composer === "expense" && dashboard && <ExpenseComposer dashboard={dashboard} preferredGroupId={preferredGroupId} initialDraft={resumedDraft} resumedDraftId={expenseDraftId} returnHref={handoff?.returnHref ?? "/?product=companion"} onClose={() => { setComposer(null); if (!handoff) window.history.replaceState({}, "", "/?product=clear_accounts"); }} onDiscard={() => { removeExpenseDraft(expenseDraftId); setExpenseDraftId(null); setResumedDraft(null); setPreferredGroupId(null); setComposer(null); window.history.replaceState({}, "", "/?product=clear_accounts"); setNotice("Borrador descartado. No se creó ningún gasto."); }} onSaved={(next, expenseId) => { setDashboard(next); setComposer(null); setPreferredGroupId(null); setExpenseDraftId(null); setResumedDraft(null); setCreatedExpenseId(expenseId); setPreparedDebtIds([]); window.history.replaceState({}, "", "/?product=clear_accounts"); }} />}
    {composer === "group" && dashboard && <GroupComposer dashboard={dashboard} onClose={() => setComposer(null)} onSaved={(next) => { const created = next.groups.find((group) => !dashboard.groups.some((current) => current.id === group.id)); setDashboard(next); setComposer(null); setTab("groups"); setSelectedGroupId(created?.id ?? next.groups.at(-1)?.id ?? null); setNotice("Grupo demo creado. Agrega el primer gasto cuando estés listo; aún no invitamos a nadie."); }} />}
  </main>;
}

export default function ClearAccountsPage() {
  useEffect(() => {
    if (window.location.pathname === "/cuentas-claras") window.location.replace("/?product=clear_accounts");
  }, []);
  return <ClearAccountsApp />;
}

function HomeView({ dashboard, receivables, payables, recurringSuggestion, onDebt, onGroups, onReconciliation, onRecurring, onPrepareRecurring, onDismissRecurring }: { dashboard: DebtDashboard; receivables: DebtSummary[]; payables: DebtSummary[]; recurringSuggestion: DebtDashboard["expenses"][number] | null; onDebt: (id: string) => void; onGroups: () => void; onReconciliation: () => void; onRecurring: (id: string) => void; onPrepareRecurring: (expenseId: string) => void; onDismissRecurring: () => void }) {
  const activeReceivables = receivables.filter((debt) => debt.outstandingAmount > 0);
  const activePayables = payables.filter((debt) => debt.outstandingAmount > 0);
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div><p className={styles.eyebrow}>TU PLATA COMPARTIDA</p><h1>Que las cuentas no<br /><span>se metan en el grupo.</span></h1><p>Cuentas Claras lleva el registro, prepara cada cobro y sigue el saldo cuando se confirma un abono.</p></div>
      <div className={styles.heroTotal}><small>TE DEBEN AHORA</small><strong>{money.format(dashboard.totals.outstanding)}</strong><span>{dashboard.totals.openDebts} {dashboard.totals.openDebts === 1 ? "cuenta pendiente" : "cuentas pendientes"}</span></div>
    </section>
    <div className={styles.metrics}>
      <article><small>ORIGINAL</small><strong>{money.format(dashboard.totals.receivable)}</strong><p>Lo que adelantaste por otros</p></article>
      <article><small>YA VOLVIÓ</small><strong>{money.format(dashboard.totals.received)}</strong><p>Abonos confirmados</p></article>
      <article><small>POR PAGAR</small><strong>{money.format(activePayables.reduce((sum, debt) => sum + debt.outstandingAmount, 0))}</strong><p>Tu parte en otros grupos</p></article>
    </div>
    <button className={overrides.reconciliationCard} onClick={onReconciliation}>
      <span>≋</span><div><small>{dashboard.reconciliation.statementLoaded ? "CARTOLA DEMO · RESULTADOS" : "CARTOLA DEMO · SIN BANCO CONECTADO"}</small><strong>{dashboard.reconciliation.statementLoaded ? dashboard.reconciliation.pendingCount ? `${dashboard.reconciliation.pendingCount} movimiento necesita revisión` : "La cartola demo quedó revisada" : "Prueba cómo YOL1 encuentra abonos"}</strong><p>{dashboard.reconciliation.statementLoaded ? `${dashboard.reconciliation.confirmedCount} conciliado${dashboard.reconciliation.confirmedCount === 1 ? "" : "s"} · ${dashboard.reconciliation.rejectedCount} descartado${dashboard.reconciliation.rejectedCount === 1 ? "" : "s"}` : "Usaremos movimientos ficticios y reglas locales. No pediremos claves ni conectaremos un banco."}</p></div><b>{dashboard.reconciliation.statementLoaded ? "Ver evidencia →" : "Simular cartola →"}</b>
    </button>
    {recurringSuggestion && <section className={overrides.recurringSuggestion}><div><small>PARA LA PRÓXIMA</small><strong>¿Este gasto se repite?</strong><p>Podemos dejar “{recurringSuggestion.title}” como borrador mensual. Nada se creará ni cobrará automáticamente.</p></div><div><button onClick={onDismissRecurring}>No por ahora</button><button onClick={() => onPrepareRecurring(recurringSuggestion.id)}>Prepararlo cada mes</button></div></section>}
    {dashboard.recurringTemplates.filter((template) => template.status === "active" && template.nextOccurrenceOn <= new Date().toISOString().slice(0, 10)).map((template) => <button key={template.id} className={overrides.recurringCard} onClick={() => onRecurring(template.id)}>
      <span>↻</span><div><small>GASTO HABITUAL · BORRADOR</small><strong>{template.title}</strong><p>Revisar el {readableDate(template.nextOccurrenceOn)} · nada se crea solo</p></div><b>Revisar →</b>
    </button>)}
    <section className={styles.splitColumns}>
      <div className={styles.panel}><header><div><small>POR COBRAR</small><h2>Te deben</h2></div><span>{activeReceivables.length}</span></header><div className={styles.debtList}>{activeReceivables.map((debt) => <DebtRow key={debt.id} debt={debt} direction="receivable" onClick={() => onDebt(debt.id)} />)}{activeReceivables.length === 0 && <Empty title="Todo está al día" detail="No tienes cobros pendientes en esta demo." />}</div></div>
      <div className={styles.panel}><header><div><small>POR PAGAR</small><h2>Debes</h2></div><span>{activePayables.length}</span></header><div className={styles.debtList}>{activePayables.map((debt) => <DebtRow key={debt.id} debt={debt} direction="payable" onClick={() => onDebt(debt.id)} />)}{activePayables.length === 0 && <Empty title="No debes nada" detail="Tus partes pendientes aparecerán aquí." />}</div></div>
    </section>
    <button className={styles.groupShortcut} onClick={onGroups}><span>◎</span><div><small>TUS GRUPOS</small><strong>{dashboard.groups.length} espacios para ordenar gastos</strong><p>Viajes, casa, comidas y gastos recurrentes.</p></div><b>→</b></button>
  </div>;
}

function ReconciliationSheet({ dashboard, onClose, onUpdated }: { dashboard: DebtDashboard; onClose: () => void; onUpdated: (dashboard: DebtDashboard, message: string) => void }) {
  const [selectedByEntry, setSelectedByEntry] = useState<Record<string, string>>({});
  const commandRef = useRef<Record<string, string>>({});
  const [busyEntryId, setBusyEntryId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const dialogRef = useDialogFocus(onClose);
  const entries = dashboard.reconciliation.entries.filter((entry) => entry.state !== "unmatched");
  const commandFor = (key: string, prefix: string) => commandRef.current[key] ?? (commandRef.current[key] = `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`);
  const mutate = async (entryId: string, body: Record<string, unknown>, success: string) => {
    if (busyEntryId) return;
    setBusyEntryId(entryId); setError("");
    try {
      const response = await fetch("/api/debt-center", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json() as { dashboard?: DebtDashboard; message?: string };
      if (!response.ok || !payload.dashboard) throw new Error(payload.message || "No pudimos guardar esta decisión demo.");
      onUpdated(payload.dashboard, success);
      for (const key of Object.keys(commandRef.current)) if (key.startsWith(`${entryId}:`)) delete commandRef.current[key];
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No pudimos guardar esta decisión demo.");
    } finally { setBusyEntryId(null); }
  };
  return <div className={styles.overlay}><section ref={dialogRef} className={`${styles.composer} ${overrides.reconciliationSheet}`} role="dialog" aria-modal="true" aria-labelledby="reconciliation-title" aria-describedby="reconciliation-description">
    <header><div><small>CARTOLA DEMO · EVIDENCIA FICTICIA</small><strong id="reconciliation-title" data-dialog-initial tabIndex={-1}>Revisa cómo cerramos las cuentas.</strong></div><button onClick={onClose} aria-label="Cerrar y revisar después">×</button></header>
    <div className={styles.composerBody}>
      <p id="reconciliation-description" className={overrides.reconciliationLead}>Esta pantalla imita una cartola receptora. No se conectó un banco, no usamos Floid y ningún movimiento acredita una transferencia real.</p>
      <div className={overrides.statementMeta}><span>≋</span><div><small>CUENTA FICTICIA</small><strong>{dashboard.reconciliation.accountAlias}</strong><p>Cargada sólo en esta demo · movimientos locales</p></div></div>
      {entries.map((entry) => {
        const selectedId = selectedByEntry[entry.entryId];
        const selected = entry.candidates.find((candidate) => candidate.id === selectedId);
        const decided = entry.selectedDebtId ? entry.candidates.find((candidate) => candidate.debtId === entry.selectedDebtId) : undefined;
        return <article key={entry.entryId} className={overrides.reconciliationEntry}>
          <div className={overrides.movementHeader}><div><small>{entry.state === "confirmed" ? entry.decisionSource === "automatic_rule" ? "CONCILIADO AUTOMÁTICAMENTE · SIMULACIÓN" : "ABONO REGISTRADO POR TI" : entry.state === "rejected" ? "DESCARTADO POR TI" : entry.state === "reversed" ? "REGISTRO DESHECHO" : "MOVIMIENTO POR REVISAR"}</small><strong>+{money.format(entry.amount)}</strong><p>{new Date(entry.bookedAt).toLocaleString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · {entry.descriptor}</p></div><span>{entry.state === "confirmed" ? "✓" : entry.state === "needs_review" ? "?" : "↶"}</span></div>
          {entry.state === "needs_review" && <>
            <p className={overrides.matchExplanation}>{entry.candidates.length > 1 ? `Este movimiento podría corresponder a ${entry.candidates.length} cuentas. YOL1 no elegirá por ti.` : "Encontramos una coincidencia posible. Revisa antes de registrar."}</p>
            <div className={overrides.candidateList} role="radiogroup" aria-label="Cuentas posibles">{entry.candidates.map((candidate) => <label key={candidate.id} className={candidate.stale ? overrides.candidateStale : ""}><input type="radio" name={`candidate-${entry.entryId}`} value={candidate.id} checked={selectedId === candidate.id} disabled={candidate.stale || Boolean(busyEntryId)} onChange={() => setSelectedByEntry((current) => ({ ...current, [entry.entryId]: candidate.id }))} /><span><strong>{candidate.debtorName} · {candidate.expenseTitle}</strong><small>{candidate.groupName} · faltan {money.format(candidate.outstandingAmount)}</small><em>{candidate.score === "good" ? "Buena coincidencia" : "Posible coincidencia"}{candidate.stale ? " · saldo cambió" : ""}</em></span></label>)}</div>
            {selected && <div className={overrides.reconciliationMath}><span>Pendiente actual <b>{money.format(selected.outstandingAmount)}</b></span><span>Abono a registrar <b>− {money.format(selected.amount)}</b></span><span>Quedará pendiente <b>{money.format(selected.outstandingAmount - selected.amount)}</b></span></div>}
            <p className={overrides.reconciliationGuardrail}>Registrar sólo actualizará Cuentas Claras. No mueve dinero, no informa al pagador y no confirma una transferencia real.</p>
            <div className={overrides.reconciliationActions}><button disabled={!selected || Boolean(busyEntryId)} onClick={() => selected && void mutate(entry.entryId, { action: "confirm_reconciliation_candidate", commandId: commandFor(`${entry.entryId}:confirm`, "recon_confirm_cmd"), candidateId: selected.id, expectedOutstandingAmount: selected.outstandingAmount }, `Abono demo registrado por ti. Aún quedan ${money.format((selected?.outstandingAmount ?? 0) - (selected?.amount ?? 0))}.`)}>{busyEntryId === entry.entryId ? "Guardando…" : selected ? `Registrar ${money.format(selected.amount)} como abono` : "Elige una cuenta para continuar"}</button><button disabled={Boolean(busyEntryId)} onClick={() => void mutate(entry.entryId, { action: "reject_reconciliation_entry", commandId: commandFor(`${entry.entryId}:reject`, "recon_reject_cmd"), entryId: entry.entryId }, "Coincidencia descartada. Ningún saldo cambió.")}>No corresponde a ninguna</button></div>
          </>}
          {entry.state === "confirmed" && decided && <><div className={overrides.reconciliationMath}><span>Pendiente antes <b>{money.format(entry.decidedOutstandingBefore ?? decided.outstandingAmount + decided.amount)}</b></span><span>Abono conciliado <b>− {money.format(decided.amount)}</b></span><span>Pendiente después de este abono <b>{money.format(entry.decidedOutstandingAfter ?? decided.outstandingAmount)}</b></span></div><p className={overrides.reconciliationGuardrail}>{entry.decisionSource === "automatic_rule" ? "La regla local encontró una referencia exacta y única." : "Esta es una declaración tuya basada en la cartola demo."} No acredita una transferencia real.</p>{entry.decisionId && <button className={overrides.reversalButton} disabled={Boolean(busyEntryId)} onClick={() => void mutate(entry.entryId, { action: "reverse_reconciliation_decision", commandId: commandFor(`${entry.entryId}:reverse`, "recon_reverse_cmd"), decisionId: entry.decisionId }, "Registro demo deshecho. El saldo volvió al valor anterior.")}>Esto no corresponde · deshacer registro</button>}</>}
          {entry.state === "rejected" && <div className={overrides.rejectedState}><p>Descartaste esta coincidencia. Ningún saldo cambió.</p><button disabled={Boolean(busyEntryId)} onClick={() => void mutate(entry.entryId, { action: "reopen_reconciliation_entry", commandId: commandFor(`${entry.entryId}:reopen`, "recon_reopen_cmd"), entryId: entry.entryId }, "Movimiento reabierto para revisión.")}>Deshacer descarte</button></div>}
          {entry.state === "reversed" && <p className={overrides.reconciliationGuardrail}>El abono dejó de contar, pero conservamos la evidencia y la decisión en la actividad.</p>}
        </article>;
      })}
      {error && <p className={styles.formError} role="alert">{error}</p>}
    </div><footer><button className={styles.secondaryButton} onClick={onClose}>Revisar después</button></footer>
  </section></div>;
}

function DebtRow({ debt, direction, onClick }: { debt: DebtSummary; direction: "receivable" | "payable"; onClick: () => void }) {
  const progress = debt.originalAmount ? Math.round((debt.paidAmount / debt.originalAmount) * 100) : 0;
  const counterpart = direction === "receivable" ? debt.debtorName : debt.creditorName;
  return <button className={styles.debtRow} onClick={onClick}>
    <span className={styles.avatar}>{counterpart.slice(0, 1)}</span><span><strong>{counterpart}</strong><small>{debt.expenseTitle} · {debt.groupName}</small><i><i style={{ width: `${progress}%` }} /></i><em>{direction === "receivable" ? collectionStatusLabel(debt) : statusLabel(debt)}</em></span><b>{money.format(debt.outstandingAmount)}</b>
  </button>;
}

function GroupsView({ dashboard, groups, search, setSearch, selectedGroupId, setSelectedGroupId, onDebt, onRecurring, onExpense, onResumeCorrection, onGroup }: { dashboard: DebtDashboard; groups: DebtDashboard["groups"]; search: string; setSearch: (value: string) => void; selectedGroupId: string | null; setSelectedGroupId: (id: string | null) => void; onDebt: (id: string) => void; onRecurring: (id: string) => void; onExpense: (groupId: string) => void; onResumeCorrection: (expenseId: string) => void; onGroup: () => void }) {
  const [balanceMode, setBalanceMode] = useState<"simplified" | "gross">("simplified");
  const selected = dashboard.groups.find((group) => group.id === selectedGroupId);
  if (selected) {
    const expenses = dashboard.expenses.filter((expense) => expense.groupId === selected.id);
    const debts = dashboard.debts.filter((debt) => debt.groupId === selected.id && debt.status !== "cancelled");
    const netting = dashboard.groupNetting.find((item) => item.groupId === selected.id);
    const recurringTemplates = dashboard.recurringTemplates.filter((template) => template.groupId === selected.id);
    const participantName = (participantId: string) => participantId === dashboard.currentParticipant.id ? "Tú" : dashboard.participants.find((item) => item.id === participantId)?.name ?? "Participante";
    const transferLabel = (fromParticipantId: string, toParticipantId: string) => {
      if (fromParticipantId === dashboard.currentParticipant.id) return `Tú le pagas a ${participantName(toParticipantId)}`;
      if (toParticipantId === dashboard.currentParticipant.id) return `${participantName(fromParticipantId)} te paga`;
      return `${participantName(fromParticipantId)} le paga a ${participantName(toParticipantId)}`;
    };
    return <div className={styles.page}>
      <button className={styles.backButton} onClick={() => setSelectedGroupId(null)}>← Todos los grupos</button>
      <section className={styles.groupHero}>
        <div><span>{categoryLabel[selected.category]}</span><h1>{selected.name}</h1><p>{selected.participantIds.length} personas · {expenses.length} {expenses.length === 1 ? "gasto" : "gastos"}</p></div>
        <button className={styles.primaryButton} onClick={() => onExpense(selected.id)}>＋ Agregar gasto</button>
      </section>
      <div className={styles.participantRail}>{selected.participantIds.map((id) => { const person = dashboard.participants.find((item) => item.id === id); return person ? <span key={id}><b>{person.initials}</b>{person.name}</span> : null; })}</div>
      {recurringTemplates.length > 0 && <section className={styles.panel}><header><div><small>GASTOS HABITUALES</small><h2>Próximas revisiones</h2></div></header><div className={overrides.recurringGroupList}>{recurringTemplates.map((template) => { const due = template.status === "active" && template.nextOccurrenceOn <= new Date().toISOString().slice(0, 10); return <article key={template.id}><span>↻</span><div><strong>{template.title}</strong><small>{template.status === "paused" ? "Dejamos de preparar nuevos borradores" : due ? `Listo desde el ${readableDate(template.nextOccurrenceOn)}` : `Lo revisaremos el ${readableDate(template.nextOccurrenceOn)}`}</small></div>{due ? <button onClick={() => onRecurring(template.id)}>Revisar gasto</button> : <em>{template.status === "paused" ? "Detenido" : "Próximo"}</em>}</article>; })}</div></section>}
      <section className={styles.panel}>
        <header><div><small>SALDOS DEL GRUPO</small><h2>{balanceMode === "simplified" ? "Saldo simplificado" : "Quién debe qué"}</h2></div></header>
        <div className={overrides.nettingToggle} role="group" aria-label="Cómo mostrar los saldos">
          <button aria-pressed={balanceMode === "simplified"} onClick={() => setBalanceMode("simplified")}>Simplificado</button>
          <button aria-pressed={balanceMode === "gross"} onClick={() => setBalanceMode("gross")}>Por gasto</button>
        </div>
        {balanceMode === "simplified" && netting ? <div className={overrides.nettingView}>
          <p>{netting.transfers.length === 0 ? "El grupo está a mano. No quedan transferencias pendientes." : netting.reducedBy > 0 ? `Con ${netting.simplifiedTransferCount} ${netting.simplifiedTransferCount === 1 ? "transferencia" : "transferencias"} pueden quedar al día.` : "Las cuentas ya están simples. No encontramos una ruta con menos transferencias."}</p>
          {netting.hasActivePayment && <div className={overrides.nettingNotice}>Hay un pago demo en curso. Este resumen puede cambiar cuando termine.</div>}
          <div className={overrides.nettingTransfers}>{netting.transfers.map((transfer) => <article key={transfer.id}>
            <span>⇄</span><div><strong>{transferLabel(transfer.fromParticipantId, transfer.toParticipantId)}</strong><small>Sugerencia matemática · no es un cobro</small></div><b>{money.format(transfer.amount)}</b>
          </article>)}</div>
          <details className={overrides.nettingDetails}><summary>Ver cómo se calculó</summary><p>Compensamos lo que cada persona da y recibe dentro de este grupo. Por eso puede aparecer alguien con quien no hubo un gasto directo. Los gastos originales siguen disponibles en “Por gasto”.</p></details>
          <div className={overrides.nettingGuardrail}><strong>No cambia ningún acuerdo.</strong><span>Esta sugerencia no registra pagos, no cancela cobros y no mueve dinero.</span></div>
        </div> : <div className={styles.debtList}>{debts.map((debt) => <DebtRow key={debt.id} debt={debt} direction={debt.creditorParticipantId === dashboard.currentParticipant.id ? "receivable" : "payable"} onClick={() => onDebt(debt.id)} />)}{debts.length === 0 && <Empty title="Todavía no hay saldos" detail="Agrega el primer gasto para calcular quién debe qué." />}</div>}
      </section>
      <section className={styles.panel}>
        <header><div><small>HISTORIAL</small><h2>Gastos</h2></div></header>
        <div className={styles.expenseList}>{expenses.map((expense) => <article key={expense.id}><span>{expense.lifecycle === "cancelled_for_correction" ? "×" : expense.receipt ? "▣" : "$"}</span><div><strong>{expense.title}</strong><small>{expense.lifecycle === "cancelled_for_correction" ? expense.correction?.replacementExpenseId ? "Anulado · versión corregida creada" : "Anulado · corrección pendiente" : `${new Date(expense.createdAt).toLocaleDateString("es-CL")} · ${splitModeLabel[expense.splitMode]}`}</small></div><b>{money.format(expense.totalAmount)}</b>{expense.lifecycle === "cancelled_for_correction" && !expense.correction?.replacementExpenseId && expense.correction?.cancelledByParticipantId === dashboard.currentParticipant.id && <button className={overrides.resumeCorrectionButton} onClick={() => onResumeCorrection(expense.id)}>Retomar corrección</button>}</article>)}{expenses.length === 0 && <Empty title="Este grupo está listo" detail="Agrega el primer gasto cuando tengan algo que dividir." />}</div>
      </section>
    </div>;
  }
  return <div className={styles.page}>
    <section className={styles.pageHeading}>
      <div><p className={styles.eyebrow}>GRUPOS</p><h1>Un lugar para cada cuenta.</h1><p>Casa, viajes, comidas o cualquier gasto que vuelve.</p></div>
      <div className={styles.groupTools}><label className={styles.search}>⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar grupo" /></label><button className={styles.primaryButton} onClick={onGroup}>＋ Crear grupo</button></div>
    </section>
    <div className={styles.groupGrid}>{groups.map((group) => { const net = dashboard.groupNetting.find((item) => item.groupId === group.id)?.participantBalances.find((item) => item.participantId === dashboard.currentParticipant.id)?.netAmount ?? 0; return <button key={group.id} onClick={() => setSelectedGroupId(group.id)}><span className={styles.groupIcon}>{group.category === "trip" ? "⌁" : group.category === "meal" ? "⌑" : "⌂"}</span><small>{categoryLabel[group.category].toUpperCase()}</small><strong>{group.name}</strong><p>{group.participantIds.length} personas</p><div><span>{net > 0 ? "Te deben neto" : net < 0 ? "Debes neto" : "Saldo neto"}</span><b>{net === 0 ? "Están a mano" : money.format(Math.abs(net))}</b></div></button>; })}{groups.length === 0 && <Empty title="No encontramos grupos" detail="Prueba otra búsqueda o crea un grupo nuevo." />}</div>
  </div>;
}

function ActivityView({ dashboard, busy, onReset }: { dashboard: DebtDashboard; busy: boolean; onReset: () => void }) {
  return <div className={styles.page}><section className={styles.pageHeading}><div><p className={styles.eyebrow}>TRAZABILIDAD</p><h1>Todo cambio deja rastro.</h1><p>Los acuerdos, intentos y abonos quedan separados para que una deuda nunca parezca pagada antes de tiempo.</p></div></section><section className={styles.timeline}>{dashboard.activities.map((activity) => <article key={activity.id}><span>{activity.type === "payment_succeeded" ? "✓" : activity.type === "payment_failed" ? "!" : "·"}</span><div><strong>{activity.title}</strong><p>{activity.detail}</p><time>{new Date(activity.occurredAt).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })}</time></div></article>)}</section><section className={styles.developerBox}><div><small>HERRAMIENTA LOCAL</small><strong>Volver al caso inicial</strong><p>Recupera a Nico con $10.000 pendientes y a Josefa con un abono parcial. No afecta dinero ni personas reales.</p></div><button disabled={busy} onClick={onReset}>{busy ? "Reiniciando…" : "Reiniciar demo"}</button></section></div>;
}

function ExpenseCreatedFollowup({ expense, debts, currentParticipantId, preparedDebtIds, onDebt, onClose }: { expense: DebtDashboard["expenses"][number]; debts: DebtSummary[]; currentParticipantId: string; preparedDebtIds: string[]; onDebt: (id: string) => void; onClose: (offerRecurring: boolean) => void }) {
  const dialogRef = useDialogFocus(() => onClose(false));
  const pending = debts.filter((debt) => debt.creditorParticipantId === currentParticipantId && debt.outstandingAmount > 0);
  const otherCreditor = debts.find((debt) => debt.creditorParticipantId !== currentParticipantId && debt.outstandingAmount > 0);
  const prepared = pending.filter((debt) => preparedDebtIds.includes(debt.id) || Boolean(debt.collection.lastSharedAt)).length;
  return <div className={styles.overlay}><section ref={dialogRef} className={`${styles.sheet} ${styles.createdFollowup}`} role="dialog" aria-modal="true" aria-labelledby="created-expense-title">
    <header><div><small>GASTO CREADO · YOL1 NO ENVÍA</small><strong id="created-expense-title">Las cuentas quedaron listas.</strong></div><button onClick={() => onClose(false)} aria-label="Cerrar resumen">×</button></header>
    <div className={styles.createdSummary}><span>✓</span><div><small>{expense.shares.length} PERSONAS · {splitModeLabel[expense.splitMode].toLocaleUpperCase("es-CL")}</small><strong>{expense.title}</strong><b>{money.format(expense.totalAmount)}</b></div></div>
    {pending.length > 0 ? <><p className={styles.createdLead}>Creamos {pending.length} {pending.length === 1 ? "cobro demo" : "cobros demo"}. Revisa cada mensaje antes de copiarlo; Yol1 no enviará nada automáticamente.</p><div className={styles.createdDebtList}>{pending.map((debt, index) => {
      const isPrepared = preparedDebtIds.includes(debt.id);
      const isShared = Boolean(debt.collection.lastSharedAt);
      return <button key={debt.id} data-dialog-initial={index === 0 ? "true" : undefined} onClick={() => onDebt(debt.id)}><span className={styles.avatar}>{debt.debtorName.slice(0, 1)}</span><span><strong>{debt.debtorName}</strong><small>{isShared ? "Compartido por ti · sin confirmar entrega" : isPrepared ? "Mensaje copiado · no enviado" : "Listo para revisar"}</small></span><b>{money.format(debt.outstandingAmount)}</b><em>{isShared ? "Ver estado →" : isPrepared ? "✓ Copiado" : "Revisar cobro →"}</em></button>;
    })}</div><p className={styles.createdProgress}>{prepared === pending.length ? `${prepared} de ${pending.length} ${prepared === 1 ? "cobro revisado" : "cobros revisados"}. Los estados compartidos son declaraciones tuyas; YOL1 no confirma entrega.` : `${prepared} de ${pending.length} cobros revisados.`}</p></> : <div className={styles.createdEmpty}><strong>{otherCreditor ? `${otherCreditor.creditorName} quedó como quien recibe.` : "Este gasto no dejó cobros pendientes."}</strong><p>{otherCreditor ? "No prepararemos mensajes en su nombre. El acuerdo sí quedó registrado." : "Los saldos del grupo ya se actualizaron."}</p></div>}
    {pending.length > 0 && prepared < pending.length ? <button className={styles.secondaryButton} onClick={() => onClose(false)}>Terminar después</button> : <div className={overrides.recurringOfferActions}><button className={styles.secondaryButton} onClick={() => onClose(false)}>Volver a Cuentas Claras</button><button className={styles.primaryButton} onClick={() => onClose(true)}>¿Se repite? Prepararlo</button></div>}
  </section></div>;
}

function RecurringSetup({ expense, groupName, onClose, onSaved }: { expense: DebtDashboard["expenses"][number]; groupName: string; onClose: () => void; onSaved: (dashboard: DebtDashboard) => void }) {
  const [commandId] = useState(() => `rec_template_cmd_${crypto.randomUUID().replaceAll("-", "")}`);
  const [nextOccurrenceOn, setNextOccurrenceOn] = useState(nextMonthlyReviewDate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useDialogFocus(onClose);
  const validDate = /^\d{4}-\d{2}-(?:0[1-9]|1\d|2[0-8])$/.test(nextOccurrenceOn);

  const save = async () => {
    if (busy || !validDate) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/debt-center", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create_recurring_template", commandId, sourceExpenseId: expense.id, nextOccurrenceOn }) });
      const payload = await response.json() as { dashboard?: DebtDashboard; message?: string };
      if (!response.ok || !payload.dashboard) throw new Error(payload.message || "No pudimos guardar este gasto habitual.");
      onSaved(payload.dashboard);
    } catch (nextError) { setError(nextError instanceof Error ? nextError.message : "No pudimos guardar este gasto habitual."); }
    finally { setBusy(false); }
  };

  return <div className={styles.overlay}><section ref={dialogRef} className={`${styles.sheet} ${overrides.recurringSetup}`} role="dialog" aria-modal="true" aria-labelledby="recurring-setup-title">
    <header><div><small>PARA LA PRÓXIMA</small><strong id="recurring-setup-title">¿Este gasto se repite?</strong></div><button onClick={onClose} aria-label="Cerrar gasto habitual">×</button></header>
    <p className={overrides.recurringLead}>Podemos dejar el monto y el reparto como borrador para el próximo mes. Nada se creará ni cobrará automáticamente.</p>
    <div className={overrides.recurringSummary}><small>{groupName}</small><strong>{expense.title}</strong><b>{money.format(expense.totalAmount)}</b><span>{expense.shares.length} personas · {splitModeLabel[expense.splitMode]}</span></div>
    <label className={styles.field}>Próxima revisión<input data-dialog-initial="true" type="date" value={nextOccurrenceOn} onChange={(event) => setNextOccurrenceOn(event.target.value)} /></label>
    <div className={styles.guardrail}><span>i</span><p><strong>Siempre tendrás el control.</strong>Cada mes tendrás que revisar y confirmar antes de crear nuevas cuentas.</p></div>
    {error && <p className={styles.formError} role="alert">{error}</p>}
    <div className={overrides.recurringActions}><button className={styles.secondaryButton} onClick={onClose}>No por ahora</button><button className={styles.primaryButton} disabled={!validDate || busy} onClick={() => void save()}>{busy ? "Guardando…" : "Prepararlo cada mes"}</button></div>
  </section></div>;
}

function RecurringDueSheet({ dashboard, template, groupName, onClose, onUpdated, onMaterialized }: { dashboard: DebtDashboard; template: DebtDashboard["recurringTemplates"][number]; groupName: string; onClose: () => void; onUpdated: (dashboard: DebtDashboard, message: string) => void; onMaterialized: (dashboard: DebtDashboard, expenseId: string) => void }) {
  const [materializeCommandId] = useState(() => `rec_occ_cmd_${crypto.randomUUID().replaceAll("-", "")}`);
  const [skipCommandId] = useState(() => `rec_skip_cmd_${crypto.randomUUID().replaceAll("-", "")}`);
  const [pauseCommandId] = useState(() => `rec_pause_cmd_${crypto.randomUUID().replaceAll("-", "")}`);
  const [busyAction, setBusyAction] = useState<"create" | "skip" | "pause" | null>(null);
  const [confirmAction, setConfirmAction] = useState<"skip" | "pause" | null>(null);
  const [error, setError] = useState("");
  const dialogRef = useDialogFocus(onClose);

  const mutate = async (action: "materialize_recurring_occurrence" | "skip_recurring_occurrence" | "pause_recurring_template") => {
    if (busyAction) return;
    const kind = action === "materialize_recurring_occurrence" ? "create" : action === "skip_recurring_occurrence" ? "skip" : "pause";
    setBusyAction(kind); setError("");
    try {
      const commandId = kind === "create" ? materializeCommandId : kind === "skip" ? skipCommandId : pauseCommandId;
      const body = { action, commandId, templateId: template.id, ...(kind === "pause" ? {} : { expectedOccurrenceKey: template.nextOccurrenceOn }) };
      const response = await fetch("/api/debt-center", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json() as { dashboard?: DebtDashboard; result?: { expense?: { id?: string } }; message?: string };
      if (!response.ok || !payload.dashboard) throw new Error(payload.message || "No pudimos actualizar este gasto habitual.");
      if (kind === "create") {
        if (!payload.result?.expense?.id) throw new Error("No pudimos recuperar el gasto creado.");
        onMaterialized(payload.dashboard, payload.result.expense.id);
      } else {
        onUpdated(payload.dashboard, kind === "skip" ? "Omitimos este mes. No se creó ninguna deuda." : "Gasto habitual pausado. No prepararemos nuevos borradores.");
      }
    } catch (nextError) { setError(nextError instanceof Error ? nextError.message : "No pudimos actualizar este gasto habitual."); }
    finally { setBusyAction(null); }
  };

  return <div className={styles.overlay}><section ref={dialogRef} className={`${styles.sheet} ${overrides.recurringSetup}`} role="dialog" aria-modal="true" aria-labelledby="recurring-due-title">
    <header><div><small>GASTO HABITUAL · BORRADOR</small><strong id="recurring-due-title">Revisa antes de crear.</strong></div><button onClick={onClose} aria-label="Cerrar borrador habitual">×</button></header>
    <p className={overrides.recurringLead}>Repetiremos exactamente el monto, pagador y reparto anteriores. Si algo cambió, omite este mes y crea un gasto nuevo.</p>
    <div className={overrides.recurringSummary}><small>{groupName} · {readableDate(template.nextOccurrenceOn)}</small><strong>{template.title}</strong><b>{money.format(template.totalAmount)}</b><span>{template.splitSpec.participantOrder.length} personas · {splitModeLabel[template.splitSpec.mode]}</span></div>
    <div className={overrides.recurringBreakdown}><p><span>Pagó</span><strong>{dashboard.participants.find((person) => person.id === template.paidByParticipantId)?.name ?? "Persona no disponible"}</strong></p>{template.shares.map((share) => <p key={share.participantId}><span>{dashboard.participants.find((person) => person.id === share.participantId)?.name ?? "Persona no disponible"}</span><strong>{share.amount === 0 ? "No genera cobro" : money.format(share.amount)}</strong></p>)}</div>
    <div className={styles.guardrail}><span>i</span><p><strong>Todavía es un borrador.</strong>No existe una deuda nueva, un mensaje ni un pago hasta que confirmes.</p></div>
    {error && <p className={styles.formError} role="alert">{error}</p>}
    {confirmAction ? <div className={overrides.recurringConfirmation} role="alert"><strong>{confirmAction === "skip" ? `¿Omitir ${readableDate(template.nextOccurrenceOn)}?` : "¿Dejar de preparar este gasto?"}</strong><p>{confirmAction === "skip" ? "No se creará ninguna cuenta este mes. La próxima revisión avanzará un mes." : "No aparecerán nuevos borradores mensuales. Los gastos ya creados no cambiarán."}</p><div><button onClick={() => setConfirmAction(null)}>Volver</button><button onClick={() => void mutate(confirmAction === "skip" ? "skip_recurring_occurrence" : "pause_recurring_template")}>{confirmAction === "skip" ? "Sí, omitir este mes" : "Dejar de preparar"}</button></div></div> : <><button data-dialog-initial="true" className={styles.primaryWide} disabled={Boolean(busyAction)} onClick={() => void mutate("materialize_recurring_occurrence")}>{busyAction === "create" ? "Creando…" : "Confirmar y crear este mismo gasto"}</button><div className={overrides.recurringSecondaryActions}><button disabled={Boolean(busyAction)} onClick={() => setConfirmAction("skip")}>Omitir este mes</button><button disabled={Boolean(busyAction)} onClick={() => setConfirmAction("pause")}>Dejar de preparar</button></div></>}
  </section></div>;
}

function DebtSheet({ debt, direction, onClose, onCopy, onCorrect }: { debt: DebtSummary; direction: "receivable" | "payable"; onClose: () => void; onCopy: () => void; onCorrect?: () => void }) {
  const progress = debt.originalAmount ? Math.round((debt.paidAmount / debt.originalAmount) * 100) : 0;
  const counterpart = direction === "receivable" ? debt.debtorName : debt.creditorName;
  const dialogRef = useDialogFocus(onClose);
  return <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><aside ref={dialogRef} className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="debt-title">
    <header><div><small>{direction === "receivable" ? "TE DEBE" : "LE DEBES"}</small><strong id="debt-title">{counterpart}</strong></div><button onClick={onClose} aria-label="Cerrar detalle">×</button></header>
    <div className={styles.debtAmount}><small>FALTA POR PAGAR</small><strong>{money.format(debt.outstandingAmount)}</strong><span>{debt.expenseTitle} · {debt.groupName}</span></div>
    <div className={styles.progressDetail}><i><i style={{ width: `${progress}%` }} /></i><div><span>Pagado {money.format(debt.paidAmount)}</span><span>Total {money.format(debt.originalAmount)}</span></div></div>
    {direction === "receivable" && <section className={overrides.collectionState}><small>ESTADO DEL COBRO</small><strong>{collectionStatusLabel(debt)}</strong><p>{debt.collection.lastSharedAt ? `Marcado por ti el ${new Date(debt.collection.lastSharedAt).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })}. YOL1 no confirma entrega ni lectura.` : "Todavía no registraste haber compartido este cobro."}</p></section>}
    {debt.status !== "paid" ? direction === "receivable" ? <>{debt.collection.state === "payment_started" ? <div className={styles.guardrail}><span>i</span><p><strong>Hay un pago demo en curso.</strong>Espera su resultado antes de preparar un seguimiento.</p></div> : <button className={styles.primaryWide} onClick={onCopy}>{debt.collection.lastSharedAt ? "Preparar seguimiento" : "Preparar cobro por WhatsApp"}</button>}<a className={styles.previewLink} href={`/pagar/${debt.publicToken}`} target="_blank" rel="noreferrer">Vista del pagador (nueva pestaña) →</a><p className={styles.safetyCopy}>Primero verás el mensaje como borrador. Nada se enviará automáticamente.</p></> : <><a className={styles.primaryWide} href={`/pagar/${debt.publicToken}`} target="_blank" rel="noreferrer">Pagar mi parte en el simulador</a><p className={styles.safetyCopy}>Se abrirá la tarea de pago en una pestaña nueva. No moverá dinero.</p></> : <div className={styles.paidState}>✓ Esta cuenta quedó pagada.</div>}
    <section className={styles.sheetHistory}><small>ABONOS CONFIRMADOS</small>{debt.settlements.map((settlement) => <article key={settlement.id}><span>✓</span><div><strong>{money.format(settlement.amount)}</strong><small>{new Date(settlement.settledAt).toLocaleString("es-CL")}</small></div></article>)}{debt.settlements.length === 0 && <p>Todavía no hay abonos confirmados.</p>}</section>
    {onCorrect && <button className={overrides.correctionLink} onClick={onCorrect}>Hay un error en este gasto</button>}
  </aside></div>;
}

function ExpenseCorrectionSheet({ expense, debts, recurringActive, onClose, onCancelled }: { expense: DebtDashboard["expenses"][number]; debts: DebtSummary[]; recurringActive: boolean; onClose: () => void; onCancelled: (dashboard: DebtDashboard) => void }) {
  const dialogRef = useDialogFocus(onClose);
  const [reason, setReason] = useState<"wrong_amount" | "wrong_people" | "duplicate" | "other">("wrong_amount");
  const [commandId] = useState(() => `correction_cmd_${crypto.randomUUID().replaceAll("-", "")}`);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const hasActivePayment = debts.some((debt) => debt.paymentAttempts.some((attempt) => ["creating", "not_started", "pending"].includes(attempt.status)));
  const paidAmount = debts.reduce((sum, debt) => sum + debt.paidAmount, 0);
  const blocker = paidAmount > 0 ? "Este gasto ya tiene un abono registrado. Para conservar la historia, no podemos reemplazarlo desde esta demo." : hasActivePayment ? "Hay un pago demo en curso. Termínalo antes de corregir este gasto." : recurringActive ? "Detén primero el gasto habitual asociado antes de corregir esta versión." : "";
  const sharedCount = debts.reduce((sum, debt) => sum + debt.collection.sharedCount, 0);
  const cancelAndPrepare = async () => {
    if (busy || blocker) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/debt-center", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "cancel_expense_for_correction", commandId, expenseId: expense.id, reason }) });
      const payload = await response.json() as { dashboard?: DebtDashboard; message?: string };
      if (!response.ok || !payload.dashboard) throw new Error(payload.message || "No pudimos preparar la corrección.");
      onCancelled(payload.dashboard);
    } catch (nextError) { setError(nextError instanceof Error ? nextError.message : "No pudimos preparar la corrección."); }
    finally { setBusy(false); }
  };
  return <div className={styles.overlay}><section ref={dialogRef} className={`${styles.sheet} ${overrides.correctionSheet}`} role="dialog" aria-modal="true" aria-labelledby="correction-title">
    <header><div><small>CORRECCIÓN AUDITABLE</small><strong id="correction-title" data-dialog-initial tabIndex={-1}>Anular y preparar una copia</strong></div><button onClick={onClose} aria-label="Cerrar corrección">×</button></header>
    <div className={overrides.correctionSummary}><small>GASTO ORIGINAL</small><strong>{expense.title}</strong><b>{money.format(expense.totalAmount)}</b><span>{debts.length} {debts.length === 1 ? "cuenta afectada" : "cuentas afectadas"}{sharedCount > 0 ? ` · ${sharedCount} marcadas como compartidas` : ""}</span></div>
    <p className={overrides.correctionLead}>Anular no borra el gasto ni los mensajes que ya compartiste. Los links anteriores dejarán de aceptar pagos demo.</p>
    <fieldset className={overrides.correctionReasons}><legend>¿Qué necesitas corregir?</legend>{([["wrong_amount", "Monto incorrecto"], ["wrong_people", "Personas incorrectas"], ["duplicate", "Gasto duplicado"], ["other", "Otro motivo"]] as const).map(([value, label]) => <label key={value}><input type="radio" name="correction-reason" checked={reason === value} onChange={() => setReason(value)} /><span>{label}</span></label>)}</fieldset>
    {blocker ? <div className={styles.guardrail}><span>!</span><p><strong>No se puede anular todavía.</strong>{blocker}</p></div> : <div className={styles.guardrail}><span>i</span><p><strong>La copia seguirá siendo un borrador.</strong>Nada nuevo se guardará hasta que revises y confirmes todos los datos.</p></div>}
    {error && <p className={styles.formError} role="alert">{error}</p>}
    <button className={styles.primaryWide} disabled={Boolean(blocker) || busy} onClick={() => void cancelAndPrepare()}>{busy ? "Preparando…" : "Anular y preparar corrección"}</button>
  </section></div>;
}

function WhatsAppPreview({ debt, messageKind, onClose, onCopy }: { debt: DebtSummary; messageKind: CollectionMessageKind; onClose: () => void; onCopy: () => void }) {
  const dialogRef = useDialogFocus(onClose);
  return <div className={waStyles.overlay}><section ref={dialogRef} className={waStyles.app} role="dialog" aria-modal="true" aria-label="Vista previa de WhatsApp"><header><button onClick={onClose} aria-label="Volver">‹</button><span>{debt.debtorName.slice(0, 1)}</span><div><strong>{debt.debtorName}</strong><small>borrador · no enviado</small></div><b>⋮</b></header><div className={waStyles.chat}><time>{messageKind === "follow_up" ? "SEGUIMIENTO · BORRADOR" : "BORRADOR"}</time><div className={waStyles.bubble}><p>{collectionMessageBody(debt, messageKind)}</p><a href={`/pagar/${debt.publicToken}`}>pagar.yol1.demo/{debt.publicToken.slice(0, 8)}</a><span>Listo para copiar · todavía no enviado</span></div><p className={waStyles.guardrail}>Simulación: todavía no se envió ni abrió WhatsApp.</p></div><footer><div>Vista previa · sólo se copiará</div></footer><button className={waStyles.copy} onClick={onCopy}>Copiar mensaje y link demo</button></section></div>;
}

function CollectionShareConfirmation({ debt, messageKind, busy, onClose, onConfirm }: { debt: DebtSummary; messageKind: CollectionMessageKind; busy: boolean; onClose: () => void; onConfirm: () => void }) {
  const dialogRef = useDialogFocus(onClose, true, false);
  return <div className={styles.overlay}><section ref={dialogRef} className={`${styles.sheet} ${overrides.collectionConfirmation}`} role="dialog" aria-modal="true" aria-labelledby="collection-confirmation-title">
    <header><div><small>MENSAJE COPIADO · NO ENVIADO</small><strong id="collection-confirmation-title" tabIndex={-1} data-dialog-initial>¿Alcanzaste a compartirlo?</strong></div><button onClick={onClose} aria-label="Cerrar confirmación">×</button></header>
    <p>YOL1 no puede saber desde el portapapeles si compartiste el {messageKind === "follow_up" ? "seguimiento" : "cobro"} con {debt.debtorName}.</p>
    <div className={styles.guardrail}><span>i</span><p><strong>Lo anotaremos como una declaración tuya.</strong>No significa entregado, leído ni confirmado por WhatsApp.</p></div>
    <div className={overrides.collectionConfirmationActions}><button className={styles.secondaryButton} disabled={busy} onClick={onClose}>Ahora no</button><button className={styles.primaryButton} disabled={busy} onClick={onConfirm}>{busy ? "Guardando…" : "Sí, ya lo compartí"}</button></div>
  </section></div>;
}

function ExpenseComposer({ dashboard, preferredGroupId, initialDraft, resumedDraftId, returnHref, onClose, onDiscard, onSaved }: { dashboard: DebtDashboard; preferredGroupId: string | null; initialDraft: ExpenseDraftV1 | null; resumedDraftId: string | null; returnHref: string; onClose: () => void; onDiscard: () => void; onSaved: (dashboard: DebtDashboard, expenseId: string) => void }) {
  const initialParams = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const fromCompanion = initialParams.get("source") === "companion";
  const defaultGroupId = initialDraft?.groupId ?? preferredGroupId ?? dashboard.groups[0]?.id ?? "";
  const defaultGroup = dashboard.groups.find((item) => item.id === defaultGroupId);
  const defaultParticipants = initialDraft?.participantIds ?? defaultGroup?.participantIds ?? [];
  const defaultPayer = initialDraft?.paidBy ?? (defaultParticipants.includes(dashboard.currentParticipant.id) ? dashboard.currentParticipant.id : defaultParticipants[0] ?? "");
  const [step, setStep] = useState(initialDraft ? 4 : 1);
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [amountText, setAmountText] = useState(initialDraft?.amountText ?? "");
  const [groupId, setGroupId] = useState(defaultGroupId);
  const [paidBy, setPaidBy] = useState(defaultPayer);
  const [participantIds, setParticipantIds] = useState<string[]>(defaultParticipants);
  const [splitMode, setSplitMode] = useState<SplitMode>(initialDraft?.splitMode ?? "equal");
  const [splitInputs, setSplitInputs] = useState<Record<"amount" | "percentage" | "shares", Record<string, string>>>(() => {
    const empty = { amount: {}, percentage: {}, shares: {} } as Record<"amount" | "percentage" | "shares", Record<string, string>>;
    if (!initialDraft || initialDraft.splitMode === "equal") return empty;
    empty[initialDraft.splitMode] = Object.fromEntries(Object.entries(initialDraft.amounts).map(([id, value]) => [id, initialDraft.splitMode === "percentage" ? formatBasisPoints(value) : String(value)]));
    return empty;
  });
  const [receiptName, setReceiptName] = useState(initialDraft?.receiptName ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [commandId] = useState(() => resumedDraftId ?? createExpenseDraftId());
  const group = dashboard.groups.find((item) => item.id === groupId);
  const amount = /^\d+$/.test(amountText) ? Number(amountText) : Number.NaN;
  const validAmount = Number.isSafeInteger(amount) && amount > 0 && amount <= 100_000_000;
  const canonicalSplitValues = splitMode === "equal" ? undefined : Object.fromEntries(participantIds.map((id) => {
    const raw = splitInputs[splitMode][id] ?? "";
    return [id, splitMode === "percentage" ? parsePercentageBasisPoints(raw) : parseDigits(raw)];
  }));
  let calculatedShares: Array<{ participantId: string; amount: number }> | null = null;
  if (validAmount && participantIds.length >= 2) {
    try { calculatedShares = splitExpense(amount, participantIds, splitMode, canonicalSplitValues); } catch { calculatedShares = null; }
  }
  const canContinue = step === 1 ? title.trim().length > 1 && validAmount : step === 2 ? Boolean(group && participantIds.length >= 2 && participantIds.includes(paidBy)) : step === 3 ? Boolean(calculatedShares) : true;
  const reviewShares = (calculatedShares ?? []).map((share) => ({ person: dashboard.participants.find((item) => item.id === share.participantId), amount: share.amount, participantId: share.participantId }));
  const rawValues = splitMode === "equal" ? [] : participantIds.map((id) => canonicalSplitValues?.[id] ?? Number.NaN);
  const inputTotal = rawValues.every(Number.isFinite) ? rawValues.reduce((sum, value) => sum + value, 0) : Number.NaN;

  const initializeMode = (mode: SplitMode) => {
    setSplitMode(mode);
    if (mode === "equal") return;
    const defaults = mode === "amount" ? distributedIntegers(validAmount ? amount : 0, participantIds) : mode === "percentage" ? distributedIntegers(10_000, participantIds) : Object.fromEntries(participantIds.map((id) => [id, 1]));
    setSplitInputs((current) => ({
      ...current,
      [mode]: Object.fromEntries(participantIds.map((id) => [id, current[mode][id] ?? (mode === "percentage" ? formatBasisPoints(defaults[id]) : String(defaults[id]))])),
    }));
  };
  const updateSplitInput = (mode: "amount" | "percentage" | "shares", participantId: string, value: string) => {
    setSplitInputs((current) => ({ ...current, [mode]: { ...current[mode], [participantId]: value } }));
  };
  const splitStatus = splitMode === "amount"
    ? !Number.isFinite(inputTotal) ? "Escribe un monto válido para cada persona." : inputTotal === amount ? `✓ Total repartido: ${money.format(amount)}` : inputTotal < amount ? `Faltan ${money.format(amount - inputTotal)} por repartir.` : `Sobran ${money.format(inputTotal - amount)}. Reduce uno o más montos.`
    : splitMode === "percentage"
      ? !Number.isFinite(inputTotal) ? "Usa valores entre 0% y 100%, con hasta 2 decimales." : inputTotal === 10_000 ? `✓ Total: 100% · ${money.format(amount)}` : inputTotal < 10_000 ? `Falta ${formatBasisPoints(10_000 - inputTotal)}% por asignar.` : `Te pasaste por ${formatBasisPoints(inputTotal - 10_000)}%.`
      : splitMode === "shares"
        ? !Number.isFinite(inputTotal) || inputTotal <= 0 ? "Asigna al menos 1 parte en total." : calculatedShares ? `✓ ${inputTotal} ${inputTotal === 1 ? "parte" : "partes"} · convertidas a ${money.format(amount)}` : "Revisa las partes de cada persona."
        : amount % participantIds.length ? `Ajustamos ${money.format(amount % participantIds.length)} por redondeo para que el total cierre.` : "Todos aportan lo mismo.";
  const requestClose = () => {
    const untouched = !initialDraft && step === 1 && !title && !amountText && !receiptName;
    if (untouched) onClose();
    else setConfirmDiscard(true);
  };
  const dialogRef = useDialogFocus(requestClose, !confirmDiscard);
  const discardDialogRef = useDialogFocus(() => setConfirmDiscard(false), confirmDiscard);

  const save = async () => {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const access = parseOnboardingDemoSnapshot(window.localStorage.getItem(ONBOARDING_DEMO_STORAGE_KEY));
      if (!access) {
        const draftId = createExpenseDraftId();
        saveExpenseDraft(draftId, { title, amountText, groupId, paidBy, participantIds, splitMode, splitValues: canonicalSplitValues ?? {}, receiptName, correctionOfExpenseId: initialDraft?.correctionOfExpenseId });
        window.location.assign(buildOnboardingHref({ schema_version: "onboarding-entry-1", entry_context: "clear_accounts", requested_job: "save_clear_accounts_draft", return_to: "clear_accounts_draft", draft_id: draftId }));
        return;
      }
      const response = await fetch("/api/debt-center", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create_expense", commandId, groupId, title, totalAmount: amount, paidByParticipantId: paidBy, participantIds, splitMode, splitValues: canonicalSplitValues, receiptName, correctionOfExpenseId: initialDraft?.correctionOfExpenseId }) });
      const payload = await response.json() as { dashboard?: DebtDashboard; result?: { expense?: { id?: string } }; message?: string };
      if (!response.ok || !payload.dashboard || !payload.result?.expense?.id) throw new Error(payload.message || "No pudimos crear el gasto.");
      removeExpenseDraft(resumedDraftId);
      onSaved(payload.dashboard, payload.result.expense.id);
    } catch (nextError) { setError(nextError instanceof Error ? nextError.message : "No pudimos crear el gasto."); }
    finally { setBusy(false); }
  };

  return <div className={styles.overlay}><section ref={dialogRef} className={styles.composer} role="dialog" aria-modal="true" aria-labelledby="expense-title"><header><div><small>NUEVO GASTO · PASO {step} DE 4</small><strong id="expense-title">{step === 1 ? "¿Qué pagaste?" : step === 2 ? "¿Con quién?" : step === 3 ? "¿Cómo lo dividimos?" : "Revisa antes de crear"}</strong></div><button onClick={requestClose} aria-label="Cerrar">×</button></header><div className={styles.stepBar}><i style={{ width: `${step * 25}%` }} /></div><div className={styles.composerBody}>
    {fromCompanion && step === 1 && <div className={styles.handoffRibbon}><span>✦</span><p><strong>Desde Acompañante financiero</strong>Trajimos comercio y monto de la señal ficticia. Revisa todo antes de guardar.</p><a href={returnHref} onClick={(event) => { event.preventDefault(); window.location.assign(returnHref); }}>Volver</a></div>}
    {step === 1 && <><button className={receiptName ? styles.receiptSelected : styles.receiptButton} onClick={() => setReceiptName(receiptName ? "" : "boleta-demo-liguria.jpg")}><span>▣</span><div><strong>{receiptName ? "Boleta ficticia leída" : "Probar escaneo de boleta"}</strong><small>{receiptName ? "Monto y comercio son editables" : "Usa una imagen sintética; no sube archivos"}</small></div><b>{receiptName ? "✓" : "→"}</b></button><label className={styles.field}>Nombre del gasto<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej.: Cena en Liguria" /></label><label className={styles.field}>Monto total<div className={styles.moneyInput}><span>$</span><input inputMode="numeric" value={amountText} onChange={(event) => setAmountText(event.target.value)} placeholder="0" /></div>{amountText && !/^\d+$/.test(amountText) && <small>Escribe sólo pesos, sin signos, letras ni decimales.</small>}{Number.isFinite(amount) && amount > 100_000_000 && <small>Para esta demo, usa un monto de hasta $100.000.000.</small>}</label><div className={styles.guardrail}><span>i</span><p><strong>Usa sólo información ficticia.</strong>Esta demo conserva el gasto durante 7 días; no ingreses nombres, contactos o boletas reales.</p></div></>}
    {step === 2 && <><label className={styles.field}>Grupo<select value={groupId} disabled={Boolean(initialDraft?.correctionOfExpenseId)} onChange={(event) => { const nextGroupId = event.target.value; const nextGroup = dashboard.groups.find((item) => item.id === nextGroupId); const nextParticipants = nextGroup?.participantIds ?? []; setGroupId(nextGroupId); setParticipantIds(nextParticipants); setPaidBy(nextParticipants.includes(dashboard.currentParticipant.id) ? dashboard.currentParticipant.id : nextParticipants[0] ?? ""); }}>{dashboard.groups.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>{initialDraft?.correctionOfExpenseId && <p className={styles.selectionHint}>La copia queda en el grupo original para conservar la historia. Si necesitas otro grupo, crea un gasto nuevo.</p>}<p className={styles.sectionLabel}>QUIÉNES PARTICIPARON</p><div className={styles.peopleChoices}>{group?.participantIds.map((id) => { const person = dashboard.participants.find((item) => item.id === id); if (!person) return null; return <label key={id}><input type="checkbox" checked={participantIds.includes(id)} onChange={() => { const next = participantIds.includes(id) ? participantIds.filter((item) => item !== id) : [...participantIds, id]; setParticipantIds(next); if (!next.includes(paidBy)) setPaidBy(next[0] ?? ""); }} /><span>{person.initials}</span><strong>{person.name}</strong></label>; })}</div>{participantIds.length < 2 && <p className={styles.selectionHint}>Elige al menos dos personas para repartir este gasto.</p>}<label className={styles.field}>Quién pagó<select value={paidBy} disabled={participantIds.length === 0} onChange={(event) => setPaidBy(event.target.value)}>{participantIds.map((id) => { const person = dashboard.participants.find((item) => item.id === id); return person ? <option key={id} value={id}>{person.name}</option> : null; })}</select></label></>}
    {step === 3 && <>
      <div className={`${styles.segmented} ${styles.splitModes}`} role="radiogroup" aria-label="Forma de dividir" onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        const modes: SplitMode[] = ["equal", "amount", "percentage", "shares"];
        const offset = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
        const nextMode = modes[(modes.indexOf(splitMode) + offset + modes.length) % modes.length];
        initializeMode(nextMode);
        requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-split-mode="${nextMode}"]`)?.focus());
      }}>
        {(["equal", "amount", "percentage", "shares"] as SplitMode[]).map((mode) => <button key={mode} type="button" role="radio" data-split-mode={mode} tabIndex={splitMode === mode ? 0 : -1} aria-checked={splitMode === mode} className={splitMode === mode ? styles.segmentActive : ""} onClick={() => initializeMode(mode)}>{mode === "equal" ? "Iguales" : mode === "amount" ? "Montos" : mode === "percentage" ? "Porcentaje" : "Partes"}</button>)}
      </div>
      <p className={styles.splitHelp}>{splitMode === "equal" ? "Todos aportan lo mismo. Si sobra algún peso, Yol1 lo ajusta automáticamente." : splitMode === "amount" ? "Escribe cuánto le corresponde a cada persona." : splitMode === "percentage" ? "Define el porcentaje de cada persona. El total debe ser 100%." : "Usa proporciones: 2 partes aportan el doble que 1."}</p>
      <div className={styles.splitEditor}>{participantIds.map((id) => {
        const person = dashboard.participants.find((item) => item.id === id);
        const derived = calculatedShares?.find((share) => share.participantId === id)?.amount;
        if (!person) return null;
        return <label key={id}><span><b>{person.initials}</b><span>{person.name}{splitMode !== "equal" && Number.isSafeInteger(derived) && <small>{derived === 0 ? "No genera cobro" : money.format(derived ?? 0)}</small>}</span></span>{splitMode === "equal" ? <strong>{money.format(derived ?? 0)}</strong> : splitMode === "percentage" ? <span className={styles.unitInput}><input inputMode="decimal" aria-label={`Porcentaje de ${person.name}`} value={splitInputs.percentage[id] ?? ""} onChange={(event) => updateSplitInput("percentage", id, event.target.value)} placeholder="0" /><b>%</b></span> : splitMode === "shares" ? <span className={styles.shareStepper}><button type="button" aria-label={`Quitar una parte a ${person.name}`} onClick={() => updateSplitInput("shares", id, String(Math.max(0, (parseDigits(splitInputs.shares[id] ?? "1") || 0) - 1)))}>−</button><input inputMode="numeric" aria-label={`Partes de ${person.name}`} value={splitInputs.shares[id] ?? ""} onChange={(event) => updateSplitInput("shares", id, event.target.value)} /><button type="button" aria-label={`Agregar una parte a ${person.name}`} onClick={() => updateSplitInput("shares", id, String(Math.min(1_000_000, (parseDigits(splitInputs.shares[id] ?? "0") || 0) + 1)))}>＋</button></span> : <span className={styles.unitInput}><b>$</b><input inputMode="numeric" aria-label={`Monto de ${person.name}`} value={splitInputs.amount[id] ?? ""} onChange={(event) => updateSplitInput("amount", id, event.target.value)} placeholder="0" /></span>}</label>;
      })}</div>
      <p className={calculatedShares ? styles.sumOk : styles.sumWarn} aria-live="polite">{splitStatus}</p>
    </>}
    {step === 4 && <>
      <div className={styles.reviewCard}>
        <small>{group?.name}</small><strong>{title}</strong><b>{money.format(amount)}</b>
        <p>{participantIds.length} personas · reparto por {splitModeLabel[splitMode].toLocaleLowerCase("es-CL")}</p>
        <button className={styles.editSplit} onClick={() => setStep(3)}>Editar reparto</button>
        <div className={styles.reviewPayer}><span>Pagó</span><strong>{dashboard.participants.find((person) => person.id === paidBy)?.name ?? "Por definir"}</strong></div>
        <div className={styles.reviewShares}>{reviewShares.map(({ person, amount: share, participantId }) => person ? <div key={person.id}><span>{person.name}<small>{share === 0 ? "No genera cobro" : person.id === paidBy ? `Pagó · su parte ${money.format(share)}` : splitMode === "percentage" ? `${splitInputs.percentage[participantId]}% · debe ${money.format(share)}` : splitMode === "shares" ? `${splitInputs.shares[participantId]} ${splitInputs.shares[participantId] === "1" ? "parte" : "partes"} · debe ${money.format(share)}` : splitMode === "amount" ? `Monto exacto · debe ${money.format(share)}` : `Parte igual · debe ${money.format(share)}`}</small></span><strong>{money.format(share)}</strong></div> : null)}</div>
      </div>
      {initialDraft?.correctionOfExpenseId ? <div className={styles.guardrail}><span>↻</span><p><strong>COPIA PARA CORREGIR</strong>Preparamos una copia del gasto anulado. Todavía no existe una versión nueva. Revisa monto, personas, pagador y reparto antes de crearla.</p></div> : initialDraft ? <div className={styles.guardrail}><span>✓</span><p><strong>Borrador recuperado.</strong>Volviste exactamente al gasto que estabas preparando. Revisa antes de crearlo.</p></div> : null}
      <div className={styles.guardrail}><span>i</span><p><strong>Esto crea acuerdos, no pagos.</strong>Los cobros quedan listos para revisar. No contactaremos a nadie automáticamente. Si aún no tienes acceso demo, conservaremos este borrador mientras confirmas un canal.</p></div>
    </>}
    {error && <p className={styles.formError}>{error}</p>}
  </div><footer><button className={styles.secondaryButton} onClick={() => step === 1 ? requestClose() : setStep(step - 1)}>{step === 1 ? "Cancelar" : "Atrás"}</button><button className={styles.primaryButton} disabled={!canContinue || busy} onClick={() => { if (step === 4) void save(); else { if (step === 2) initializeMode(splitMode); setStep(step + 1); } }}>{busy ? "Creando…" : step === 4 ? "Crear gasto y preparar cobros" : "Continuar"}</button></footer></section>{confirmDiscard && <section ref={discardDialogRef} className={styles.confirmDialog} role="alertdialog" aria-modal="true" aria-labelledby="discard-title"><span>GASTO SIN GUARDAR</span><strong id="discard-title">¿Quieres descartar este borrador?</strong><p>Si sigues editando, conservaremos todo tal como está.</p><div><button onClick={() => setConfirmDiscard(false)}>Seguir editando</button><button onClick={onDiscard}>Descartar borrador</button></div></section>}</div>;
}

function GroupComposer({ dashboard, onClose, onSaved }: { dashboard: DebtDashboard; onClose: () => void; onSaved: (dashboard: DebtDashboard) => void }) {
  const [commandId] = useState(() => `group_cmd_${crypto.randomUUID().replaceAll("-", "")}`);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"trip" | "home" | "meal" | "activity" | "monthly" | "other">("trip");
  const [participantIds, setParticipantIds] = useState([dashboard.currentParticipant.id]);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useDialogFocus(onClose);
  const save = async () => {
    if (busy) return; setBusy(true); setError("");
    try {
      const response = await fetch("/api/debt-center", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create_group", commandId, name, category, participantIds, newParticipantNames: newName.trim() ? [newName] : [] }) });
      const payload = await response.json() as { dashboard?: DebtDashboard; message?: string };
      if (!response.ok || !payload.dashboard) throw new Error(payload.message || "No pudimos crear el grupo.");
      onSaved(payload.dashboard);
    } catch (nextError) { setError(nextError instanceof Error ? nextError.message : "No pudimos crear el grupo."); }
    finally { setBusy(false); }
  };
  return <div className={styles.overlay}><section ref={dialogRef} className={styles.composer} role="dialog" aria-modal="true" aria-labelledby="group-title"><header><div><small>NUEVO GRUPO</small><strong id="group-title">Un espacio para ponerse de acuerdo.</strong></div><button onClick={onClose} aria-label="Cerrar nuevo grupo">×</button></header><div className={styles.composerBody}><label className={styles.field}>Nombre del grupo<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej.: Viaje a Chiloé" /></label><label className={styles.field}>Tipo<select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>{Object.entries(categoryLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><p className={styles.sectionLabel}>PERSONAS</p><div className={styles.peopleChoices}>{dashboard.participants.map((person) => <label key={person.id}><input type="checkbox" disabled={person.id === dashboard.currentParticipant.id} checked={participantIds.includes(person.id)} onChange={() => setParticipantIds((current) => current.includes(person.id) ? current.filter((id) => id !== person.id) : [...current, person.id])} /><span>{person.initials}</span><strong>{person.name}</strong></label>)}</div><label className={styles.field}>Agregar contacto demo (opcional)<input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Nombre ficticio" /></label><div className={styles.guardrail}><span>i</span><p><strong>Usa sólo personas ficticias.</strong>Nadie será invitado. La demo conserva este espacio durante 7 días; no ingreses nombres ni contactos reales.</p></div>{error && <p className={styles.formError}>{error}</p>}</div><footer><button className={styles.secondaryButton} onClick={onClose}>Cancelar</button><button className={styles.primaryButton} disabled={name.trim().length < 2 || participantIds.length + (newName.trim() ? 1 : 0) < 2 || busy} onClick={() => void save()}>{busy ? "Creando…" : "Crear grupo"}</button></footer></section></div>;
}

function Empty({ title, detail }: { title: string; detail: string }) { return <div className={styles.empty}><span>✓</span><strong>{title}</strong><p>{detail}</p></div>; }
