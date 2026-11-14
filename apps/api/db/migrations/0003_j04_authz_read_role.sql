-- J04-D3-B2 CANDIDATE. Requires generated schema + security overlay from draft PR #7.
-- NEVER apply to Supabase without a separate explicit user approval.
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
REVOKE ALL ON panokit_private.staff_memberships FROM PUBLIC;
GRANT USAGE ON SCHEMA panokit_private TO panokit_authz_reader;
GRANT SELECT(user_id,role,active,factory_id) ON panokit_private.staff_memberships TO panokit_authz_reader;
GRANT SELECT(id,factory_id,assigned_operator_user_id) ON panokit_private.production_jobs TO panokit_authz_reader;
CREATE POLICY j04_membership_reader ON panokit_private.staff_memberships FOR SELECT TO panokit_authz_reader USING(true);
CREATE POLICY j04_job_reader ON panokit_private.production_jobs FOR SELECT TO panokit_authz_reader USING(true);
COMMIT;
