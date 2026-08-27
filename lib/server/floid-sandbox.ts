/**
 * Fixture demostrativa de Floid.
 *
 * Este Lab no acepta credenciales, no construye tokens y no realiza llamadas de
 * red. El contrato se conserva sólo para poder explicar qué datos podrían
 * normalizarse en una integración futura, marcada siempre como propuesta.
 */
export type FloidProbeStep = {
  id: string;
  label: string;
  status: "pass" | "blocked" | "fail" | "info";
  detail: string;
};

export type FloidSandboxProbe = {
  verdict: "module_blocked";
  title: string;
  summary: string;
  checkedAt: string;
  steps: FloidProbeStep[];
  banking: {
    accounts: number;
    cards: number;
    creditLines: number;
    movements: number;
    balancesClp: number;
    usedCreditClp: number;
    availableCreditClp: number;
    movementInflowsClp: number;
    movementOutflowsClp: number;
  };
};

export function getFloidSimulationFixture(): FloidSandboxProbe {
  return {
    verdict: "module_blocked",
    title: "Simulación bancaria lista",
    summary: "Datos completamente ficticios. No se conectó Floid ni ningún banco.",
    checkedAt: new Date().toISOString(),
    steps: [
      { id: "network", label: "Conexión externa", status: "blocked", detail: "Bloqueada por diseño en este entregable." },
      { id: "products", label: "Productos bancarios", status: "info", detail: "Fixture local con una cuenta, una tarjeta y una línea de crédito." },
      { id: "movements", label: "Cartola", status: "info", detail: "Doce movimientos sintéticos para probar explicación y clasificación." },
      { id: "formal_debt", label: "Deuda formal", status: "blocked", detail: "No disponible hasta validar cobertura, consentimiento y rol legal." },
    ],
    banking: {
      accounts: 1,
      cards: 1,
      creditLines: 1,
      movements: 12,
      balancesClp: 830000,
      usedCreditClp: 420000,
      availableCreditClp: 580000,
      movementInflowsClp: 2450000,
      movementOutflowsClp: 1620000,
    },
  };
}
