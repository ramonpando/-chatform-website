ALTER TABLE "surveys" ADD COLUMN "brand_color" varchar(7) DEFAULT '#2563eb';--> statement-breakpoint
ALTER TABLE "surveys" ADD COLUMN "accent_color" varchar(7) DEFAULT '#06b6d4';--> statement-breakpoint
ALTER TABLE "surveys" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "surveys" ADD COLUMN "custom_styles" jsonb;