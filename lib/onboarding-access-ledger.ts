import type { OnboardingDemoSnapshot } from "./onboarding-demo-storage";

export type AccessLedgerAction = "open_onboarding" | "open_bank" | "clear_demo" | null;

export type AccessLedgerRow = {
  key: "access" | "financial_data" | "receive_value" | "capabilities" | "demo_data";
  label: string;
  status: string;
  mark: "✓" | "→" | "○";
  action: AccessLedgerAction;
};

export function buildAccessLedger(snapshot: OnboardingDemoSnapshot | null): AccessLedgerRow[] {
  const hasPreregistration = snapshot?.preregistration_state === "created_demo";
  const financialDataPrepared = snapshot?.selected_capability === "financial_data_connect";
  const consentPreviewSeen = financialDataPrepared && snapshot.consent_preview_seen;
  const receiveValuePrepared = snapshot?.selected_capability === "receive_value";

  return [
    {
      key: "access",
      label: "Acceso",
      status: hasPreregistration
        ? `Pre-registro demo · ${snapshot.channel_type}`
        : "Sin pre-registro",
      mark: hasPreregistration ? "✓" : "○",
      action: "open_onboarding",
    },
    {
      key: "financial_data",
      label: "Datos financieros",
      status: consentPreviewSeen
        ? "Vista de consentimiento revisada · sin permiso"
        : financialDataPrepared
          ? "Preparación guardada · sin permiso"
          : "Sin permiso",
      mark: financialDataPrepared ? "→" : "○",
      action: "open_onboarding",
    },
    {
      key: "receive_value",
      label: "Solicitud de recibir dinero",
      status: receiveValuePrepared
        ? "Intención guardada · requisitos por validar"
        : "No iniciada",
      mark: receiveValuePrepared ? "→" : "○",
      action: receiveValuePrepared ? "open_bank" : "open_onboarding",
    },
    {
      key: "capabilities",
      label: "Capacidades disponibles",
      status: "Sólo exploración · ninguna capacidad real",
      mark: "○",
      action: null,
    },
    {
      key: "demo_data",
      label: "Datos de la demo",
      status: hasPreregistration
        ? "Guardados localmente · sin contacto ni OTP"
        : "Vacíos",
      mark: hasPreregistration ? "→" : "○",
      action: hasPreregistration ? "clear_demo" : null,
    },
  ];
}
