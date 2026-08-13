import { approvedKnowledge, YOL1_KNOWLEDGE_VERSION } from "./knowledge-catalog";

export { YOL1_KNOWLEDGE_VERSION } from "./knowledge-catalog";

export function buildKnowledgeContext() {
  return approvedKnowledge.map((card) => [
    `## ${card.canonicalQuestion} (${card.id})`,
    `- Qué veo: ${card.expectedAnswer.see}`,
    `- Qué significa: ${card.expectedAnswer.meaning}`,
    `- Qué puede hacer ahora: ${card.expectedAnswer.next}`,
    `- Límites: ${card.limits.join("; ")}`,
    `- Fuente editorial: ${card.source}`,
  ].join("\n")).join("\n\n");
}

export function knowledgeSummary() {
  return { version: YOL1_KNOWLEDGE_VERSION, approved: approvedKnowledge.length };
}
