import { createHash, timingSafeEqual } from "node:crypto";

function reviewAccessToken() {
  const configured = process.env.YOL1_REVIEW_TOKEN?.trim();
  if (configured) return configured;
  return process.env.NODE_ENV === "development" ? "Yol1" : "";
}

export function isReviewConfigured() {
  return Boolean(reviewAccessToken());
}

export function isReviewAuthorized(request: Request) {
  const expected = reviewAccessToken();
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !provided) return false;
  const expectedHash = createHash("sha256").update(expected).digest();
  const providedHash = createHash("sha256").update(provided).digest();
  return timingSafeEqual(expectedHash, providedHash);
}
