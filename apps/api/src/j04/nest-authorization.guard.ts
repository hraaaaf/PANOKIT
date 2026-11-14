import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { authorizeBearerRequest, type IdentityVerifier, type MembershipStore } from "./request-authorization";
import type { AuthorizedOperation, AuthorizedResource } from "./authorization-policy";

/**
 * Deliberately not bound to a route until authenticated SQL adapters exist.
 * Neither headers nor request bodies may supply factory membership claims.
 */
@Injectable()
export class J04AuthorizationGuard implements CanActivate {
  constructor(
    private readonly verifier: IdentityVerifier,
    private readonly memberships: MembershipStore,
    private readonly operation: AuthorizedOperation,
    private readonly trustedResource: (req: unknown) => Promise<AuthorizedResource>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: unknown = ctx.switchToHttp().getRequest();
    if (!request || typeof request !== "object") throw new UnauthorizedException();
    const headers: unknown = (request as Record<string, unknown>).headers;
    const bearer = headers && typeof headers === "object"
      ? (headers as Record<string, unknown>).authorization : undefined;
    // Authenticate before any dossier lookup; otherwise 401/403 can leak existence.
    if (typeof bearer !== "string" || !/^Bearer [^\\s]+$/.test(bearer)) {
      throw new UnauthorizedException();
    }
    try {
      const identity = await this.verifier.verifyBearerToken(bearer.slice("Bearer ".length));
      if (!identity?.userId || !identity.issuer) throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }
    let resource: AuthorizedResource;
    try {
      resource = await this.trustedResource(request);
    } catch {
      throw new ForbiddenException();
    }
    const decision = await authorizeBearerRequest(
      typeof bearer === "string" ? bearer : undefined,
      this.operation,
      resource,
      this.verifier,
      this.memberships,
    );
    if (decision.allowed) return true;
    if (decision.reason.startsWith("BEARER_") || decision.reason.startsWith("IDENTITY_")) {
      throw new UnauthorizedException();
    }
    throw new ForbiddenException();
  }
}
