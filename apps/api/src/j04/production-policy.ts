/**
 * J04/J08: pure, fail-closed policy for a proposed fabrication release.
 *
 * This module is NOT an API endpoint, a payment verifier, an authorization
 * guard, or a persisted database rule. Callers must load all evidence from
 * trusted server-side records in a transaction and recheck it at release time.
 */

export const PANOKIT_WEB_ORIGIN = "PANOKIT_WEB" as const;

export function assertNoClientOrigin(
  checkoutPayload: Readonly<Record<string, unknown>>,
): void {
  if (
    Object.prototype.hasOwnProperty.call(checkoutPayload, "origin") ||
    Object.prototype.hasOwnProperty.call(checkoutPayload, "origin_channel") ||
    Object.prototype.hasOwnProperty.call(checkoutPayload, "source_channel")
  ) {
    throw new Error("CLIENT_ORIGIN_FORBIDDEN");
  }
}

export type ProductionReleaseEvidence = Readonly<{
  formatHomologated?: boolean | null;
  technicalApproved?: boolean | null;
  latestBatRevision?: string | null;
  customerAcceptedBatRevision?: string | null;
  customerConsentVerified?: boolean | null;
  commercialClearance?: boolean | null;
  suspensionCleared?: boolean | null;
}>;

export type ProductionReleaseBlocker =
  | "FORMAT_NOT_HOMOLOGATED"
  | "TECHNICAL_REVIEW_PENDING"
  | "LATEST_BAT_NOT_ACCEPTED"
  | "CUSTOMER_CONSENT_NOT_VERIFIED"
  | "COMMERCIAL_CLEARANCE_MISSING"
  | "PRODUCTION_SUSPENDED";

export type ProductionReleaseDecision = Readonly<{
  authorized: boolean;
  blockers: readonly ProductionReleaseBlocker[];
}>;

export function evaluateProductionRelease(
  evidence: ProductionReleaseEvidence,
): ProductionReleaseDecision {
  const blockers: ProductionReleaseBlocker[] = [];

  if (evidence.formatHomologated !== true) {
    blockers.push("FORMAT_NOT_HOMOLOGATED");
  }
  if (evidence.technicalApproved !== true) {
    blockers.push("TECHNICAL_REVIEW_PENDING");
  }
  if (
    typeof evidence.latestBatRevision !== "string" ||
    evidence.latestBatRevision.length === 0 ||
    evidence.customerAcceptedBatRevision !== evidence.latestBatRevision
  ) {
    blockers.push("LATEST_BAT_NOT_ACCEPTED");
  }
  if (evidence.customerConsentVerified !== true) {
    blockers.push("CUSTOMER_CONSENT_NOT_VERIFIED");
  }
  if (evidence.commercialClearance !== true) {
    blockers.push("COMMERCIAL_CLEARANCE_MISSING");
  }
  // Missing suspension status must also block, not silently permit.
  if (evidence.suspensionCleared !== true) {
    blockers.push("PRODUCTION_SUSPENDED");
  }

  return { authorized: blockers.length === 0, blockers };
}
