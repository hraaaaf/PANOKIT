import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  assertNoClientOrigin,
  evaluateProductionRelease,
  PANOKIT_WEB_ORIGIN,
  type ProductionReleaseEvidence,
} from "./j04/production-policy";
import {
  projectAssignedFactoryJob,
  type FactoryViewer,
  type PrivateProductionJob,
} from "./j04/atelier-view";

const valid: ProductionReleaseEvidence = {
  formatHomologated: true,
  technicalApproved: true,
  latestBatRevision: "BAT-002",
  customerAcceptedBatRevision: "BAT-002",
  customerConsentVerified: true,
  commercialClearance: true,
  suspensionCleared: true,
};

const viewer: FactoryViewer = {
  userId: "operator-demo",
  factoryId: "factory-A",
  role: "factory_operator",
  active: true,
};

const job: PrivateProductionJob = {
  jobId: "DEMO-001",
  factoryId: "factory-A",
  assignedOperatorUserIds: ["operator-demo"],
  orderReference: "PANOKIT-DEMO-001",
  modelCode: "CAISSON",
  homologatedFormatReference: "FORMAT-DEMO",
  quantity: 1,
  technicalStatus: "APPROVED",
  productionStatus: "NOT_STARTED",
  releaseEvidence: valid,
  customerName: "PRIVATE_NAME",
  customerPhone: "PRIVATE_PHONE",
  customerAddress: "PRIVATE_ADDRESS",
  priceTtcMad: "PRIVATE_PRICE",
  marginMad: "PRIVATE_MARGIN",
  originChannel: PANOKIT_WEB_ORIGIN,
};

test("T01: client-supplied origin is rejected even if it matches the real origin", () => {
  assert.equal(PANOKIT_WEB_ORIGIN, "PANOKIT_WEB");
  assert.doesNotThrow(() => assertNoClientOrigin({ selectedProduct: "CAISSON" }));
  for (const key of ["origin", "origin_channel", "source_channel"]) {
    assert.throws(
      () => assertNoClientOrigin({ [key]: "PANOKIT_WEB" }),
      /CLIENT_ORIGIN_FORBIDDEN/,
    );
  }
});

test("production release requires every server-side prerequisite", () => {
  assert.deepEqual(evaluateProductionRelease(valid), { authorized: true, blockers: [] });
});

test("technical acceptance alone NEVER authorizes fabrication", () => {
  const result = evaluateProductionRelease({ technicalApproved: true });
  assert.equal(result.authorized, false);
  assert.ok(result.blockers.includes("LATEST_BAT_NOT_ACCEPTED"));
  assert.ok(result.blockers.includes("COMMERCIAL_CLEARANCE_MISSING"));
});

test("any missing or false evidence fails closed", () => {
  for (const field of [
    "formatHomologated",
    "technicalApproved",
    "customerConsentVerified",
    "commercialClearance",
    "suspensionCleared",
  ] as const) {
    assert.equal(evaluateProductionRelease({ ...valid, [field]: false }).authorized, false, field);
    assert.equal(evaluateProductionRelease({ ...valid, [field]: undefined }).authorized, false, field);
  }
});

test("changed BAT revokes earlier fabrication clearance", () => {
  const changedBat = evaluateProductionRelease({ ...valid, latestBatRevision: "BAT-003" });
  assert.equal(changedBat.authorized, false);
  assert.ok(changedBat.blockers.includes("LATEST_BAT_NOT_ACCEPTED"));
});

test("empty, mismatched or absent BAT revision fails closed", () => {
  for (const latestBatRevision of ["", undefined, "BAT-004"]) {
    const result = evaluateProductionRelease({ ...valid, latestBatRevision });
    assert.equal(result.authorized, false);
  }
});

test("atelier only sees own assigned job with minimal fields", () => {
  const view = projectAssignedFactoryJob(job, viewer);
  assert.ok(view);
  assert.deepEqual(Object.keys(view).sort(), [
    "fabricationAuthorized", "homologatedFormatReference", "jobId",
    "modelCode", "orderReference", "productionStatus", "quantity", "technicalStatus",
  ].sort());
  const serialized = JSON.stringify(view);
  for (const sensitive of ["PRIVATE_NAME", "PRIVATE_PHONE", "PRIVATE_ADDRESS", "PRIVATE_PRICE", "PRIVATE_MARGIN", "PANOKIT_WEB"]) {
    assert.equal(serialized.includes(sensitive), false, sensitive);
  }
});

test("T03: no inter-factory access or unassigned dossier", () => {
  assert.equal(projectAssignedFactoryJob(job, { ...viewer, factoryId: "factory-B" }), null);
  assert.equal(projectAssignedFactoryJob(job, { ...viewer, userId: "other-user" }), null);
});

test("revoked and non-operator identities are denied", () => {
  assert.equal(projectAssignedFactoryJob(job, { ...viewer, active: false }), null);
  assert.equal(projectAssignedFactoryJob(job, { ...viewer, role: "factory_manager" }), null);
  assert.equal(projectAssignedFactoryJob(job, { ...viewer, role: "sales_agent" }), null);
  assert.equal(projectAssignedFactoryJob(job, { ...viewer, role: "digital_auditor" }), null);
});

test("factory view never trusts a stale fabrication authorization", () => {
  const updated = projectAssignedFactoryJob(
    { ...job, releaseEvidence: { ...valid, latestBatRevision: "BAT-003" } },
    viewer,
  );
  assert.ok(updated);
  assert.equal(updated.fabricationAuthorized, false);
});

test("empty IDs and missing assignment fail closed", () => {
  assert.equal(projectAssignedFactoryJob(job, { ...viewer, userId: "" }), null);
  assert.equal(projectAssignedFactoryJob(job, { ...viewer, factoryId: "" }), null);
  assert.equal(projectAssignedFactoryJob({ ...job, assignedOperatorUserIds: [] }, viewer), null);
});
