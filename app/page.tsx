"use client";

import { useMemo, useState } from "react";

type Tab = "inicio" | "finanzas" | "cartola" | "cobrar" | "ahorrar" | "ganar" | "futuro";
type MovementAction = "Revisar" | "Lo reconozco" | "Dividir" | "Crear solicitud de cobro";

const tabLabels: Record<Tab, string> = {
  inicio: "Inicio",
  finanzas: "Mis finanzas",
  cartola: "Cartola",
  cobrar: "Cobrar",
  ahorrar: "Ahorrar",
  ganar: "Ganar",
  futuro: "Experimentos",
};

const movements = [
  { id: "disney-bci", date: "05 AGO", time: "10:43", name: "Disney+", code: "TX-81672", bank: "BCI", amount: -11990, hint: "Mismo monto y comercio en dos fuentes", tone: "warning", ownTransfer: false },
  { id: "disney-mach", date: "05 AGO", time: "10:42", name: "Disney+", code: "TX-81665", bank: "MACH", amount: -11990, hint: "Posible duplicado; falta confirmar", tone: "warning", ownTransfer: false },
  { id: "adam", date: "04 AGO", time: "13:16", name: "Dr. Adam", code: "TX-80811", bank: "BCI", amount: -70000, hint: "Podría ser un gasto compartido", tone: "info", ownTransfer: false },
  { id: "own", date: "02 AGO", time: "09:31", name: "Transferencia propia", code: "TX-79845", bank: "BCI", amount: 17500, hint: "Excluida del resumen consolidado", tone: "muted", ownTransfer: true },
  { id: "liguria", date: "01 AGO", time: "21:06", name: "Rest. Liguria", code: "TX-79122", bank: "BCI", amount: -41600, hint: "Beneficio público encontrado", tone: "good", ownTransfer: false },
];

const money = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "brand brand-compact" : "brand"}><img src={compact ? "/yol1-icon.png" : "/yol1-wordmark-dark.png"} alt={compact ? "YOL1" : "YOL1"} /></div>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("inicio");
  const [source, setSource] = useState("Todas");
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null);
  const [notice, setNotice] = useState("Prototipo exploratorio con datos sintéticos: no conecta bancos, no mueve dinero ni representa capacidades disponibles o roadmap.");
  const [collectStep, setCollectStep] = useState(0);
  const [prefillExpense, setPrefillExpense] = useState("Cena de equipo");

  const go = (next: Tab, message?: string) => {
    setTab(next);
    if (message) setNotice(message);
  };

  const openLedger = (filter = "Todas", selected?: string) => {
    setSource(filter);
    setSelectedMovement(selected ?? null);
    go("cartola", filter === "Todas" ? "Mostrando todas las fuentes ficticias." : `Mostrando movimientos ficticios de ${filter}.`);
  };

  const openCollect = (expense?: string) => {
    if (expense) setPrefillExpense(expense);
    setCollectStep(expense ? 1 : 0);
    go("cobrar", expense ? `Preparamos “${expense}” para dividir o crear una solicitud. Aún no se envía nada.` : undefined);
  };

  const activeTitle = tabLabels[tab];

  return (
    <main className="lab-shell">
      <section className="lab-intro">
        <div className="brand-plate"><Brand /><span>PRODUCT GROWTH LAB · 01</span></div>
        <div className="editorial-copy">
          <p className="eyebrow">FINANZAS QUE AYUDAN A VIVIR</p>
          <h1>Tu plata,<br /><span>más clara.</span></h1>
          <p className="lede">Encuentra dónde pierdes plata o desaprovechas beneficios y decide qué hacer.</p>
          <div className="editorial-rule"><span>YOL1 explica</span><span>Tú decides</span><span>Nada se ejecuta</span></div>
        </div>
        <figure className="life-shot"><img src="/yol1-life.jpg" alt="Una mano sintiendo el aire desde una ventana en movimiento" /><figcaption>Plata para vivir. No vivir para administrar plata.</figcaption></figure>
        <div className="module-map" aria-label="Módulos del MVP">
          {(Object.keys(tabLabels) as Tab[]).map((item) => (
            <button key={item} className={tab === item ? "module-active" : ""} onClick={() => go(item)}>{tabLabels[item]}</button>
          ))}
        </div>
        <div className="lab-status" role="status"><span className="status-dot" /><span>{notice}</span></div>
      </section>

      <section className="phone-wrap" aria-label={`YOL1 — ${activeTitle}`}>
        <span className="phone-halo" aria-hidden="true" />
        <div className="phone">
          <div className="phone-notch" />
          <header className="app-top"><Brand compact /><span className="app-section">{activeTitle}</span><span className="demo-pill">DATOS FICTICIOS</span></header>
          <div className={`app-content app-${tab}`}>
            {tab === "inicio" && <Start onMove={go} onCollect={openCollect} />}
            {tab === "finanzas" && <Finances onLedger={openLedger} onNotice={setNotice} />}
            {tab === "cartola" && <Ledger source={source} setSource={setSource} selected={selectedMovement} setSelected={setSelectedMovement} onAction={(action, movement) => {
              if (action === "Dividir" || action === "Crear solicitud de cobro") openCollect(movement.name);
              else setNotice(`${movement.name}: quedó marcado como “${action}” en esta demo. Puedes cambiarlo cuando quieras.`);
            }} />}
            {tab === "cobrar" && <Collect step={collectStep} setStep={setCollectStep} initialExpense={prefillExpense} onNotice={setNotice} />}
            {tab === "ahorrar" && <Save onNotice={setNotice} onLedger={openLedger} />}
            {tab === "ganar" && <ComingSoon onBack={() => go("inicio")} />}
            {tab === "futuro" && <Future onNotice={setNotice} />}
          </div>
          <nav className="bottom-nav" aria-label="Navegación principal">
            <NavButton icon="⌂" label="Inicio" current={tab === "inicio"} onClick={() => go("inicio")} />
            <NavButton icon="↗" label="Finanzas" current={tab === "finanzas" || tab === "cartola"} onClick={() => go("finanzas")} />
            <NavButton icon="÷" label="Cobrar" current={tab === "cobrar"} onClick={() => openCollect()} />
            <NavButton icon="✦" label="Ahorrar" current={tab === "ahorrar"} onClick={() => go("ahorrar")} />
            <NavButton icon="•••" label="Más" current={tab === "ganar" || tab === "futuro"} onClick={() => go("futuro")} />
          </nav>
        </div>
      </section>
    </main>
  );
}

