import { strict as assert } from "node:assert";
import { test } from "node:test";
import { authorizeStaff, type StaffMembership } from "./j04/authorization-policy";
import {
  authorizeBearerRequest,
  type IdentityVerifier,
  type MembershipStore,
} from "./j04/request-authorization";

const operator: StaffMembership = {
  userId: "demo-operator",
  role: "factory_operator",
  factoryId: "demo-factory-A",
  assignedProductionJobIds: ["demo-job-1"],
  active: true,
};
const assigned = { factoryId: "demo-factory-A", productionJobId: "demo-job-1" };

test("factory can read ONLY its own assigned dossier", () => {
  assert.equal(authorizeStaff(operator, "view_production_job", assigned).allowed, true);
  assert.equal(authorizeStaff(operator, "record_technical_note", assigned).allowed, true);
  assert.equal(authorizeStaff(operator, "view_production_job", { ...assigned, factoryId: "other-factory" }).allowed, false);
  assert.equal(authorizeStaff(operator, "view_production_job", { ...assigned, productionJobId: "unknown-job" }).allowed, false);
});

test("revoked or missing memberships fail closed", () => {
  assert.equal(authorizeStaff({ ...operator, active: false }, "view_production_job", assigned).allowed, false);
  assert.equal(authorizeStaff(null, "view_production_job", assigned).allowed, false);
});

test("factory cannot access commercial or customer data", () => {
  for (const operation of ["view_web_sales", "export_web_sales", "view_customer_contact"] as const) {
    assert.equal(authorizeStaff(operator, operation, assigned).allowed, false, operation);
  }
});

test("no principal can forge customer BAT or fabrication release", () => {
  for (const role of ["factory_operator", "panokit_admin", "digital_auditor"] as const) {
    const user = { ...operator, role };
    assert.equal(authorizeStaff(user, "approve_customer_bat", assigned).allowed, false);
    assert.equal(authorizeStaff(user, "request_fabrication_release", assigned).allowed, false);
    assert.equal(authorizeStaff(user, "change_commercial_origin", assigned).allowed, false);
  }
});

test("sensitive financial adjustments, refunds and PII export disabled until workflow", () => {
  const admin: StaffMembership = { userId: "admin", role: "panokit_admin", active: true };
  for (const operation of ["financial_adjustment", "refund", "export_personal_data"] as const) {
    assert.equal(authorizeStaff(admin, operation).allowed, false);
  }
});

test("digital auditor sees web-origin accounting but not private client records", () => {
  const auditor: StaffMembership = { userId: "auditor", role: "digital_auditor", active: true };
  assert.equal(authorizeStaff(auditor, "view_web_sales").allowed, true);
  assert.equal(authorizeStaff(auditor, "export_web_sales").allowed, true);
  assert.equal(authorizeStaff(auditor, "view_customer_contact").allowed, false);
});

test("undefined manager or sales permissions refuse all", () => {
  assert.equal(authorizeStaff({ ...operator, role: "factory_manager" }, "view_production_job", assigned).allowed, false);
  assert.equal(authorizeStaff({ ...operator, role: "sales_agent" }, "view_production_job", assigned).allowed, false);
});

const verifier: IdentityVerifier = {
  async verifyBearerToken(token) {
    return token === "verified-demo" ? { userId: "demo-operator", issuer: "trusted-verifier-test" } : null;
  },
};
const memberships: MembershipStore = {
  async getCurrentMembership(userId) {
    return userId === "demo-operator" ? operator : null;
  },
};

test("missing token and spoofed role cannot authorize", async () => {
  assert.equal((await authorizeBearerRequest(undefined, "view_production_job", assigned, verifier, memberships)).allowed, false);
  assert.equal((await authorizeBearerRequest("Bearer fake", "view_production_job", assigned)).allowed, false);
  assert.equal((await authorizeBearerRequest("Bearer fake", "view_production_job", assigned, verifier, memberships)).allowed, false);
  assert.equal((await authorizeBearerRequest("Bearer verified-demo", "view_production_job", assigned, verifier, memberships)).allowed, true);
});

test("lookup mismatch is denied despite valid signed-identity stub", async () => {
  const wrong: MembershipStore = { async getCurrentMembership() { return { ...operator, userId: "different" }; } };
  assert.equal((await authorizeBearerRequest("Bearer verified-demo", "view_production_job", assigned, verifier, wrong)).allowed, false);
});

test("revocation checked at authorization time, not only in JWT", async () => {
  const revoked: MembershipStore = { async getCurrentMembership() { return { ...operator, active: false }; } };
  assert.equal((await authorizeBearerRequest("Bearer verified-demo", "view_production_job", assigned, verifier, revoked)).allowed, false);
});

test("identity verifier and membership store outages fail closed", async () => {
  const unavailableIdentity: IdentityVerifier = { async verifyBearerToken() { throw new Error("offline"); } };
  const unavailableStore: MembershipStore = { async getCurrentMembership() { throw new Error("offline"); } };
  assert.equal((await authorizeBearerRequest("Bearer verified-demo", "view_production_job", assigned, unavailableIdentity, memberships)).allowed, false);
  assert.equal((await authorizeBearerRequest("Bearer verified-demo", "view_production_job", assigned, verifier, unavailableStore)).allowed, false);
});
