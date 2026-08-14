"use client";

import { useState } from "react";

export type CardsView = "intent" | "details" | "movement" | "benefit";

type CardsDiscoveryProps = {
  view: CardsView;
  onView: (view: CardsView) => void;
  onNotice: (message: string) => void;
};

const syntheticCards = [
  { id: "bank-a", name: "Banco A", ending: "1234", reason: "3% informado en supermercado", estimate: "$1.350 estimados", tone: "aqua" },
  { id: "bank-b", name: "Banco B", ending: "9876", reason: "3 cuotas informadas sin interés", estimate: "sin ahorro confirmado", tone: "violet" },
] as const;

export function CardsDiscovery({ view, onView, onNotice }: CardsDiscoveryProps) {
  const [amount, setAmount] = useState("45.000");
  const [category, setCategory] = useState("Supermercado");
  const [preference, setPreference] = useState("Ahorrar ahora");
  const [recommendationReady, setRecommendationReady] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return <section className="cards-discovery" aria-label="Borrador local de Tarjetas YOL1">
    <header className="cards-draft-status">
      <span>BORRADOR LOCAL</span>
      <small>DATOS SINTÉTICOS · NO PAGA</small>
    </header>

    {view === "intent" && <section className="cards-view cards-intent-view">
      <p className="kicker">ANTES DE PAGAR</p>
      <h2>¿Qué quieres resolver?</h2>
      <p className="cards-lede">Cuéntanos la compra. YOL1 prepara una elección explicable; no inicia ni confirma pagos.</p>

      <div className="cards-intent-shortcuts" aria-label="Intenciones disponibles">
        <button className="selected" onClick={() => onView("intent")} data-event="payment_intent_selected"><span>↗</span><b>Elegir cómo pagar</b></button>
        <button onClick={() => onView("details")} data-event="card_details_requested"><span>◉</span><b>Ver datos</b></button>
        <button onClick={() => onView("movement")} data-event="card_movement_viewed"><span>≋</span><b>Último movimiento</b></button>
        <button onClick={() => onView("benefit")} data-event="card_benefit_reviewed"><span>✦</span><b>Ver beneficio</b></button>
      </div>

      <div className="cards-intent-form">
        <label>Monto aproximado <span>$<input value={amount} onChange={(event) => { setAmount(event.target.value); setRecommendationReady(false); }} inputMode="numeric" aria-label="Monto aproximado ficticio" /></span></label>
        <label>Categoría <select value={category} onChange={(event) => { setCategory(event.target.value); setRecommendationReady(false); }} aria-label="Categoría de compra"><option>Supermercado</option><option>Restaurante</option><option>Combustible</option><option>Suscripción</option></select></label>
        <label>Qué priorizas <select value={preference} onChange={(event) => { setPreference(event.target.value); setRecommendationReady(false); }} aria-label="Preferencia de pago"><option>Ahorrar ahora</option><option>Ordenar el presupuesto</option><option>Pagar en cuotas</option></select></label>
        <button className="cards-primary" onClick={() => setRecommendationReady(true)} data-event="card_recommendation_prepared">Preparar mi elección →</button>
      </div>

      {recommendationReady && <article className="cards-recommendation" aria-live="polite">
        <div><small>OPCIÓN SUGERIDA · EJEMPLO</small><strong>{syntheticCards[0].name} · {syntheticCards[0].ending}</strong><p>{syntheticCards[0].reason}. Priorizamos “{preference.toLowerCase()}” para {category.toLowerCase()}.</p></div>
        <b>{syntheticCards[0].estimate}</b>
        <button onClick={() => onView("benefit")} data-event="card_recommendation_explained">Ver por qué y condiciones</button>
        <p className="cards-source-note">Catálogo ficticio para esta prueba. Elegibilidad, vigencia y resultado no están confirmados.</p>
      </article>}
    </section>}

    {view === "details" && <CardsDetailsView onBack={() => onView("intent")} onNotice={onNotice} />}

    {view === "movement" && <section className="cards-view cards-movement-view">
      <button className="cards-back" onClick={() => onView("intent")}>← Volver</button>
      <p className="kicker">ÚLTIMO MOVIMIENTO</p>
      <h2>Esto todavía no termina.</h2>
      <article className="cards-movement-card">
        <div className="movement-state"><span>PENDIENTE</span><small>ESTADO SINTÉTICO</small></div>
        <header><div><strong>Supermercado Central</strong><small>Hoy · 18:42 · Banco A · 1234</small></div><b>−$45.000</b></header>
        <p>La fuente de ejemplo registró el intento, pero todavía no confirma el resultado final. El monto o estado podría cambiar.</p>
        <dl><div><dt>Actualización</dt><dd>Hace 2 min · simulada</dd></div><div><dt>Beneficio</dt><dd>$1.350 estimados</dd></div><div><dt>Fuente</dt><dd>Feed ficticio del prototipo</dd></div></dl>
      </article>
      <div className="cards-action-grid"><button onClick={() => onNotice("Pendiente no significa pagado: falta confirmación de la fuente.")} data-event="card_movement_status_explained">Entender el estado</button><button onClick={() => onNotice("Abrimos una guía ficticia. No se creó un reclamo.")} data-event="card_alert_action_selected">No lo reconozco</button></div>
      <p className="cards-guardrail">No es una cartola oficial ni un comprobante. En producto, estados, frescura y ayuda dependen del emisor o partner por validar.</p>
    </section>}

    {view === "benefit" && <section className="cards-view cards-benefit-view">
      <button className="cards-back" onClick={() => onView("intent")}>← Volver</button>
      <p className="kicker">BENEFICIO CONTEXTUAL</p>
      <h2>Una razón, no un anuncio.</h2>
      <p className="cards-lede">La sugerencia responde a la compra declarada. No implica acuerdo, disponibilidad ni beneficio garantizado.</p>
      <article className="benefit-match-card">
        <div className="benefit-match-icon">3%</div>
        <div><small>COINCIDENCIA FICTICIA</small><strong>Banco A · 1234</strong><p>Descuento informado para supermercado hoy.</p></div>
        <b>$1.350<br /><small>estimados</small></b>
      </article>
      <div className="benefit-condition-list">
        <div><span>1</span><p><b>Elegibilidad</b>Por confirmar para esta persona e instrumento.</p></div>
        <div><span>2</span><p><b>Activación</b>El ejemplo supone activación previa; no la ejecuta.</p></div>
        <div><span>3</span><p><b>Resultado</b>Sólo se confirma con evidencia posterior reconciliada.</p></div>
      </div>
      <button className="cards-secondary" onClick={() => setTermsOpen((current) => !current)} data-event="card_benefit_terms_toggled">{termsOpen ? "Ocultar condiciones" : "Ver condiciones y fuente"}</button>
      {termsOpen && <div className="benefit-terms"><strong>Fuente de prueba</strong><p>Catálogo sintético, sin comercio, banco o partner real. Vigencia, tope, canal, exclusiones y financiador quedan por validar.</p></div>}
      <button className="cards-primary" onClick={() => onNotice("Guardamos tu interés sólo en esta sesión. No activamos un beneficio ni iniciamos un pago.")} data-event="card_benefit_interest_saved">Me interesa esta alternativa</button>
    </section>}
  </section>;
}

