import {
  authorizeStaff,
  type AuthorizedOperation,
  type AuthorizedResource,
  type StaffMembership,
} from "./authorization-policy";

/**
 * D3-A trusted adapter contracts. No direct Supabase access or real JWT
 * verification yet. A token string is not itself a verified identity.
 */
export type VerifiedIdentity = Readonly<{ userId: string; issuer: string }>;
export interface IdentityVerifier {
  verifyBearerToken(token: string): Promise<VerifiedIdentity | null>;
}
export interface MembershipStore {
  getCurrentMembership(userId: string, resource?: AuthorizedResource): Promise<StaffMembership | null>;
}
export type AuthorizationResult = Readonly<{
  allowed: boolean;
  reason: string;
  userId?: string;
}>;

export const denyAllIdentityVerifier: IdentityVerifier = {
  async verifyBearerToken(): Promise<null> { return null; },
};
export const denyAllMembershipStore: MembershipStore = {
  async getCurrentMembership(): Promise<null> { return null; },
};

export async function authorizeBearerRequest(
  authHeader: string | undefined,
  operation: AuthorizedOperation,
  resource: AuthorizedResource,
  verifier: IdentityVerifier = denyAllIdentityVerifier,
  memberships: MembershipStore = denyAllMembershipStore,
): Promise<AuthorizationResult> {
  if (!authHeader || !/^Bearer [^\s]+$/.test(authHeader)) {
    return { allowed: false, reason: "BEARER_TOKEN_REQUIRED" };
  }

  let identity: VerifiedIdentity | null;
  try {
    identity = await verifier.verifyBearerToken(authHeader.slice("Bearer ".length));
  } catch {
    return { allowed: false, reason: "IDENTITY_VERIFICATION_FAILED" };
  }
  if (!identity?.userId || !identity.issuer) {
    return { allowed: false, reason: "IDENTITY_UNVERIFIED" };
  }

  let membership: StaffMembership | null;
  try {
    membership = await memberships.getCurrentMembership(identity.userId, resource);
  } catch {
    return { allowed: false, reason: "MEMBERSHIP_LOOKUP_FAILED" };
  }
  // Never trust a membership for someone else, user_metadata, stale or
  // revoked membership state, or caller-supplied role claims.
  if (!membership || membership.userId !== identity.userId) {
    return { allowed: false, reason: "MEMBERSHIP_MISMATCH" };
  }

  const access = authorizeStaff(membership, operation, resource);
  return {
    allowed: access.allowed,
    reason: access.reason,
    ...(access.allowed ? { userId: identity.userId } : {}),
  };
}
