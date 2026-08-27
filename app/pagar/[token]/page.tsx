"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { PaymentAttemptStatus, PublicDebt } from "../../../lib/debt-center/types";
import styles from "./pagar.module.css";

const money = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
type Screen = "choose" | "bank" | "authorize" | "confirming" | "result" | "cancelled" | "error";

export default function PublicPaymentPage({ params }: { params: Promise<{ token: string }> }) {
  const [publicToken, setPublicToken] = useState("");
  const [debt, setDebt] = useState<PublicDebt | null>(null);
  const [screen, setScreen] = useState<Screen>("choose");
  const [mode, setMode] = useState<"all" | "partial">("all");
  const [amount, setAmount] = useState(0);
  const [attemptId, setAttemptId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [resultAmount, setResultAmount] = useState(0);
  const [historicalPaid, setHistoricalPaid] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(() => `payer_${crypto.randomUUID()}`);

  const load = useCallback(async (token: string) => {
    const response = await fetch(`/api/debt-center/public/${encodeURIComponent(token)}`, { cache: "no-store" });
    const payload = await response.json() as { debt?: PublicDebt; message?: string };
    if (!response.ok || !payload.debt) throw new Error(payload.message || "Este cobro demo no está disponible.");
    setDebt(payload.debt);
    const attemptFromUrl = new URLSearchParams(window.location.search).get("attempt");
    if (attemptFromUrl && payload.debt.lastCompletedAttempt?.id === attemptFromUrl) {
      setAttemptId(attemptFromUrl);
      setAmount(payload.debt.lastCompletedAttempt.amount);
      setResultAmount(payload.debt.lastCompletedAttempt.amount);
      setHistoricalPaid(false);
      setScreen("result");
    } else if (payload.debt.status === "cancelled") { setScreen("cancelled"); }
    else if (payload.debt.status === "paid") { setHistoricalPaid(true); setScreen("result"); }
    else if (payload.debt.activeAttempt) {
      setAttemptId(payload.debt.activeAttempt.id);
      setAmount(payload.debt.activeAttempt.amount);
      setHistoricalPaid(false);
      if (payload.debt.activeAttempt.status === "pending") setScreen("authorize");
      else if (payload.debt.activeAttempt.status === "not_started") setScreen("bank");
    } else setAmount((current) => current || payload.debt!.outstandingAmount);
    return payload.debt;
  }, []);

  useEffect(() => {
    void params.then(({ token }) => {
      setPublicToken(token);
      return load(token);
    }).catch((error) => { setMessage(error instanceof Error ? error.message : "No pudimos abrir este cobro."); setScreen("error"); });
  }, [load, params]);

  const remainingAfter = debt ? Math.max(0, debt.outstandingAmount - amount) : 0;
  const validAmount = debt && Number.isSafeInteger(amount) && amount > 0 && amount <= debt.outstandingAmount;

  const createAttempt = async () => {
    if (!validAmount || busy) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/debt-center/public/${encodeURIComponent(publicToken)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({ amount }),
      });
      const payload = await response.json() as { attempt?: { id: string }; publicDebt?: PublicDebt; message?: string };
      if (!response.ok || !payload.attempt) throw new Error(payload.message || "No pudimos preparar el pago demo.");
      setAttemptId(payload.attempt.id);
      if (payload.publicDebt) setDebt(payload.publicDebt);
      window.history.replaceState({}, "", `/pagar/${encodeURIComponent(publicToken)}?attempt=${encodeURIComponent(payload.attempt.id)}`);
      setScreen("bank");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No pudimos preparar el pago demo."); }
    finally { setBusy(false); }
  };

  const simulate = async (status: PaymentAttemptStatus, errorCode?: string) => {
    if (!attemptId || busy) return;
    setBusy(true); setMessage("");
    if (status === "succeeded") setScreen("confirming");
    try {
      const response = await fetch(`/api/debt-center/attempts/${encodeURIComponent(attemptId)}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicToken, status, errorCode }),
      });
      const payload = await response.json() as { publicDebt?: PublicDebt; message?: string };
      if (!response.ok || !payload.publicDebt) throw new Error(payload.message || "No pudimos actualizar el pago demo.");
      setDebt(payload.publicDebt);
      if (status === "pending") setScreen("authorize");
      else if (status === "succeeded") { setHistoricalPaid(false); setResultAmount(amount); setScreen("result"); }
      else if (status === "cancelled") { setAttemptId(""); setSelectedBank(""); setMode("all"); setIdempotencyKey(`payer_${crypto.randomUUID()}`); setAmount(payload.publicDebt.outstandingAmount); setMessage("No se cobró nada. Puedes elegir otro monto."); setScreen("choose"); }
      else { setMessage(status === "expired" ? "El intento demo venció. No se cobró nada." : "El banco demo rechazó el pago. No se cobró nada."); setScreen("error"); }
    } catch (error) { setMessage(error instanceof Error ? error.message : "No pudimos actualizar el pago demo."); setScreen("error"); }
    finally { setBusy(false); }
  };

  const retry = async () => {
    setAttemptId(""); setSelectedBank(""); setMessage(""); setMode("all");
    setIdempotencyKey(`payer_${crypto.randomUUID()}`);
    try { const fresh = await load(publicToken); setAmount(fresh.outstandingAmount); setScreen("choose"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No pudimos actualizar el saldo."); }
  };

  if (!debt && screen !== "error") return <main className={styles.center}><span className={styles.loader} /><p>Abriendo tu cobro demo…</p></main>;
  if (!debt) return <main className={styles.center}><span className={styles.errorMark}>!</span><h1>No pudimos abrir este cobro</h1><p>{message}</p><Link href="/?product=clear_accounts">Conocer Cuentas Claras</Link></main>;

  return <main className={styles.shell}>
    <header className={styles.header}><Link href="/?product=clear_accounts" aria-label="Conocer Cuentas Claras"><span>yol1</span><b>≍ Cuentas Claras</b></Link><span>SIMULACIÓN · NO MUEVE PLATA</span></header>
    <section className={styles.card}>
      {screen === "choose" && <><div className={styles.context}><span>{debt.creditorName.slice(0, 1)}</span><div><small>{debt.creditorName.toUpperCase()} TE PIDIÓ PAGAR</small><strong>{debt.expenseTitle}</strong><p>{debt.groupName}</p></div></div><p className={styles.identityNotice}>Cobro asociado a <strong>{debt.debtorName}</strong>. Si pagas por otra persona, el abono igualmente se acreditará a su deuda.</p><div className={styles.amountHero}><small>PENDIENTE</small><strong>{money.format(debt.outstandingAmount)}</strong><p>Total {money.format(debt.originalAmount)} · Ya pagado {money.format(debt.paidAmount)}</p></div><div className={styles.choice}><button className={mode === "all" ? styles.choiceActive : ""} onClick={() => { setMode("all"); setAmount(debt.outstandingAmount); }}><span>○</span><div><strong>Pagar todo</strong><small>{money.format(debt.outstandingAmount)}</small></div></button><button className={mode === "partial" ? styles.choiceActive : ""} onClick={() => { setMode("partial"); setAmount(Math.min(5000, debt.outstandingAmount)); }}><span>◐</span><div><strong>Pagar una parte</strong><small>Tú eliges cuánto</small></div></button></div>{mode === "partial" && <label className={styles.partialField}>¿Cuánto quieres pagar?<div><span>$</span><input autoFocus inputMode="numeric" value={amount || ""} onChange={(event) => { const raw = event.target.value; if (raw === "") { setAmount(0); setMessage(""); return; } if (!/^\d+$/.test(raw)) { setMessage("Escribe sólo pesos, sin signos, letras ni decimales."); return; } setMessage(""); setAmount(Number(raw)); }} /></div><small>Máximo {money.format(debt.outstandingAmount)}</small>{validAmount && <p>Después de este pago quedarán <strong>{money.format(remainingAfter)}</strong>.</p>}</label>}{message && <p className={styles.inlineError}>{message}</p>}<button className={styles.primary} disabled={!validAmount || busy} onClick={() => void createAttempt()}>{busy ? "Preparando…" : "Continuar con pago simulado"}</button><details className={styles.explain}><summary>Ver cómo se calculó</summary><p>Tu parte original fue {money.format(debt.originalAmount)}. Restamos sólo abonos confirmados ({money.format(debt.paidAmount)}). Por eso quedan {money.format(debt.outstandingAmount)}.</p></details></>}

      {screen === "bank" && <><button className={styles.back} onClick={() => void simulate("cancelled")}>← Cancelar y cambiar monto</button><p className={styles.kicker}>PASO 2 DE 3</p><h1>Elige un banco demo</h1><p className={styles.lede}>Esta pantalla imita un flujo bancario. No se conecta a Floid ni a un banco y nunca solicita claves.</p><div className={styles.bankList}>{[{id:"estado",name:"BancoEstado",mark:"BE"},{id:"bci",name:"BCI",mark:"BC"},{id:"santander",name:"Santander",mark:"ST"}].map((bank) => <button key={bank.id} className={selectedBank === bank.id ? styles.bankActive : ""} onClick={() => setSelectedBank(bank.id)}><span>{bank.mark}</span><strong>{bank.name}</strong><b>›</b></button>)}</div><button className={styles.primary} disabled={!selectedBank || busy} onClick={() => void simulate("pending")}>{busy ? "Abriendo…" : `Continuar por ${selectedBank ? ({estado:"BancoEstado",bci:"BCI",santander:"Santander"} as Record<string,string>)[selectedBank] : "el banco"}`}</button></>}

      {screen === "authorize" && <><div className={styles.bankMock}><span>SIMULADOR DEL BANCO</span><b>{selectedBank ? ({estado:"BancoEstado",bci:"BCI",santander:"Santander"} as Record<string,string>)[selectedBank] : "Banco demo"}</b></div><p className={styles.kicker}>PASO 3 DE 3</p><h1>Autoriza {money.format(amount)}</h1><p className={styles.lede}>Simulamos la confirmación que normalmente ocurre en la app o sitio de tu banco.</p><div className={styles.paymentFacts}><div><span>Destino</span><strong>{debt.creditorName}</strong></div><div><span>Por</span><strong>{debt.expenseTitle}</strong></div><div><span>Monto</span><strong>{money.format(amount)}</strong></div></div><button className={styles.primary} disabled={busy} onClick={() => void simulate("succeeded")}>Aprobar pago simulado</button><button className={styles.secondary} disabled={busy} onClick={() => void simulate("failed", "INSUFFICIENT_BALANCE")}>Simular rechazo del banco</button><button className={styles.scenarioToggle} onClick={() => setScenarioOpen(!scenarioOpen)}>Probar otro escenario {scenarioOpen ? "−" : "+"}</button>{scenarioOpen && <button className={styles.expire} disabled={busy} onClick={() => void simulate("expired")}>Simular que el link venció</button>}</>}

      {screen === "confirming" && <div className={styles.confirming}><span className={styles.loader} /><p className={styles.kicker}>APLICANDO RESULTADO SIMULADO LOCAL</p><h1>No cierres esta ventana.</h1><p>Estamos aplicando el resultado ficticio antes de actualizar esta cuenta demo.</p></div>}

      {screen === "result" && <div className={styles.result}><span className={styles.success}>✓</span><p className={styles.kicker}>{historicalPaid ? "ESTADO DE LA CUENTA" : "PAGO SIMULADO REGISTRADO"}</p><h1>{historicalPaid ? "Esta cuenta ya estaba pagada." : debt.outstandingAmount === 0 ? "Esta cuenta quedó al día en la demo." : "Tu parte quedó actualizada."}</h1><div className={styles.receipt}>{!historicalPaid && <div><span>Abono</span><strong>{money.format(resultAmount)}</strong></div>}<div><span>Pagado acumulado</span><strong>{money.format(debt.paidAmount)}</strong></div><div><span>Aún pendiente</span><strong>{money.format(debt.outstandingAmount)}</strong></div></div>{debt.outstandingAmount > 0 && <p className={styles.remaining}>Aún quedan <strong>{money.format(debt.outstandingAmount)}</strong> en esta cuenta. Puedes volver más adelante y hacer otro abono.</p>}{message && <p className={styles.remaining}>{message}</p>}<button className={styles.primary} onClick={() => { window.close(); setMessage("Listo. Si esta pestaña sigue abierta, ya puedes cerrarla."); }}>Listo, volver al chat</button><section className={styles.creatorInvite}><strong>¿También organizas gastos con otras personas?</strong><p>Puedes probarlo sin registrarte. Sólo pediremos un acceso demo si decides guardar el gasto.</p><Link data-event-id="payer_creator_intent_selected" href="/?product=clear_accounts&source=payer_success&new=expense">Quiero dividir un gasto con mi grupo</Link></section><p className={styles.trust}>Este comprobante pertenece a una simulación. No acredita una transferencia real.</p></div>}

      {screen === "cancelled" && <div className={styles.result}><span className={styles.failure}>×</span><p className={styles.kicker}>COBRO ANULADO</p><h1>Este link ya no acepta pagos demo.</h1><p className={styles.remaining}>Quien creó el gasto detectó un error y anuló esta versión. No se cobró nada. Si preparó una cuenta corregida, pídele el link nuevo.</p><Link className={styles.primary} href="/?product=clear_accounts">Conocer Cuentas Claras</Link><p className={styles.trust}>Conservamos este estado para que un link antiguo nunca parezca vigente.</p></div>}

      {screen === "error" && <div className={styles.result}><span className={styles.failure}>!</span><p className={styles.kicker}>NO SE COBRÓ NADA</p><h1>El pago no se completó.</h1><p className={styles.remaining}>{message}</p><button className={styles.primary} disabled={busy} onClick={() => void retry()}>Intentar nuevamente</button><Link className={styles.cancelLink} href="/">Salir sin pagar</Link></div>}
    </section>
    <footer className={styles.footer}><span>Yol1 no recibe, retiene ni guarda este dinero.</span><Link href="/?product=clear_accounts">¿Qué es Cuentas Claras?</Link></footer>
  </main>;
}
