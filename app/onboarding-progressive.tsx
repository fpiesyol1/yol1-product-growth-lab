"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildOnboardingDemoSnapshot, ONBOARDING_DEMO_STORAGE_KEY, type OnboardingDemoSnapshot } from "../lib/onboarding-demo-storage";
import { PIVOT_ONBOARDING_STAGE_META, transitionPivotOnboarding, type PivotOnboardingStage, type PivotOnboardingTransition } from "../lib/onboarding-pivot-state-machine";
import { validateAccessContact, validateDeclaredProfile, type AccessMethod } from "../lib/onboarding-validation";

type Props = {
  onEnterAdvisor: () => void;
  onSnapshotChange: (snapshot: OnboardingDemoSnapshot | null) => void;
  onStepChange: () => void;
};

const slides = [
  { key: "organiza", number: "01", eyebrow: "ORGANIZA", title: "Tu plata, en un solo lugar.", body: "Junta la historia de tus bancos y cartolas para ver ingresos, gastos, cobros y deudas con menos ruido.", points: ["Detecta cobros duplicados", "Ordena lo que debes y te deben", "Sin conectar bancos en esta demo"], mark: "↕" },
  { key: "entiende", number: "02", eyebrow: "ENTIENDE", title: "Que cada movimiento te diga algo.", body: "El asistente convierte movimientos en explicaciones, alertas y oportunidades que puedes revisar y corregir.", points: ["Explica cambios del mes", "Encuentra beneficios posibles", "Distingue hechos de sugerencias"], mark: "✦" },
  { key: "usa", number: "03", eyebrow: "ÚSALA BIEN", title: "Un banco que no parece banco.", body: "Explora formas de cobrar, pagar, ahorrar y ganar más. Cada capacidad se activa sólo cuando tenga respaldo real.", points: ["Productos en contexto", "Pasos claros y progresivos", "Nada de dinero se activa aquí"], mark: "Y" },
] as const;

