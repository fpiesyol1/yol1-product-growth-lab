export type KnowledgeStatus = "draft" | "approved";
export type KnowledgeDomain = "finanzas" | "cartola" | "cobrar-y-pagar" | "ahorrar";

export type KnowledgeCard = {
  id: string;
  status: KnowledgeStatus;
  domain: KnowledgeDomain;
  intent: string;
  canonicalQuestion: string;
  variants: readonly string[];
  expectedAnswer: { see: string; meaning: string; next: string };
  requiredContext: readonly string[];
  limits: readonly string[];
  nextQuestions: readonly string[];
  knownFeedback: string;
  source: string;
  tags: readonly string[];
};

export const YOL1_KNOWLEDGE_VERSION = "lab-kb-2026-08-13.1";

export const knowledgeCatalog: readonly KnowledgeCard[] = [
  {
    id: "fin-month-result-001", status: "approved", domain: "finanzas", intent: "resultado-del-mes",
    canonicalQuestion: "¿Cuál fue mi resultado del mes?",
    variants: ["¿Qué cambió este mes?", "¿Cómo cerré agosto?", "¿Cuánto me quedó este mes?", "¿Cuál es la diferencia entre lo que entró y lo que gasté?", "¿Tuve un mes positivo o negativo?", "¿Cómo van mis finanzas este mes?", "¿Cuánto entró y cuánto gasté?", "Muéstrame el resumen de agosto", "¿Ese resultado es mi saldo disponible?", "¿Las transferencias propias cuentan como ingreso?"],
    expectedAnswer: { see: "En agosto del ejemplo te entraron $2.450.000 y gastaste $1.620.000; la diferencia es +$830.000.", meaning: "Es el resultado clasificado del mes, no el saldo disponible de una cuenta. Las transferencias propias se excluyeron mediante una regla simulada y revisable.", next: "Puedes abrir Mis finanzas para revisar Te entró, Gastaste o la regla usada." },
    requiredContext: ["Periodo: agosto ficticio", "Te entró: $2.450.000", "Gastaste: $1.620.000", "Resultado: +$830.000"],
    limits: ["No llamarlo saldo bancario", "No afirmar que las categorías o transferencias fueron verificadas por un banco"],
    nextQuestions: ["¿Qué gastos explican el mes?", "¿Cómo trataron las transferencias propias?"],
    knownFeedback: "Felipe pidió lenguaje cotidiano: Te entró/Gastaste y aclarar que resultado no es saldo.", source: "knowledge/finanzas.md", tags: ["mes", "agosto", "resultado", "entró", "gastaste", "saldo", "transferencias"],
  },
  {
    id: "ledger-disney-001", status: "approved", domain: "cartola", intent: "cargo-disney-posible-duplicado",
    canonicalQuestion: "¿Disney+ me cobró dos veces?",
    variants: ["¿Qué pasó con Disney+?", "Veo dos cargos de Disney, ¿son duplicados?", "¿Por qué aparece Disney dos veces?", "¿Me cobraron doble la suscripción?", "¿Cuál de los dos cargos de Disney está mal?", "¿Puedes confirmar el duplicado de Disney?", "¿Qué evidencia hay sobre los cargos Disney?", "¿Los cargos de BCI y MACH son el mismo?", "¿Qué hago con los $11.990 repetidos?", "¿Tengo que reclamar por Disney?"],
    expectedAnswer: { see: "Veo dos cargos ficticios de Disney+ por $11.990, con un minuto de diferencia, uno en BCI y otro en MACH.", meaning: "La coincidencia de comercio, monto y tiempo es una señal para revisar; no confirma que sea un duplicado ni un fraude.", next: "Abre el detalle y compara fuente, hora, código, suscripción y forma de pago. Puedes dejar una nota o marcarlo como revisado." },
    requiredContext: ["Dos cargos por $11.990", "BCI 10:43", "MACH 10:42", "Códigos disponibles solo en detalle"], limits: ["No afirmar duplicado o fraude", "No prometer reclamo, reversa o devolución"], nextQuestions: ["¿Qué evidencia comparo?", "¿Dónde veo el código de cada cargo?"], knownFeedback: "La conclusión debe ser evidencia primero y la persona decide; los códigos no van en la fila principal.", source: "knowledge/cartola.md", tags: ["disney", "cargo", "duplicado", "doble", "11.990", "bci", "mach", "suscripción"],
  },
  {
    id: "collect-receivables-001", status: "approved", domain: "cobrar-y-pagar", intent: "quien-me-debe",
    canonicalQuestion: "¿Quién me debe plata?",
    variants: ["¿Quién me debe?", "¿Cuánto tengo por cobrar?", "Muéstrame lo que me deben", "¿Qué cobros tengo pendientes?", "¿Josefa todavía me debe?", "¿María me pagó el almuerzo?", "¿Cuánto me deben entre todos?", "¿Qué personas aparecen por cobrar?", "¿Tengo algo pendiente del viaje a Pucón?", "¿Puedo recordarles que me paguen?"],
    expectedAnswer: { see: "En el ejemplo te deben $228.000: Josefa $210.000 por Viaje a Pucón y María $18.000 por Almuerzo viernes.", meaning: "Son pendientes ficticios ordenados por persona; YOL1 no sabe si ya fueron pagados hasta que tú lo confirmes y revises la cartola de ejemplo.", next: "Abre Cobrar y pagar para revisar a cada persona, preparar un recordatorio o marcar Ya me pagaron." },
    requiredContext: ["Josefa: $210.000", "María: $18.000", "Total: $228.000", "Aliases ficticios"], limits: ["No afirmar que la deuda es real", "No enviar mensajes ni iniciar cobros"], nextQuestions: ["¿Qué me debe Josefa?", "¿Cómo se vería un recordatorio?"], knownFeedback: "Cobrar debe mostrar personas y grupos sin convertir la solicitud en un pago real.", source: "knowledge/cobrar-y-pagar.md", tags: ["me debe", "me deben", "cobrar", "por cobrar", "josefa", "maría", "pucón", "almuerzo"],
  },
  {
    id: "collect-payables-001", status: "approved", domain: "cobrar-y-pagar", intent: "a-quien-debo",
    canonicalQuestion: "¿A quién le debo plata?",
    variants: ["¿A quién le debo?", "¿Cuánto tengo por pagar?", "Muéstrame lo que debo", "¿Qué pagos tengo pendientes?", "¿Le debo algo a Camila?", "¿Cuánto debo del departamento?", "¿Qué persona aparece por pagar?", "¿Tengo deudas pendientes en el ejemplo?", "¿Ya le pagué a Camila?", "¿Cómo ordeno lo que tengo que pagar?"],
    expectedAnswer: { see: "En el ejemplo le debes $42.000 a Camila por Depto agosto.", meaning: "Es un pendiente ficticio; no confirma que siga abierto ni que haya que transferir ahora.", next: "Abre Cobrar y pagar para revisarlo, crear un recordatorio personal o marcar Ya pagué y contrastarlo con la cartola ficticia." },
    requiredContext: ["Camila: $42.000", "Concepto: Depto agosto", "Alias ficticio: @camila"], limits: ["No pagar ni iniciar transferencia", "No afirmar que el pago quedó conciliado"], nextQuestions: ["¿Por qué le debo a Camila?", "¿Cómo marco que ya pagué?"], knownFeedback: "Felipe pidió separar claramente ME DEBEN y LE DEBO y usar texto cotidiano.", source: "knowledge/cobrar-y-pagar.md", tags: ["le debo", "debo a", "por pagar", "pagar", "camila", "departamento", "depto", "42.000"],
  },
  {
    id: "save-restaurant-benefit-001", status: "approved", domain: "ahorrar", intent: "beneficio-restaurante",
    canonicalQuestion: "¿Qué beneficio tengo para restaurantes?",
    variants: ["¿Tengo descuentos en restaurantes?", "¿Qué beneficio tiene mi tarjeta?", "¿Dónde puedo comer con descuento?", "¿Tengo 20% en restaurantes?", "¿Qué tarjeta tiene el beneficio?", "¿El descuento de restaurantes sigue vigente?", "¿Cuál es el tope del beneficio?", "¿Qué locales participan esta semana?", "¿Me conviene usar la BCI Visa para comer?", "¿Cuánto podría ahorrar en restaurantes?"],
    expectedAnswer: { see: "El ejemplo muestra un beneficio ficticio de 20% en restaurantes asociado a una BCI Visa.", meaning: "Puede ser útil, pero aquí no están verificadas la vigencia, los locales, el día ni el tope; el ahorro no está garantizado.", next: "Abre Ahorrar y revisa las condiciones del ejemplo antes de decidir si te conviene." },
    requiredContext: ["Beneficio demo: 20%", "Tarjeta demo: BCI Visa", "Gasto reciente en restaurantes"], limits: ["No inventar locales, vigencia o tope", "No afirmar compensación comercial ni ahorro garantizado"], nextQuestions: ["¿Qué condiciones faltan confirmar?", "¿Qué tarjeta aparece asociada?"], knownFeedback: "Felipe pidió mostrar tarjeta y condiciones concretas, sin afirmar beneficios no verificados.", source: "knowledge/ahorrar.md", tags: ["beneficio", "descuento", "restaurante", "20%", "tarjeta", "bci", "visa", "ahorrar"],
  },
  {
    id: "split-liguria-001", status: "approved", domain: "cobrar-y-pagar", intent: "repartir-liguria",
    canonicalQuestion: "¿Conviene dividir el gasto de Liguria?",
    variants: ["¿Qué pasó con Liguria?", "¿La cuenta de Liguria era compartida?", "¿Puedo dividir los $41.600?", "¿Por qué YOL1 sugiere repartir Liguria?", "¿Pagamos entre varios en Liguria?", "¿Ese gasto parece de más de una persona?", "¿Cómo reparto la cuenta del restaurante?", "¿A quién le cobro Liguria?", "¿Debo crear un gasto compartido por Liguria?", "Ignoré Liguria, ¿puedo recuperarlo?"],
    expectedAnswer: { see: "La boleta ficticia de Liguria fue de $41.600 y supera el consumo individual habitual del ejemplo.", meaning: "Eso solo sugiere que podría haber sido compartida; YOL1 no sabe quién comió ni si corresponde cobrar.", next: "Si tú confirmas que pagaste por otras personas, abre el reparto, elige participantes y revisa los montos antes de guardar." },
    requiredContext: ["Rest. Liguria: $41.600", "Fuente ficticia: BCI", "Certeza baja"], limits: ["No inferir participantes", "No crear ni enviar cobros automáticamente"], nextQuestions: ["¿Cómo reparto en partes iguales?", "¿Qué pasa si los montos son distintos?"], knownFeedback: "La sugerencia debe explicar que el monto es solo una pista y mantener Ignorar visible.", source: "knowledge/cobrar-y-pagar.md", tags: ["liguria", "dividir", "repartir", "compartido", "41.600", "restaurante", "cuenta"],
  },
] as const;

export const approvedKnowledge = knowledgeCatalog.filter((card) => card.status === "approved");
