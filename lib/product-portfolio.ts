export type ProductId = "companion" | "kyc" | "banking" | "cards" | "remittances" | "builder";

export type CertaintyState = "No aplica" | "Por validar" | "Requerido";

export type ProductDefinition = {
  id: ProductId;
  shortLabel: string;
  name: string;
  icon: string;
  published: boolean;
  description: string;
};

export type LivingSpec = {
  event: string;
  architecture: string[];
  data: { store: string[]; query: string[]; handling: string };
  kyc: { state: CertaintyState; reason: string };
  licenses: { state: CertaintyState; reason: string };
  questions: string[];
  risks: string[];
};

export const PORTFOLIO_PRODUCTS: ProductDefinition[] = [
  { id: "companion", shortLabel: "Acompañante", name: "Acompañante financiero", icon: "✦", published: true, description: "El prototipo activo del Lab: finanzas, cobrar y pagar, ahorrar, ganar más lucas y Mi banco." },
  { id: "kyc", shortLabel: "Onboarding + KYC", name: "Onboarding y KYC progresivo", icon: "◎", published: true, description: "Entrada por teléfono o email con OTP, pre-registro y activación progresiva." },
  { id: "banking", shortLabel: "Home Banking", name: "Home Banking", icon: "⌂", published: false, description: "Espacio reservado. No representa banca construida ni disponible." },
  { id: "cards", shortLabel: "Tarjetas", name: "Tarjetas", icon: "▰", published: false, description: "Espacio reservado. No hay emisión, procesamiento ni producto publicado." },
  { id: "remittances", shortLabel: "Remesas", name: "Remesas", icon: "↗", published: false, description: "Espacio reservado. No hay envíos, tipo de cambio ni licencias definidas." },
  { id: "builder", shortLabel: "Construir", name: "Construir mi propio producto", icon: "✎", published: false, description: "Escribe una idea en ChatGPT o Claude. YOL1 la convierte en pantallas y funcionalidades para que las edites, las pruebes y las envíes a revisión." },
];

export const EMPTY_STATE_LIBRARY = [
  { id: "paper", icon: "✎", eyebrow: "FELIPE, TE TENEMOS IDENTIFICADO", title: "Alguien no hizo la pega…", body: "Perdón por las molestias. Ya estamos apurando al equipo para que deje de pavear.", gesture: "scribble" },
  { id: "dog", icon: "", eyebrow: "PAUSA CON MOVIMIENTO", title: "Aún no está listo esto.", body: "Pero para que no esperes solo, acá tenemos un perro feliz que te hará compañía.", gesture: "dog" },
  { id: "cat", icon: "", eyebrow: "SORY, NO HICE LA PEGA", title: "Pero acá hay un gato tecleando.", body: "Nos pareció suficientemente útil mientras Felipe termina de armar esta parte.", gesture: "cat" },
  { id: "robot", icon: "", eyebrow: "IDEAS EN ORDEN", title: "Un robot está ordenando los post-its.", body: "Tu idea después podrá pasar de conversación a propuesta, pantalla y revisión.", gesture: "robot" },
  { id: "coffee", icon: "", eyebrow: "TARJETAS EN ESPERA", title: "Las tarjetas todavía están en modo avión.", body: "Por ahora no hay nada que tocar. Apenas exista algo aprobado, aparece acá.", gesture: "coffee" },
  { id: "rhyme", icon: "✦", eyebrow: "REMESAS EN PAUSA", title: "Las rosas son rojas. Las violetas, azules. Esto aún no funciona y no vendemos humo con luces.", body: "Aún no desciframos por completo cómo lo queremos construir.", gesture: "orbit" },
  { id: "lamp", icon: "◉", eyebrow: "IDEA EN REVISIÓN", title: "Hay una luz prendida, no un producto listo.", body: "Felipe decide qué rescatar antes de que una pantalla entre al Lab.", gesture: "halo" },
  { id: "door", icon: "▥", eyebrow: "PUERTA CERRADA POR AHORA", title: "Todavía no se abre esta experiencia.", body: "Preferimos mostrar el vacío antes que inventar una capacidad.", gesture: "door" },
  { id: "blocks", icon: "▦", eyebrow: "PIEZAS SIN ARMAR", title: "Tenemos preguntas. No una promesa.", body: "Arquitectura, datos y regulación siguen por validar antes de diseñar flujo.", gesture: "blocks" },
  { id: "orbit", icon: "⊙", eyebrow: "EN ÓRBITA, NO EN ROADMAP", title: "Esta idea todavía está encontrando su forma.", body: "Sin fecha, sin disponibilidad y sin claims operacionales.", gesture: "orbit" },
  { id: "tape", icon: "╱", eyebrow: "NO PUBLICADO", title: "Cinta de obra. Nada que operar todavía.", body: "Cuando exista una decisión aprobada, Felipe habilitará la primera pantalla.", gesture: "tape" },
  { id: "spark", icon: "✦", eyebrow: "CHISPA, NO CAPACIDAD", title: "La intuición existe. El producto aún no.", body: "Este espacio ayuda a separar ideas interesantes de experiencias autorizadas.", gesture: "spark" },
  { id: "folder", icon: "▤", eyebrow: "CARPETA EN ESPERA", title: "Lo bueno se ordena antes de publicarse.", body: "Las propuestas futuras podrán revisarse aquí; hoy esa bandeja no existe.", gesture: "folder" },
  { id: "signal", icon: "⌁", eyebrow: "SEÑAL DÉBIL", title: "Todavía falta contexto para diseñar bien.", body: "No completamos los vacíos con supuestos de producto, datos o regulación.", gesture: "signal" },
  { id: "stamp", icon: "○", eyebrow: "FALTA EL OK DE FELIPE", title: "Sin aprobación, sigue siendo borrador.", body: "La prioridad es simple: decisión verbal, decisión aprobada y después el resto de las fuentes.", gesture: "stamp" },
  { id: "bench", icon: "⌑", eyebrow: "EN EL BANCO DE PRUEBAS", title: "Vuelve cuando la hagamos oficial.", body: "Esta pantalla no conecta servicios, no mueve dinero y no representa readiness.", gesture: "bench" },
] as const;

