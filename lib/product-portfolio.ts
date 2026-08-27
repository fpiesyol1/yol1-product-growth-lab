export type ProductId = "companion" | "clear_accounts" | "kyc" | "banking" | "cards" | "remittances" | "builder";

export type CertaintyState = "No aplica" | "Por validar" | "Requerido";

export type ProductDefinition = {
  id: ProductId;
  shortLabel: string;
  name: string;
  icon: string;
  explorable: boolean;
  maturity: "explore" | "evidence" | "paused";
  description: string;
};

export type LivingSpec = {
  event: string;
  architecture: string[];
  data: { store: string[]; query: string[]; sources: string[]; handling: string };
  kyc: { state: CertaintyState; reason: string };
  licenses: { state: CertaintyState; reason: string };
  governance: { owner: string; reviewBy: string };
  questions: string[];
  risks: string[];
  flowAnalysis?: { step: string; purpose: string; good: string; failure: string; persist: string }[];
  references?: string[];
  technicalFlow?: { screen: string; ui: string; next: string; services: string[]; command: string; reads: string[]; writes: string[]; records: string[]; events: string[]; failure: string; acceptance: string }[];
};

type SpecWithoutGovernance = Omit<LivingSpec, "governance">;

const GOVERNANCE_BY_PRODUCT: Record<ProductId, LivingSpec["governance"]> = {
  companion: { owner: "Producto · Acompañante", reviewBy: "Antes de conectar datos o activar una acción" },
  clear_accounts: { owner: "Producto · Cuentas Claras", reviewBy: "Antes de compartir un link simulado o cambiar el alcance del simulador" },
  kyc: { owner: "Producto + Compliance · por asignar", reviewBy: "Antes de elegir una acción material real" },
  banking: { owner: "Producto · Home Banking", reviewBy: "Antes de pasar de investigación a flujo" },
  cards: { owner: "Producto + Riesgo · por asignar", reviewBy: "Antes de seleccionar emisor, partner o rail" },
  remittances: { owner: "Producto · pendiente", reviewBy: "Antes de retomar discovery" },
  builder: { owner: "Producto · Lab", reviewBy: "Antes de habilitar lectura o escritura externa" },
};

function withGovernance(productId: ProductId, spec: SpecWithoutGovernance): LivingSpec {
  return { ...spec, governance: GOVERNANCE_BY_PRODUCT[productId] };
}

export const PORTFOLIO_PRODUCTS: ProductDefinition[] = [
  { id: "kyc", shortLabel: "Onboarding + KYC", name: "Onboarding y KYC progresivo", icon: "◎", explorable: true, maturity: "explore", description: "Explora primero. Cada acción explica su gate; KYC nunca habilita una capacidad por sí solo." },
  { id: "companion", shortLabel: "Acompañante", name: "Acompañante financiero", icon: "✦", explorable: true, maturity: "explore", description: "Lee cartolas demo, explica señales y te acompaña a entender flujo de caja, productos y deuda. Las cuentas compartidas se administran en Cuentas Claras." },
  { id: "clear_accounts", shortLabel: "Cuentas Claras", name: "Cuentas Claras", icon: "≍", explorable: true, maturity: "explore", description: "Registra gastos compartidos, mantiene acuerdos y simula cobros y abonos sin custodiar ni mover dinero." },
  { id: "banking", shortLabel: "Home Banking", name: "Home Banking", icon: "⌂", explorable: false, maturity: "evidence", description: "Espacio reservado. No representa banca construida ni disponible." },
  { id: "cards", shortLabel: "Tarjetas", name: "Tarjetas", icon: "▰", explorable: false, maturity: "evidence", description: "Espacio reservado. No hay emisión, procesamiento ni capacidad operativa." },
  { id: "remittances", shortLabel: "Remesas", name: "Remesas", icon: "↗", explorable: false, maturity: "paused", description: "Pausado por decisión de producto. Remesas no se trabaja ni se investiga en este ciclo." },
  { id: "builder", shortLabel: "Construir", name: "Construir mi propio producto", icon: "✎", explorable: true, maturity: "explore", description: "Trabaja una idea en ChatGPT, Claude o Codex, ordénala con el contexto de YOL1 y envíala a revisión cuando esté lista." },
];

export function maturityLabel(product: ProductDefinition) {
  return product.maturity === "explore" ? "PARA EXPLORAR" : product.maturity === "evidence" ? "INVESTIGACIÓN CON EVIDENCIA" : "PAUSADO";
}

