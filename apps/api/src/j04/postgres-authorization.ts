import type { AuthorizedResource, StaffMembership, StaffRole } from "./authorization-policy";
import type { MembershipStore, VerifiedIdentity } from "./request-authorization";

/**
 * SQL functions are SECURITY DEFINER, restricted to EXECUTE-only DB readers.
 * A real server adapter MUST bind p_user only from a verified server identity.
 * No connection or credentials are configured in this draft branch.
 */
export interface ReadOnlyPg {
  query<T extends object>(statement: string, args: readonly string[]): Promise<{ rows: readonly T[] }>;
}
type Member = { user_id: string; role: string; active: boolean; factory_id: string | null };
type Job = { job_id: string; factory_id: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const valid = (v: unknown): v is string => typeof v === "string" && uuid.test(v);
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const roles = new Set(["panokit_admin","digital_auditor","sales_agent","factory_operator","factory_manager"]);

export function createPostgresMembershipStore(db: ReadOnlyPg): MembershipStore {
  return { async getCurrentMembership(userId, resource): Promise<StaffMembership | null> {
    if (!valid(userId)) return null;
    const r = await db.query<Member>(
      "SELECT user_id::text AS user_id,role,active,factory_id::text AS factory_id FROM panokit_private.authz_read_membership($1::uuid)",
      [userId],
    );
    if (r.rows.length !== 1) return null;
    const m = r.rows[0];
    if (!m || !valid(m.user_id) || !same(m.user_id,userId) || !roles.has(m.role) ||
        typeof m.active !== "boolean" || (m.factory_id !== null && !valid(m.factory_id))) return null;

    const assignedProductionJobIds: string[] = [];
    if (m.active && m.role === "factory_operator" && valid(m.factory_id) &&
        valid(resource?.factoryId) && valid(resource?.productionJobId) && same(m.factory_id,resource.factoryId)) {
      const a = await db.query<{job_id:string}>(
        "SELECT job_id::text AS job_id FROM panokit_private.authz_confirm_assignment($1::uuid,$2::uuid,$3::uuid)",
        [resource.productionJobId,m.factory_id,userId],
      );
      if (a.rows.length === 1 && valid(a.rows[0]?.job_id) && same(a.rows[0].job_id,resource.productionJobId))
        assignedProductionJobIds.push(resource.productionJobId);
    }
    return {
      userId:m.user_id, role:m.role as StaffRole, active:m.active,
      factoryId:m.factory_id, assignedProductionJobIds,
    };
  } };
}

export function createPostgresJobResolver(db: ReadOnlyPg) {
  return async (request: unknown, identity: VerifiedIdentity): Promise<AuthorizedResource> => {
    if (!valid(identity?.userId)) throw Error("VERIFIED_IDENTITY_REQUIRED");
    if (!request || typeof request !== "object") throw Error("REQUEST_REQUIRED");
    const params = (request as {params?:unknown}).params;
    if (!params || typeof params !== "object") throw Error("PARAMS_REQUIRED");
    const id = (params as Record<string,unknown>).jobId;
    if (!valid(id)) throw Error("INVALID_JOB_ID");
    const r = await db.query<Job>(
      "SELECT job_id::text AS job_id,factory_id::text AS factory_id FROM panokit_private.authz_read_job($1::uuid,$2::uuid)",
      [id,identity.userId],
    );
    if (r.rows.length !== 1 || !valid(r.rows[0]?.job_id) || !valid(r.rows[0]?.factory_id) ||
        !same(r.rows[0].job_id,id)) throw Error("JOB_NOT_ACCESSIBLE");
    return { productionJobId:r.rows[0].job_id, factoryId:r.rows[0].factory_id };
  };
}
