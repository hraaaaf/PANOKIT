CREATE SCHEMA "panokit_private";
--> statement-breakpoint
CREATE TABLE "panokit_private"."order_events" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "panokit_private"."order_events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"order_id" uuid NOT NULL,
	"event_name" text NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_name_nonempty" CHECK (length(trim("event_name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "panokit_private"."production_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"factory_id" uuid NOT NULL,
	"assigned_operator_user_id" uuid,
	"technical_status" text DEFAULT 'PENDING_REVIEW' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "production_jobs_technical_status_chk" CHECK ("technical_status" IN ('PENDING_REVIEW','IN_REVIEW','NEEDS_CORRECTION','TECH_APPROVED'))
);
--> statement-breakpoint
CREATE TABLE "panokit_private"."provenance_records" (
	"order_id" uuid PRIMARY KEY NOT NULL,
	"source_channel" text DEFAULT 'PANOKIT_WEB' NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "provenance_origin_check" CHECK ("source_channel" = 'PANOKIT_WEB')
);
--> statement-breakpoint
CREATE TABLE "panokit_private"."transaction_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"event_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"delivered_at" timestamp with time zone,
	"attempts" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "outbox_event_limited" CHECK ("event_name" = 'TECH_REVIEW_REQUESTED'),
	CONSTRAINT "outbox_attempts_nonnegative" CHECK ("attempts" >= 0)
);
--> statement-breakpoint
CREATE TABLE "panokit_private"."web_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_channel" text DEFAULT 'PANOKIT_WEB' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "web_orders_origin_check" CHECK ("source_channel" = 'PANOKIT_WEB')
);
--> statement-breakpoint
ALTER TABLE "panokit_private"."order_events" ADD CONSTRAINT "order_events_order_id_web_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "panokit_private"."web_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "panokit_private"."production_jobs" ADD CONSTRAINT "production_jobs_order_id_web_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "panokit_private"."web_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "panokit_private"."provenance_records" ADD CONSTRAINT "provenance_records_order_id_web_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "panokit_private"."web_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "panokit_private"."transaction_outbox" ADD CONSTRAINT "transaction_outbox_order_id_web_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "panokit_private"."web_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "production_jobs_factory_idx" ON "panokit_private"."production_jobs" USING btree ("factory_id","technical_status");--> statement-breakpoint
CREATE INDEX "transaction_outbox_pending_idx" ON "panokit_private"."transaction_outbox" USING btree ("created_at") WHERE "delivered_at" IS NULL;