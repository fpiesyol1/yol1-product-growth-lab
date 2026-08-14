export type NormalizedKycState =
  | "not_required"
  | "requirements_pending"
  | "in_progress"
  | "review"
  | "failed_recoverable"
  | "declined"
  | "verified";

const canonicalKycStates = new Set<NormalizedKycState>([
  "not_required",
  "requirements_pending",
  "in_progress",
  "review",
  "failed_recoverable",
  "declined",
  "verified",
]);

export function normalizeKycState(rawState: unknown): NormalizedKycState {
  return typeof rawState === "string" && canonicalKycStates.has(rawState as NormalizedKycState)
    ? rawState as NormalizedKycState
    : "review";
}

export type SafeOnboardingEventName =
  | "onboarding_started"
  | "material_action_selected"
  | "requirements_explained"
  | "access_method_selected"
  | "otp_requested_demo"
  | "otp_submitted_demo"
  | "otp_verified_demo"
  | "otp_recovery_started"
  | "account_recovery_started"
  | "preregistration_created_demo"
  | "preregistration_demo_deleted"
  | "consent_preview_opened"
  | "kyc_handoff_opened"
  | "kyc_requirements_viewed"
  | "support_route_started"
  | "onboarding_e2_answered";

export const SAFE_ONBOARDING_EVENT_NAMES: readonly SafeOnboardingEventName[] = [
  "onboarding_started",
  "material_action_selected",
  "requirements_explained",
  "access_method_selected",
  "otp_requested_demo",
  "otp_submitted_demo",
  "otp_verified_demo",
  "otp_recovery_started",
  "account_recovery_started",
  "preregistration_created_demo",
  "preregistration_demo_deleted",
  "consent_preview_opened",
  "kyc_handoff_opened",
  "kyc_requirements_viewed",
  "support_route_started",
  "onboarding_e2_answered",
] as const;

type SafeEventValue = string | number | boolean;
type SafeEvent = { event: SafeOnboardingEventName } & Record<string, SafeEventValue>;

const commonFields = ["anonymous_id", "session_id", "screen_key", "schema_version", "source"] as const;
const fieldsByEvent: Record<SafeOnboardingEventName, readonly string[]> = {
  onboarding_started: ["entry_point"],
  material_action_selected: ["capability_key", "availability_state"],
  requirements_explained: ["capability_key", "requirements_version"],
  access_method_selected: ["channel"],
  otp_requested_demo: ["channel", "purpose", "attempt_bucket"],
  otp_submitted_demo: ["channel", "attempt_bucket"],
  otp_verified_demo: ["channel", "attempt_bucket"],
  otp_recovery_started: ["channel", "reason_code", "attempt_bucket"],
  account_recovery_started: ["channel", "reason_code", "surface"],
  preregistration_created_demo: ["capability_key", "identity_state"],
  preregistration_demo_deleted: ["capability_key", "resume_stage"],
  consent_preview_opened: ["capability_key", "policy_version"],
  kyc_handoff_opened: ["capability_key", "availability_state", "policy_version"],
  kyc_requirements_viewed: ["capability_key", "normalized_state", "reason_code"],
  support_route_started: ["reason_code", "surface"],
  onboarding_e2_answered: ["answer_key", "result", "misconception_key"],
};

const forbiddenFields = new Set([
  "contact",
  "email",
  "phone",
  "telefono",
  "otp",
  "rut",
  "serial",
  "document",
  "biometrics",
  "address",
  "raw_provider_response",
]);

export function buildSafeOnboardingEvent(event: string, input: Record<string, unknown>): SafeEvent | null {
  if (!(event in fieldsByEvent)) return null;
  const eventName = event as SafeOnboardingEventName;
  const allowedFields = new Set<string>([...commonFields, ...fieldsByEvent[eventName]]);
  const payload: SafeEvent = { event: eventName };

  for (const [key, value] of Object.entries(input)) {
    if (!allowedFields.has(key) || forbiddenFields.has(key)) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") payload[key] = value;
  }

  return payload;
}
