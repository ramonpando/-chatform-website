CREATE TABLE "ai_generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid,
	"generation_type" varchar(50) NOT NULL,
	"prompt" text NOT NULL,
	"response" jsonb NOT NULL,
	"tokens_used_input" integer NOT NULL,
	"tokens_used_output" integer NOT NULL,
	"cost_usd" integer NOT NULL,
	"latency_ms" integer,
	"model" varchar(50) DEFAULT 'gpt-4o-mini' NOT NULL,
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_gen_tenant_date_idx" ON "ai_generations" USING btree ("tenant_id","created_at");--> statement-breakpoint
CREATE INDEX "ai_gen_tenant_type_idx" ON "ai_generations" USING btree ("tenant_id","generation_type");--> statement-breakpoint
CREATE INDEX "ai_gen_created_idx" ON "ai_generations" USING btree ("created_at");