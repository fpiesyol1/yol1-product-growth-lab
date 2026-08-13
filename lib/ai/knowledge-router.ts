import { approvedKnowledge, type KnowledgeCard } from "./knowledge-catalog";

export type KnowledgeRoute = {
  kind: "approved" | "rule" | "fallback";
  text: string;
  knowledgeId?: string;
  confidence: "high" | "medium" | "none";
  suggestions: string[];
};

const FALLBACK_SUGGESTIONS = ["¿Qué pasó con Disney+?", "¿Quién me debe?", "¿Qué beneficio tengo?"];
const LAB_MONTH_DATA = { income: 2_450_000, expenses: 1_620_000 } as const;
const STOP_WORDS = new Set(["a", "al", "algo", "como", "con", "cual", "de", "del", "el", "en", "es", "esta", "este", "la", "las", "lo", "los", "me", "mi", "para", "por", "que", "se", "tengo", "un", "una", "y"]);

export function normalizeKnowledgeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9%.$]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(value: string) {
  return normalizeKnowledgeText(value).split(" ").filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function phraseScore(question: string, phrase: string) {
  const normalizedQuestion = normalizeKnowledgeText(question);
  const normalizedPhrase = normalizeKnowledgeText(phrase);
  if (normalizedQuestion === normalizedPhrase) return 100;
  if (normalizedQuestion.includes(normalizedPhrase)) return 72;
  const questionTokens = new Set(tokens(normalizedQuestion));
  const phraseTokens = tokens(normalizedPhrase);
  if (!phraseTokens.length) return 0;
  return Math.round((phraseTokens.filter((token) => questionTokens.has(token)).length / phraseTokens.length) * 60);
}

function intentBias(question: string, card: KnowledgeCard) {
  const normalized = normalizeKnowledgeText(question);
  if (card.intent === "quien-me-debe" && /\b(me debe|me deben|por cobrar|cobrar)\b/.test(normalized)) return 32;
  if (card.intent === "a-quien-debo" && /\b(le debo|debo a|por pagar|pagar|camila)\b/.test(normalized)) return 32;
  if (card.intent === "cargo-disney-posible-duplicado" && /\b(disney|duplicado|cobro doble)\b/.test(normalized)) return 35;
  if (card.intent === "repartir-liguria" && /\b(liguria|dividir|repartir|compartid)\b/.test(normalized)) return 35;
  if (card.intent === "beneficio-restaurante" && /\b(beneficio|descuento|restaurante|bci visa)\b/.test(normalized)) return 30;
  if (card.intent === "resultado-del-mes" && /\b(resultado|mes|agosto|entro|gaste|saldo|transferencias)\b/.test(normalized)) return 28;
  return 0;
}

export function calculateLabMonthResult() {
  return { ...LAB_MONTH_DATA, result: LAB_MONTH_DATA.income - LAB_MONTH_DATA.expenses };
}

function formatAnswer(card: KnowledgeCard) {
  const expected = card.intent === "resultado-del-mes"
    ? { ...card.expectedAnswer, see: `En agosto del ejemplo te entraron $2.450.000 y gastaste $1.620.000; la diferencia calculada es +$${calculateLabMonthResult().result.toLocaleString("es-CL")}.` }
    : card.expectedAnswer;
  return `Qué veo: ${expected.see}\n\nQué significa: ${expected.meaning}\n\nQué puedes hacer ahora: ${expected.next}`;
}

function safeRule(question: string): KnowledgeRoute | null {
  const normalized = normalizeKnowledgeText(question);
  if (/\b(clave|contrasena|password|numero de tarjeta|rut|pin bancario|credencial)\b/.test(normalized)) {
    return { kind: "rule", confidence: "high", text: "No compartas claves, RUT, números de tarjeta ni credenciales. Este Lab solo usa datos ficticios y no puede revisar una cuenta real. Puedes probar con: “¿Qué pasó con Disney+?”", suggestions: FALLBACK_SUGGESTIONS };
  }
  if (/\b(paga|pagale|transfiere|cobra ahora|envia el cobro|reclama al banco)\b/.test(normalized)) {
    return { kind: "rule", confidence: "high", text: "YOL1 no paga, transfiere, cobra, envía mensajes ni reclama por ti. Puedo ayudarte a revisar la evidencia y preparar una acción ficticia que tú decides si continuar.", suggestions: ["¿A quién le debo?", "¿Quién me debe?", "¿Qué evidencia comparo en Disney+?"] };
  }
  return null;
}

export function routeKnowledge(question: string): KnowledgeRoute {
  const rule = safeRule(question);
  if (rule) return rule;
  const ranked = approvedKnowledge.map((card) => {
    const bestPhrase = Math.max(...[card.canonicalQuestion, ...card.variants, ...card.tags].map((phrase) => phraseScore(question, phrase)));
    return { card, score: bestPhrase + intentBias(question, card) };
  }).sort((left, right) => right.score - left.score);
  const best = ranked[0];
  const second = ranked[1];
  if (best && best.score >= 62 && (!second || best.score - second.score >= 8)) {
    return { kind: "approved", knowledgeId: best.card.id, confidence: best.score >= 88 ? "high" : "medium", text: formatAnswer(best.card), suggestions: [...best.card.nextQuestions] };
  }
  return { kind: "fallback", confidence: "none", text: `No alcancé a ubicar esa pregunta en el conocimiento aprobado del Lab. No voy a inventar una respuesta. Prueba con: ${FALLBACK_SUGGESTIONS.map((suggestion) => `“${suggestion}”`).join(", ")}.`, suggestions: FALLBACK_SUGGESTIONS };
}
