ALTER TABLE "tenants" ADD COLUMN "twilio_content_sid" varchar(100);--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "twilio_content_variables" jsonb;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "whatsapp_provider" varchar(50) DEFAULT 'chatform';