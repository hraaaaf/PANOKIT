-- D1-B security overlay for Drizzle-generated candidate schema.
-- Applied only after Drizzle's 0000 generated SQL, on a disposable PostgreSQL CI database.
-- Do NOT apply directly to PANOKIT Supabase.
BEGIN;

-- Enforce all-or-nothing provenance even if a caller forgets to insert it.
ALTER TABLE panokit_private.web_orders
  ADD CONSTRAINT web_orders_require_provenance
  FOREIGN KEY (id)
  REFERENCES panokit_private.provenance_records (order_id)
  DEFERRABLE INITIALLY DEFERRED;

-- A client cannot reclassify PANOKIT_WEB or delete an issued web order.
CREATE FUNCTION panokit_private.protect_web_order() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, panokit_private AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'web orders cannot be deleted';
  END IF;
  IF NEW.source_channel IS DISTINCT FROM OLD.source_channel THEN
    RAISE EXCEPTION 'origin cannot be changed';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER prevent_order_reclassification
  BEFORE UPDATE OR DELETE ON panokit_private.web_orders
  FOR EACH ROW EXECUTE FUNCTION panokit_private.protect_web_order();

-- Append-only for normal application DML (not privileged database owners).
CREATE FUNCTION panokit_private.protect_append_only() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, panokit_private AS $$
BEGIN
  RAISE EXCEPTION 'append-only mutation forbidden';
END $$;
CREATE TRIGGER protect_provenance
  BEFORE UPDATE OR DELETE ON panokit_private.provenance_records
  FOR EACH ROW EXECUTE FUNCTION panokit_private.protect_append_only();
CREATE TRIGGER protect_events
  BEFORE UPDATE OR DELETE ON panokit_private.order_events
  FOR EACH ROW EXECUTE FUNCTION panokit_private.protect_append_only();

CREATE FUNCTION panokit_private.protect_factory_assignment() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, panokit_private AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'job deletion forbidden'; END IF;
  IF NEW.order_id IS DISTINCT FROM OLD.order_id
     OR NEW.factory_id IS DISTINCT FROM OLD.factory_id THEN
    RAISE EXCEPTION 'job reassignment forbidden';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER protect_job_assignment
  BEFORE UPDATE OR DELETE ON panokit_private.production_jobs
  FOR EACH ROW EXECUTE FUNCTION panokit_private.protect_factory_assignment();

-- No direct grants/SQL or Data API exposure of private commercial data.
ALTER TABLE panokit_private.web_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE panokit_private.provenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE panokit_private.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE panokit_private.production_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE panokit_private.transaction_outbox ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON SCHEMA panokit_private FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA panokit_private FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA panokit_private FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA panokit_private FROM PUBLIC;

COMMIT;
