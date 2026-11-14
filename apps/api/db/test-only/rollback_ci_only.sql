-- TEST ONLY. Never on Supabase or other non-fixture databases.
\set ON_ERROR_STOP on
DO $guard$
BEGIN
 IF current_database() <> 'panokit_j04_ci' THEN
  RAISE EXCEPTION 'destructive cleanup refused outside isolated CI database';
 END IF;
END $guard$;
DROP SCHEMA panokit_private CASCADE;
