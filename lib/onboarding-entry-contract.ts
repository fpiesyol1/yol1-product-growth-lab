export const ONBOARDING_ENTRY_VERSION = "onboarding-entry-1" as const;

export type OnboardingEntryV1 = {
  schema_version: typeof ONBOARDING_ENTRY_VERSION;
  entry_context: "direct" | "companion" | "clear_accounts";
  requested_job: "explore_yol1" | "save_clear_accounts_draft";
  return_to: "companion_home" | "clear_accounts_draft";
  draft_id?: `draft_${string}`;
};

export const DEFAULT_ONBOARDING_ENTRY: OnboardingEntryV1 = {
  schema_version: ONBOARDING_ENTRY_VERSION,
  entry_context: "direct",
  requested_job: "explore_yol1",
  return_to: "companion_home",
};

const DRAFT_ID = /^draft_[a-f0-9]{32}$/;

export function parseOnboardingEntry(search: string | URLSearchParams): OnboardingEntryV1 {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const version = params.get("entry_v");
  const context = params.get("entry_context");
  const job = params.get("requested_job");
  const returnTo = params.get("return_to");
  const draftId = params.get("draft_id");

  if (version !== "1") return DEFAULT_ONBOARDING_ENTRY;
  if (context === "companion" && job === "explore_yol1" && returnTo === "companion_home" && !draftId) {
    return { ...DEFAULT_ONBOARDING_ENTRY, entry_context: "companion" };
  }
  if (context === "clear_accounts" && job === "save_clear_accounts_draft" && returnTo === "clear_accounts_draft" && draftId && DRAFT_ID.test(draftId)) {
    return {
      schema_version: ONBOARDING_ENTRY_VERSION,
      entry_context: context,
      requested_job: job,
      return_to: returnTo,
      draft_id: draftId as `draft_${string}`,
    };
  }
  return DEFAULT_ONBOARDING_ENTRY;
}

export function buildOnboardingHref(entry: OnboardingEntryV1) {
  const params = new URLSearchParams({
    product: "kyc",
    entry_v: "1",
    entry_context: entry.entry_context,
    requested_job: entry.requested_job,
    return_to: entry.return_to,
  });
  if (entry.draft_id) params.set("draft_id", entry.draft_id);
  return `/?${params.toString()}`;
}

export function resolveOnboardingReturn(entry: OnboardingEntryV1) {
  if (entry.return_to === "clear_accounts_draft" && entry.draft_id) {
    return `/?product=clear_accounts&intent=resume_draft&draftId=${encodeURIComponent(entry.draft_id)}`;
  }
  return "/?product=companion&tab=inicio";
}
