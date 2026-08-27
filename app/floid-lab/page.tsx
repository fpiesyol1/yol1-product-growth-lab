import type { Metadata } from "next";
import Link from "next/link";
import FloidLabClient from "./floid-lab-client";
import styles from "../belvo-lab/belvo-lab.module.css";

export const metadata: Metadata = {
  title: "Simulador local de datos bancarios — Yol1",
  description: "Fixture local y desconectado para explorar productos, cartolas y cobertura de deuda en Chile.",
  robots: { index: false, follow: false },
};

export default function FloidLabPage() {
  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Volver a Yol1 Product Lab">
          <span className={styles.mark}>Y1</span>
          <span>
            <strong>Yol1 · Side project</strong>
            <small>Simulador local de datos bancarios</small>
          </span>
        </Link>
        <span className={styles.environment}>FIXTURE LOCAL</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>PRUEBA DE FACTIBILIDAD · SALUD FINANCIERA</p>
        <h1>¿Floid puede unir cartola, cupos y deuda para Yol1?</h1>
        <p className={styles.lede}>
          Exploramos el contrato de una capa bancaria con datos sintéticos y dejamos explícito qué falta para sumar
          el Certificado de Deudas CMF. Son módulos complementarios, no una respuesta única.
        </p>
      </section>

      <section className={styles.evidenceGrid} aria-label="Mapa de capacidades">
        <article className={styles.evidenceCard}>
          <span className={styles.evidenceIndex}>01</span>
          <div>
            <p>Productos bancarios</p>
            <h2>Cuentas + tarjetas</h2>
            <span>Saldos, tarjetas, líneas, cupo usado y disponible.</span>
          </div>
        </article>
        <article className={styles.evidenceCard}>
          <span className={styles.evidenceIndex}>02</span>
          <div>
            <p>Cartola</p>
            <h2>Hasta 12 meses</h2>
            <span>Movimientos de la cuenta seleccionada; Santander también documenta tarjetas.</span>
          </div>
        </article>
        <article className={`${styles.evidenceCard} ${styles.warningCard}`}>
          <span className={styles.evidenceIndex}>03</span>
          <div>
            <p>Deuda oficial</p>
            <h2>Módulo CMF aparte</h2>
            <span>Existe comercialmente, pero requiere habilitación y contrato técnico de Floid.</span>
          </div>
        </article>
      </section>

      <FloidLabClient />

      <section className={styles.boundary}>
        <div>
          <p className={styles.eyebrow}>QUÉ DEMUESTRA</p>
          <h2>Este fixture explica el contrato; no prueba una integración.</h2>
        </div>
        <p>
          Floid está completamente desconectado en este entregable: no hay credenciales, sandbox ni
          llamadas de red. La respuesta vive como fixture local de YOL1. Una integración futura exigiría
          una decisión separada de Producto, Legal, Seguridad y Operaciones.
        </p>
      </section>

      <footer className={styles.footer}>
        <span>Yol1 Research · 24 agosto 2026</span>
        <div>
          <a href="https://readme.floid.io/docs/sandbox" target="_blank" rel="noreferrer">Sandbox</a>
          <a href="https://readme.floid.io/reference/santander-personas-products" target="_blank" rel="noreferrer">Productos</a>
          <a href="https://www.floid.io/servicios/api-cmf" target="_blank" rel="noreferrer">API CMF</a>
        </div>
      </footer>
    </main>
  );
}
