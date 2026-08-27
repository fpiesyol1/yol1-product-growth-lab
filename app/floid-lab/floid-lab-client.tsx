"use client";

import { useState } from "react";
import styles from "../belvo-lab/belvo-lab.module.css";

type ProbeResult = {
  verdict: "module_blocked";
  title: string;
  summary: string;
  checkedAt: string;
  steps: Array<{ id: string; label: string; status: "blocked" | "info"; detail: string }>;
  banking: { accounts: number; cards: number; creditLines: number; movements: number; movementInflowsClp: number; movementOutflowsClp: number; usedCreditClp: number; availableCreditClp: number };
};

const statusLabel = { blocked: "Bloqueado por diseño", info: "Dato ficticio" };
const money = (value: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);

export default function FloidLabClient() {
  const [result, setResult] = useState<ProbeResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function execute() {
    setLoading(true);
    const response = await fetch("/api/floid-lab/probe", { method: "POST" });
    setResult(await response.json() as ProbeResult);
    setLoading(false);
  }

  return <section className={styles.labShell} aria-labelledby="floid-probe-title">
    <div className={styles.controlPanel}>
      <div className={styles.panelHeading}><div><p className={styles.eyebrow}>SIMULACIÓN LOCAL</p><h2 id="floid-probe-title">Explora sin conectar un banco</h2></div><span className={styles.noStorage}>Cero credenciales</span></div>
      <p>Este escenario reproduce la forma de productos y cartolas con información ficticia. No llama a Floid, no pide claves y no mueve dinero.</p>
      <button className={styles.primaryButton} type="button" onClick={execute} disabled={loading}>{loading ? "Preparando ejemplo…" : "Cargar escenario simulado"}</button>
      <details className={styles.setupHelp}><summary>Qué aprenderemos</summary><ol><li>Qué puede explicar el Acompañante con una cartola normalizada.</li><li>Qué datos faltan para hablar responsablemente de deuda formal.</li><li>Qué integraciones serían propuestas futuras, no capacidades activas.</li></ol></details>
    </div>
    <div className={styles.reportPanel} aria-live="polite">
      {!result ? <div className={styles.emptyReport}><span>Y1</span><h2>Floid está desconectado.</h2><p>Presiona el botón para cargar sólo un fixture local.</p></div> : <div className={styles.report} data-verdict={result.verdict}>
        <div className={styles.verdict}><span>SIMULACIÓN</span><h2>{result.title}</h2><p>{result.summary}</p><small>Generado {new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(result.checkedAt))}</small></div>
        <ol className={styles.timeline}>{result.steps.map((step) => <li key={step.id} data-status={step.status}><span className={styles.timelineDot} aria-hidden="true" /><div><small>{statusLabel[step.status]}</small><strong>{step.label}</strong><p>{step.detail}</p></div></li>)}</ol>
        <div className={styles.dataGrid}><article><small>PRODUCTOS FICTICIOS</small><strong>{result.banking.accounts + result.banking.cards + result.banking.creditLines}</strong><p>{result.banking.accounts} cuenta · {result.banking.cards} tarjeta · {result.banking.creditLines} línea</p></article><article><small>CARTOLA FICTICIA</small><strong>{result.banking.movements}</strong><p>{money(result.banking.movementInflowsClp)} entra · {money(result.banking.movementOutflowsClp)} sale</p></article><article><small>CRÉDITO FICTICIO</small><strong>{money(result.banking.usedCreditClp)}</strong><p>{money(result.banking.availableCreditClp)} disponible</p></article></div>
      </div>}
    </div>
  </section>;
}