const companionSpecs: Record<string, LivingSpec> = {
  inicio: {
    event: "home.view",
    architecture: ["React Native · app móvil (candidato)", "AWS Amplify + Cognito para acceso (por validar)", "API Gateway → Lambda para reglas y respuestas (por validar)"],
    data: { store: ["Preferencias de la persona", "Estado de pendientes vistos", "Preguntas y notas explícitamente guardadas"], query: ["Perfil de la persona", "Pendientes aprobados", "Catálogo de respuestas"], handling: "Separar datos de producto de datos financieros. Nada real en este prototipo." },
    kyc: { state: "No aplica", reason: "Esta pantalla demo no identifica ni verifica personas." },
    licenses: { state: "Por validar", reason: "Pendiente cruzar el Notion/Second Brain de licencias para Chile." },
    questions: ["¿Qué pendiente merece aparecer primero?", "¿Cuándo una respuesta pasa de demo a aprobada?"],
    risks: ["La persona no entiende por qué ve un pendiente", "Un toque puede llevar a una pantalla sin salida clara", "La recomendación puede sonar más cierta de lo que la evidencia permite"],
  },
  finanzas: {
    event: "finances.view",
    architecture: ["React Native · vista de resumen (candidato)", "Servicio de consolidación en AWS Lambda (por validar)", "Base transaccional con trazabilidad por fuente (por validar)"],
    data: { store: ["Fuentes conectadas y su estado", "Reglas de clasificación", "Resumen calculado por período"], query: ["Movimientos normalizados", "Cuentas activas", "Reglas de exclusión de transferencias propias"], handling: "Guardar origen y fecha de cálculo para que cada número sea explicable." },
    kyc: { state: "No aplica", reason: "No hay alta ni conexión de cuenta en este prototipo." },
    licenses: { state: "Por validar", reason: "Pendiente validar en Notion qué habilita ver y consolidar datos financieros en Chile." },
    questions: ["¿Qué criterio de consolidación debe explicar primero?", "¿Qué fuente tendría permiso de corregir una clasificación?"],
    risks: ["Duplicar transferencias entre cuentas propias", "Mostrar un saldo atrasado como actual", "Mezclar fuentes con distinta fecha de actualización"],
  },
  cartola: {
    event: "ledger.view",
    architecture: ["React Native · lista virtualizada (candidato)", "Servicio de normalización de movimientos (por validar)", "Almacenamiento cifrado y auditado en AWS (por validar)"],
    data: { store: ["Movimiento normalizado", "Origen, fecha/hora y código", "Notas y decisiones de revisión"], query: ["Movimientos por cuenta/período", "Detalle de un movimiento", "Reglas de duplicado y transferencias propias"], handling: "No perder la cartola original: conservar trazabilidad al origen antes de clasificar." },
    kyc: { state: "No aplica", reason: "Inspeccionar el ejemplo no requiere verificar identidad." },
    licenses: { state: "Por validar", reason: "Pendiente revisar el marco aplicable a acceso y tratamiento de cartolas en Chile." },
    questions: ["¿Qué evidencia basta para sugerir un duplicado?", "¿Quién confirma una transferencia propia?"],
    risks: ["Clasificar un gasto real como duplicado por error", "No explicar de dónde vino un movimiento", "Ofrecer dividir algo que no es compartido"],
  },
  cobrar: {
    event: "collect.view",
    architecture: ["React Native · grupos y pendientes (candidato)", "API autenticada para solicitudes (por validar)", "Servicio de mensajería/pagos solo vía partner autorizado (futuro)"],
    data: { store: ["Gastos compartidos", "Participantes y montos", "Estado de solicitud: borrador, enviada, resuelta"], query: ["Deudas por persona", "Deudas por grupo", "Contactos solo con permiso explícito"], handling: "Separar el registro de deuda del pago. No leer contactos ni enviar mensajes por defecto." },
    kyc: { state: "Por validar", reason: "La demo no verifica identidad; un flujo real debería definir cuándo corresponde." },
    licenses: { state: "Por validar", reason: "Pendiente validar en Notion el alcance de iniciación de pagos, cobros y partners en Chile." },
    questions: ["¿Qué consentimiento se necesita antes de compartir?", "¿Cómo se confirma que una deuda quedó resuelta?"],
    risks: ["Enviar un cobro a la persona equivocada", "Confundir deuda registrada con pago realizado", "Presionar a un contacto sin consentimiento"],
  },
  ahorrar: {
    event: "saving.view",
    architecture: ["React Native · oportunidades (candidato)", "Servicio de reglas y evidencia en Lambda (por validar)", "Catálogo de beneficios/versiones (por validar)"],
    data: { store: ["Oportunidades vistas, ignoradas o guardadas", "Regla que generó la oportunidad", "Divulgación comercial si aplica"], query: ["Movimientos categorizados", "Beneficios vigentes", "Preferencias explícitas de la persona"], handling: "Cada oportunidad debe indicar evidencia, vigencia y si existe interés comercial." },
    kyc: { state: "No aplica", reason: "Revisar una recomendación demo no verifica identidad." },
    licenses: { state: "Por validar", reason: "Pendiente confirmar con Notion cuándo una recomendación/afiliación exige disclosure o permiso." },
    questions: ["¿Qué certeza mínima permite mostrar una oportunidad?", "¿Cómo se valida el ahorro después de actuar?"],
    risks: ["Recomendar un beneficio vencido", "Confundir estimación con ahorro garantizado", "Ocultar un interés comercial"],
  },
  ganar: {
    event: "earn.view",
    architecture: ["Placeholder editorial local"],
    data: { store: ["Sin datos funcionales"], query: ["No aplica"], handling: "No hay flujo publicado." },
    kyc: { state: "Por validar", reason: "No hay flujo diseñado; no corresponde inferir requisitos." },
    licenses: { state: "Por validar", reason: "Pendiente definición del producto y revisión documental." },
    questions: ["¿Qué problema cotidiano debería resolver antes de diseñar un flujo?"],
    risks: ["Prometer ingresos sin un mecanismo real", "No transparentar pagos de terceros"],
  },
  banco: {
    event: "my-bank.view",
    architecture: ["React Native · activación progresiva", "Cognito · sesión autenticada", "API Gateway + Lambda · orquestación (por validar)", "Proveedor KYC/biometría · pendiente de selección", "CDP · deduplicación y unión de identidad (por definir)"],
    data: { store: ["Estado de activación", "Referencia del caso KYC", "Consentimiento y versión aceptada"], query: ["Estado del pre-registro", "Reglas de elegibilidad", "Resultado del proveedor KYC"], handling: "RUT, número de serie, biometría y documentos no van a analytics ni quedan expuestos en este prototipo." },
    kyc: { state: "Requerido", reason: "La pantalla solicita RUT + número de serie y luego biometría simulada para activar Mi banco." },
    licenses: { state: "Por validar", reason: "Activar una cuenta o conectar banca depende de partner, vehículo y definición legal en Chile." },
    questions: ["¿Cuándo se crea el ID definitivo Yol1?", "¿Qué proveedor y qué datos conserva cada parte?"],
    risks: ["Pedir identidad antes de que la persona entienda el beneficio", "No tener salida humana ante revisión manual", "Confundir una simulación con validación real"],
  },
};

