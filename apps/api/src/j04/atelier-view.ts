/**
 * J04: minimum-necessary factory projection and local access predicate.
 *
 * Default-deny until a validated NestJS guard checks current role/assignment
 * against the authoritative database (including revocation). This helper
 * does NOT itself authenticate a caller and is not a substitute for SQL GRANT/RLS.
 */
import {
  evaluateProductionRelease,
  type ProductionReleaseEvidence,
} from "./production-policy";

export type FactoryViewer = Readonly<{
  userId: string;
  factoryId: string;
  role: "factory_operator" | "factory_manager" | "sales_agent" | "digital_auditor";
  active: boolean;
}>;

export type PrivateProductionJob = Readonly<{
  jobId: string;
  factoryId: string;
  assignedOperatorUserIds: readonly string[];
  orderReference: string;
  modelCode: string;
  homologatedFormatReference: string;
  quantity: number;
  technicalStatus: string;
  productionStatus: string;
  releaseEvidence: ProductionReleaseEvidence;
  // Deliberately model sensitive fields to prove they never enter the view:
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  priceTtcMad?: string;
  marginMad?: string;
  originChannel?: string;
}>;

export type FactoryJobView = Readonly<{
  jobId: string;
  orderReference: string;
  modelCode: string;
  homologatedFormatReference: string;
  quantity: number;
  technicalStatus: string;
  productionStatus: string;
  fabricationAuthorized: boolean;
}>;

export function projectAssignedFactoryJob(
  job: PrivateProductionJob,
  viewer: FactoryViewer,
): FactoryJobView | null {
  // Factory-manager privileges and cross-assignment access await RBAC signoff.
  if (
    viewer.active !== true ||
    viewer.role !== "factory_operator" ||
    !viewer.userId ||
    !viewer.factoryId ||
    viewer.factoryId !== job.factoryId ||
    !job.assignedOperatorUserIds.includes(viewer.userId)
  ) {
    return null;
  }

  return {
    jobId: job.jobId,
    orderReference: job.orderReference,
    modelCode: job.modelCode,
    homologatedFormatReference: job.homologatedFormatReference,
    quantity: job.quantity,
    technicalStatus: job.technicalStatus,
    productionStatus: job.productionStatus,
    fabricationAuthorized: evaluateProductionRelease(job.releaseEvidence).authorized,
  };
}
