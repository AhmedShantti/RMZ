import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_sections_client_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "home_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_work_enabled" boolean DEFAULT true,
  	"featured_work_kicker" varchar DEFAULT 'Selected work',
  	"featured_work_heading" varchar DEFAULT 'Work we are proud of',
  	"featured_work_button_label" varchar DEFAULT 'See all work',
  	"featured_work_button_link" varchar DEFAULT '/portfolio',
  	"client_logos_enabled" boolean DEFAULT true,
  	"client_logos_heading" varchar DEFAULT 'Brands we have built with',
  	"cta_banner_enabled" boolean DEFAULT true,
  	"cta_banner_kicker" varchar DEFAULT 'Have a project in mind?',
  	"cta_banner_heading" varchar DEFAULT 'Let’s make something bold.',
  	"cta_banner_text" varchar,
  	"cta_banner_button_label" varchar DEFAULT 'Start a project',
  	"cta_banner_button_link" varchar DEFAULT '/contact',
  	"cta_banner_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_sections_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"portfolio_projects_id" integer
  );
  
  ALTER TABLE "home_sections_client_logos_logos" ADD CONSTRAINT "home_sections_client_logos_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_sections_client_logos_logos" ADD CONSTRAINT "home_sections_client_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_sections" ADD CONSTRAINT "home_sections_cta_banner_image_id_media_id_fk" FOREIGN KEY ("cta_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_sections_rels" ADD CONSTRAINT "home_sections_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_sections_rels" ADD CONSTRAINT "home_sections_rels_portfolio_projects_fk" FOREIGN KEY ("portfolio_projects_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_sections_client_logos_logos_order_idx" ON "home_sections_client_logos_logos" USING btree ("_order");
  CREATE INDEX "home_sections_client_logos_logos_parent_id_idx" ON "home_sections_client_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "home_sections_client_logos_logos_logo_idx" ON "home_sections_client_logos_logos" USING btree ("logo_id");
  CREATE INDEX "home_sections_cta_banner_cta_banner_image_idx" ON "home_sections" USING btree ("cta_banner_image_id");
  CREATE INDEX "home_sections_rels_order_idx" ON "home_sections_rels" USING btree ("order");
  CREATE INDEX "home_sections_rels_parent_idx" ON "home_sections_rels" USING btree ("parent_id");
  CREATE INDEX "home_sections_rels_path_idx" ON "home_sections_rels" USING btree ("path");
  CREATE INDEX "home_sections_rels_portfolio_projects_id_idx" ON "home_sections_rels" USING btree ("portfolio_projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_sections_client_logos_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_sections_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_sections_client_logos_logos" CASCADE;
  DROP TABLE "home_sections" CASCADE;
  DROP TABLE "home_sections_rels" CASCADE;`)
}

