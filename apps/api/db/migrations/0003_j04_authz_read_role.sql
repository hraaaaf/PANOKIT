-- J04-D3-B2 CANDIDATE ONLY. Requires Drizzle 0000 and D1-B security overlay 0002.
-- Never apply to a real Supabase database without a separate explicit approval.
-- The app reader gets EXECUTE on three fixed, parameterized, SECURITY DEFINER
-- read functions; it never gets direct SELECT on membership or production tables.
BEGIN;
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='panokit_authz_reader') THEN
   CREATE ROLE panokit_authz_reader NOLOGIN;
 END IF;
END $$;
CREATE TABLE panokit_private.staff_memberships(
 user_id uuid PRIMARY KEY,
 role text NOT NULL CHECK(role IN ('panokit_admin','digital_auditor','sales_agent','factory_operator','factory_manager')),
 active boolean NOT NULL DEFAULT false,
 factory_id uuid,
 CHECK(role<>'factory_operator' OR factory_id IS NOT NULL)
);
ALTER TABLE panokit_private.staff_memberships ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON panokit_private.staff_memberships FROM PUBLIC, panokit_authz_reader;
REVOKE ALL ON panokit_private.production_jobs FROM panokit_authz_reader;
GRANT USAGE ON SCHEMA panokit_private TO panokit_authz_reader;

-- Only the authenticated user ID from the server's verified JWT may be passed.
CREATE FUNCTION panokit_private.authz_read_membership(p_user uuid)
RETURNS TABLE(user_id uuid, role text, active boolean, factory_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog AS $fn$
 SELECT m.user_id,m.role,m.active,m.factory_id
 FROM panokit_private.staff_memberships m WHERE m.user_id=p_user
$fn$;

-- The database itself refuses cross-factory, non-assigned and revoked jobs;
-- administrators are the only unscoped role with view_production_job policy.
CREATE FUNCTION panokit_private.authz_read_job(p_job uuid, p_user uuid)
RETURNS TABLE(job_id uuid, factory_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog AS $fn$
 SELECT j.id,j.factory_id
 FROM panokit_private.production_jobs j
 JOIN panokit_private.staff_memberships m ON m.user_id=p_user AND m.active
 WHERE j.id=p_job AND (
   m.role='panokit_admin'
   OR (m.role='factory_operator' AND m.factory_id=j.factory_id
       AND j.assigned_operator_user_id=m.user_id)
 )
$fn$;

CREATE FUNCTION panokit_private.authz_confirm_assignment(p_job uuid, p_factory uuid, p_user uuid)
RETURNS TABLE(job_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog AS $fn$
 SELECT j.id
 FROM panokit_private.production_jobs j
 JOIN panokit_private.staff_memberships m
   ON m.user_id=p_user AND m.active AND m.role='factory_operator'
 WHERE j.id=p_job AND j.factory_id=p_factory AND m.factory_id=p_factory
   AND j.assigned_operator_user_id=m.user_id
$fn$;

REVOKE ALL ON FUNCTION panokit_private.authz_read_membership(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION panokit_private.authz_read_job(uuid,uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION panokit_private.authz_confirm_assignment(uuid,uuid,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION panokit_private.authz_read_membership(uuid) TO panokit_authz_reader;
GRANT EXECUTE ON FUNCTION panokit_private.authz_read_job(uuid,uuid) TO panokit_authz_reader;
GRANT EXECUTE ON FUNCTION panokit_private.authz_confirm_assignment(uuid,uuid,uuid) TO panokit_authz_reader;
COMMIT;
