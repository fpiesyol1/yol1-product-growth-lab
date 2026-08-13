"use client";

import { useMemo, useState } from "react";

type Tab = "inicio" | "finanzas" | "cartola" | "cobrar";

const movements = [
  { date: "05 AGO · 10:43", name: "Disney+", code: "TX-81672", amount: "− $11.990", hint: "Posible duplicado", tone: "warning", action: "Revisar" },
  { date: "04 AGO · 13:16", name: "Dr. Adam", code: "TX-80811", amount: "− $70.000", hint: "Gasto compartido", tone: "info", action: "Dividir" },
  { date: "02 AGO · 09:31", name: "Transferencia propia", code: "TX-79845", amount: "+ $17.500", hint: "No cuenta en el resumen", tone: "muted", action: "Excluir" },
  { date: "01 AGO · 21:06", name: "Rest. Liguria", code: "TX-79122", amount: "− $41.600", hint: "Beneficio disponible", tone: "good", action: "Ver" },
];

function Brand() {
  return <div className="brand"><span className="brand-mark">Y</span><span>YOL1</span></div>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("inicio");
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("Este es un laboratorio con datos ficticios.");
  const activeTitle = useMemo(() => ({ inicio: "Inicio", finanzas: "Mis finanzas", cartola: "Cartola", cobrar: "Cobrar" })[tab], [tab]);
  const choose = (text: string) => { setNotice(text); };

  return (
    <main className="lab-shell">
      <section className="lab-intro">
        <Brand />
        <p className="eyebrow">PRODUCT LAB · LOCAL</p>
        <h1>Diseñemos la app<br />antes de construirla.</h1>
        <p className="lede">Este laboratorio sirve para recorrer flujos, discutir decisiones y mejorar pantallas sin esperar al repositorio oficial.</p>
        <div className="principles">
          <p><strong>Una tarea por vista.</strong> La pantalla ayuda a decidir o actuar; no intenta mostrarlo todo.</p>
          <p><strong>Color con sentido.</strong> Verde para avance, coral para revisar, aqua para información.</p>
          <p><strong>Todo tiene origen.</strong> Un hallazgo siempre lleva a la fuente y explica por qué apareció.</p>
        </div>
        <div className="lab-status"><span className="status-dot" /> {notice}</div>
      </section>

      <section className="phone-wrap" aria-label={`YOL1 ${activeTitle}`}>
        <div className="phone">
          <div className="phone-notch" />
          <header className="app-top"><span>{activeTitle.toUpperCase()}</span><Brand /></header>
          <div className="app-content">
            {tab === "inicio" && <Start onMove={(target, msg) => { setTab(target); choose(msg); }} />}
            {tab === "finanzas" && <Finances onOpen={(message) => { setTab("cartola"); choose(message); }} onNotice={choose} />}
            {tab === "cartola" && <Ledger selected={selected} setSelected={setSelected} onNotice={choose} />}
            {tab === "cobrar" && <Collect onNotice={choose} />}
          </div>
          <nav className="bottom-nav" aria-label="Navegación principal">
            <NavButton label="Inicio" current={tab === "inicio"} onClick={() => setTab("inicio")} />
            <NavButton label="Chat" current={false} onClick={() => choose("Chat es la próxima pantalla que definiremos juntos.")} />
            <NavButton label="Finanzas" current={tab === "finanzas" || tab === "cartola"} onClick={() => setTab("finanzas")} />
            <NavButton label="Cobrar" current={tab === "cobrar"} onClick={() => setTab("cobrar")} />
          </nav>
        </div>
      </section>
    </main>
  );
}

function NavButton({ label, current, onClick }: { label: string; current: boolean; onClick: () => void }) {
  return <button className={current ? "nav-active" : ""} onClick={onClick}>{label}</button>;
}

function Start({ onMove }: { onMove: (target: Tab, message: string) => void }) {
  return <>
    <p className="kicker">BIENVENIDO</p>
    <h2>Tu plata,<br />bajo control.</h2>
    <p className="body-copy">¿Por dónde quieres partir hoy?</p>
    <button className="path-card" onClick={() => onMove("finanzas", "Partimos por entender lo que se mueve en tus cuentas.")}><span className="path-icon">↗</span><span><strong>Entender mis finanzas</strong><small>Cartolas, bancos y hallazgos</small></span><b>→</b></button>
    <button className="path-card" onClick={() => onMove("cobrar", "Partimos por recuperar una plata pendiente.")}><span className="path-icon">$</span><span><strong>Recuperar plata</strong><small>Cobros, grupos y deudas</small></span><b>→</b></button>
    <div className="path-card disabled"><span className="path-icon">✦</span><span><strong>Encontrar oportunidades</strong><small>Ahorro y beneficios</small></span><em>Pronto</em></div>
    <div className="path-card disabled"><span className="path-icon">+</span><span><strong>Ganar unas luquitas</strong><small>Referidos y opciones</small></span><em>Pronto</em></div>
  </>;
}

