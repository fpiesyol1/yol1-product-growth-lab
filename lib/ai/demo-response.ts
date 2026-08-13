export function createDemoResponse(question: string) {
  const normalized = question.toLowerCase();
  if (normalized.includes("mes") || normalized.includes("cambió")) return "Agosto deja un resultado de +$830.000: $2.450.000 de ingresos menos $1.620.000 de egresos clasificados. No es un saldo bancario y las transferencias propias están excluidas por una regla simulada que puedes revisar.";
  if (normalized.includes("debo") || normalized.includes("pagar")) return "En el ejemplo le debes $42.000 a Camila por Depto agosto. Puedes abrir Cobrar y pagar para revisar el detalle y preparar una acción ficticia; YOL1 no paga ni contacta a nadie.";
  if (normalized.includes("cobrar") || normalized.includes("deben")) return "Te deben $228.000 en el ejemplo: Josefa $210.000 y María $18.000. Puedes ordenarlo por persona o grupo y preparar un mensaje que no se envía.";
  if (normalized.includes("restaurante") || normalized.includes("beneficio") || normalized.includes("descuento")) return "Vimos gasto reciente en restaurantes y un beneficio ficticio de 20% asociado a la BCI Visa del ejemplo. Antes de considerarlo habría que revisar vigencia, locales, día y tope.";
  if (normalized.includes("ahorrar") || normalized.includes("oportunidad")) return "El ejemplo muestra un rango potencial de $0–$28.000 entre cargos por revisar, un beneficio de tarjeta y una alternativa de plan. Es una estimación, no ahorro garantizado.";
  if (normalized.includes("revisar") || normalized.includes("cargo") || normalized.includes("disney")) return "Hay dos cargos Disney+ de $11.990 con un minuto de diferencia en dos fuentes ficticias. Es una señal, no una conclusión: compara código, hora, fuente, suscripción y forma de pago.";
  if (normalized.includes("liguria") || normalized.includes("dividir")) return "La boleta ficticia de Liguria fue $41.600, mayor que el consumo individual habitual del ejemplo. Puedes preparar un reparto si confirmas que fue compartida; no se cobrará a nadie.";
  return "Puedo ayudarte a entender los datos ficticios del mes, ordenar pendientes, revisar Disney+, explorar un beneficio o estimar oportunidades. No tengo acceso a tus cuentas ni a información financiera real.";
}
