import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  index,
  integer,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * J04-D1-B, pending human approval of business decisions C1/C2 B–F.
 * Typed mirror of the MINIMAL isolated SQL foundation, NOT a production model.
 * Additional deferred FK, trigger, access and RLS protections are specified
 * in db/migrations/0002_j04_security_overlay.sql.
 *
 * No business prices, personal contact details, permissions, or fabrication
 * authorization fields belong to this provisional schema.
 */
export const privateSchema = pgSchema("panokit_private");

export const webOrders = privateSchema.table(
  "web_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceChannel: text("source_channel").notNull().default("PANOKIT_WEB"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("web_orders_origin_check", sql`"source_channel" = 'PANOKIT_WEB'`)],
);

export const provenanceRecords = privateSchema.table(
  "provenance_records",
  {
    orderId: uuid("order_id")
      .primaryKey()
      .references(() => webOrders.id, { onDelete: "restrict" }),
    sourceChannel: text("source_channel").notNull().default("PANOKIT_WEB"),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("provenance_origin_check", sql`"source_channel" = 'PANOKIT_WEB'`)],
);

export const orderEvents = privateSchema.table(
  "order_events",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => webOrders.id, { onDelete: "restrict" }),
    eventName: text("event_name").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("event_name_nonempty", sql`length(trim("event_name")) > 0`),
  ],
);

export const productionJobs = privateSchema.table(
  "production_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => webOrders.id, { onDelete: "restrict" }),
    factoryId: uuid("factory_id").notNull(),
    assignedOperatorUserId: uuid("assigned_operator_user_id"),
    technicalStatus: text("technical_status").notNull().default("PENDING_REVIEW"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check(
      "production_jobs_technical_status_chk",
      sql`"technical_status" IN ('PENDING_REVIEW','IN_REVIEW','NEEDS_CORRECTION','TECH_APPROVED')`,
    ),
    index("production_jobs_factory_idx").on(t.factoryId, t.technicalStatus),
  ],
);

export const transactionOutbox = privateSchema.table(
  "transaction_outbox",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => webOrders.id, { onDelete: "restrict" }),
    eventName: text("event_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    attempts: integer("attempts").notNull().default(0),
  },
  (t) => [
    check("outbox_event_limited", sql`"event_name" = 'TECH_REVIEW_REQUESTED'`),
    check("outbox_attempts_nonnegative", sql`"attempts" >= 0`),
    index("transaction_outbox_pending_idx")
      .on(t.createdAt)
      .where(sql`"delivered_at" IS NULL`),
  ],
);
