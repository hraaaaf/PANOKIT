#!/usr/bin/env bash
set -euo pipefail
# Hard fence: ephemeral PostgreSQL service inside GitHub Actions only.
[[ "${GITHUB_ACTIONS:-}" == true ]] || { echo "CI only"; exit 8; }
[[ "${PGHOST:-}" == "127.0.0.1" && "${PGPORT:-}" == "5432" && "${PGUSER:-}" == "postgres" ]] || { echo "Unsafe PG target"; exit 8; }
[[ "${PGPASSWORD:-}" == "panokit_ci_only" ]] || { echo "Not a fixture credential"; exit 8; }
DB=panokit_d3b2_ci
psql -v ON_ERROR_STOP=1 -d postgres -c "CREATE DATABASE ${DB}"
psql -v ON_ERROR_STOP=1 -d "${DB}" -f ref-drizzle/apps/api/db/drizzle-generated/0000_j04_private_registry.sql
psql -v ON_ERROR_STOP=1 -d "${DB}" -f ref-drizzle/apps/api/db/migrations/0002_j04_security_overlay.sql
psql -v ON_ERROR_STOP=1 -d "${DB}" -f apps/api/db/migrations/0003_j04_authz_read_role.sql
psql -v ON_ERROR_STOP=1 -d "${DB}" <<'SQL'
BEGIN;
INSERT INTO panokit_private.web_orders(id) VALUES
 ('33333333-3333-4333-8333-333333333333'),
 ('55555555-5555-4555-8555-555555555555');
INSERT INTO panokit_private.provenance_records(order_id) VALUES
 ('33333333-3333-4333-8333-333333333333'),
 ('55555555-5555-4555-8555-555555555555');
INSERT INTO panokit_private.production_jobs(id,order_id,factory_id,assigned_operator_user_id)
VALUES
 ('22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '11111111-1111-4111-8111-111111111111'),
 ('44444444-4444-4444-8444-444444444444',
  '55555555-5555-4555-8555-555555555555',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '66666666-6666-4666-8666-666666666666');
INSERT INTO panokit_private.staff_memberships(user_id,role,active,factory_id) VALUES
 ('11111111-1111-4111-8111-111111111111','factory_operator',true,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
 ('66666666-6666-4666-8666-666666666666','factory_operator',false,'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
 ('77777777-7777-4777-8777-777777777777','panokit_admin',true,NULL);
COMMIT;
CREATE ROLE panokit_ci_reader NOLOGIN;
GRANT panokit_authz_reader TO panokit_ci_reader;
SET ROLE panokit_ci_reader;
DO $assert$
DECLARE allowed integer;
BEGIN
 SELECT count(*) INTO allowed FROM panokit_private.authz_read_membership('11111111-1111-4111-8111-111111111111');
 IF allowed<>1 THEN RAISE EXCEPTION 'membership must be exact'; END IF;
 SELECT count(*) INTO allowed FROM panokit_private.authz_read_job(
 '22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111');
 IF allowed<>1 THEN RAISE EXCEPTION 'assigned operator must see own job'; END IF;
 SELECT count(*) INTO allowed FROM panokit_private.authz_confirm_assignment(
 '22222222-2222-4222-8222-222222222222','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111');
 IF allowed<>1 THEN RAISE EXCEPTION 'exact assignment must be confirmed'; END IF;
 SELECT count(*) INTO allowed FROM panokit_private.authz_read_job(
 '44444444-4444-4444-8444-444444444444','11111111-1111-4111-8111-111111111111');
 IF allowed<>0 THEN RAISE EXCEPTION 'cross factory leaked'; END IF;
 SELECT count(*) INTO allowed FROM panokit_private.authz_read_job(
 '44444444-4444-4444-8444-444444444444','66666666-6666-4666-8666-666666666666');
 IF allowed<>0 THEN RAISE EXCEPTION 'revoked user leaked'; END IF;
 SELECT count(*) INTO allowed FROM panokit_private.authz_read_job(
 '22222222-2222-4222-8222-222222222222','77777777-7777-4777-8777-777777777777');
 IF allowed<>1 THEN RAISE EXCEPTION 'admin read blocked'; END IF;
 SELECT count(*) INTO allowed FROM panokit_private.authz_confirm_assignment(
 '44444444-4444-4444-8444-444444444444','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','11111111-1111-4111-8111-111111111111');
 IF allowed<>0 THEN RAISE EXCEPTION 'wrong assignment leaked'; END IF;
END $assert$;
RESET ROLE;
SQL
# The application role MUST NOT be able to query even granted-looking columns.
for denied in \
 "SELECT user_id FROM panokit_private.staff_memberships" \
 "SELECT id,factory_id,assigned_operator_user_id FROM panokit_private.production_jobs" \
 "SELECT source_channel FROM panokit_private.web_orders" \
 "SELECT technical_status FROM panokit_private.production_jobs" \
 "UPDATE panokit_private.staff_memberships SET active=false" \
 "DELETE FROM panokit_private.production_jobs"; do
  if psql -v ON_ERROR_STOP=1 -d "${DB}" -c "SET ROLE panokit_ci_reader; ${denied}" >/tmp/d3b2_denied.log 2>&1; then
    echo "UNEXPECTED SQL ACCESS: ${denied}"; exit 1
  fi
  grep -qi "permission denied" /tmp/d3b2_denied.log || { cat /tmp/d3b2_denied.log; exit 1; }
done
psql -v ON_ERROR_STOP=1 -d "${DB}" -c "SELECT rolcanlogin FROM pg_roles WHERE rolname='panokit_authz_reader'" | grep -q f
echo "PASS: PG16 EXECUTE-only, 7 function assertions, 6 denied direct queries"
