/**
 * J04-D3-A: explicit server-side authorization policy.
 *
 * IMPORTANT: Verification of Supabase access tokens and fresh DB membership
 * is NOT implemented by this module. All inputs must be established by
 * server-controlled adapters, never from request body or user_metadata.
 * Unknown roles/actions, unassigned production dossiers, and missing approval
 * are denied. Future NestJS adapters must recheck membership on each request.
 */

export type StaffRole =
  | "panokit_admin"
  | "digital_auditor"
  | "sales_agent"
  | "factory_operator"
  | "factory_manager";

export type AuthorizedOperation =
  | "view_web_sales"
  | "export_web_sales"
  | "view_customer_contact"
  | "view_production_job"
  | "record_technical_note"
  | "request_fabrication_release"
  | "change_commercial_origin"
  | "approve_customer_bat"
  | "financial_adjustment"
  | "refund"
  | "export_personal_data";

export type StaffMembership = Readonly<{
  userId: string;
  role: StaffRole;
  active: boolean;
  factoryId?: string | null;
  assignedProductionJobIds?: readonly string[];
}>;

export type AuthorizedResource = Readonly<{
  productionJobId?: string | null;
  factoryId?: string | null;
}>;

export type AccessDecision = Readonly<{
  allowed: boolean;
  reason: string;
}>;

const deny = (reason: string): AccessDecision => ({ allowed: false, reason });
const allow = (): AccessDecision => ({ allowed: true, reason: "ALLOW" });

export function authorizeStaff(
  membership: StaffMembership | null | undefined,
  operation: AuthorizedOperation,
  resource: AuthorizedResource = {},
): AccessDecision {
  if (!membership?.active || !membership.userId || !membership.role) {
    return deny("STAFF_INACTIVE_OR_UNKNOWN");
  }

  // These operations require separate server-side workflows, so no role may
  // perform them through this generic access policy.
  if (
    operation === "change_commercial_origin" ||
    operation === "approve_customer_bat" ||
    operation === "request_fabrication_release" ||
    operation === "export_personal_data" ||
    operation === "financial_adjustment" ||
    operation === "refund"
  ) {
    return deny("SPECIAL_WORKFLOW_NOT_IMPLEMENTED");
  }

  switch (membership.role) {
    case "panokit_admin":
      return operation === "view_web_sales" ||
        operation === "export_web_sales" ||
        operation === "view_customer_contact" ||
        operation === "view_production_job"
        ? allow()
        : deny("ADMIN_OPERATION_NOT_GRANTED");
    case "digital_auditor":
      return operation === "view_web_sales" || operation === "export_web_sales"
        ? allow()
        : deny("AUDITOR_OPERATION_NOT_GRANTED");
    case "sales_agent":
      // Individual sales assignment model remains unsettled: deny by default.
      return deny("SALES_ASSIGNMENT_NOT_IMPLEMENTED");
    case "factory_operator":
      if (operation !== "view_production_job" && operation !== "record_technical_note") {
        return deny("FACTORY_OPERATION_NOT_GRANTED");
      }
      if (
        !membership.factoryId ||
        !resource.factoryId ||
        membership.factoryId !== resource.factoryId ||
        !resource.productionJobId ||
        !membership.assignedProductionJobIds?.includes(resource.productionJobId)
      ) {
        return deny("FACTORY_ASSIGNMENT_REQUIRED");
      }
      return allow();
    case "factory_manager":
      // Manager-level permissions still need an explicit C2 grant.
      return deny("FACTORY_MANAGER_ROLE_NOT_GRANTED");
    default:
      return deny("UNKNOWN_ROLE");
  }
}