function NavButton({ icon, label, current, onClick }: { icon: string; label: string; current: boolean; onClick: () => void }) {
  return <button className={current ? "nav-active" : ""} onClick={onClick}><span aria-hidden="true">{icon}</span><small>{label}</small></button>;
}

function Start({ onMove, onCollect }: { onMove: (target: Tab, message?: string) => void; onCollect: (expense?: string) => void }) {
  const [showConsent, setShowConsent] = useState(false);
  return <>
    <div className="demo-banner"><strong>PROTOTIPO · DATOS SINTÉTICOS</strong><span>No conecta bancos, no mueve dinero ni representa capacidades disponibles o roadmap.</span></div>
    <section className="start-hero">
      <div><p className="kicker">TU PLATA, BAJO CONTROL</p><h2 className="value-hero">Encuentra dónde <span>pierdes plata</span> o desaprovechas beneficios.</h2></div>
      <div className="signal-object" aria-hidden="true"><small>SEÑAL</small><strong>$11.990</strong><span>?</span></div>
    </section>
    <p className="body-copy start-copy">YOL1 te muestra la evidencia. Tú decides qué hacer. Nada se ejecuta ni mueve dinero.</p>
    <div className="entry-choices">
      <button className="entry-primary" onClick={() => onMove("finanzas", "Exploras un ejemplo con datos 100% ficticios y cero datos tuyos.")}><span>01</span><strong>Explorar ejemplo</strong><small>Cero datos personales</small><b>→</b></button>
      <button className="entry-secondary" onClick={() => setShowConsent(!showConsent)}><span>02</span><strong>Simular con mi información</strong><small>Consentimiento también simulado</small><b>{showConsent ? "−" : "+"}</b></button>
    </div>
    {showConsent && <section className="consent-preview"><strong>Antes de usar una fuente</strong><p>Te explicaríamos qué datos se usarían, para qué y por cuánto tiempo. Aquí no se carga ni conecta nada.</p><button onClick={() => onMove("finanzas", "Consentimiento simulado: seguimos con datos ficticios; no se conectó ni cargó información.")}>Seguir con datos ficticios →</button></section>}
    <p className="choice-label">OTRAS RUTAS DEL PROTOTIPO</p>
    <div className="secondary-paths">
      <button className="path-card" onClick={() => onMove("finanzas", "Partimos por entender el mes. Ninguna cuenta real fue conectada.")}><span className="path-icon">↗</span><span><strong>Entender el mes</strong><small>Fuentes y hallazgos</small></span><b>→</b></button>
      <button className="path-card" onClick={() => onCollect()}><span className="path-icon">÷</span><span><strong>Ordenar pendientes</strong><small>Repartir o solicitar</small></span><b>→</b></button>
      <button className="path-card" onClick={() => onMove("ahorrar", "Busquemos oportunidades con evidencia, sin prometer ahorros.")}><span className="path-icon">✦</span><span><strong>Ver oportunidades</strong><small>Evidencia y rangos</small></span><b>→</b></button>
      <button className="path-card secondary" onClick={() => onMove("ganar")}><span className="path-icon">＋</span><span><strong>Ganar</strong><small>Próximamente</small></span><b>→</b></button>
    </div>
    <button className="text-link" onClick={() => onMove("futuro")}>Ayúdanos a priorizar experimentos →</button>
  </>;
}

