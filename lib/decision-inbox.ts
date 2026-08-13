export type DecisionChoice = "a" | "b" | "context";

export type DecisionConflict = {
  id: string;
  topic: string;
  context: string;
  sourceA: { label: string; value: string; date: string; state: string };
  sourceB: { label: string; value: string; date: string; state: string };
};

export type DecisionResolution = {
  conflictId: string;
  choice: DecisionChoice;
  comment: string;
  decidedAt: string;
};

export const DECISION_STORAGE_KEY = "yol1-lab-decisions-v1";

export const DECISION_CONFLICTS: DecisionConflict[] = [
  {
    id: "transfer-rule-copy",
    topic: "Cómo nombrar una transferencia propia",
    context: "Acompañante financiero · Cartola",
    sourceA: { label: "Decisión verbal de Felipe", value: "Clasificación simulada y revisable", date: "13 ago 2026", state: "confirmado" },
    sourceB: { label: "Documento anterior", value: "Transferencia propia excluida", date: "12 ago 2026", state: "propuesto" },
  },
  {
    id: "home-value-copy",
    topic: "Copy principal de Inicio",
    context: "Acompañante financiero · Inicio",
    sourceA: { label: "Decisión verbal de Felipe", value: "Entiende tus finanzas. Simplifica tu vida.", date: "13 ago 2026", state: "confirmado" },
    sourceB: { label: "MVP-SPEC anterior", value: "Encuentra dónde pierdes plata…", date: "12 ago 2026", state: "aprobado previo" },
  },
  {
    id: "benefit-source-order",
    topic: "Qué fuente prioriza un beneficio",
    context: "Acompañante financiero · Ahorrar",
    sourceA: { label: "Regla de pantalla", value: "Mostrar tarjeta y condiciones visibles", date: "13 ago 2026", state: "propuesto" },
    sourceB: { label: "Contexto de estrategia", value: "Explicar evidencia y certeza antes de recomendar", date: "12 ago 2026", state: "confirmado" },
  },
];

export function readDecisionResolutions(): Record<string, DecisionResolution> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DECISION_STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveDecisionResolution(resolution: DecisionResolution) {
  if (typeof window === "undefined") return;
  const current = readDecisionResolutions();
  window.localStorage.setItem(DECISION_STORAGE_KEY, JSON.stringify({ ...current, [resolution.conflictId]: resolution }));
}