export function ProgressiveOnboardingFlow({ onEnterAdvisor, onSnapshotChange, onStepChange }: Props) {
  const [stage, setStage] = useState<PivotOnboardingStage>("welcome");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const swipeOrigin = useRef<{ x: number; y: number } | null>(null);
  const [method, setMethod] = useState<AccessMethod>("teléfono");
  const [contact, setContact] = useState("");
  const [contactTouched, setContactTouched] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpState, setOtpState] = useState<"entry" | "invalid" | "expired" | "rate_limited" | "contact_exists">("entry");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [declaredName, setDeclaredName] = useState("");
  const [declaredRut, setDeclaredRut] = useState("");
  const [profileTouched, setProfileTouched] = useState({ name: false, rut: false });
  const [supportOpen, setSupportOpen] = useState(false);
  const contactValidation = useMemo(() => validateAccessContact(method, contact), [contact, method]);
  const profileValidation = useMemo(() => validateDeclaredProfile(declaredName, declaredRut), [declaredName, declaredRut]);
  const stageMeta = PIVOT_ONBOARDING_STAGE_META[stage];
  const slide = slides[carouselIndex];

  const move = (event: PivotOnboardingTransition) => {
    setStage((current) => transitionPivotOnboarding(current, event));
    onStepChange();
  };
  const resetOtp = () => { setOtp(""); setOtpState("entry"); setOtpAttempts(0); };
  const changeMethod = (nextMethod: AccessMethod) => { setMethod(nextMethod); setContact(""); setContactTouched(false); };
  const requestOtp = (recovery = false) => {
    setContactTouched(true);
    if (!contactValidation.valid) return;
    resetOtp();
    if (recovery) setOtpState("contact_exists");
    move("REQUEST_OTP_DEMO");
  };
  const confirmOtp = () => {
    if (otp === "123456") { resetOtp(); move("VERIFY_OTP_DEMO"); return; }
    const attempts = otpAttempts + 1;
    setOtpAttempts(attempts);
    setOtpState(attempts >= 3 ? "rate_limited" : "invalid");
  };
  const submitProfile = () => {
    setProfileTouched({ name: true, rut: true });
    if (!profileValidation.valid) return;
    const snapshot = buildOnboardingDemoSnapshot({ capability: "none", channel: method, stage: "preregistered_demo" });
    window.localStorage.setItem(ONBOARDING_DEMO_STORAGE_KEY, JSON.stringify(snapshot));
    onSnapshotChange(snapshot);
    move("SUBMIT_PROFILE_DEMO");
  };
  const clearDemo = () => {
    window.localStorage.removeItem(ONBOARDING_DEMO_STORAGE_KEY);
    onSnapshotChange(null);
    setCarouselIndex(0); setMethod("teléfono"); setContact(""); setContactTouched(false); resetOtp();
    setDeclaredName(""); setDeclaredRut(""); setProfileTouched({ name: false, rut: false }); setSupportOpen(false);
    move("RESET_DEMO");
  };
  const finishStorySwipe = (clientX: number, clientY: number) => {
    if (!swipeOrigin.current) return;
    const deltaX = clientX - swipeOrigin.current.x;
    const deltaY = clientY - swipeOrigin.current.y;
    swipeOrigin.current = null;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    setCarouselIndex((current) => Math.max(0, Math.min(slides.length - 1, current + (deltaX < 0 ? 1 : -1))));
  };

  useEffect(() => { onStepChange(); }, [onStepChange, stage]);

  return <section className="onboarding-flow onboarding-pivot" data-stage={stage}>
    <div className="onboarding-progress" aria-label={`Progreso: ${stageMeta.label}`}><span style={{ width: `${stageMeta.progress * 100}%` }} /></div>
    {stage === "welcome" && <>
      <div className="onboarding-brand"><span className="brand brand-compact"><img src="/yol1-icon.png" alt="YOL1" /></span><span>YOL1</span></div>
      <div key={slide.key} className={`value-carousel slide-${slide.key}`} tabIndex={0} role="group" aria-roledescription="historia" aria-label={`${slide.number} de ${slides.length}. ${slide.eyebrow}. Desliza horizontalmente o usa las flechas del teclado.`} aria-live="polite" onKeyDown={(event) => { if (event.key === "ArrowRight") setCarouselIndex((current) => Math.min(slides.length - 1, current + 1)); if (event.key === "ArrowLeft") setCarouselIndex((current) => Math.max(0, current - 1)); }} onPointerDown={(event) => { swipeOrigin.current = { x: event.clientX, y: event.clientY }; }} onPointerUp={(event) => finishStorySwipe(event.clientX, event.clientY)} onPointerCancel={() => { swipeOrigin.current = null; }}>
        <div className="value-story-progress" aria-hidden="true">{slides.map((item, index) => <span key={item.key} className={index < carouselIndex ? "complete" : index === carouselIndex ? "active" : ""}><i /></span>)}</div>
        <div className="value-carousel-visual" aria-hidden="true"><span>{slide.mark}</span><i>{slide.number}</i><b /><b /><b /></div><div className="value-carousel-copy"><p className="kicker">{slide.eyebrow}</p><h2 className="compact-title">{slide.title}</h2><p className="onboarding-copy">{slide.body}</p><ul>{slide.points.map((point) => <li key={point}>{point}</li>)}</ul></div>
      </div>
      <p className="story-swipe-hint">Desliza para conocer más · {carouselIndex + 1} de {slides.length}</p>
      <button className="primary-action story-start-action" data-event-id="onboarding_started" onClick={() => move("COMPLETE_VALUE_CAROUSEL")}>Inicia en YOL1</button>
      <p className="microcopy carousel-disclaimer">Todavía no pedimos datos ni activamos productos financieros.</p>
    </>}
    {stage === "channel_select" && <><button className="back-link" onClick={() => move("BACK_TO_WELCOME")}>← Volver a las historias</button><p className="kicker">CREA TU ACCESO</p><h2 className="compact-title">¿Cómo quieres entrar?</h2><p className="onboarding-copy">Confirma un correo o teléfono para volver a tu espacio. Este paso controla el canal; todavía no verifica tu identidad.</p><div className="federated-access"><button disabled>Google <small>SSO por configurar</small></button><button disabled>Apple <small>SSO por configurar</small></button></div><p className="microcopy">En esta primera demo usamos correo o teléfono con OTP.</p><div className="auth-choice"><button className={method === "teléfono" ? "selected-option" : ""} onClick={() => changeMethod("teléfono")} aria-pressed={method === "teléfono"}>Teléfono</button><button className={method === "email" ? "selected-option" : ""} onClick={() => changeMethod("email")} aria-pressed={method === "email"}>Correo</button></div><label className="onboarding-field" htmlFor="pivot-contact">{method === "teléfono" ? "Tu número" : "Tu correo"}<input id="pivot-contact" type={method === "email" ? "email" : "tel"} autoComplete={method === "email" ? "email" : "tel"} value={contact} onChange={(event) => { setContact(event.target.value); setContactTouched(false); }} onBlur={() => setContactTouched(true)} aria-invalid={contactTouched && !contactValidation.valid} aria-describedby={contactTouched && !contactValidation.valid ? "pivot-contact-error" : undefined} placeholder={method === "teléfono" ? "+56 9 1234 5678" : "tu@email.com"} /></label>{contactTouched && !contactValidation.valid && <p id="pivot-contact-error" className="field-error" role="alert">{contactValidation.error}</p>}<p className="microcopy">No guardaremos el contacto ni el código en el estado local de esta demo.</p><button className="primary-action" data-event-id="otp_requested_demo" disabled={!contact.trim()} onClick={() => requestOtp()}>Enviar código →</button><button className="secondary-action" data-event-id="account_recovery_started" disabled={!contact.trim()} onClick={() => requestOtp(true)}>Ya tengo un acceso</button></>}
    {stage === "otp_entry" && <><button className="back-link" onClick={() => move("CHANGE_CHANNEL")}>← Cambiar {method}</button><p className="kicker">CÓDIGO DE EJEMPLO</p><h2 className="compact-title">Confirma que controlas este canal.</h2><p className="onboarding-copy">Escribe el código de seis dígitos. Esto no comprueba identidad ni crea una cuenta financiera.</p>{(otpState === "entry" || otpState === "invalid") && <><label className="onboarding-field" htmlFor="pivot-otp">Código de 6 dígitos<input id="pivot-otp" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 6)); setOtpState("entry"); }} aria-invalid={otpState === "invalid"} placeholder="000000" /></label>{otpState === "invalid" && <div className="onboarding-state error" role="alert"><strong>Ese código no coincide.</strong><small>Te quedan {3 - otpAttempts} intentos en esta simulación.</small></div>}<button className="primary-action" disabled={otp.length < 6} data-event-id="otp_submitted_demo" onClick={confirmOtp}>Confirmar canal →</button><button className="secondary-action" onClick={() => setOtp("123456")}>Usar código de ejemplo</button><div className="onboarding-demo-actions"><button onClick={() => setOtpState("expired")}>Simular código vencido</button><button onClick={() => setOtpState("contact_exists")}>Simular recuperación</button></div></>}{otpState === "expired" && <div className="onboarding-state" role="status"><strong>El código venció.</strong><small>Puedes generar otro sin perder el avance.</small><button onClick={resetOtp}>Generar otro código</button></div>}{otpState === "rate_limited" && <div className="onboarding-state error" role="alert"><strong>Pausa después de varios intentos.</strong><small>Cambia de canal o usa una ruta de ayuda; no habilitamos intentos infinitos.</small><button onClick={() => move("CHANGE_CHANNEL")}>Cambiar canal</button></div>}{otpState === "contact_exists" && <div className="onboarding-state" role="status"><strong>Revisa cómo continuar.</strong><small>Por seguridad no confirmamos si el canal ya está registrado.</small><button onClick={resetOtp}>Continuar recuperación demo</button></div>}</>}
    {stage === "profile_basics" && <><button className="back-link" onClick={() => move("BACK_TO_OTP")}>← Volver al código</button><p className="kicker">TU PERFIL BÁSICO</p><h2 className="compact-title">¿Cómo te llamamos?</h2><p className="onboarding-copy">Nombre y RUT preparan una experiencia local. Son datos declarados: todavía no comprobamos tu identidad.</p><label className="onboarding-field" htmlFor="pivot-name">Nombre<input id="pivot-name" autoComplete="name" value={declaredName} onChange={(event) => { setDeclaredName(event.target.value); setProfileTouched((current) => ({ ...current, name: false })); }} onBlur={() => setProfileTouched((current) => ({ ...current, name: true }))} aria-invalid={profileTouched.name && !profileValidation.name.valid} aria-describedby={profileTouched.name && !profileValidation.name.valid ? "pivot-name-error" : undefined} placeholder="Tu nombre" /></label>{profileTouched.name && !profileValidation.name.valid && <p id="pivot-name-error" className="field-error" role="alert">{profileValidation.name.error}</p>}<label className="onboarding-field" htmlFor="pivot-rut">RUT<input id="pivot-rut" autoComplete="off" value={declaredRut} onChange={(event) => { setDeclaredRut(event.target.value.slice(0, 12)); setProfileTouched((current) => ({ ...current, rut: false })); }} onBlur={() => setProfileTouched((current) => ({ ...current, rut: true }))} aria-invalid={profileTouched.rut && !profileValidation.rut.valid} aria-describedby={profileTouched.rut && !profileValidation.rut.valid ? "pivot-rut-error" : undefined} placeholder="11.111.111-1" /></label>{profileTouched.rut && !profileValidation.rut.valid && <p id="pivot-rut-error" className="field-error" role="alert">{profileValidation.rut.error}</p>}<p className="microcopy">No guardamos nombre ni RUT en localStorage o analytics. Esta pantalla no consulta Registro Civil.</p><button className="primary-action" disabled={!profileValidation.valid} onClick={submitProfile}>Entrar a YOL1 →</button><button className="secondary-action" onClick={() => { setDeclaredName("Persona demo"); setDeclaredRut("11.111.111-1"); }}>Usar datos ficticios</button></>}
    {stage === "workspace_ready" && <><p className="kicker">YA PUEDES NAVEGAR</p><h2 className="compact-title">Parte por entender<br /><span>qué pasa con tu plata.</span></h2><p className="onboarding-copy">Tu acceso y perfil básico quedaron preparados. El Acompañante financiero es la primera experiencia; luego decides si completas la verificación.</p><div className="progressive-access-card"><span>AHORA</span><strong>Acompañante y productos de exploración</strong><small>Conversar, revisar ejemplos y recorrer funcionalidades sin mover dinero.</small></div><div className="onboarding-check"><span>✓</span><div><strong>Canal confirmado</strong><small>El OTP sólo comprobó control del correo o teléfono.</small></div></div><div className="onboarding-check"><span>✓</span><div><strong>Perfil declarado</strong><small>Nombre y RUT ingresados, pero identidad aún no verificada.</small></div></div><div className="onboarding-check muted"><span>○</span><div><strong>Verificación completa pendiente</strong><small>Documento, screening y biometría sólo cuando corresponda.</small></div></div><button className="primary-action" onClick={onEnterAdvisor}>Ir al Acompañante financiero →</button><button className="secondary-action" onClick={() => move("CONTINUE_FULL_KYC")}>Seguir con la verificación completa</button><button className="back-link" onClick={clearDemo}>Borrar avance de esta demo</button></>}
    {stage === "kyc_intro" && <><button className="back-link" onClick={() => move("BACK_TO_WORKSPACE")}>← Ahora no</button><p className="kicker">VERIFICACIÓN COMPLETA · DEMO</p><h2 className="compact-title">Antes de pedirte algo,<br /><span>te contamos para qué.</span></h2><p className="onboarding-copy">Podría ser necesaria para una capacidad financiera real. Producto, partner y política todavía deben aprobarse.</p><div className="kyc-step-list"><article><span>01</span><div><strong>Documento</strong><small>Vigencia, legibilidad y coincidencia de datos.</small></div></article><article><span>02</span><div><strong>Screening</strong><small>Listas, PEP y riesgo según política aprobada.</small></div></article><article><span>03</span><div><strong>Prueba de vida</strong><small>Sólo si producto y partner la justifican.</small></div></article></div><button className="primary-action" onClick={() => move("START_DOCUMENT_DEMO")}>Ver cómo sería →</button><button className="secondary-action" onClick={onEnterAdvisor}>Volver al Acompañante</button></>}
    {stage === "document_check" && <><button className="back-link" onClick={() => move("BACK_TO_WORKSPACE")}>← Salir de la verificación</button><p className="kicker">PASO 1 DE 2 · DOCUMENTO</p><h2 className="compact-title">Tu cédula,<br /><span>completa y legible.</span></h2><p className="onboarding-copy">Aquí no abrimos cámara ni subimos archivos. En producción explicaríamos finalidad y conservación antes de capturar.</p><div className="document-capture-demo"><div><span>FRENTE</span><b>RUT</b><i /></div><div><span>REVERSO</span><b>DATOS</b><i /></div></div><div className="onboarding-check muted"><span>!</span><div><strong>Feedback inmediato</strong><small>Reflejos, bordes cortados o texto borroso se corrigen sin reiniciar.</small></div></div><button className="primary-action" onClick={() => move("CONFIRM_DOCUMENT_DEMO")}>Simular documento legible →</button></>}
    {stage === "biometric_check" && <><button className="back-link" onClick={() => move("BACK_TO_WORKSPACE")}>← Salir de la verificación</button><p className="kicker">PASO 2 DE 2 · PRUEBA DE VIDA</p><h2 className="compact-title">Una verificación<br /><span>con propósito visible.</span></h2><p className="onboarding-copy">La cámara compararía una captura en vivo con el documento. Antes deben explicarse finalidad, responsable, conservación y ayuda.</p><div className="biometric-demo" aria-hidden="true"><div><span>rostro</span></div><b>mantén tu cara dentro del marco</b></div><div className="onboarding-check muted"><span>○</span><div><strong>Sin cámara en esta demo</strong><small>No generamos biometría ni enviamos evidencia.</small></div></div><button className="primary-action" onClick={() => move("CONFIRM_BIOMETRIC_DEMO")}>Simular prueba de vida →</button><button className="secondary-action" onClick={() => setSupportOpen(true)}>Necesito otra alternativa</button></>}
    {stage === "kyc_review" && <><p className="kicker">VERIFICACIÓN · EN REVISIÓN</p><h2 className="compact-title">Ya recibimos lo necesario<br /><span>en esta simulación.</span></h2><p className="onboarding-copy">Un proveedor real podría aprobar, pedir recaptura o revisión humana. Mientras tanto puedes navegar; este estado no habilita dinero.</p><div className="onboarding-state" role="status"><strong>Revisión simulada</strong><small>No activamos cuenta, tarjeta, transferencia o saldo.</small></div><button className="primary-action" onClick={onEnterAdvisor}>Volver al Acompañante →</button><button className="secondary-action" onClick={() => move("BACK_TO_WORKSPACE")}>Ver mi progreso</button><button className="back-link" onClick={clearDemo}>Borrar avance de esta demo</button></>}
    {supportOpen && <aside className="onboarding-support"><strong>Customer Success · demo</strong><p>La alternativa accesible y su SLA todavía deben definirse.</p><button onClick={() => setSupportOpen(false)}>Cerrar</button></aside>}
  </section>;
}
