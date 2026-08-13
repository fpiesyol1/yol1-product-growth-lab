export const YOL1_KNOWLEDGE_VERSION = "lab-example-2026-08-13";

const knowledge = [
  ["Naturaleza del Lab", [
    "Todo el producto usa datos ficticios y es un prototipo exploratorio.",
    "No conecta bancos, no carga cartolas reales, no mueve dinero y no envía mensajes.",
    "YOL1 explica señales y recomienda; la persona revisa evidencia y decide.",
  ]],
  ["Resumen financiero ficticio de agosto", [
    "Ingresos clasificados: $2.450.000 CLP.",
    "Egresos clasificados: $1.620.000 CLP.",
    "Resultado del mes: +$830.000 CLP; no es el saldo de una cuenta bancaria.",
    "Las transferencias propias se excluyen mediante una clasificación simulada y revisable.",
  ]],
  ["Cargo Disney+", [
    "Hay dos cargos ficticios de Disney+ por $11.990 CLP, registrados con un minuto de diferencia en BCI y MACH.",
    "La coincidencia es una señal para revisar, no prueba un cobro duplicado.",
    "El siguiente paso seguro es comparar comercio, código, hora, fuente, suscripción y forma de pago.",
  ]],
  ["Pendientes entre personas", [
    "Por cobrar: Josefa $210.000 CLP por Viaje a Pucón y María $18.000 CLP por Almuerzo viernes.",
    "Por pagar: Camila $42.000 CLP por Depto agosto.",
    "Los aliases @josefa, @maria y @camila son ficticios.",
    "Preparar o previsualizar un mensaje no cobra, paga ni contacta a nadie.",
  ]],
  ["Ahorro y beneficios", [
    "El rango total mostrado es $0–$28.000 CLP potenciales; no es ahorro real ni garantizado.",
    "Existe un beneficio ficticio de 20% en restaurantes asociado a una BCI Visa del ejemplo.",
    "Antes de recomendar usar un beneficio se deben revisar vigencia, locales, día, tope y condiciones.",
    "YOL1 no recibe compensación en esta simulación; cualquier relación comercial futura se declararía en cada recomendación.",
  ]],
  ["Gasto posiblemente compartido", [
    "La boleta ficticia de Rest. Liguria fue de $41.600 CLP.",
    "Su tamaño solo sugiere que podría ser compartida; la persona debe confirmarlo antes de dividir.",
  ]],
] as const;

export function buildKnowledgeContext() {
  return knowledge.map(([title, facts]) => `## ${title}\n${facts.map((fact) => `- ${fact}`).join("\n")}`).join("\n\n");
}