export const EMPTY_STATE_LIBRARY = [
  { id: "paper", icon: "✎", eyebrow: "ALGO ESTÁ PASANDO ACÁ", title: "Alguien no hizo la pega…", body: "Perdón por las molestias. Ya estamos apurando al equipo para que deje de pavear.", gesture: "scribble" },
  { id: "dog", icon: "", eyebrow: "PAUSA CON MOVIMIENTO", title: "Aún no está listo esto.", body: "Pero para que no esperes solo, acá tenemos un perro feliz que te hará compañía.", gesture: "dog" },
  { id: "cat", icon: "", eyebrow: "SORY, NO HICE LA PEGA", title: "Pero acá hay un gato tecleando.", body: "Nos pareció suficientemente útil mientras Felipe termina de armar esta parte.", gesture: "cat" },
  { id: "robot", icon: "", eyebrow: "IDEAS EN ORDEN", title: "Un robot está ordenando los post-its.", body: "Tu idea después podrá pasar de conversación a propuesta, pantalla y revisión.", gesture: "robot" },
  { id: "coffee", icon: "", eyebrow: "TARJETAS EN ESPERA", title: "Las tarjetas todavía están en modo avión.", body: "Por ahora no hay nada que tocar. Apenas exista algo aprobado, aparece acá.", gesture: "coffee" },
  { id: "remittance-robot", icon: "", eyebrow: "PAUSADO EN ESTE CICLO", title: "Remesas no está siendo trabajada ahora.", body: "No estamos investigando, diseñando ni prototipando este producto hasta una nueva decisión de Felipe.", gesture: "robot" },
  { id: "lamp", icon: "◉", eyebrow: "IDEA EN REVISIÓN", title: "Hay una luz prendida, no un producto listo.", body: "Felipe decide qué rescatar antes de que una pantalla entre al Lab.", gesture: "halo" },
  { id: "door", icon: "▥", eyebrow: "PUERTA CERRADA POR AHORA", title: "Todavía no se abre esta experiencia.", body: "Preferimos mostrar el vacío antes que inventar una capacidad.", gesture: "door" },
  { id: "blocks", icon: "▦", eyebrow: "PIEZAS SIN ARMAR", title: "Tenemos preguntas. No una promesa.", body: "Arquitectura, datos y regulación siguen por validar antes de diseñar flujo.", gesture: "blocks" },
  { id: "orbit", icon: "⊙", eyebrow: "EN ÓRBITA, NO EN ROADMAP", title: "Esta idea todavía está encontrando su forma.", body: "Sin fecha, sin disponibilidad y sin claims operacionales.", gesture: "orbit" },
  { id: "tape", icon: "╱", eyebrow: "EN INVESTIGACIÓN", title: "Cinta de obra. Nada que operar todavía.", body: "Cuando exista una decisión aprobada, Felipe habilitará la primera pantalla.", gesture: "tape" },
  { id: "spark", icon: "✦", eyebrow: "CHISPA, NO CAPACIDAD", title: "La intuición existe. El producto aún no.", body: "Este espacio ayuda a separar ideas interesantes de experiencias autorizadas.", gesture: "spark" },
  { id: "folder", icon: "▤", eyebrow: "CARPETA EN ESPERA", title: "Lo bueno se ordena antes de publicarse.", body: "Las propuestas futuras podrán revisarse aquí; hoy esa bandeja no existe.", gesture: "folder" },
  { id: "signal", icon: "⌁", eyebrow: "SEÑAL DÉBIL", title: "Todavía falta contexto para diseñar bien.", body: "No completamos los vacíos con supuestos de producto, datos o regulación.", gesture: "signal" },
  { id: "stamp", icon: "○", eyebrow: "FALTA EL OK DE FELIPE", title: "Sin aprobación, sigue siendo borrador.", body: "La prioridad es simple: decisión verbal, decisión aprobada y después el resto de las fuentes.", gesture: "stamp" },
  { id: "bench", icon: "⌑", eyebrow: "EN EL BANCO DE PRUEBAS", title: "Vuelve cuando la hagamos oficial.", body: "Esta pantalla no conecta servicios, no mueve dinero y no representa readiness.", gesture: "bench" },
] as const;

