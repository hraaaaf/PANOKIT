#!/usr/bin/env bash
set -euo pipefail
: "${PGPASSWORD:?Only use isolated CI credentials}"
export PGHOST="${PGHOST:-127.0.0.1}" PGPORT="${PGPORT:-5432}" PGUSER="${PGUSER:-postgres}" PGPASSWORD
DB=panokit_j04_ci
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
psql -X -v ON_ERROR_STOP=1 -d postgres -c "CREATE DATABASE $DB"
psql -X -v ON_ERROR_STOP=1 -d "$DB" -f "$ROOT/migrations/0001_j04_private_registry.sql"
if psql -X -v ON_ERROR_STOP=1 -d "$DB" -f "$ROOT/migrations/0001_j04_private_registry.sql" >/dev/null 2>&1; then
 echo "FAIL: duplicate migration accepted"; exit 1
fi

psql -X -v ON_ERROR_STOP=1 -d "$DB" <<'SQL'
BEGIN;
INSERT INTO panokit_private.web_orders(id) VALUES ('11111111-1111-4111-8111-111111111111');
INSERT INTO panokit_private.provenance_records(order_id) VALUES ('11111111-1111-4111-8111-111111111111');
INSERT INTO panokit_private.order_events(order_id,event_name) VALUES ('11111111-1111-4111-8111-111111111111','order.created');
INSERT INTO panokit_private.production_jobs(id,order_id,factory_id)
VALUES ('33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
INSERT INTO panokit_private.transaction_outbox(order_id,event_name)
VALUES ('11111111-1111-4111-8111-111111111111','TECH_REVIEW_REQUESTED');
COMMIT;
DO $$
BEGIN
 IF (SELECT count(*) FROM panokit_private.web_orders) <> 1 OR
    (SELECT count(*) FROM panokit_private.provenance_records) <> 1 OR
    (SELECT count(*) FROM panokit_private.order_events) <> 1 OR
    (SELECT count(*) FROM panokit_private.transaction_outbox) <> 1 THEN
  RAISE EXCEPTION 'atomic fixture not persisted';
 END IF;
 IF EXISTS (SELECT 1 FROM information_schema.columns
            WHERE table_schema='panokit_private' AND table_name='production_jobs'
              AND column_name IN ('customer_name','customer_phone','price','margin')) THEN
  RAISE EXCEPTION 'sensitive factory columns exposed';
 END IF;
 IF EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='panokit_private') THEN
  RAISE EXCEPTION 'C2 RLS permissions prematurely granted';
 END IF;
END $$;
BEGIN;
INSERT INTO panokit_private.web_orders(id) VALUES ('22222222-2222-4222-8222-222222222222');
INSERT INTO panokit_private.provenance_records(order_id) VALUES ('22222222-2222-4222-8222-222222222222');
INSERT INTO panokit_private.transaction_outbox(order_id,event_name)
VALUES ('22222222-2222-4222-8222-222222222222','TECH_REVIEW_REQUESTED');
ROLLBACK;
DO $$
BEGIN
 IF EXISTS(SELECT 1 FROM panokit_private.transaction_outbox
   WHERE order_id='22222222-2222-4222-8222-222222222222') THEN
   RAISE EXCEPTION 'outbox rollback failed';
 END IF;
END $$;
CREATE ROLE panokit_ci_factory NOLOGIN;
CREATE ROLE panokit_ci_public NOLOGIN;
SQL

expect_denied() {
 local label="$1" query="$2"
 if psql -X -v ON_ERROR_STOP=1 -d "$DB" -c "$query" >/dev/null 2>&1; then
   echo "FAIL: $label was allowed"; exit 1
 fi
 echo "PASS denied: $label"
}
expect_denied 'order without provenance' "INSERT INTO panokit_private.web_orders(id) VALUES ('44444444-4444-4444-8444-444444444444');"
expect_denied 'wrong origin' "INSERT INTO panokit_private.web_orders(id,source_channel) VALUES ('44444444-4444-4444-8444-444444444445','OFFSITE');"
expect_denied 'origin UPDATE' "UPDATE panokit_private.web_orders SET source_channel='OFFSITE' WHERE id='11111111-1111-4111-8111-111111111111';"
expect_denied 'order DELETE' "DELETE FROM panokit_private.web_orders WHERE id='11111111-1111-4111-8111-111111111111';"
expect_denied 'provenance UPDATE' "UPDATE panokit_private.provenance_records SET recorded_at=now() WHERE order_id='11111111-1111-4111-8111-111111111111';"
expect_denied 'event DELETE' "DELETE FROM panokit_private.order_events WHERE order_id='11111111-1111-4111-8111-111111111111';"
expect_denied 'cross-factory reassignment' "UPDATE panokit_private.production_jobs SET factory_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' WHERE id='33333333-3333-4333-8333-333333333333';"
expect_denied 'fabrication release unsupported' "UPDATE panokit_private.production_jobs SET technical_status='FABRICATION_RELEASED' WHERE id='33333333-3333-4333-8333-333333333333';"
expect_denied 'factory SQL read' 'SET ROLE panokit_ci_factory; SELECT * FROM panokit_private.web_orders;'
expect_denied 'public SQL read' 'SET ROLE panokit_ci_public; SELECT * FROM panokit_private.production_jobs;'
expect_denied 'orphan notification' "INSERT INTO panokit_private.transaction_outbox(order_id,event_name) VALUES ('55555555-5555-4555-8555-555555555555','TECH_REVIEW_REQUESTED');"

psql -X -v ON_ERROR_STOP=1 -d "$DB" -f "$ROOT/test-only/rollback_ci_only.sql"
test "$(psql -X -v ON_ERROR_STOP=1 -d "$DB" -Atqc "SELECT count(*) FROM pg_namespace WHERE nspname='panokit_private'")" = 0
echo "PASS J04-D1-A: private schema, atomics, 11 denied cases, rollback"