function Finances({ onLedger, onNotice }: { onLedger: (filter?: string, selected?: string) => void; onNotice: (message: string) => void }) {
  const [insight, setInsight] = useState<"duplicate" | "split" | null>(null);
  return <>
    <section className="finance-hero">
      <div className="section-heading"><p className="kicker">AGOSTO · EJEMPLO</p><button className="help-button" onClick={() => onNotice("Los totales consolidan las fuentes demo y excluyen transferencias propias.")} aria-label="Cómo se calcula">?</button></div>
      <span className="finance-label">Resultado del mes</span><strong className="net-amount">+$830.000</strong><p>Ingresos menos egresos clasificados. No es saldo bancario.</p>
      <div className="money-line" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    </section>
    <div className="source-strip" aria-label="Fuentes ficticias">
      <button className="source-card" onClick={() => onLedger("BCI")}><span className="source-logo">BCI</span><span><strong>Cuenta corriente</strong><small>Al día · hace 8 min</small></span><b>→</b></button>
      <button className="source-card" onClick={() => onLedger("MACH")}><span className="source-logo">M</span><span><strong>Cuenta digital</strong><small>Al día · hace 12 min</small></span><b>→</b></button>
    </div>
    <div className="source-actions"><button onClick={() => onNotice("Simulación: aquí explicaríamos qué datos se usarían y pediríamos tu consentimiento. No se conecta ningún banco.")}>＋ Simular banco</button><button onClick={() => onNotice("Simulación: una cartola podría aportar información sin acceso permanente. No se carga ningún archivo.")}>↑ Simular cartola</button><button onClick={() => onLedger("Todas")}>Ver cartola →</button></div>
    <div className="metrics"><Metric label="Ingresos" value="$2.450.000" tone="aqua" note="2 fuentes" /><Metric label="Egresos" value="$1.620.000" tone="coral" note="sin transferencias propias" /><Metric label="Por cobrar" value="$560.000" tone="acid" note="3 pendientes" /><Metric label="Por pagar" value="$42.000" tone="yellow" note="1 pendiente" /></div>
    <section className="calculation-card"><div><strong>Cómo calculamos este resumen</strong><button onClick={() => onNotice("En un producto real podrías corregir fuentes, periodo o reglas; aquí solo simulamos el cambio.")}>Corregir</button></div><dl><div><dt>Fuentes</dt><dd>BCI + MACH demo</dd></div><div><dt>Periodo</dt><dd>1–12 ago 2026</dd></div><div><dt>Actualización</dt><dd>12 ago · 20:31</dd></div><div><dt>Criterio</dt><dd>Ingresos y egresos, excluyendo movimientos clasificados como transferencia propia</dd></div></dl></section>
    <div className="exclusion-note"><strong>$17.500 excluidos</strong><span>Clasificación simulada y revisable: “transferencia propia”.</span><button onClick={() => onNotice("Clasificación marcada para corregir. Nada cambia sin tu confirmación.")}>Corregir</button></div>
    <div className="insight-heading"><span>01</span><h3>Cosas para revisar</h3><small>Explicables. Corregibles.</small></div>
    <button className="issue-card primary-issue" onClick={() => setInsight(insight === "duplicate" ? null : "duplicate")}><span className="issue-tag warn-bg">REVISA</span><span><strong>Disney+ aparece dos veces</strong><small>Mismo monto · 1 minuto de diferencia</small></span><b>{insight === "duplicate" ? "−" : "→"}</b></button>
    {insight === "duplicate" && <Evidence title="Posible duplicado" certainty="Certeza media" source="BCI + MACH · 5 ago" rule="Mismo comercio y monto con 1 minuto de diferencia. Podrían ser dos compras válidas." action="Ver ambos movimientos" onAction={() => onLedger("Todas", "disney-bci")} />}
    <button className="issue-card" onClick={() => setInsight(insight === "split" ? null : "split")}><span className="issue-tag info-bg">REPARTE</span><span><strong>Dr. Adam podría dividirse</strong><small>Marcado antes como gasto compartido</small></span><b>{insight === "split" ? "−" : "→"}</b></button>
    {insight === "split" && <Evidence title="Gasto posiblemente compartido" certainty="Certeza baja" source="BCI · 4 ago" rule="La sugerencia viene de una clasificación anterior. Confírmala antes de preparar una solicitud." action="Abrir movimiento" onAction={() => onLedger("BCI", "adam")} />}
  </>;
}