function CardsDetailsView({ onBack, onNotice }: { onBack: () => void; onNotice: (message: string) => void }) {
  const [detailsStep, setDetailsStep] = useState<"masked" | "confirm" | "revealed">("masked");

  return <section className="cards-view cards-details-view">
    <button className="cards-back" onClick={onBack}>← Volver</button>
    <p className="kicker">ACCESO PROTEGIDO</p>
    <h2>Tú decides qué revelar.</h2>
    <p className="cards-lede">Este ejercicio usa una tarjeta inventada. Ningún dato real entra al prototipo, analytics o soporte.</p>

    <article className={`synthetic-card ${detailsStep === "revealed" ? "is-revealed" : ""}`}>
      <header><span>INSTRUMENTO DE PRUEBA</span><small>FICTICIO</small></header>
      <strong>{detailsStep === "revealed" ? "4111 1111 1111 1234" : "•••• •••• •••• 1234"}</strong>
      <div><span>FELIPE EJEMPLO</span><span>{detailsStep === "revealed" ? "CVV 000" : "CVV •••"}</span></div>
    </article>

    {detailsStep === "masked" && <><div className="cards-security-copy"><b>Oculta por defecto</b><span>La vista completa sería temporal y exigiría una verificación adicional por validar.</span></div><button className="cards-primary" onClick={() => setDetailsStep("confirm")} data-event="card_details_requested">Ver datos ficticios →</button></>}
    {detailsStep === "confirm" && <article className="cards-step-up"><small>PASO ADICIONAL · SIMULADO</small><h3>¿Por qué te pedimos confirmar?</h3><p>Mostrar credenciales aumenta el riesgo de exposición. En un producto real, el método y la duración dependen de la arquitectura y revisión de seguridad.</p><div><button onClick={() => setDetailsStep("masked")}>Cancelar</button><button onClick={() => setDetailsStep("revealed")} data-event="card_details_revealed">Confirmar ejemplo</button></div></article>}
    {detailsStep === "revealed" && <><div className="cards-security-copy success"><b>Datos ficticios visibles</b><span>Se ocultarán al salir de esta pantalla. El temporizador real está por validar.</span></div><button className="cards-secondary" onClick={() => { setDetailsStep("masked"); onNotice("Los datos ficticios volvieron a quedar ocultos."); }} data-event="card_details_hidden">Ocultar ahora</button></>}
  </section>;
}

export const cardsNavigation: { id: CardsView; label: string; icon: string }[] = [
  { id: "intent", label: "Elegir", icon: "↗" },
  { id: "details", label: "Datos", icon: "◉" },
  { id: "movement", label: "Movimiento", icon: "≋" },
  { id: "benefit", label: "Beneficio", icon: "✦" },
];
