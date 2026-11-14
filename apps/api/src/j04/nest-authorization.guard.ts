import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import {
  authorizeVerifiedIdentityRequest,
  type IdentityVerifier,
  type MembershipStore,
  type VerifiedIdentity,
} from "./request-authorization";
import type { AuthorizedOperation, AuthorizedResource } from "./authorization-policy";

/**
 * Authenticates BEFORE resource resolution and uses exactly one signature
 * verification per request. This remains unbound from the production AppModule.
 */
@Injectable()
export class J04AuthorizationGuard implements CanActivate {
  constructor(
    private readonly verifier: IdentityVerifier,
    private readonly memberships: MembershipStore,
    private readonly operation: AuthorizedOperation,
    private readonly trustedResource: (req: unknown, identity: VerifiedIdentity) => Promise<AuthorizedResource>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: unknown = ctx.switchToHttp().getRequest();
    if (!request || typeof request !== "object") throw new UnauthorizedException();
    const headers: unknown = (request as Record<string, unknown>).headers;
    const bearer = headers && typeof headers === "object"
      ? (headers as Record<string, unknown>).authorization : undefined;
    if (typeof bearer !== "string" || !/^Bearer [^\s]+$/.test(bearer)) {
      throw new UnauthorizedException();
    }
    let identity: VerifiedIdentity | null;
    try {
      identity = await this.verifier.verifyBearerToken(bearer.slice("Bearer ".length));
    } catch {
      throw new UnauthorizedException();
    }
    if (!identity?.userId || !identity.issuer) throw new UnauthorizedException();

    let resource: AuthorizedResource;
    try {
      resource = await this.trustedResource(request, identity);
    } catch {
      // Do not disclose whether an unauthorized dossier exists.
      throw new ForbiddenException();
    }
    const decision = await authorizeVerifiedIdentityRequest(
      identity, this.operation, resource, this.memberships,
    );
    if (decision.allowed) return true;
    throw new ForbiddenException();
  }
}