function Metric({ label, value, tone, note }: { label: string; value: string; tone: string; note: string }) {
  return <div className="metric"><small>{label}</small><strong className={tone}>{value}</strong><span>{note}</span></div>;
}

function Evidence({ title, certainty, source, rule, action, onAction }: { title: string; certainty: string; source: string; rule: string; action: string; onAction: () => void }) {
  return <section className="evidence"><div><span className="evidence-label">QUÉ VIMOS</span><strong>{title}</strong></div><dl><div><dt>Evidencia</dt><dd>{rule}</dd></div><div><dt>Origen</dt><dd>{source}</dd></div><div><dt>Certeza</dt><dd>{certainty}</dd></div></dl><button onClick={onAction}>{action} →</button></section>;
}

function Ledger({ source, setSource, selected, setSelected, onAction }: { source: string; setSource: (source: string) => void; selected: string | null; setSelected: (id: string | null) => void; onAction: (action: MovementAction, movement: typeof movements[number]) => void }) {
  const filtered = useMemo(() => movements.filter((movement) => source === "Todas" || movement.bank === source), [source]);
  return <>
    <div className="section-heading"><div><p className="kicker">EVIDENCIA</p><h2 className="compact-title">Cartola completa</h2></div><span className="count-pill">{filtered.length}</span></div>
    <p className="body-copy top-gap">Fecha, código, monto y fuente. Sin imágenes ni adornos.</p>
    <div className="filter-row" aria-label="Filtrar por fuente">{["Todas", "BCI", "MACH"].map((filter) => <button key={filter} className={source === filter ? "filter-active" : ""} onClick={() => setSource(filter)}>{filter}</button>)}</div>
    <div className="table-head"><span>FECHA</span><span>MOVIMIENTO / CÓDIGO</span><span>MONTO</span></div>
    <div className="ledger">
      {filtered.map((movement) => <article className={selected === movement.id ? "movement selected" : "movement"} key={movement.id}>
        <button className="row-main" onClick={() => setSelected(selected === movement.id ? null : movement.id)} aria-expanded={selected === movement.id}>
          <time>{movement.date}<small>{movement.time}</small></time><span><strong>{movement.name}</strong><small className={movement.tone}>{movement.bank} · {movement.code}</small></span><b className={movement.amount > 0 ? "positive" : ""}>{movement.amount > 0 ? "+" : "−"} {money.format(Math.abs(movement.amount))}</b>
        </button>
        <p className={`movement-hint ${movement.tone}`}>{movement.hint}</p>
        {selected === movement.id && <div className="row-actions">
          {(["Revisar", "Lo reconozco", "Dividir", "Crear solicitud de cobro"] as MovementAction[]).map((action) => <button key={action} onClick={() => onAction(action, movement)}>{action}</button>)}
        </div>}
      </article>)}
    </div>
    <div className="exclusion-note"><strong>Regla revisable</strong><span>TX-79845 está clasificada en esta simulación como transferencia propia y se excluye del resumen.</span><button onClick={() => setSelected("own")}>Corregir</button></div>
  </>;
}

