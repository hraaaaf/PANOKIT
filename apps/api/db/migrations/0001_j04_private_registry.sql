-- J04-D1-A candidate; NO real Supabase migration; decisions B-F pending.
BEGIN;
CREATE SCHEMA panokit_private;
REVOKE ALL ON SCHEMA panokit_private FROM PUBLIC;

CREATE TABLE panokit_private.web_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_channel text NOT NULL DEFAULT 'PANOKIT_WEB'
    CONSTRAINT web_orders_origin_check CHECK (source_channel = 'PANOKIT_WEB'),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE panokit_private.provenance_records (
  order_id uuid PRIMARY KEY REFERENCES panokit_private.web_orders(id) ON DELETE RESTRICT,
  source_channel text NOT NULL DEFAULT 'PANOKIT_WEB'
    CONSTRAINT provenance_origin_check CHECK (source_channel = 'PANOKIT_WEB'),
  recorded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE panokit_private.web_orders
  ADD CONSTRAINT web_orders_require_provenance
  FOREIGN KEY (id) REFERENCES panokit_private.provenance_records(order_id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE panokit_private.order_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES panokit_private.web_orders(id) ON DELETE RESTRICT,
  event_name text NOT NULL CHECK (length(trim(event_name)) > 0),
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE panokit_private.production_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES panokit_private.web_orders(id) ON DELETE RESTRICT,
  factory_id uuid NOT NULL,
  assigned_operator_user_id uuid,
  technical_status text NOT NULL DEFAULT 'PENDING_REVIEW'
    CHECK (technical_status IN ('PENDING_REVIEW','IN_REVIEW','NEEDS_CORRECTION','TECH_APPROVED')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX production_jobs_factory_idx ON panokit_private.production_jobs(factory_id,technical_status);
CREATE TABLE panokit_private.transaction_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES panokit_private.web_orders(id) ON DELETE RESTRICT,
  event_name text NOT NULL CHECK (event_name='TECH_REVIEW_REQUESTED'),
  created_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts>=0)
);
CREATE INDEX transaction_outbox_pending_idx ON panokit_private.transaction_outbox(created_at)
  WHERE delivered_at IS NULL;

CREATE FUNCTION panokit_private.protect_web_order() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,panokit_private AS $$
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'web orders cannot be deleted'; END IF;
 IF NEW.source_channel IS DISTINCT FROM OLD.source_channel THEN
   RAISE EXCEPTION 'origin cannot be changed'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER prevent_order_reclassification
 BEFORE UPDATE OR DELETE ON panokit_private.web_orders
 FOR EACH ROW EXECUTE FUNCTION panokit_private.protect_web_order();

CREATE FUNCTION panokit_private.protect_append_only() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,panokit_private AS $$
BEGIN
 RAISE EXCEPTION 'append-only mutation forbidden';
END $$;
CREATE TRIGGER protect_provenance BEFORE UPDATE OR DELETE ON panokit_private.provenance_records
 FOR EACH ROW EXECUTE FUNCTION panokit_private.protect_append_only();
CREATE TRIGGER protect_events BEFORE UPDATE OR DELETE ON panokit_private.order_events
 FOR EACH ROW EXECUTE FUNCTION panokit_private.protect_append_only();

CREATE FUNCTION panokit_private.protect_factory_assignment() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,panokit_private AS $$
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'job deletion forbidden'; END IF;
 IF NEW.order_id IS DISTINCT FROM OLD.order_id OR NEW.factory_id IS DISTINCT FROM OLD.factory_id THEN
   RAISE EXCEPTION 'job reassignment forbidden'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER protect_job_assignment BEFORE UPDATE OR DELETE ON panokit_private.production_jobs
 FOR EACH ROW EXECUTE FUNCTION panokit_private.protect_factory_assignment();

ALTER TABLE panokit_private.web_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE panokit_private.provenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE panokit_private.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE panokit_private.production_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE panokit_private.transaction_outbox ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA panokit_private FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA panokit_private FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA panokit_private FROM PUBLIC;
COMMIT;