function Finances({ onOpen, onNotice }: { onOpen: (message: string) => void; onNotice: (message: string) => void }) {
  return <>
    <h2 className="compact-title">Mis finanzas</h2>
    <p className="body-copy top-gap">Tu resumen de agosto.</p>
    <div className="sources-grid">
      <button className="source-card" onClick={() => onOpen("BCI está al día: abrimos su cartola completa.")}><strong>BCI</strong><span className="good">Al día</span><small>Ver cuenta</small></button>
      <button className="source-card" onClick={() => onNotice("Fintual necesita una nueva conexión. Aquí irá la explicación y el botón para resolverlo.")}><strong>Fintual</strong><span className="warn">Revisar</span><small>Ver error</small></button>
    </div>
    <div className="source-actions"><button onClick={() => onNotice("Agregar banco abrirá el flujo de conexión segura.")}>＋ Banco</button><button onClick={() => onNotice("Cargar cartola abrirá un selector de archivo.")}>↑ Cartola</button><button onClick={() => onOpen("Mostrando todas tus fuentes consolidadas.")}>Ver todas ›</button></div>
    <div className="metrics"><Metric label="Ingresos" value="$2.450.000" tone="aqua" /><Metric label="Egresos" value="$1.620.000" tone="coral" /><Metric label="Por cobrar" value="$560.000" tone="acid" /><Metric label="Por pagar" value="$42.000" tone="yellow" /></div>
    <h3>Cosas para revisar</h3>
    <button className="issue-card" onClick={() => onOpen("Abrimos la cartola filtrada en Disney+ para revisar el cobro duplicado.")}><span className="issue-tag warn-bg">REVISA</span><span><strong>Disney aparece dos veces</strong><small>Mismo cobro en dos fuentes</small></span><b>Ver ›</b></button>
    <button className="issue-card" onClick={() => onOpen("Abrimos Dr. Adam para dividir o cobrar este gasto.")}><span className="issue-tag info-bg">COBRA</span><span><strong>Dr. Adam podría dividirse</strong><small>Gasto de salud compartido</small></span><b>Ver ›</b></button>
  </>;
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) { return <div className="metric"><small>{label}</small><strong className={tone}>{value}</strong></div>; }

function Ledger({ selected, setSelected, onNotice }: { selected: string | null; setSelected: (v: string | null) => void; onNotice: (v: string) => void }) {
  return <>
    <h2 className="compact-title">Cartola completa</h2><p className="body-copy top-gap">Agosto · 47 movimientos</p>
    <button className="source-selector" onClick={() => onNotice("En la versión real podrás filtrar por banco, periodo o categoría.")}>Todas las fuentes <span>BCI + Fintual ›</span></button>
    <div className="table-head"><span>DÍA / HORA</span><span>MOVIMIENTO</span><span>MONTO</span><span>ACCIÓN</span></div>
    <div className="ledger">
      {movements.map((m) => <article className={selected === m.name ? "movement selected" : "movement"} key={m.name}>
        <button className="row-main" onClick={() => { setSelected(m.name); onNotice(`${m.name}: ${m.hint}. La recomendación siempre muestra su evidencia.`); }}><time>{m.date}</time><span><strong>{m.name}</strong><small className={m.tone}>{m.code} · {m.hint}</small></span><b>{m.amount}</b></button>
        <div className="row-actions"><button onClick={() => onNotice(`Acción: ${m.action}.`)}>{m.action}</button><button onClick={() => onNotice(`${m.name} quedó marcado como revisado.`)}>OK</button><button onClick={() => onNotice(`${m.name}: se abre el flujo para dividir o cobrar.`)}>{m.name === "Disney+" ? "Excluir" : "Cobrar"}</button></div>
      </article>)}
    </div>
    <p className="fine-print">Los totales excluyen transferencias entre cuentas propias.</p>
  </>;
}

function Collect({ onNotice }: { onNotice: (v: string) => void }) {
  const debts = [["Viaje a Pucón", "3 personas · $210.000", "$210.000", "Enviar cobro"], ["Almuerzo viernes", "María López · vence hoy", "$18.000", "Cobrar"], ["Depto agosto", "2 personas · $332.000", "$332.000", "Recordar"]];
  return <>
    <h2 className="compact-title">Recupera lo tuyo.</h2><p className="amount-highlight">$560.000 por cobrar</p>
    <div className="collect-actions"><button onClick={() => onNotice("Nuevo cobro: eliges monto, persona y el mensaje antes de enviarlo.")}>＋ Nuevo cobro</button><button onClick={() => onNotice("Repartir gasto: defines participantes y luego confirmas cada monto.")}>Repartir gasto</button></div>
    <h3>Pendientes</h3>
    {debts.map(([title, meta, amount, action]) => <button className="debt" key={title} onClick={() => onNotice(`${title}: el siguiente paso es ${action.toLowerCase()}.`)}><span><strong>{title}</strong><small>{meta}</small></span><span><b>{amount}</b><small>{action} ›</small></span></button>)}
    <section className="import"><h3>Importa tus deudas</h3><p>Trae un archivo exportado de Splitwise o Tricount.</p><button onClick={() => onNotice("En la primera versión, importar abre un selector de archivo exportado.")}>Importar archivo</button></section>
  </>;
}