function Collect({ step, setStep, initialExpense, onNotice }: { step: number; setStep: (step: number) => void; initialExpense: string; onNotice: (message: string) => void }) {
  const [expense, setExpense] = useState(initialExpense);
  const [amount, setAmount] = useState(48000);
  const [split, setSplit] = useState<"equal" | "custom">("equal");
  const [custom, setCustom] = useState([16000, 20000, 12000]);
  const people = ["Tú", "Josefa", "Martín"];
  const equalAmount = Math.round(amount / people.length);
  const assigned = custom.reduce((sum, value) => sum + value, 0);

  if (step === 0) return <>
    <section className="collect-hero"><div><p className="kicker">UTILIDAD SECUNDARIA · EXPERIMENTO</p><h2 className="compact-title">Ordena lo pendiente, sin hacer show.</h2></div><div className="avatar-stack" aria-label="Tres personas ficticias"><span>J</span><span>M</span><span>＋1</span></div><p className="amount-highlight"><small>POR COBRAR</small>$560.000</p></section>
    <div className="collect-actions"><button onClick={() => { setExpense("Cena de equipo"); setStep(1); }}>＋ Registrar gasto</button><button onClick={() => setStep(1)}>Repartir gasto</button></div>
    <p className="privacy-note">Simulación evidente: nada se envía hasta que revises montos y mensaje.</p>
    <div className="insight-heading compact-heading"><span>03</span><h3>Pendientes</h3><small>Personas, no cuentas.</small></div>
    {[{ title: "Viaje a Pucón", meta: "3 personas", amount: "$210.000" }, { title: "Almuerzo viernes", meta: "María · vence hoy", amount: "$18.000" }, { title: "Depto agosto", meta: "2 personas", amount: "$332.000" }].map((debt) => <button className="debt" key={debt.title} onClick={() => onNotice(`${debt.title}: abriríamos el detalle antes de preparar un recordatorio. No se envió nada.`)}><span><strong>{debt.title}</strong><small>{debt.meta}</small></span><span><b>{debt.amount}</b><small>Ver detalle ›</small></span></button>)}
  </>;

  return <>
    <button className="back-link" onClick={() => setStep(step - 1)}>← {step === 1 ? "Volver a pendientes" : "Atrás"}</button>
    <div className="progress" aria-label={`Paso ${step} de 4`}><span style={{ width: `${Math.min(step, 4) * 25}%` }} /></div>
    {step === 1 && <section className="flow-step"><p className="kicker">PASO 1 DE 4</p><h2 className="compact-title">Registra el gasto</h2><label>¿Qué pagaste?<input value={expense} onChange={(event) => setExpense(event.target.value)} /></label><label>Monto total<input type="number" min="0" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></label><p className="helper">Este registro vive solo en la demo y puedes corregirlo.</p><button className="primary-action" onClick={() => setStep(2)}>Elegir participantes →</button></section>}
    {step === 2 && <section className="flow-step"><p className="kicker">PASO 2 DE 4</p><h2 className="compact-title">¿Quiénes participaron?</h2><div className="participants">{people.map((person, index) => <label key={person}><input type="checkbox" defaultChecked /><span className="avatar">{person[0]}</span><strong>{person}</strong><small>{index === 0 ? "Pagaste tú" : "Incluido"}</small></label>)}</div><button className="primary-action" onClick={() => setStep(3)}>Definir división →</button></section>}
    {step === 3 && <section className="flow-step"><p className="kicker">PASO 3 DE 4</p><h2 className="compact-title">Divide {money.format(amount)}</h2><div className="segmented"><button className={split === "equal" ? "selected-option" : ""} onClick={() => setSplit("equal")}>En partes iguales</button><button className={split === "custom" ? "selected-option" : ""} onClick={() => setSplit("custom")}>Montos distintos</button></div><div className="split-list">{people.map((person, index) => <label key={person}><span>{person}</span>{split === "equal" ? <strong>{money.format(equalAmount)}</strong> : <input type="number" min="0" value={custom[index]} onChange={(event) => { const next = [...custom]; next[index] = Number(event.target.value); setCustom(next); }} />}</label>)}</div>{split === "custom" && <p className={assigned === amount ? "sum-ok" : "sum-warn"}>Asignado: {money.format(assigned)} de {money.format(amount)} {assigned === amount ? "✓" : "· ajusta la diferencia"}</p>}<button className="primary-action" disabled={split === "custom" && assigned !== amount} onClick={() => setStep(4)}>Revisar solicitud →</button></section>}
    {step === 4 && <section className="flow-step"><p className="kicker">PASO 4 DE 4</p><h2 className="compact-title">Confirma antes de preparar la solicitud</h2><div className="summary-card"><span>{expense}</span><strong>{money.format(amount)}</strong><small>{split === "equal" ? "División en partes iguales" : "División personalizada"}</small></div><div className="split-list compact">{people.slice(1).map((person, index) => <div key={person}><span>{person}</span><strong>{money.format(split === "equal" ? equalAmount : custom[index + 1])}</strong></div>)}</div><div className="consent-box"><strong>Esto es una simulación</strong><span>El siguiente paso prepara un link ficticio. No cobra, inicia ni recibe pagos reales.</span></div><button className="primary-action" onClick={() => setStep(5)}>Confirmar y preparar link simulado →</button></section>}
    {step === 5 && <section className="flow-step success-step"><span className="success-mark">✓</span><p className="kicker">LINK DEMO CREADO</p><h2 className="compact-title">Listo para compartir.</h2><p className="body-copy">Revisa el mensaje. WhatsApp se muestra como canal, pero no abriremos ni enviaremos nada.</p><div className="fake-link">yol1.demo/cobro/cena-48k <button onClick={() => onNotice("Link ficticio copiado para efectos de la demo.")}>Copiar</button></div><div className="message-preview">Hola, te comparto tu parte de {expense}: <strong>{money.format(split === "equal" ? equalAmount : custom[1])}</strong>. Este enlace es una simulación de YOL1.</div><button className="whatsapp-action" onClick={() => onNotice("WhatsApp simulado: no se abrió la app ni se envió un mensaje.")}>Preparar en WhatsApp · Demo</button><button className="text-link centered" onClick={() => setStep(0)}>Volver a pendientes</button></section>}
  </>;
}