export function getLivingSpec(product: ProductDefinition, screen: string): LivingSpec {
  if (product.id === "companion") return companionSpecs[screen] ?? companionSpecs.inicio;
  if (product.id === "kyc") return {
    event: "onboarding.view",
    architecture: ["React Native · app móvil (decisión de equipo)", "Cognito · OTP, sesión y credenciales", "API Gateway + Lambda · perfil temporal y reglas", "DynamoDB · pre-registro y estados de onboarding", "CDP · resolución de duplicidades e identidad canónica (por definir)"],
    data: { store: ["ID temporal", "Canal de acceso verificado", "Estado de onboarding", "Consentimientos versionados"], query: ["Estado de OTP", "Regla de duplicidad", "Estado KYC cuando se active"], handling: "T0 no activa productos ni usa datos financieros propios. No guardar OTP, PIN, biometría o documentos en analytics." },
    kyc: { state: "Por validar", reason: "RUT + número de serie y biometría se solicitan al activar Mi banco; el ID definitivo queda abierto." },
    licenses: { state: "Por validar", reason: "Chile es la base. La capacidad financiera depende de vehículo, partner y revisión Legal." },
    questions: ["¿Cuándo nace el ID definitivo Yol1?", "¿Cuál es el SLA y ruta de Customer Success ante revisión o pérdida de acceso?"],
    risks: ["OTP no recibido o expirado", "Pre-registros duplicados por teléfono o email", "Abandono durante la validación de identidad", "Explicar biometría como demo cuando no hay proveedor conectado"],
  };
  return {
    event: `portfolio.${product.id}.view`,
    architecture: ["Sin arquitectura aprobada", "React Native + AWS son candidatos, no decisiones"],
    data: { store: ["Sin datos aprobados"], query: ["No aplica"], handling: "Solo contexto editorial del Lab." },
    kyc: { state: "Por validar", reason: "No existe flujo publicado; Chile es la jurisdicción base." },
    licenses: { state: "Por validar", reason: "No se afirma requisito ni exención sin revisar la documentación vigente." },
    questions: ["¿Qué necesidad de usuario autoriza Felipe?", "¿Qué evidencia y fuente faltan antes de construir?"],
    risks: ["Construir una solución antes de entender el problema", "Confundir un espacio reservado con un producto disponible"],
  };
}

export function simpleEventName(event: string, product: ProductDefinition, screen: string) {
  if (event.endsWith(".view")) return screen === "Inicio" ? "Home" : screen;
  const readable = event.split(".").slice(-2, -1)[0]?.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Acción";
  return `${readable} en ${screen}`;
}

export function eventMetadata(event: string, product: ProductDefinition, screen: string) {
  return [
    ["producto", product.name],
    ["pantalla", screen],
    ["acción", event.split(".").slice(-2, -1)[0] || "view"],
    ["origen", "prototipo"],
  ];
}

export function proposedEventForElement(element: HTMLElement, fallback: string) {
  const explicit = element.dataset.event;
  if (explicit) return explicit;
  const raw = element.getAttribute("aria-label") || element.textContent || "action";
  const slug = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "").slice(0, 42) || "action";
  return `${fallback.replace(/\.view$/, "")}.${slug}.click`;
}
