CREATE TABLE "support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid,
	"ticket_number" varchar(20) NOT NULL,
	"subject" varchar(200) NOT NULL,
	"category" varchar(50) NOT NULL,
	"priority" varchar(20) NOT NULL,
	"status" varchar(50) DEFAULT 'open' NOT NULL,
	"message" text NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"user_name" varchar(255),
	"resolved_at" timestamp,
	"resolved_by" uuid,
	"resolution_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "support_tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
ALTER TABLE "tenants" ALTER COLUMN "responses_limit" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "support_tickets_tenant_idx" ON "support_tickets" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "support_tickets_user_idx" ON "support_tickets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "support_tickets_status_idx" ON "support_tickets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "support_tickets_created_idx" ON "support_tickets" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "support_tickets_number_idx" ON "support_tickets" USING btree ("ticket_number");