function Save({ onNotice, onLedger }: { onNotice: (message: string) => void; onLedger: (filter?: string, selected?: string) => void }) {
  const [open, setOpen] = useState<string | null>("duplicate");
  const opportunities = [
    { id: "duplicate", tag: "CARGO DUDOSO", title: "Dos cargos de Disney+", value: "$0–$11.990 estimados", tone: "warn-bg", signal: "Mismo comercio y monto con un minuto de diferencia.", source: "BCI + MACH · 5 ago", certainty: "Media", estimate: "$0 si ambos son válidos; hasta $11.990 si confirmas un duplicado", reversible: "Solo revisar y marcar; YOL1 no disputa ni recupera fondos", disclosure: "Sin compensación en esta simulación", action: "Ver movimientos" },
    { id: "benefit", tag: "BENEFICIO", title: "20% en restaurantes", value: "$0–$12.000 estimados", tone: "good-bg", signal: "Beneficio público del emisor para compras los jueves.", source: "Sitio público del beneficio · demo", certainty: "Alta si cumples todas las condiciones", estimate: "Entre $0 y $12.000 según compra, día y tope", reversible: "Revisar condiciones; no se compra ni activa nada", disclosure: "Sin compensación en esta simulación", action: "Revisar condiciones" },
    { id: "alternative", tag: "RECURRENCIA", title: "Plan móvil posiblemente ineficiente", value: "$0–$4.000/mes estimados", tone: "info-bg", signal: "Alternativa ficticia con precio de lista menor y prestaciones comparables.", source: "Comparación demo · sin datos personales", certainty: "Media; precio y cobertura sujetos a condiciones", estimate: "Entre $0 y $4.000 mensuales después de validar condiciones", reversible: "Solo comparar; YOL1 no cambia proveedores", disclosure: "Sin compensación en esta simulación", action: "Comparar" },
  ];
  return <>
    <section className="save-heading"><p className="kicker">OPORTUNIDADES COTIDIANAS</p><h2 className="compact-title">Primero la evidencia.<br /><span>Después, tú.</span></h2><p className="body-copy">Señales para evaluar. Nunca promesas de ahorro.</p></section>
    <div className="independence"><span>TRANSPARENCIA COMERCIAL</span><strong>YOL1 no recibe compensación en esta simulación.</strong><small>Cualquier relación comercial futura se declarará en cada recomendación.</small></div>
    <div className="opportunity-list">{opportunities.map((item, index) => <article key={item.id} className={`opportunity opportunity-${item.id} ${open === item.id ? "opportunity-open" : ""}`}><button onClick={() => setOpen(open === item.id ? null : item.id)}><span className="opportunity-index">0{index + 1}</span><span><span className={`issue-tag ${item.tone}`}>{item.tag}</span><strong>{item.title}</strong><small>{item.value}</small></span><b>{open === item.id ? "−" : "+"}</b></button>{open === item.id && <div className="opportunity-detail"><dl><div><dt>Evidencia</dt><dd>{item.signal}</dd></div><div><dt>Fuente</dt><dd>{item.source}</dd></div><div><dt>Certeza</dt><dd>{item.certainty}</dd></div><div><dt>Estimación</dt><dd>{item.estimate}</dd></div><div><dt>Acción</dt><dd>{item.reversible}</dd></div><div><dt>Disclosure</dt><dd>{item.disclosure}</dd></div></dl><button onClick={() => item.id === "duplicate" ? onLedger("Todas", "disney-bci") : onNotice(`${item.action}: pediremos confirmación; no se contrata, compra ni cambia nada.`)}>{item.action} →</button></div>}</article>)}</div>
  </>;
}

