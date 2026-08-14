import type { OnboardingStage } from "./onboarding-state-machine";

export const ONBOARDING_DEMO_STORAGE_KEY = "yol1-onboarding-demo-v0.3";
export const ONBOARDING_DEMO_SCHEMA_VERSION = "onboarding-demo-0.3";

type StoredCapability = "financial_data_connect" | "receive_value";
type StoredChannel = "teléfono" | "email";
type ResumeStage = Extract<OnboardingStage, "preregistered_demo" | "consent_preview">;

export type OnboardingDemoSnapshot = {
  schema_version: typeof ONBOARDING_DEMO_SCHEMA_VERSION;
  selected_capability: StoredCapability;
  preregistration_state: "created_demo";
  channel_type: StoredChannel;
  resume_stage: ResumeStage;
  consent_preview_seen: boolean;
};

export function buildOnboardingDemoSnapshot(input: {
  capability: StoredCapability;
  channel: StoredChannel;
  stage: ResumeStage;
}): OnboardingDemoSnapshot {
  const resumeStage = input.capability === "financial_data_connect" ? input.stage : "preregistered_demo";
  return {
    schema_version: ONBOARDING_DEMO_SCHEMA_VERSION,
    selected_capability: input.capability,
    preregistration_state: "created_demo",
    channel_type: input.channel,
    resume_stage: resumeStage,
    consent_preview_seen: resumeStage === "consent_preview",
  };
}

export function parseOnboardingDemoSnapshot(raw: string | null): OnboardingDemoSnapshot | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    if (value.schema_version !== ONBOARDING_DEMO_SCHEMA_VERSION) return null;
    if (value.preregistration_state !== "created_demo") return null;
    if (value.selected_capability !== "financial_data_connect" && value.selected_capability !== "receive_value") return null;
    if (value.channel_type !== "teléfono" && value.channel_type !== "email") return null;
    if (value.resume_stage !== "preregistered_demo" && value.resume_stage !== "consent_preview") return null;

    return buildOnboardingDemoSnapshot({
      capability: value.selected_capability,
      channel: value.channel_type,
      stage: value.resume_stage,
    });
  } catch {
    return null;
  }
}
