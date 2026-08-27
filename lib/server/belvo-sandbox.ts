export type ProbeStatus = "pass" | "blocked" | "info";

export type ProbeStep = {
  id: string;
  label: string;
  status: ProbeStatus;
  detail: string;
};

export type FiscalInstitution = {
  name: string;
  displayName: string;
  type: string;
  countries: string[];
};

export type TaxSummary = {
  records: number;
  sections: string[];
  entityType: string | null;
  activityCount: number;
};

export type InvoiceSummary = {
  records: number;
  totalAmount: number;
  currencies: string[];
  inflow: number;
  outflow: number;
  samples: Array<{
    issueDate: string | null;
    totalAmount: number | null;
    currency: string | null;
    direction: string | null;
    status: string | null;
  }>;
};

export type SandboxProbeResult = {
  verdict: "fixture_ready";
  title: string;
  summary: string;
  checkedAt: string;
  institutions: FiscalInstitution[];
  steps: ProbeStep[];
  taxStatus: TaxSummary;
  invoices: InvoiceSummary;
};

/**
 * A deterministic, non-identifying fixture for product exploration.
 *
 * Security invariant: this module has no provider adapter, environment lookup,
 * credential input or outbound request. A future Belvo adapter must live behind
 * a separate reviewed boundary; it must never be selected by this Lab route.
 */
export function getLocalBelvoFixture(): SandboxProbeResult {
  return {
    verdict: "fixture_ready",
    title: "Fixture tributaria local cargada",
    summary:
      "Esta respuesta vive dentro de YOL1. Sirve para explorar el contrato y la experiencia, no para comprobar cobertura de Belvo.",
    checkedAt: "2026-08-26T12:00:00.000Z",
    institutions: [
      {
        name: "fiscal_cl_fixture",
        displayName: "Institución fiscal ficticia",
        type: "fiscal",
        countries: ["CL"],
      },
    ],
    steps: [
      {
        id: "scope",
        label: "Ejecución local",
        status: "pass",
        detail: "La ruta responde desde una fixture determinista incluida en el repositorio.",
      },
      {
        id: "provider",
        label: "Proveedor desconectado",
        status: "blocked",
        detail: "Este Lab no autentica, no crea Links y no consulta servicios de Belvo.",
      },
      {
        id: "contract",
        label: "Contrato de datos",
        status: "pass",
        detail: "La fixture modela sólo resúmenes sintéticos y no incluye identidad ni payloads tributarios crudos.",
      },
      {
        id: "coverage",
        label: "Cobertura real",
        status: "info",
        detail: "Pendiente de una validación futura, aislada y expresamente autorizada fuera de este prototipo.",
      },
    ],
    taxStatus: {
      records: 1,
      sections: ["entity_details", "economic_activities", "regimes"],
      entityType: "RUT_FICTICIO",
      activityCount: 2,
    },
    invoices: {
      records: 4,
      totalAmount: 1_284_900,
      currencies: ["CLP"],
      inflow: 3,
      outflow: 1,
      samples: [
        {
          issueDate: "2026-07-04",
          totalAmount: 428_300,
          currency: "CLP",
          direction: "INFLOW",
          status: "VALID",
        },
        {
          issueDate: "2026-06-18",
          totalAmount: 316_600,
          currency: "CLP",
          direction: "OUTFLOW",
          status: "VALID",
        },
      ],
    },
  };
}
