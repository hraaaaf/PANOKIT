import { Controller, Get, Inject, Injectable, Param, UseGuards } from "@nestjs/common";
import { J04AuthorizationGuard } from "./nest-authorization.guard";
import { createPostgresMembershipStore, createPostgresJobResolver, type ReadOnlyPg } from "./postgres-authorization";
import type { IdentityVerifier } from "./request-authorization";

/**
 * Route contract for isolated HTTP tests. NOT imported by AppModule.
 * Real activation requires verified Supabase JWKS, a scoped SQL connector,
 * environment-specific credentials and a separately approved rollout.
 */
export const J04_AUTHZ_DB = "J04_AUTHZ_READ_ONLY_DB";
export const J04_AUTHZ_VERIFIER = "J04_VERIFIED_JWT_VERIFIER";

@Injectable()
export class J04ProductionJobGuard extends J04AuthorizationGuard {
  constructor(
    @Inject(J04_AUTHZ_VERIFIER) verifier: IdentityVerifier,
    @Inject(J04_AUTHZ_DB) db: ReadOnlyPg,
  ) {
    super(verifier,createPostgresMembershipStore(db),
      "view_production_job",createPostgresJobResolver(db));
  }
}

@Controller("j04/production-jobs")
export class J04ProductionJobsController {
  @Get(":jobId")
  @UseGuards(J04ProductionJobGuard)
  readOne(@Param("jobId") jobId: string) {
    // No commercial source, customer data or technical payload exposed.
    return { id:jobId };
  }
}
