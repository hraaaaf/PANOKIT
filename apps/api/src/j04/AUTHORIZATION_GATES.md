# J04-D3-A — Application authorization contracts

This is a **fail-closed policy candidate**, not a connected auth service.
No JWT cryptography, Supabase calls, NestJS routes, database access or grants
are active in this candidate. Calling a pure policy with spoofed identity
data is NOT an authorization boundary.

Principles B–F approved in Notion on 2026-11-14:
B factory no client PII by default; C admin-only financial workflows with audit;
D no guessed retention periods; E offsite sales excluded from PANOKIT_WEB;
F server-generated identifiers and dual approval for sensitive corrections.

All unimplemented operations are denied: BAT acceptance by customer,
fabrication release, financial adjustment/refund, personal-data export.
Factory operators may see/annotate only assigned dossiers, based on a
**fresh server-side membership lookup**, never client role or user_metadata.
Manager and sales-agent rights remain denied until explicitly defined.

Next necessary implementation before any real API route:
1. Verify Supabase JWT cryptographically (issuer, audience, signature, expiry)
   using an established library; do not trust `getSession` or user_metadata.
2. Query real membership/assignment/revocation from server-side database
   on every sensitive request. Add SQL-scoped roles, GRANT/RLS and tests.
3. Extract resource IDs from server-controlled record lookups, not caller
   claims; perform privileged mutations under a transaction and recheck BAT.
4. Bind the NestJS guard/service to the actual routes and end-to-end tests.
5. Never claim production-ready authorization based on these unit tests.

PR remains DRAFT, with no merge, Supabase migration or Vercel deployment.
