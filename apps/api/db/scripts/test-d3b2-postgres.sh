#!/usr/bin/env bash
set -euo pipefail
# Hard fence: PostgreSQL CI fixture only; do not permit real Supabase endpoints.
[[ "${GITHUB_ACTIONS:-}" == true ]] || { echo "CI only"; exit 8; }
[[ "${PGHOST:-}" == "127.0.0.1" && "${PGPORT:-}" == "5432" && "${PGUSER:-}" == "postgres" ]] || { echo "Unsafe PG target"; exit 8; }
[[ "${PGPASSWORD:-}" == "panokit_ci_only" ]] || { echo "Not a test credential"; exit 8; }
DB=panokit_d3b2_ci
psql -v ON_ERROR_STOP=1 -d postgres -c "CREATE DATABASE ${DB}"
psql -v ON_ERROR_STOP=1 -d "${DB}" -f ref-drizzle/apps/api/db/drizzle-generated/0000_j04_private_registry.sql
psql -v ON_ERROR_STOP=1 -d "${DB}" -f ref-drizzle/apps/api/db/migrations/0002_j04_security_overlay.sql
psql -v ON_ERROR_STOP=1 -d "${DB}" -f apps/api/db/migrations/0003_j04_authz_read_role.sql
psql -v ON_ERROR_STOP=1 -d "${DB}" <<'SQL'
BEGIN;
INSERT INTO panokit_private.web_orders(id) VALUES ('33333333-3333-4333-8333-333333333333');
INSERT INTO panokit_private.provenance_records(order_id) VALUES ('33333333-3333-4333-8333-333333333333');
INSERT INTO panokit_private.production_jobs(id,order_id,factory_id,assigned_operator_user_id)
VALUES('22222222-2222-4222-8222-222222222222',
'33333333-3333-4333-8333-333333333333',
'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
'11111111-1111-4111-8111-111111111111');
INSERT INTO panokit_private.staff_memberships(user_id,role,active,factory_id)
VALUES('11111111-1111-4111-8111-111111111111','factory_operator',true,
'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
COMMIT;
CREATE ROLE panokit_ci_reader LOGIN;
GRANT panokit_authz_reader TO panokit_ci_reader;
SQL
# The SQL reader can fetch only membership and non-commercial assignment columns.
psql -v ON_ERROR_STOP=1 -d "${DB}" -c "SET ROLE panokit_ci_reader; SELECT user_id,active,factory_id FROM panokit_private.staff_memberships;"
psql -v ON_ERROR_STOP=1 -d "${DB}" -c "SET ROLE panokit_ci_reader; SELECT id,factory_id,assigned_operator_user_id FROM panokit_private.production_jobs;"
# Denied reads/writes must fail as SQL errors, rather than only return 0 rows.
for denied in \
  "SELECT source_channel FROM panokit_private.web_orders" \
  "SELECT technical_status FROM panokit_private.production_jobs" \
  "UPDATE panokit_private.staff_memberships SET active=false" \
  "DELETE FROM panokit_private.production_jobs"; do
  if psql -v ON_ERROR_STOP=1 -d "${DB}" -c "SET ROLE panokit_ci_reader; ${denied}" >/tmp/d3b2_denied.log 2>&1; then
    echo "UNEXPECTED SQL ACCESS: ${denied}"; exit 1
  fi
  grep -qi "permission denied" /tmp/d3b2_denied.log || { cat /tmp/d3b2_denied.log; exit 1; }
done
# No app-user role has been granted this reader role in the candidate migration.
psql -v ON_ERROR_STOP=1 -d "${DB}" -c "SELECT rolcanlogin FROM pg_roles WHERE rolname='panokit_authz_reader'" | grep -q f
echo "PASS: isolated PostgreSQL 16 minimal reader and 4 expected denials"
