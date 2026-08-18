"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./preview.module.css";

type Theme = "dark" | "light";

const palette = [
  { name: "Night", className: styles.swatchNight },
  { name: "Cream", className: styles.swatchCream },
  { name: "Acid", className: styles.swatchAcid },
  { name: "Aqua", className: styles.swatchAqua },
  { name: "Coral", className: styles.swatchCoral },
];

export function DesignPreview() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => {
      setNotice(null);
    }, 2800);
  };

  return (
    <main className={styles.root} data-theme={theme}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="#preview-top" aria-label="Ir al inicio del mockup">
          <Image src="/yol1-icon.png" alt="" width={42} height={42} priority />
          <span>
            <strong>YOL1</strong>
            <small>DESIGN SYSTEM · PROPUESTA 01</small>
          </span>
        </a>

        <nav className={styles.previewNav} aria-label="Pantallas del mockup">
          <a href="#inicio">01 Inicio</a>
          <a href="#finanzas">02 Finanzas</a>
          <a href="#transferir">03 Transferir</a>
        </nav>

        <button
          className={styles.themeToggle}
          type="button"
          onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
          aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
        >
          <span aria-hidden="true">{theme === "dark" ? "☀" : "◐"}</span>
          {theme === "dark" ? "Ver claro" : "Ver oscuro"}
        </button>
      </header>

      <section className={styles.intro} id="preview-top">
        <div>
          <p className={styles.eyebrow}>MOCKUP CONECTADO · 3 PANTALLAS</p>
          <h1>Menos espectáculo.<br /><em>Más claridad que mueve.</em></h1>
          <p className={styles.lede}>
            El carácter editorial del Lab se convierte en un sistema de producto: jerarquía firme,
            datos explicables y una acción principal por momento.
          </p>
        </div>

        <aside className={styles.designNote}>
          <span className={styles.noteIndex}>01</span>
          <div>
            <small>DIRECCIÓN PROPUESTA</small>
            <strong>Petróleo como base. Acid para avanzar. Aqua para entender.</strong>
            <p>El vidrio queda reservado al resumen protagonista. El resto usa superficies sobrias y legibles.</p>
          </div>
        </aside>

        <div className={styles.palette} aria-label="Paleta propuesta">
          {palette.map((color) => (
            <span key={color.name}>
              <i className={color.className} />
              {color.name}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.screens} aria-label="Tres pantallas propuestas">
        <ScreenColumn index="01" title="Inicio" purpose="Una lectura, no un dashboard" id="inicio">
          <HomeScreen onAction={showNotice} />
        </ScreenColumn>

        <ScreenColumn index="02" title="Finanzas" purpose="Evidencia antes que decoración" id="finanzas">
          <FinanceScreen onAction={showNotice} />
        </ScreenColumn>

        <ScreenColumn index="03" title="Transferir" purpose="Confirmar antes de comprometer" id="transferir">
          <TransferScreen onAction={showNotice} />
        </ScreenColumn>
      </section>

      <section className={styles.systemSummary}>
        <p className={styles.eyebrow}>LO QUE CAMBIÓ</p>
        <div className={styles.summaryGrid}>
          <article><span>01</span><strong>La jerarquía tiene una escala corta</strong><p>Títulos, lectura, cifra y ayuda dejan de competir por atención.</p></article>
          <article><span>02</span><strong>El color tiene trabajo asignado</strong><p>Acid avanza, Aqua explica, Coral alerta y Pink humaniza.</p></article>
          <article><span>03</span><strong>Los estados dicen la verdad</strong><p>Ejemplo, estimado, pendiente y confirmado nunca se confunden.</p></article>
          <article><span>04</span><strong>Los patrones se repiten</strong><p>Tarjetas, filas, botones y avisos conservan la misma lógica.</p></article>
        </div>
      </section>

      {notice && <div className={styles.notice} role="status" aria-live="polite">
        <span aria-hidden="true">✦</span>{notice}
      </div>}
    </main>
  );
}

function ScreenColumn({
  index,
  title,
  purpose,
  id,
  children,
}: {
  index: string;
  title: string;
  purpose: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <article className={styles.screenColumn} id={id}>
      <header className={styles.screenLabel}>
        <span>{index}</span>
        <div><strong>{title}</strong><small>{purpose}</small></div>
      </header>
      <div className={styles.device}>
        <div className={styles.deviceStatus}><span>9:41</span><span>● ◒ ▰</span></div>
        {children}
      </div>
    </article>
  );
}

function AppHeader({ label, back = false }: { label: string; back?: boolean }) {
  return (
    <header className={styles.appHeader}>
      {back ? <button type="button" aria-label="Volver">←</button> : <Image src="/yol1-icon.png" alt="YOL1" width={34} height={34} />}
      <strong>{label}</strong>
      <button type="button" aria-label="Abrir perfil" className={styles.avatar}>FP</button>
    </header>
  );
}

function HomeScreen({ onAction }: { onAction: (message: string) => void }) {
  return (
    <>
      <AppHeader label="Hola, Felipe" />
      <div className={styles.screenBody}>
        <section className={styles.homeHero}>
          <div className={styles.cardKicker}><span>LECTURA DE AGOSTO</span><b>ACTUALIZADA HOY</b></div>
          <p>Disponible estimado</p>
          <h2>$1.284.300</h2>
          <div className={styles.heroSignal}>
            <span className={styles.signalDot} />
            <strong>Tu mes va bien.</strong>
            <p>El punto de presión aparece el 26.</p>
          </div>
          <button type="button" onClick={() => onAction("Abrimos la explicación de agosto · ejemplo")}>Entender mi mes <span>→</span></button>
        </section>

        <section className={styles.nextMove}>
          <header><span>PRÓXIMO MOVIMIENTO</span><small>EN 4 DÍAS</small></header>
          <div>
            <span className={styles.iconButton}>⌂</span>
            <p><strong>Arriendo</strong><small>Programado · dato de ejemplo</small></p>
            <b>−$480.000</b>
          </div>
        </section>

        <section className={styles.signalCard}>
          <div><span className={styles.aquaMark}>+8%</span><p><strong>Más margen que en julio</strong><small>Principalmente por menos suscripciones.</small></p></div>
          <button type="button" onClick={() => onAction("Mostramos la evidencia que explica el +8%")}>Ver evidencia</button>
        </section>
      </div>
      <BottomNav active="Inicio" />
    </>
  );
}

function FinanceScreen({ onAction }: { onAction: (message: string) => void }) {
  return (
    <>
      <AppHeader label="Finanzas" />
      <div className={styles.screenBody}>
        <p className={styles.inAppEyebrow}>TU MES · 01–18 AGO</p>
        <h2 className={styles.screenTitle}>Agosto tiene un punto de presión claro.</h2>
        <p className={styles.screenIntro}>Si mantienes el ritmo actual, llegas al 26 con menos margen que el recomendado.</p>

        <section className={styles.metricRow}>
          <article><small>ENTRÓ</small><strong>$2,14M</strong><span>confirmado</span></article>
          <article><small>SALIÓ</small><strong>$856K</strong><span>confirmado</span></article>
          <article className={styles.metricAccent}><small>MARGEN</small><strong>$1,28M</strong><span>estimado</span></article>
        </section>

        <section className={styles.chartCard}>
          <header><div><small>GASTO POR SEMANA</small><strong>$856.200</strong></div><span>−12% vs. julio</span></header>
          <div className={styles.chart} aria-label="Gasto semanal de ejemplo">
            <div><i className={styles.bar42} /><small>01</small></div>
            <div><i className={styles.bar58} /><small>05</small></div>
            <div><i className={styles.bar76} /><small>12</small></div>
            <div><i className={styles.bar48} /><small>18</small></div>
            <div className={styles.futureBar}><i className={styles.bar66} /><small>26</small></div>
          </div>
          <p><span /> Proyección desde hoy · no es un movimiento real</p>
        </section>

        <section className={styles.opportunityCard}>
          <div className={styles.opportunityIcon}>✦</div>
          <div><small>OPORTUNIDAD DETECTADA</small><strong>Podrías liberar $18.990 este mes.</strong><p>Hay dos suscripciones similares.</p></div>
          <button type="button" onClick={() => onAction("Abrimos dos suscripciones ficticias para comparar")}>→</button>
        </section>
      </div>
      <BottomNav active="Finanzas" />
    </>
  );
}

function TransferScreen({ onAction }: { onAction: (message: string) => void }) {
  return (
    <>
      <AppHeader label="Transferir" back />
      <div className={styles.screenBody}>
        <div className={styles.stepHeader}><span>PASO 2 DE 3</span><div><i /><i className={styles.activeStep} /><i /></div></div>
        <h2 className={styles.screenTitle}>Confirma antes de preparar.</h2>
        <p className={styles.screenIntro}>Revisa a quién, cuánto y desde dónde. Nada se enviará desde este prototipo.</p>

        <section className={styles.recipientCard}>
          <div className={styles.recipientAvatar}>CM</div>
          <div><small>RECIBE</small><strong>Camila Morales</strong><p>Banco Ejemplo · •••• 1842</p></div>
          <span className={styles.verifiedMark}>✓</span>
        </section>

        <section className={styles.amountCard}>
          <small>MONTO</small>
          <h2>$45.000</h2>
          <p>CLP · desde Cuenta principal</p>
        </section>

        <dl className={styles.detailList}>
          <div><dt>Motivo</dt><dd>Comida del sábado</dd></div>
          <div><dt>Comisión</dt><dd>$0 <span>estimado</span></dd></div>
          <div><dt>Total preparado</dt><dd><strong>$45.000</strong></dd></div>
        </dl>

        <aside className={styles.honestyNote}>
          <span>i</span><p><strong>Esto es una simulación.</strong> El paso siguiente sólo mostrará cómo sería la confirmación; no conecta una cuenta ni mueve dinero.</p>
        </aside>

        <div className={styles.transferActions}>
          <button type="button" className={styles.secondaryButton} onClick={() => onAction("Volvemos a editar el monto ficticio")}>Editar</button>
          <button type="button" className={styles.primaryButton} onClick={() => onAction("Transferencia preparada · todavía no enviada")}>Preparar <span>→</span></button>
        </div>
      </div>
    </>
  );
}

function BottomNav({ active }: { active: "Inicio" | "Finanzas" }) {
  const items = [
    { icon: "⌂", label: "Inicio" },
    { icon: "≋", label: "Finanzas" },
    { icon: "↗", label: "Mover" },
    { icon: "◎", label: "Perfil" },
  ];

  return (
    <nav className={styles.bottomNav} aria-label="Navegación de ejemplo">
      {items.map((item) => (
        <button type="button" key={item.label} className={active === item.label ? styles.navActive : undefined}>
          <span>{item.icon}</span><small>{item.label}</small>
        </button>
      ))}
    </nav>
  );
}
