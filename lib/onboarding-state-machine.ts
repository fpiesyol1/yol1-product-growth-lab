export type OnboardingStage =
  | "welcome"
  | "capability_chooser"
  | "requirements_explained"
  | "channel_select"
  | "otp_entry"
  | "preregistered_demo"
  | "consent_preview";

export type OnboardingTransition =
  | "VIEW_ACTIVATIONS"
  | "BACK_TO_WELCOME"
  | "SELECT_CAPABILITY"
  | "BACK_TO_CAPABILITY"
  | "START_PREREGISTRATION"
  | "BACK_TO_REQUIREMENTS"
  | "REQUEST_OTP_DEMO"
  | "CHANGE_CHANNEL"
  | "VERIFY_OTP_DEMO"
  | "OPEN_CONSENT_PREVIEW"
  | "BACK_TO_PREREGISTERED"
  | "RESET_DEMO";

export const ONBOARDING_STAGE_META: Record<OnboardingStage, { label: string; progress: number }> = {
  welcome: { label: "Explorar valor", progress: 1 / 7 },
  capability_chooser: { label: "Elegir una acción", progress: 2 / 7 },
  requirements_explained: { label: "Entender requisitos", progress: 3 / 7 },
  channel_select: { label: "Elegir canal", progress: 4 / 7 },
  otp_entry: { label: "Confirmar canal", progress: 5 / 7 },
  preregistered_demo: { label: "Revisar el resultado", progress: 6 / 7 },
  consent_preview: { label: "Revisar el consentimiento", progress: 1 },
};

const transitions: Record<OnboardingStage, Partial<Record<OnboardingTransition, OnboardingStage>>> = {
  welcome: { VIEW_ACTIVATIONS: "capability_chooser", RESET_DEMO: "welcome" },
  capability_chooser: { BACK_TO_WELCOME: "welcome", SELECT_CAPABILITY: "requirements_explained", RESET_DEMO: "welcome" },
  requirements_explained: { BACK_TO_CAPABILITY: "capability_chooser", START_PREREGISTRATION: "channel_select", RESET_DEMO: "welcome" },
  channel_select: { BACK_TO_REQUIREMENTS: "requirements_explained", REQUEST_OTP_DEMO: "otp_entry", RESET_DEMO: "welcome" },
  otp_entry: { CHANGE_CHANNEL: "channel_select", VERIFY_OTP_DEMO: "preregistered_demo", RESET_DEMO: "welcome" },
  preregistered_demo: { OPEN_CONSENT_PREVIEW: "consent_preview", RESET_DEMO: "welcome" },
  consent_preview: { BACK_TO_PREREGISTERED: "preregistered_demo", RESET_DEMO: "welcome" },
};

export function transitionOnboarding(stage: OnboardingStage, event: OnboardingTransition): OnboardingStage {
  return transitions[stage][event] ?? stage;
}