const companionSpecs: Record<string, SpecWithoutGovernance> = {
  inicio: {
    event: "financial_home_viewed",
    architecture: ["React Native · app móvil (candidato)", "AWS Amplify + Cognito para acceso (por validar)", "API Gateway → Lambda para reglas y respuestas (por validar)"],
    data: { store: ["Preferencias de la persona", "Estado de pendientes vistos", "Preguntas y notas explícitamente guardadas"], query: ["Perfil de la persona", "Pendientes aprobados", "Catálogo de respuestas"], sources: ["Perfil YOL1 · por definir", "Motor de reglas · candidato", "Consentimiento explícito"], handling: "Separar datos de producto de datos financieros. Nada real en este prototipo." },
    kyc: { state: "No aplica", reason: "Esta pantalla demo no identifica ni verifica personas." },
    licenses: { state: "Por validar", reason: "Pendiente cruzar el Notion/Second Brain de licencias para Chile." },
    questions: ["¿Qué pendiente merece aparecer primero?", "¿Cuándo una respuesta pasa de demo a aprobada?"],
    risks: ["La persona no entiende por qué ve un pendiente", "Un toque puede llevar a una pantalla sin salida clara", "La recomendación puede sonar más cierta de lo que la evidencia permite"],
  },
  finanzas: {
    event: "financial_summary_viewed",
    architecture: ["React Native · vista de resumen (candidato)", "Servicio de consolidación en AWS Lambda (por validar)", "Base transaccional con trazabilidad por fuente (por validar)"],
    data: { store: ["Fuentes conectadas y su estado", "Reglas de clasificación", "Resumen calculado por período"], query: ["Movimientos normalizados", "Cuentas activas", "Reglas de exclusión de transferencias propias"], sources: ["Proveedor de datos bancarios · por validar", "Cartola cargada con consentimiento", "Perfil YOL1"], handling: "Guardar origen y fecha de cálculo para que cada número sea explicable." },
    kyc: { state: "No aplica", reason: "No hay alta ni conexión de cuenta en este prototipo." },
    licenses: { state: "Por validar", reason: "Pendiente validar en Notion qué habilita ver y consolidar datos financieros en Chile." },
    questions: ["¿Qué criterio de consolidación debe explicar primero?", "¿Qué fuente tendría permiso de corregir una clasificación?"],
    risks: ["Duplicar transferencias entre cuentas propias", "Mostrar un saldo atrasado como actual", "Mezclar fuentes con distinta fecha de actualización"],
  },
  cartola: {
    event: "statement_viewed",
    architecture: ["React Native · lista virtualizada (candidato)", "Servicio de normalización de movimientos (por validar)", "Almacenamiento cifrado y auditado en AWS (por validar)"],
    data: { store: ["Movimiento normalizado", "Origen, fecha/hora y código", "Notas y decisiones de revisión"], query: ["Movimientos por cuenta/período", "Detalle de un movimiento", "Reglas de duplicado y transferencias propias"], sources: ["Cartola original", "Proveedor de agregación · por validar", "Reglas de clasificación versionadas"], handling: "No perder la cartola original: conservar trazabilidad al origen antes de clasificar." },
    kyc: { state: "No aplica", reason: "Inspeccionar el ejemplo no requiere verificar identidad." },
    licenses: { state: "Por validar", reason: "Pendiente revisar el marco aplicable a acceso y tratamiento de cartolas en Chile." },
    questions: ["¿Qué evidencia basta para sugerir un duplicado?", "¿Quién confirma una transferencia propia?"],
    risks: ["Clasificar un gasto real como duplicado por error", "No explicar de dónde vino un movimiento", "Ofrecer dividir algo que no es compartido"],
  },
  ahorrar: {
    event: "opportunities_viewed",
    architecture: ["React Native · oportunidades (candidato)", "Servicio de reglas y evidencia en Lambda (por validar)", "Catálogo de beneficios/versiones (por validar)"],
    data: { store: ["Oportunidades vistas, ignoradas o guardadas", "Regla que generó la oportunidad", "Divulgación comercial si aplica"], query: ["Movimientos categorizados", "Beneficios vigentes", "Preferencias explícitas de la persona"], sources: ["Catálogo de beneficios versionado", "Movimientos con consentimiento", "Preferencias declaradas"], handling: "Cada oportunidad debe indicar evidencia, vigencia y si existe interés comercial." },
    kyc: { state: "No aplica", reason: "Revisar una recomendación demo no verifica identidad." },
    licenses: { state: "Por validar", reason: "Pendiente confirmar con Notion cuándo una recomendación/afiliación exige disclosure o permiso." },
    questions: ["¿Qué certeza mínima permite mostrar una oportunidad?", "¿Cómo se valida el ahorro después de actuar?"],
    risks: ["Recomendar un beneficio vencido", "Confundir estimación con ahorro garantizado", "Ocultar un interés comercial"],
  },
  deudas: {
    event: "debt_health_viewed",
    architecture: ["Next.js · thin slice local del Acompañante", "DebtHealthReadModel separado del ledger social", "Fixture sintético versionado; sin Floid, CMF ni conexión bancaria"],
    data: { store: ["Estado reversible del plan durante la sesión", "Referencia opaca del movimiento demo"], query: ["Obligaciones institucionales sintéticas", "Evidencia de pago y fecha de corte", "Cobertura y costos faltantes"], sources: ["Informe de deuda ficticio", "Cartola sintética", "Reglas de inferencia locales y versionadas"], handling: "Una coincidencia produce sólo candidate. Nunca altera saldo, mora ni estado oficial; deuda social queda fuera del total institucional." },
    kyc: { state: "No aplica", reason: "El recorrido usa fixtures y no identifica a la persona ni consulta una fuente oficial." },
    licenses: { state: "Por validar", reason: "Una lectura futura de deuda formal depende del rol legal de YOL1, consentimiento, fuente y contrato aplicable; el Lab no la ejecuta." },
    questions: ["¿La persona distingue un desfase de un error?", "¿Qué evidencia nueva permite confirmar o corregir el plan?", "¿Qué fuente futura puede mostrar cobertura y fecha de corte sin inducir falsa certeza?"],
    risks: ["Confundir candidate con pago confirmado", "Presentar cero mora como salud financiera completa", "Mezclar deuda institucional con acuerdos entre personas", "Convertir contención en una oferta de crédito"],
  },
  banco: {
    event: "kyc_requirements_viewed",
    architecture: ["React Native · experiencia candidata", "Matriz local · capability y requisitos demo", "BFF/orquestación · por validar", "Proveedor KYC/biometría · pendiente de selección", "Resolución de identidad · por definir"],
    data: { store: ["Capability de ejemplo", "Estado de requisitos", "Versión de política/copy"], query: ["Estado del pre-registro", "Availability de la capacidad", "Política KYC por validar"], sources: ["Matriz local de capabilities", "Perfil/identidad YOL1 · futuro", "Proveedor KYC · pendiente"], handling: "La demo no captura RUT, número de serie, biometría ni documentos. Ninguno de esos datos puede ir a analytics." },
    kyc: { state: "Por validar", reason: "Mi banco/KYC explica requisitos posibles, pero no solicita identidad sin capacidad, partner y fundamento aprobados." },
    licenses: { state: "Por validar", reason: "Activar una cuenta o conectar banca depende de partner, vehículo y definición legal en Chile." },
    questions: ["¿Cuándo se crea el ID definitivo Yol1?", "¿Qué proveedor y qué datos conserva cada parte?"],
    risks: ["Pedir identidad antes de una acción material concreta", "No tener salida humana ante revisión manual", "Confundir requisitos posibles con validación real", "Inferir capacidad desde un KYC verificado"],
  },
};

