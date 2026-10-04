import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "bts_content_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"label" varchar,
  	"card_image_id" integer NOT NULL,
  	"video_id" integer NOT NULL,
  	"poster_id" integer,
  	"description" varchar
  );
  
  CREATE TABLE "bts_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Behind the scenes',
  	"lede" varchar,
  	"home_heading" varchar DEFAULT 'Behind The Scenes',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "bts_content_items" ADD CONSTRAINT "bts_content_items_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bts_content_items" ADD CONSTRAINT "bts_content_items_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bts_content_items" ADD CONSTRAINT "bts_content_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bts_content_items" ADD CONSTRAINT "bts_content_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."bts_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bts_content" ADD CONSTRAINT "bts_content_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "bts_content_items_order_idx" ON "bts_content_items" USING btree ("_order");
  CREATE INDEX "bts_content_items_parent_id_idx" ON "bts_content_items" USING btree ("_parent_id");
  CREATE INDEX "bts_content_items_card_image_idx" ON "bts_content_items" USING btree ("card_image_id");
  CREATE INDEX "bts_content_items_video_idx" ON "bts_content_items" USING btree ("video_id");
  CREATE INDEX "bts_content_items_poster_idx" ON "bts_content_items" USING btree ("poster_id");
  CREATE INDEX "bts_content_seo_seo_og_image_idx" ON "bts_content" USING btree ("seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "bts_content_items" CASCADE;
  DROP TABLE "bts_content" CASCADE;`)
}