function ComingSoon({ onBack }: { onBack: () => void }) {
  return <section className="empty-state"><span className="empty-icon">＋</span><p className="kicker">GANAR</p><h2>Próximamente</h2><p>Este módulo todavía no tiene flujo. Lo construiremos solo cuando exista una propuesta concreta, verificable y alineada con YOL1.</p><button className="primary-action" onClick={onBack}>Volver al inicio</button></section>;
}

function Future({ onNotice }: { onNotice: (message: string) => void }) {
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const capabilities = [
    { id: "alerts", title: "Alertas que tú controlas", detail: "Elegir qué señales importan y con qué frecuencia recibirlas.", status: "POR EXPLORAR" },
    { id: "compare", title: "Comparar con referencias agregadas", detail: "Solo existiría con muestra suficiente y población comparable visible.", status: "POR EXPLORAR" },
  ];
  return <>
    <section className="future-heading"><p className="kicker">EXPERIMENTOS POR EXPLORAR</p><h2 className="compact-title">¿Qué te serviría<br />de verdad?</h2><p className="body-copy">Ideas ya conversadas para aprender antes de construir. No son roadmap, fechas ni capacidades disponibles.</p></section>
    <div className="roadmap-list">{capabilities.map((item, index) => <article key={item.id}><span className="experiment-number">0{index + 1}</span><div><span className="experiment-status">{item.status}</span><h3>{item.title}</h3><p>{item.detail}</p></div><button className={votes[item.id] ? "voted" : ""} onClick={() => { setVotes({ ...votes, [item.id]: !votes[item.id] }); onNotice(votes[item.id] ? "Quitaste tu apoyo en esta demo." : "Feedback guardado solo durante esta sesión demo."); }}>{votes[item.id] ? "✓ Me interesa" : "Me interesa"}</button></article>)}</div>
    <section className="scope-box"><strong>Fuera de este MVP</strong><p>No estamos desarrollando banca, remesas, pagos reales ni una capa operativa de propuestas. Primero validamos comprensión, utilidad y confianza.</p></section>
  </>;
}