export function getLivingSpec(product: ProductDefinition, screen: string): LivingSpec {
  if (product.id === "companion") return withGovernance(product.id, companionSpecs[screen] ?? companionSpecs.inicio);
  if (product.id === "clear_accounts") return withGovernance(product.id, {
    event: "clear_accounts_viewed",
    architecture: ["Next.js · módulo local del Product Growth Lab", "Repository adapter · memoria sólo local; Neon/Postgres con Drizzle obligatorio en producción", "PaymentProvider incondicional · MockFloid sin red externa", "Sin wallet, saldo interno, credenciales bancarias ni custodia"],
    data: { store: ["Grupos, participantes, gastos, repartos y deudas", "Anulación y linaje de correcciones sin borrar originales", "Declaraciones manuales de cobro compartido", "Intentos simulados, abonos demo, decisiones de conciliación y actividad auditable"], query: ["Saldo por persona y grupo", "Neteo sugerido derivado sin modificar acuerdos", "Estado de seguimiento derivado", "Intento activo, cartola ficticia y evidencia de conciliación"], sources: ["Ledger propio YOL1", "Fixtures MockFloid", "Cartola sintética local mock_statement_v1"], handling: "Sesión demo con TTL 7 días y payload acotado. No exponer referencias de conciliación, descriptores, tokens internos, idempotency keys, RUT ni datos bancarios en URL, analytics, DTO público o logs generales." },
    kyc: { state: "No aplica", reason: "Pagar el link, crear acuerdos y simular abonos no requieren KYC ni cuenta receptora real." },
    licenses: { state: "No aplica", reason: "El prototipo no mueve dinero ni llama proveedores externos. Cualquier integración futura requiere una decisión y revisión separadas." },
    questions: ["¿Qué evidencia de cierre genera suficiente confianza para probar el loop?", "¿Qué recordatorio reduce fricción social sin aumentar presión?", "¿Qué parte del flujo convierte al pagador en futuro creador?"],
    risks: ["Confundir una deuda registrada con dinero transferido", "Duplicar un abono simulado ante reintentos", "Presentar una coincidencia sintética como conciliación bancaria real", "Pedir identidad al pagador antes de mostrar valor"],
    technicalFlow: [
      { screen: "01 · Inicio", ui: "Resumen por cobrar/pagar, grupos y actividad bajo el shell móvil YOL1", next: "Abrir deuda | Grupos | Actividad | Nuevo gasto", services: ["GET /api/debt-center", "DebtCenterRepository"], command: "Sólo lectura", reads: ["DebtDashboard versionado", "totales derivados del ledger"], writes: ["Ninguna"], records: ["workspace demo aislable (Prop.)"], events: ["clear_accounts_viewed"], failure: "Read model no disponible → estado explícito sin cifras seed", acceptance: "Acompañante y Cuentas muestran el mismo saldo y distinguen Te deben de Debes." },
      { screen: "02 · Nuevo gasto", ui: "Comercio, monto CLP, grupo, pagador, participantes y reparto igual, por montos, porcentaje o partes", next: "Revisar → crear acuerdo → ver cobros nuevos", services: ["POST /api/debt-center · create_expense"], command: "CreateExpense(commandId, splitSpec v2) idempotente", reads: ["grupos y participantes del workspace"], writes: ["expense", "splitSpec", "shares CLP", "debts", "activity"], records: ["ledger YOL1"], events: ["expense_created · candidato"], failure: "Monto inválido, pagador ausente, claves distintas o reparto incompleto → no crear", acceptance: "$100/3 conserva $100; 33,33/33,33/33,34 y partes 1/2/3 redondean por mayor resto; doble submit/retry crea un solo gasto y devuelve los mismos IDs." },
      { screen: "03 · Cobros nuevos", ui: "Obligaciones del gasto recién creado, una fila por persona", next: "Revisar cada cobro | Terminar después", services: ["DebtDashboard resultante"], command: "Sólo lectura de los debt IDs creados", reads: ["expense.id", "DebtSummary.collection"], writes: ["Estado local: copiado, no enviado"], records: ["CollectionShareConfirmation sólo después de confirmación explícita"], events: ["collection_queue_viewed · candidato", "collection_debt_selected · candidato"], failure: "Gasto creado sin proyección disponible → recargar; nunca repetir la mutación", acceptance: "N obligaciones producen N filas correctas; copiar no persiste un envío y sólo el acreedor actual puede confirmar que compartió." },
      { screen: "04 · Detalle de deuda", ui: "Contraparte, concepto, estado del cobro, total, abonado, pendiente e historial simulado", next: "Preparar cobro/seguimiento | Pagar mi parte", services: ["DebtDashboard read model"], command: "Sólo lectura", reads: ["debt", "collection state", "attempts", "settlements"], writes: ["Ninguna"], records: ["ledger YOL1"], events: ["social_debt_viewed · candidato"], failure: "Deuda cambió → mostrar saldo actual y no reutilizar un intento viejo", acceptance: "Por compartir, compartido por ti, pago iniciado, parcial y cerrado se derivan sin atribuir envío o lectura a WhatsApp." },
      { screen: "05 · WhatsApp", ui: "Vista previa reconocible con BORRADOR inicial o seguimiento y confirmación separada", next: "Copiar → declarar si se compartió → volver a la cola", services: ["Clipboard API local", "POST confirm_collection_shared"], command: "CopyPaymentRequestDraft + ConfirmCollectionShared(commandId)", reads: ["publicToken", "concepto", "saldo pendiente", "lastSharedAt"], writes: ["collection_confirmation sólo al tocar Sí, ya lo compartí"], records: ["declaración del acreedor; no evidencia de mensajería"], events: ["collection_draft_copied · candidato", "collection_shared_confirmed_by_creator · candidato", "collection_followup_draft_copied · candidato"], failure: "Portapapeles bloqueado → preview permanece; confirmación falla → no inventar estado", acceptance: "Copiar nunca equivale a compartir; recargar conserva la declaración y un seguimiento usa el mismo link y el remanente vigente." },
      { screen: "06 · Pagador público", ui: "Acreedor, persona asociada, concepto, total, pagado, pendiente y todo/otro monto", next: "Continuar con pago simulado", services: ["GET /api/debt-center/public/:token", "POST create_payin"], command: "CreateMockPayin(debtId, amount, idempotencyKey)", reads: ["PublicDebt DTO mínimo"], writes: ["payment_attempt creating/pending"], records: ["ledger YOL1 + MockFloid fixture"], events: ["payment_simulation_started · candidato"], failure: "Monto cero, sobrepago, token inválido o deuda actualizada → no reservar", acceptance: "El invitado no necesita cuenta, RUT ni KYC; el monto queda congelado durante el intento." },
      { screen: "07 · Banco simulado", ui: "Selección y autorización ficticias rotuladas SIMULACIÓN", next: "Pendiente | éxito | fallo | cancelación", services: ["MockFloidPaymentProvider local"], command: "SimulatePaymentOutcome", reads: ["attempt.amount", "deuda actual"], writes: ["estado monotónico del intento"], records: ["evidencia sintética"], events: ["payment_simulation_outcome_selected · candidato"], failure: "Recarga/replay → recuperar el mismo intento sin cambiar monto", acceptance: "Cero fetch externo incluso con variables FLOID hostiles; cancelación no altera saldo." },
      { screen: "08 · Resultado", ui: "Abono simulado, acumulado, remanente y entrada limpia para crear un gasto propio", next: "Volver al chat | Dividir un gasto", services: ["applyPaymentResult", "PublicDebt.lastCompletedAttempt"], command: "ApplySimulatedSettlement(attemptId)", reads: ["attempt terminal", "saldo vigente"], writes: ["settlement único", "outstanding", "activity"], records: ["ledger YOL1"], events: ["payer_result_viewed · candidato", "payer_creator_intent_selected · candidato"], failure: "Replay o recarga restaura el mismo comprobante sin un segundo pago", acceptance: "$10.000 → abono $5.000 → quedan $5.000; el CTA de creador no transporta token, persona ni monto." },
      { screen: "09 · Gasto habitual", ui: "Oferta posterior al valor para reutilizar monto, pagador, personas y reparto como borrador mensual", next: "No por ahora | Prepararlo cada mes", services: ["POST /api/debt-center · create_recurring_template"], command: "CreateRecurringTemplate(commandId, sourceExpenseId, nextOccurrenceOn)", reads: ["expense fuente", "splitSpec v2", "grupo vigente"], writes: ["recurring_template", "activity"], records: ["snapshot sin boleta"], events: ["recurring_prompt_viewed · candidato", "recurring_rule_created · candidato"], failure: "Fecha inválida, grupo cambiado o replay conflictivo → cero plantilla y cero deuda", acceptance: "Guardar la regla genera cero gastos, obligaciones, mensajes y pagos; reintentar devuelve la misma plantilla." },
      { screen: "10 · Borrador mensual", ui: "Fecha, monto, pagador, personas y reparto anterior completamente visible", next: "Confirmar y crear el mismo gasto | Omitir con confirmación | Dejar de preparar con confirmación", services: ["POST materialize_recurring_occurrence", "POST skip_recurring_occurrence", "POST pause_recurring_template"], command: "Natural key templateId + occurrenceKey", reads: ["recurring_template", "grupo y participantes vigentes"], writes: ["ocurrencia materializada u omitida", "siguiente fecha"], records: ["ledger YOL1 sólo tras confirmar"], events: ["recurring_due_viewed · candidato", "recurring_expense_created · candidato", "recurring_occurrence_skipped · candidato"], failure: "Plantilla pausada, ocurrencia stale o grupo modificado → no crear", acceptance: "Sólo aparece al llegar la fecha; doble tap/retry crea una ocurrencia; omitir avanza sin deuda; dejar de preparar bloquea nuevos borradores." },
      { screen: "11 · Cartola demo", ui: "Carga explícita de una cartola 100% ficticia; referencia exacta se concilia por regla local", next: "Ver resultado automático | Revisar coincidencia ambigua", services: ["POST load_mock_statement", "reconciliation-rule-v1"], command: "LoadMockStatement(commandId, fixtureVersion)", reads: ["deudas cobrables", "saldo vigente", "intentos activos"], writes: ["statement fixture", "entries", "candidates", "decisión rule_auto_applied", "settlement source=mock_statement_reconciliation"], records: ["ledger YOL1 + evidencia local"], events: ["mock_statement_loaded · candidato", "reconciliation_auto_applied · candidato"], failure: "Débito, movimiento futuro, sobrepago, replay o pago activo → cero settlement", acceptance: "La referencia exacta de Nico aplica $5.000 una sola vez, deja $5.000 pendientes y puede deshacerse sin borrar evidencia; cero banco, Floid o red." },
      { screen: "12 · Revisión de coincidencia", ui: "Movimiento, cuentas posibles, evidencia, antes/abono/después y decisión humana sin preselección", next: "Registrar | Descartar | Reabrir | Deshacer registro", services: ["POST confirm/reject/reopen/reverse reconciliation"], command: "Comandos opacos idempotentes y natural key statementEntryId", reads: ["candidate", "expectedOutstanding", "debt owner", "active attempt"], writes: ["decision", "settlement o reversa auditable", "activity"], records: ["ledger YOL1"], events: ["reconciliation_reviewed · candidato", "reconciliation_confirmed_by_creator · candidato", "reconciliation_reversed · candidato"], failure: "Saldo stale, entry usada, deuda ajena o intento activo → no mutar", acceptance: "La coincidencia ambigua cambia cero pesos hasta confirmar; doble toque/replay produce un solo abono; rechazar y revertir son recuperables." },
      { screen: "13 · Fuente compartida", ui: "Acompañante muestra sólo resumen, resultado y handoff; nunca decide", next: "Abrir Cuentas Claras con deuda, conciliación o borrador", services: ["GET /api/debt-center/summary"], command: "Sin mutaciones desde Acompañante", reads: ["DebtCenterCompanionSummaryV1"], writes: ["Ninguna"], records: ["mismo ledger YOL1"], events: ["clear_accounts_handoff_started · candidato"], failure: "Resumen no disponible → guion y CTA sin cifras inventadas", acceptance: "Después de una conciliación, Acompañante y Cuentas muestran el mismo remanente; descriptor y referencia nunca viajan en la URL." },
      { screen: "14 · Saldo simplificado", ui: "Toggle Simplificado | Por gasto, transferencias sugeridas y explicación del cálculo", next: "Ver cómo se calculó | Volver a las cuentas originales", services: ["deriveGroupNetting · determinista y local"], command: "Sólo lectura; no existe comando de pago neteado", reads: ["DebtSummary.outstandingAmount", "participantes del grupo", "intentos activos"], writes: ["Ninguna"], records: ["GroupNettingView derivado; no se persiste"], events: ["group_netting_viewed · candidato", "group_netting_gross_viewed · candidato"], failure: "Base inconsistente → ocultar sugerencia y conservar Por gasto", acceptance: "A→B $10.000 y B→C $10.000 sugiere A→C $10.000; abonos y reversas recalculan; ninguna deuda, link, settlement o contraparte original cambia." },
      { screen: "15 · Corregir un gasto", ui: "Impacto, motivo cerrado, blockers y confirmación Anular y preparar corrección", next: "Cerrar links viejos → revisar copia prellenada → crear una versión nueva", services: ["POST cancel_expense_for_correction", "sessionStorage draft adapter"], command: "CancelExpenseForCorrection(commandId, expenseId, reason) idempotente", reads: ["gasto fuente", "deudas", "settlements", "intentos activos", "plantilla habitual activa"], writes: ["lifecycle cancelled_for_correction", "deudas cancelled", "activity", "borrador local opaco"], records: ["original y linaje de reemplazo; nunca tokens en la corrección"], events: ["expense_correction_started · candidato", "expense_cancelled_for_correction · candidato", "expense_replacement_created · candidato"], failure: "Abono, pago activo, plantilla activa, actor ajeno o replay conflictivo → cero cambios", acceptance: "El original nunca se borra; link viejo no paga; una sola copia puede reemplazarlo; abonos y conciliaciones activas bloquean; el reemplazo recibe nuevos IDs y cero settlements heredados." },
    ],
  });
  if (product.id === "kyc") return withGovernance(product.id, {
    event: "onboarding_started",
    architecture: ["React Native · flujo por estados nominales, foco accesible y recuperación sin reinicio", "Cognito User Pool · candidato para email/teléfono y federación; `cognito_sub` representa credencial, no el perfil financiero", "BFF de identidad · valida JWT/issuer/audience y resuelve `person_id` idempotentemente", "Onboarding / capability orchestration · calcula requisitos por producto, partner, policy y riesgo", "Adaptadores separados: consentimiento de datos, KYC y Customer Success; ninguno habilita dinero directamente"],
    data: { store: ["anonymous_session_id efímero", "cognito_sub como referencia de credencial", "person_id estable de YOL1", "access_identity_id / método de acceso", "preregistration_id con intención y estado recuperable", "capability_request_id, versión de política y estado normalizado"], query: ["Estado del challenge OTP sin exponer código", "Estado de pre-registro y ruta seleccionada", "Matriz de capability → requisitos → availability", "Consentimiento específico/versionado y estado KYC normalizado"], sources: ["Cognito / IdP federado · candidato", "Profile service / BD operacional · por definir", "Matriz de capabilities versionada", "Adaptador KYC/consentimiento/partner · pendiente"], handling: "Explorar no requiere datos. OTP confirma control de canal; Google/Facebook/Apple serían federación candidata, no identidad financiera. No guardar ni emitir a analytics contacto crudo, OTP, RUT, número de serie, biometría, documento, token o payload crudo de proveedor." },
    kyc: { state: "Por validar", reason: "El pivote local sólo confirma un canal y un nombre visible. RUT, documento, screening o biometría no aparecen sin una capacidad futura, fundamento y proveedor aprobados." },
    licenses: { state: "Por validar", reason: "Chile es la base. La capacidad financiera depende de vehículo, partner y revisión Legal." },
    questions: ["¿Qué capacidad concreta futura justificaría pedir RUT?", "¿En qué boundary y con qué idempotency key se crea/recupera `person_id` después del token válido?", "¿Cómo se evita enumerar cuentas cuando existe un email/teléfono y cómo se unen métodos de acceso entre dispositivos?", "¿Qué TTL, rate limit, binding de sesión y política de reenvío requiere el OTP antes de operar?", "¿Qué producto/capability, partner y fundamento habilitan pedir cédula, documento o biometría en Chile?", "¿Cuál es el owner, canal y SLA de Customer Success si un estado de KYC queda en review?"],
    risks: ["Pedir RUT antes de demostrar una personalización que lo justifique", "La persona confunde perfil declarado con identidad verificada o capacidad operativa", "OTP no llega, vence o se reintenta sin preservar el avance", "Un contacto existente revela información o crea duplicados", "Documento/biometría se solicitan antes de que haya capability, policy y partner", "Estado de proveedor desconocido se interpreta como aprobado", "La UI no informa qué se guardó, qué no se guardó y cómo volver"],
    flowAnalysis: [
      { step: "01 · Historias de valor", purpose: "Explicar tres promesas antes de pedir datos.", good: "Organiza, Entiende y Úsala bien se recorren con swipe y declaran sus límites; una sola CTA inicia YOL1.", failure: "Usar las historias como publicidad vacía o afirmar conexiones y productos activos.", persist: "Sólo sesión anónima efímera y versión de copy; ningún dato de identidad." },
      { step: "02 · Crear acceso", purpose: "Explicar por qué se solicita un canal y separar acceso de identidad.", good: "Correo/teléfono equivalentes, SSO candidato deshabilitado y salida a las historias.", failure: "Afirmar cuenta financiera o esconder que el canal sirve sólo para entrada y recuperación.", persist: "Challenge opaco; nunca contacto crudo en analytics o snapshot local." },
      { step: "03 · OTP y recuperación", purpose: "Comprobar control del canal con errores recuperables y respuesta neutral.", good: "Código, vencimiento, límite, cambio de canal y recuperación conservan el avance.", failure: "Confirmar existencia de cuenta, aceptar intentos infinitos o tratar OTP como identidad.", persist: "Challenge server-side con TTL, single-use, attempt bucket y session binding; nunca el OTP." },
      { step: "04 · Perfil declarado", purpose: "Probar personalización básica sin presentar una verificación.", good: "Sólo se pide un nombre visible y se explica que el canal no verifica identidad.", failure: "Pedir RUT sin un job material, inferir KYC o asignar automáticamente una capability.", persist: "Sólo estado neutral de acceso; sin nombre, RUT, contacto, OTP ni capability seleccionada." },
      { step: "05 · Entrada al Acompañante", purpose: "Entregar navegación demo y explicar qué sigue pendiente.", good: "Canal confirmado, perfil declarado y verificación pendiente aparecen como estados separados.", failure: "Presentar saldo, conexión bancaria, cuenta o capacidad de dinero como resultado del perfil.", persist: "Estado resumido recuperable; ninguna intención material por defecto." },
      { step: "06 · Verificación contextual", purpose: "Mostrar documento y prueba de vida sólo como recorrido opcional y condicionado.", good: "Finalidad, responsable, conservación, recaptura, revisión y ayuda quedan visibles antes de simular.", failure: "KYC genérico sin capability, capturar evidencia real o terminar en aprobación automática.", persist: "En la demo sólo estado de revisión; sin documento, biometría o respuesta cruda de proveedor." },
    ],
    references: ["Craft Innovations · Revolut Onboarding UX Analysis (PDF local): patrones de propuesta de valor, OTP, compliance, corrección y revisión.", "Investigación YOL1 / Notion + Second Brain: fricción ligada a capability, no KYC universal.", "AWS Cognito documentation: federación/token validation como opción técnica candidata.", "CMF Chile: SFA y capacidades financieras requieren validación de vehículo, partner y normativa aplicable."],
    technicalFlow: [
      { screen: "01 · Historias de valor", ui: "Organiza / Entiende / Úsala bien, una promesa por historia", next: "Swipe horizontal | Inicia en YOL1 → Crear acceso", services: ["App shell / feature flags", "Content config versionado"], command: "GET /onboarding/experience?entry_point=…", reads: ["copy_variant", "feature_flags"], writes: ["Ninguna escritura de identidad"], records: ["anonymous_session_id efímero"], events: ["onboarding_value_viewed", "onboarding_started"], failure: "Config inaccesible → fallback de copy estático; nunca afirmar bancos o productos conectados.", acceptance: "Las tres historias son recorribles sin datos, conservan alternativa de teclado y declaran límites de la demo." },
      { screen: "02 · Crear acceso", ui: "Email/teléfono equivalentes; Google/Apple candidatos deshabilitados", next: "Canal válido → OTP | Volver → Historias", services: ["Cognito User Pool / IdP federado · candidato", "Identity BFF", "Rate-limit gateway"], command: "POST /access/challenges o OAuth /authorize", reads: ["provider_config", "anti_abuse_policy", "existing_identity_link"], writes: ["access_challenge_ref", "attempt_bucket", "correlation_id"], records: ["access_identity_id sólo después de token válido"], events: ["access_method_selected", "otp_requested"], failure: "Formato inválido, rate limit o contacto existente → respuesta neutral y recuperación.", acceptance: "La UI explica que el canal sirve para entrar y recuperar; no crea cuenta financiera ni enumera personas." },
      { screen: "03 · Confirmar canal", ui: "OTP, vencimiento, límite, cambio de canal y recuperación neutral", next: "Verificado → Perfil declarado | Error → recuperar o cambiar", services: ["OTP challenge service", "Notification/SMS-email provider · pendiente", "Identity BFF"], command: "POST /access/challenges/{ref}/verify", reads: ["challenge TTL", "attempt_count", "session_binding"], writes: ["channel_verified_at", "access_identity_id", "security_audit_event"], records: ["person_id idempotente en BFF · futuro"], events: ["otp_verified", "otp_expired", "account_recovery_started"], failure: "Código incorrecto/vencido o demasiados intentos → conservar avance sin confirmar existencia de cuenta.", acceptance: "Single-use, TTL, rate limit y binding server-side; OTP nunca llega a logs o analytics." },
      { screen: "04 · Perfil declarado", ui: "Nombre visible con validación local y microcopy de no verificación", next: "Nombre válido → Entrada al producto | Volver → OTP", services: ["Profile service · candidato", "Validación local de longitud"], command: "POST /profiles/declared · futuro; sin red en esta demo", reads: ["reglas del nombre visible", "copy de privacidad"], writes: ["Ninguna PII en localStorage o analytics"], records: ["snapshot neutral de acceso; sin nombre, RUT ni capability"], events: ["declared_profile_created · candidato"], failure: "Formato inválido → corrección local; nunca consultar Registro Civil ni afirmar identidad.", acceptance: "El perfil se rotula declarado y no inventa capacidad, consentimiento, KYC o cuenta." },
      { screen: "05 · Entrada al producto", ui: "Canal confirmado + perfil declarado + verificación pendiente", next: "Acompañante | Verificación completa opcional | Borrar demo", services: ["Onboarding state service", "Profile read model · futuro"], command: "GET /onboarding/resume y DELETE /onboarding/demo-state", reads: ["resume_stage", "declared_profile_state"], writes: ["resume preference", "audit deletion event"], records: ["snapshot demo no sensible con capability none"], events: ["preregistration_created", "preregistration_deleted"], failure: "Estado no recuperable → informar y permitir reinicio sin mantener PII.", acceptance: "Navegar no equivale a cuenta, identidad verificada, datos conectados ni dinero habilitado." },
      { screen: "06 · Contexto de verificación", ui: "Finalidad y pasos posibles antes de documento/biometría", next: "Ahora no → Producto | Continuar → Documento demo", services: ["Capability orchestration · futuro", "KYC adapter · pendiente"], command: "GET /capability-requests/{id}/requirements · futuro", reads: ["capability policy", "partner state", "risk controls"], writes: ["Ninguna evidencia en la demo"], records: ["Sólo estado local de pantalla"], events: ["kyc_requirements_viewed"], failure: "Sin capability o política aprobada → mantenerlo como demostración opcional y permitir salir.", acceptance: "No afirma que completar KYC habilite una capability." },
      { screen: "07 · Documento demo", ui: "Frente/reverso ficticios, legibilidad y recaptura explicadas", next: "Documento legible → Prueba de vida | Salir → Producto", services: ["KYC adapter / capture SDK · pendiente"], command: "Sin captura ni upload en el Lab", reads: ["copy de finalidad y retención · pendiente"], writes: ["Ningún archivo o dato documental"], records: ["Sólo estado local de simulación"], events: ["document_demo_reviewed · candidato"], failure: "Recaptura o salida sin perder el perfil declarado.", acceptance: "No abre cámara, no sube documento y explica que proveedor, finalidad y conservación siguen por decidir." },
      { screen: "08 · Biometría y revisión", ui: "Prueba de vida simulada, alternativa de ayuda y cierre en revisión", next: "Revisión → Acompañante | Ayuda → Ruta por definir", services: ["KYC adapter", "Risk/eligibility adapter", "Customer Success router · pendientes"], command: "Sin biometría ni caso real en el Lab", reads: ["estado normalizado candidato", "support policy pendiente"], writes: ["Sólo estado local review"], records: ["Sin evidencia ni payload de proveedor"], events: ["kyc_status_changed", "support_route_started"], failure: "Estado desconocido → review; nunca approved por default.", acceptance: "El cierre no habilita cuenta, saldo, tarjeta, transferencia o conexión bancaria." },
    ],
  });
  if (product.id === "builder") return withGovernance(product.id, {
    event: "builder_viewed",
    architecture: ["React Native · experiencia futura para colaboradores", "Paquete de contexto versionado · diseño, producto y límites", "MCP remoto con OAuth · etapa posterior, no conectado aún", "AWS · API de propuestas y revisión editorial (por validar)"],
    data: { store: ["Borrador local de idea", "Resumen de propuesta enviado", "Versión del paquete de contexto"], query: ["Sistema visual y patrones aprobados", "Especificaciones de producto aprobadas", "Estado de revisión de la propuesta"], sources: ["Paquete de contexto versionado", "Repositorio aprobado", "Envío explícito de la persona"], handling: "No conectar cuentas personales de IA ni leer conversaciones privadas. La persona decide qué pega y qué envía." },
    kyc: { state: "No aplica", reason: "Crear una propuesta no identifica ni activa productos financieros." },
    licenses: { state: "No aplica", reason: "Es un espacio editorial de ideación; cualquier producto resultante se evalúa por separado en Chile." },
    questions: ["¿Qué permisos y OAuth exigirá un MCP remoto antes de habilitarlo?", "¿Qué parte del contexto puede ser pública para colaboradores externos?"],
    risks: ["Hacer creer que YOL1 ve el chat privado de una persona", "Enviar una idea sin caso de uso ni criterio de éxito", "Convertir un borrador en promesa de producto sin revisión editorial"],
  });
  if (product.id === "cards") return withGovernance(product.id, {
    event: "cards_home_viewed",
    architecture: ["React Native · experiencia móvil sugerida", "BFF/API Gateway · orquestación por dominio (por validar)", "AWS · instrumentos, movimientos, beneficios, alertas y consentimientos separados", "Emisor/processor/rail · sin selección ni conexión"],
    data: { store: ["Intención y preferencia explícitas", "Referencia opaca del instrumento", "Estado/fuente/frescura del movimiento", "Regla versionada de recomendación o alerta"], query: ["Instrumentos autorizados", "Movimientos normalizados", "Catálogo, elegibilidad y condiciones", "Consentimiento y alcance vigente"], sources: ["Persona · declaración explícita", "Emisor/agregador · por validar", "Catálogo de beneficios · por validar"], handling: "Nunca PAN, CVV, PIN, OTP, token, biometría, QR completo ni credenciales wallet en analytics o logs generales." },
    kyc: { state: "Por validar", reason: "El borrador usa datos sintéticos. Un dato o control real requiere definir autenticación, rol del emisor/partner y riesgo; KYC por sí solo no habilita la capacidad." },
    licenses: { state: "Por validar", reason: "Emisión, pagos, QR, NFC/wallet y operación dependen del rol jurídico de YOL1, partner/contrato, rail, controles y normativa chilena aplicable." },
    questions: ["¿Qué intención domina: elegir, datos, movimiento/alerta o beneficio?", "¿Qué puede resolver YOL1 sin ser emisor u operador?", "¿Quién provee y reconcilia beneficios vigentes?"],
    risks: ["Confundir recomendación o handoff con pago", "Interpretar pendiente como confirmado", "Revelar o registrar credenciales", "Prometer un beneficio no elegible", "Diseñar QR/NFC/wallet antes de partner y gates"],
  });
  return withGovernance(product.id, {
    event: `${product.id}_portfolio_viewed`,
    architecture: ["Sin arquitectura aprobada", "React Native + AWS son candidatos, no decisiones"],
    data: { store: ["Sin datos aprobados"], query: ["No aplica"], sources: ["No aplica"], handling: "Solo contexto editorial del Lab." },
    kyc: { state: "Por validar", reason: "No existe flujo disponible; Chile es la jurisdicción base." },
    licenses: { state: "Por validar", reason: "No se afirma requisito ni exención sin revisar la documentación vigente." },
    questions: ["¿Qué necesidad de usuario autoriza Felipe?", "¿Qué evidencia y fuente faltan antes de construir?"],
    risks: ["Construir una solución antes de entender el problema", "Confundir un espacio reservado con un producto disponible"],
  });
}

