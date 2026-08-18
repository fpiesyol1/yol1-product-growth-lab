export type PivotOnboardingStage =
  | "welcome"
  | "channel_select"
  | "otp_entry"
  | "profile_basics"
  | "workspace_ready"
  | "kyc_intro"
  | "document_check"
  | "biometric_check"
  | "kyc_review";

export type PivotOnboardingTransition =
  | "COMPLETE_VALUE_CAROUSEL"
  | "BACK_TO_WELCOME"
  | "REQUEST_OTP_DEMO"
  | "CHANGE_CHANNEL"
  | "VERIFY_OTP_DEMO"
  | "SUBMIT_PROFILE_DEMO"
  | "BACK_TO_OTP"
  | "CONTINUE_FULL_KYC"
  | "BACK_TO_WORKSPACE"
  | "START_DOCUMENT_DEMO"
  | "CONFIRM_DOCUMENT_DEMO"
  | "CONFIRM_BIOMETRIC_DEMO"
  | "RESET_DEMO";

export const PIVOT_ONBOARDING_STAGE_META: Record<PivotOnboardingStage, { label: string; progress: number }> = {
  welcome: { label: "Conocer YOL1", progress: 1 / 8 },
  channel_select: { label: "Crear acceso", progress: 2 / 8 },
  otp_entry: { label: "Confirmar canal", progress: 3 / 8 },
  profile_basics: { label: "Completar perfil", progress: 4 / 8 },
  workspace_ready: { label: "Entrar a YOL1", progress: 5 / 8 },
  kyc_intro: { label: "Entender la verificación", progress: 6 / 8 },
  document_check: { label: "Revisar documento", progress: 7 / 8 },
  biometric_check: { label: "Prueba de vida", progress: 7.5 / 8 },
  kyc_review: { label: "Revisión", progress: 1 },
};

const transitions: Record<PivotOnboardingStage, Partial<Record<PivotOnboardingTransition, PivotOnboardingStage>>> = {
  welcome: { COMPLETE_VALUE_CAROUSEL: "channel_select", RESET_DEMO: "welcome" },
  channel_select: { BACK_TO_WELCOME: "welcome", REQUEST_OTP_DEMO: "otp_entry", RESET_DEMO: "welcome" },
  otp_entry: { CHANGE_CHANNEL: "channel_select", VERIFY_OTP_DEMO: "profile_basics", RESET_DEMO: "welcome" },
  profile_basics: { BACK_TO_OTP: "otp_entry", SUBMIT_PROFILE_DEMO: "workspace_ready", RESET_DEMO: "welcome" },
  workspace_ready: { CONTINUE_FULL_KYC: "kyc_intro", RESET_DEMO: "welcome" },
  kyc_intro: { BACK_TO_WORKSPACE: "workspace_ready", START_DOCUMENT_DEMO: "document_check", RESET_DEMO: "welcome" },
  document_check: { BACK_TO_WORKSPACE: "workspace_ready", CONFIRM_DOCUMENT_DEMO: "biometric_check", RESET_DEMO: "welcome" },
  biometric_check: { BACK_TO_WORKSPACE: "workspace_ready", CONFIRM_BIOMETRIC_DEMO: "kyc_review", RESET_DEMO: "welcome" },
  kyc_review: { BACK_TO_WORKSPACE: "workspace_ready", RESET_DEMO: "welcome" },
};

export function transitionPivotOnboarding(stage: PivotOnboardingStage, event: PivotOnboardingTransition): PivotOnboardingStage {
  return transitions[stage][event] ?? stage;
}
