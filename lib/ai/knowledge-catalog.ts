export type KnowledgeStatus = "draft" | "approved";
export type KnowledgeDomain = "finanzas" | "cartola" | "cuentas-claras" | "deudas" | "ahorrar";

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

export const YOL1_KNOWLEDGE_VERSION = "lab-kb-2026-08-26.3";

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
    id: "collect-receivables-001", status: "approved", domain: "cuentas-claras", intent: "quien-me-debe",
    canonicalQuestion: "¿Quién me debe plata?",
    variants: ["¿Quién me debe?", "¿Cuánto tengo por cobrar?", "Muéstrame lo que me deben", "¿Qué cobros tengo pendientes?", "¿Nico todavía me debe?", "¿Josefa terminó de pagar?", "¿Cuánto me deben entre todos?", "¿Qué personas aparecen por cobrar?", "¿Tengo algo pendiente del viaje a Pucón?", "¿Puedo recordarles que me paguen?"],
    expectedAnswer: { see: "Veo dos pendientes ficticios registrados en Cuentas Claras: Nico $10.000 y Josefa $18.000.", meaning: "Josefa ya abonó $12.000 de $30.000. El Acompañante sólo resume y explica; Cuentas Claras conserva el acuerdo y confirma los abonos.", next: "Abre Cuentas Claras para revisar el pendiente exacto y decidir qué hacer." },
    requiredContext: ["Nico: $10.000 pendientes", "Josefa: $18.000 pendientes de $30.000", "Total por cobrar: $28.000", "Fuente: Cuentas Claras demo"], limits: ["No afirmar que la deuda es real", "No enviar mensajes ni iniciar cobros desde el Acompañante"], nextQuestions: ["¿Qué me debe Nico?", "¿Cómo funciona Cuentas Claras?"], knownFeedback: "El Acompañante sólo resume; Cuentas Claras administra el ledger y los cobros.", source: "knowledge/cuentas-claras.md", tags: ["me debe", "me deben", "cobrar", "por cobrar", "nico", "josefa", "pucón", "cabaña"],
  },
  {
    id: "collect-payables-001", status: "approved", domain: "cuentas-claras", intent: "a-quien-debo",
    canonicalQuestion: "¿A quién le debo plata?",
    variants: ["¿A quién le debo?", "¿Cuánto tengo por pagar?", "Muéstrame lo que debo", "¿Qué pagos tengo pendientes?", "¿Le debo algo a Camila?", "¿Cuánto debo del departamento?", "¿Qué persona aparece por pagar?", "¿Tengo deudas pendientes en el ejemplo?", "¿Ya le pagué a Camila?", "¿Cómo ordeno lo que tengo que pagar?"],
    expectedAnswer: { see: "En Cuentas Claras aparece que le debes $42.000 a Camila por Depto agosto.", meaning: "Es un pendiente ficticio leído por el Acompañante; no confirma por sí solo una transferencia.", next: "Abre Cuentas Claras para ver el acuerdo y, si corresponde, probar el pago simulado." },
    requiredContext: ["Camila: $42.000", "Concepto: Depto agosto", "Alias ficticio: @camila"], limits: ["No pagar ni iniciar transferencia desde el Acompañante", "No afirmar que el pago quedó conciliado"], nextQuestions: ["¿Por qué le debo a Camila?", "¿Cómo funciona el pago simulado?"], knownFeedback: "Felipe pidió separar claramente Acompañante y Cuentas Claras.", source: "knowledge/cuentas-claras.md", tags: ["le debo", "debo a", "por pagar", "pagar", "camila", "departamento", "depto", "42.000"],
  },
  {
    id: "save-restaurant-benefit-001", status: "approved", domain: "ahorrar", intent: "beneficio-restaurante",
    canonicalQuestion: "¿Qué beneficio tengo para restaurantes?",
    variants: ["¿Tengo descuentos en restaurantes?", "¿Qué beneficio tiene mi tarjeta?", "¿Dónde puedo comer con descuento?", "¿Tengo 20% en restaurantes?", "¿Qué tarjeta tiene el beneficio?", "¿El descuento de restaurantes sigue vigente?", "¿Cuál es el tope del beneficio?", "¿Qué locales participan esta semana?", "¿Me conviene usar la BCI Visa para comer?", "¿Cuánto podría ahorrar en restaurantes?"],
    expectedAnswer: { see: "El ejemplo muestra un beneficio ficticio de 20% en restaurantes asociado a una BCI Visa.", meaning: "Puede ser útil, pero aquí no están verificadas la vigencia, los locales, el día ni el tope; el ahorro no está garantizado.", next: "Abre Ahorrar y revisa las condiciones del ejemplo antes de decidir si te conviene." },
    requiredContext: ["Beneficio demo: 20%", "Tarjeta demo: BCI Visa", "Gasto reciente en restaurantes"], limits: ["No inventar locales, vigencia o tope", "No afirmar compensación comercial ni ahorro garantizado"], nextQuestions: ["¿Qué condiciones faltan confirmar?", "¿Qué tarjeta aparece asociada?"], knownFeedback: "Felipe pidió mostrar tarjeta y condiciones concretas, sin afirmar beneficios no verificados.", source: "knowledge/ahorrar.md", tags: ["beneficio", "descuento", "restaurante", "20%", "tarjeta", "bci", "visa", "ahorrar"],
  },
  {
    id: "split-liguria-001", status: "approved", domain: "cuentas-claras", intent: "repartir-liguria",
    canonicalQuestion: "¿Conviene dividir el gasto de Liguria?",
    variants: ["¿Qué pasó con Liguria?", "¿La cuenta de Liguria era compartida?", "¿Puedo dividir los $41.600?", "¿Por qué YOL1 sugiere repartir Liguria?", "¿Pagamos entre varios en Liguria?", "¿Ese gasto parece de más de una persona?", "¿Cómo reparto la cuenta del restaurante?", "¿A quién le cobro Liguria?", "¿Debo crear un gasto compartido por Liguria?", "Ignoré Liguria, ¿puedo recuperarlo?"],
    expectedAnswer: { see: "La boleta ficticia de Liguria fue de $41.600 y supera el consumo individual habitual del ejemplo.", meaning: "Eso sólo sugiere que podría haber sido compartida; el Acompañante no crea el gasto ni asume participantes.", next: "Si lo confirmas, abre Cuentas Claras con el borrador y revisa personas y montos antes de guardar." },
    requiredContext: ["Rest. Liguria: $41.600", "Fuente ficticia: BCI", "Certeza baja"], limits: ["No inferir participantes", "No crear ni enviar cobros automáticamente"], nextQuestions: ["¿Cómo reparto en partes iguales?", "¿Qué pasa si los montos son distintos?"], knownFeedback: "La sugerencia debe explicar que el monto es sólo una pista y hacer explícito el cambio de producto.", source: "knowledge/cuentas-claras.md", tags: ["liguria", "dividir", "repartir", "compartido", "41.600", "restaurante", "cuenta"],
  },
  {
    id: "formal-payment-not-reflected-001", status: "approved", domain: "deudas", intent: "pago-no-reflejado",
    canonicalQuestion: "¿Por qué un pago todavía aparece en mi deuda?",
    variants: ["Pagué pero todavía aparece", "¿Mi pago de deuda no se aplicó?", "¿Por qué el informe sigue mostrando el saldo?", "Veo un pago en la cartola y la deuda igual aparece", "¿Tengo un error en mi deuda?", "¿Ese pago de $75.000 cuenta?", "¿La cartola está más actualizada que el informe?", "¿Sigo en mora después de pagar?", "¿Qué debo confirmar del pago?", "¿Cuál es mi primer paso con esta deuda?"],
    expectedAnswer: { see: "En el ejemplo, la cartola del 22 de agosto muestra un pago ficticio de $75.000 y el informe demo tiene fecha de corte 19 de agosto.", meaning: "La diferencia de fechas es compatible con un desfase. No demuestra un error, una mora ni que el acreedor haya aplicado el pago.", next: "Abre Tu plan de deuda y busca un saldo actualizado o estado de cuenta antes de decidir qué hacer." },
    requiredContext: ["Cartola demo: 22 de agosto", "Informe demo: 19 de agosto", "Pago candidato: $75.000", "Cobertura parcial"], limits: ["No confirmar el pago", "No inferir mora o error", "No ofrecer refinanciamiento o score"], nextQuestions: ["¿Qué evidencia necesito?", "¿Qué información falta del costo?"], knownFeedback: "Felipe pidió que el Acompañante ayude a manejar deuda sin mezclarla con las cuentas sociales.", source: "knowledge/deudas.md", tags: ["deuda", "pagué", "pago", "no aparece", "informe", "cartola", "75.000", "desfase", "mora", "confirmar"],
  },
] as const;

export const approvedKnowledge = knowledgeCatalog.filter((card) => card.status === "approved");