export function simpleEventName(event: string, product: ProductDefinition, screen: string) {
  if (event.endsWith("_viewed")) return screen === "Inicio" ? "Vio Home" : `Vio ${screen}`;
  const readable = event.replaceAll(".", "_").split("_").filter((part) => ![product.id, "click", "selected", "started", "action"].includes(part)).join(" ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Acción";
  return `${screen} · ${readable}`;
}

export function eventMetadata(event: string, product: ProductDefinition, screen: string) {
  const screenKey = screen.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "unknown";
  const actionKey = event.split("_").at(-1) || "unknown";
  return [
    ["event_name", event],
    ["event_id", "UUID"],
    ["event_at", "ISO 8601 UTC"],
    ["anonymous_id", "anonymous_id / null"],
    ["user_id", "user_id / null"],
    ["session_id", "UUID"],
    ["product_key", product.id],
    ["screen_key", screenKey],
    ["action_key", actionKey],
    ["platform", "web"],
    ["app_version", "lab"],
    ["schema_version", "proposed"],
    ["source", "prototype"],
    ["consent_analytics", "boolean"],
    ["correlation_id", "UUID / null"],
  ];
}

export function getExplicitEventId(element: HTMLElement) {
  const eventId = element.dataset.eventId;
  if (!eventId) {
    console.warn("[YOL1 Lab] Acción sin data-event-id; no se registra ningún evento.");
    return null;
  }
  return eventId;
}
