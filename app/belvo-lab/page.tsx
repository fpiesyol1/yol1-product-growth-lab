import type { Metadata } from "next";
import Link from "next/link";
import BelvoLabClient from "./belvo-lab-client";
import styles from "./belvo-lab.module.css";

export const metadata: Metadata = {
  title: "Belvo Chile Fixture Lab — Yol1",
  description: "Simulación local para explorar un contrato tributario posible sin conectar a Belvo.",
  robots: { index: false, follow: false },
};

export default function BelvoLabPage() {
  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Volver a Yol1 Product Lab">
          <span className={styles.mark}>Y1</span>
          <span>
            <strong>Yol1 · Side project</strong>
            <small>Belvo Chile Fixture Lab</small>
          </span>
        </Link>
        <span className={styles.environment}>LOCAL FIXTURE · 0 RED</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>SIMULADOR DE CONTRATO · FISCAL CHILE</p>
        <h1>Explora la experiencia tributaria sin conectarte a Belvo.</h1>
        <p className={styles.lede}>
          Este laboratorio usa una fixture determinista y ficticia. Permite discutir el producto,
          pero no autentica, no crea Links y no demuestra cobertura real del proveedor.
        </p>
      </section>

      <section className={styles.evidenceGrid} aria-label="Evidencia previa">
        <article className={styles.evidenceCard}>
          <span className={styles.evidenceIndex}>01</span>
          <div>
            <p>Contrato de producto</p>
            <h2>Modelado</h2>
            <span>La interfaz representa resúmenes sintéticos de estado tributario y facturas.</span>
          </div>
        </article>
        <article className={`${styles.evidenceCard} ${styles.warningCard}`}>
          <span className={styles.evidenceIndex}>02</span>
          <div>
            <p>Cobertura del proveedor</p>
            <h2>No comprobada</h2>
            <span>Esta versión no consulta catálogos, cuentas ni endpoints de Belvo.</span>
          </div>
        </article>
        <article className={styles.evidenceCard}>
          <span className={styles.evidenceIndex}>03</span>
          <div>
            <p>Fuente de esta demo</p>
            <h2>100% local</h2>
            <span>Una ruta propia devuelve siempre la misma fixture, sin llaves ni datos reales.</span>
          </div>
        </article>
      </section>

      <BelvoLabClient />

      <section className={styles.boundary}>
        <div>
          <p className={styles.eyebrow}>LÍMITE DEL EXPERIMENTO</p>
          <h2>Una fixture sólo demuestra la experiencia.</h2>
        </div>
        <p>
          Cargarla no demuestra acceso a personas, disponibilidad en sandbox, cobertura productiva
          ni autorización regulatoria. Este Lab no acepta secretos, ClaveÚnica, clave del SII ni
          datos financieros; tampoco intenta conectarse si la simulación falla.
        </p>
      </section>

      <footer className={styles.footer}>
        <span>Yol1 Research · fixture local · 26 agosto 2026</span>
        <div>Fuentes de investigación documentadas en BELVO-CHILE-SANDBOX-LAB.md</div>
      </footer>
    </main>
  );
}
