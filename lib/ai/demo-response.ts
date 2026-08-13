import { routeKnowledge } from "./knowledge-router";

export function createDemoResponse(question: string) {
  return routeKnowledge(question).text;
}
