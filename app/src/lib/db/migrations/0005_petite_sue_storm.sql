CREATE TABLE "whatsapp_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"message" text NOT NULL,
	"variables" jsonb DEFAULT '[]' NOT NULL,
	"category" varchar(50) DEFAULT 'custom' NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"whatsapp_template_id" varchar(100),
	"rejection_reason" text,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"estimated_response_rate" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "whatsapp_templates" ADD CONSTRAINT "whatsapp_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "whatsapp_templates_tenant_idx" ON "whatsapp_templates" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "whatsapp_templates_status_idx" ON "whatsapp_templates" USING btree ("status");--> statement-breakpoint
CREATE INDEX "whatsapp_templates_template_id_idx" ON "whatsapp_templates" USING btree ("whatsapp_template_id");