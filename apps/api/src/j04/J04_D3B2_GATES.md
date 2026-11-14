# J04-D3-B2 — Scoped PostgreSQL / NestJS candidate (DRAFT)

GOAL: cryptographically verified identity, current server-side membership, exact production-job isolation.

- [x] SQL read adapter uses parameterized EXECUTE-only SECURITY DEFINER functions, not direct table SELECT.
- [x] Function-level SQL guards: assigned operator, current active membership, admin permission, factory scope.
- [x] PostgreSQL 16 CI fixture with separate PR #7 pinned schema, cross-factory and direct-SELECT denial checks (code present).
- [x] Guard verifies JWT once BEFORE any database read, uses identity in scoped job resolver.
- [x] Route/controller + NestJS HTTP 200/401/403 fixture built but NOT registered in production AppModule.
- [ ] Verify GitHub Actions green on current head after this change.
- [ ] Real PostgreSQL driver and credentials restricted to database function EXECUTE, trusted live JWT/JWKS bootstrap, same-process DB+HTTP E2E, request tracing.
- [ ] Independently audit SECURITY DEFINER owner/search_path, DB role grant and user-ID trust boundary in target DEV environment.
- [ ] Reconcile PR #7 Drizzle migrations with PR #9 JWT guard in reviewed integration branch.
- [ ] Supabase migration, merge, Vercel deployment: NOT AUTHORIZED.

Important: The functions accept a server-verified user UUID; an arbitrary caller who controls the DB connection could supply another UUID. NEVER expose the reader role or SQL endpoints to browsers or users. Dedicated server connection + crypto verification remain release-blocking.

SUCCESS: source-level HTTP contract and isolated SQL permission gate only; no live API access.
PROOF: review the latest SHA and CI links in the canonical Notion roadmap.
