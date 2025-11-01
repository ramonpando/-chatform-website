CREATE TABLE "survey_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"survey_id" uuid NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"fingerprint" varchar(64),
	"referrer" text,
	"is_bot" boolean DEFAULT false NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "survey_views" ADD CONSTRAINT "survey_views_survey_id_surveys_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."surveys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "survey_views_survey_idx" ON "survey_views" USING btree ("survey_id");--> statement-breakpoint
CREATE INDEX "survey_views_survey_ip_idx" ON "survey_views" USING btree ("survey_id","ip_address");--> statement-breakpoint
CREATE INDEX "survey_views_fingerprint_idx" ON "survey_views" USING btree ("fingerprint");--> statement-breakpoint
CREATE INDEX "survey_views_viewed_at_idx" ON "survey_views" USING btree ("viewed_at");