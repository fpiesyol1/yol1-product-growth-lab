"use client";

import { useState } from "react";
import styles from "./belvo-lab.module.css";

type ProbeStatus = "pass" | "blocked" | "info";

type ProbeResult = {
  verdict: "fixture_ready";
  title: string;
  summary: string;
  checkedAt: string;
  institutions: Array<{ name: string; displayName: string }>;
  steps: Array<{
    id: string;
    label: string;
    status: ProbeStatus;
    detail: string;
  }>;
  taxStatus: {
    records: number;
    sections: string[];
    entityType: string | null;
    activityCount: number;
  };
  invoices: {
    records: number;
    totalAmount: number;
    currencies: string[];
    inflow: number;
    outflow: number;
  };
};

const statusLabel: Record<ProbeStatus, string> = {
  pass: "Incluido",
  blocked: "Desconectado",
  info: "Por validar",
};

function money(value: number, currency = "CLP") {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BelvoLabClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProbeResult | null>(null);
  const [error, setError] = useState("");

  async function loadFixture() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/belvo-lab/probe", {
        method: "GET",
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "No fue posible cargar la fixture local.");
      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.labShell} aria-labelledby="fixture-title">
      <div className={styles.controlPanel}>
        <div className={styles.panelHeading}>
          <div>
            <p className={styles.eyebrow}>SIMULACIÓN LOCAL</p>
            <h2 id="fixture-title">Explora un contrato tributario sin conectar nada</h2>
          </div>
          <span className={styles.noStorage}>0 red · 0 datos reales</span>
        </div>

        <div className={styles.localAssurance}>
          <span aria-hidden="true">✓</span>
          <div>
            <strong>No necesitamos llaves ni datos personales.</strong>
            <p>El ejemplo está dentro del repositorio y siempre devuelve el mismo escenario ficticio.</p>
          </div>
        </div>

        <button
          className={styles.primaryButton}
          type="button"
          onClick={loadFixture}
          disabled={loading}
        >
          {loading ? "Cargando fixture…" : "Cargar fixture local"}
        </button>

        <details className={styles.setupHelp}>
          <summary>Qué permite revisar</summary>
          <ol>
            <li>El resumen mínimo que una integración futura podría entregar.</li>
            <li>Cómo distinguir institución, estado tributario y facturas.</li>
            <li>Los límites antes de validar cobertura real con un proveedor.</li>
          </ol>
        </details>
      </div>

      <div className={styles.reportPanel} aria-live="polite">
        {!result && !error ? (
          <div className={styles.emptyReport}>
            <span>Y1</span>
            <h2>La simulación está lista.</h2>
            <p>Carga la fixture para recorrer datos sintéticos. Esta acción no sale de YOL1.</p>
          </div>
        ) : null}

        {error ? (
          <div className={styles.errorReport} role="alert">
            <span>FIXTURE NO DISPONIBLE</span>
            <h2>{error}</h2>
            <p>No hubo un intento alternativo de conexión. El Lab falla cerrado.</p>
          </div>
        ) : null}

        {result ? (
          <div className={styles.report} data-verdict={result.verdict}>
            <div className={styles.verdict}>
              <span>FIXTURE LOCAL · NO ES RESPUESTA DE BELVO</span>
              <h2>{result.title}</h2>
              <p>{result.summary}</p>
              <small>
                Corte fijo {new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(result.checkedAt))}
              </small>
            </div>

            <ol className={styles.timeline}>
              {result.steps.map((step) => (
                <li key={step.id} data-status={step.status}>
                  <span className={styles.timelineDot} aria-hidden="true" />
                  <div>
                    <small>{statusLabel[step.status]}</small>
                    <strong>{step.label}</strong>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className={styles.dataGrid}>
              <article>
                <small>ESTADO TRIBUTARIO FICTICIO</small>
                <strong>{result.taxStatus.records}</strong>
                <p>{result.taxStatus.sections.join(" · ")}</p>
              </article>
              <article>
                <small>FACTURAS FICTICIAS · 365 DÍAS</small>
                <strong>{result.invoices.records}</strong>
                <p>{result.invoices.inflow} recibidas · {result.invoices.outflow} emitidas</p>
              </article>
              <article>
                <small>MONTO SINTÉTICO</small>
                <strong>{money(result.invoices.totalAmount, result.invoices.currencies[0] ?? "CLP")}</strong>
                <p>No equivale a ingreso, deuda ni capacidad de pago real.</p>
              </article>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
