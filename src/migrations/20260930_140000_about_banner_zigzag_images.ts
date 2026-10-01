import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_content" ADD COLUMN "banner_image_id" integer;
  ALTER TABLE "about_content" ADD COLUMN "banner_alt" varchar;
  ALTER TABLE "about_content" ADD COLUMN "banner_focal_x" numeric DEFAULT 50;
  ALTER TABLE "about_content" ADD COLUMN "banner_focal_y" numeric DEFAULT 50;
  ALTER TABLE "about_content_sections" ADD COLUMN "image_id" integer;
  ALTER TABLE "about_content_sections" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "about_content_sections" ADD COLUMN "focal_x" numeric DEFAULT 50;
  ALTER TABLE "about_content_sections" ADD COLUMN "focal_y" numeric DEFAULT 50;
  ALTER TABLE "about_content" ADD CONSTRAINT "about_content_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_content_sections" ADD CONSTRAINT "about_content_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_content_banner_image_idx" ON "about_content" USING btree ("banner_image_id");
  CREATE INDEX "about_content_sections_image_idx" ON "about_content_sections" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_content" DROP CONSTRAINT "about_content_banner_image_id_media_id_fk";
  ALTER TABLE "about_content_sections" DROP CONSTRAINT "about_content_sections_image_id_media_id_fk";

  DROP INDEX "about_content_banner_image_idx";
  DROP INDEX "about_content_sections_image_idx";
  ALTER TABLE "about_content" DROP COLUMN "banner_image_id";
  ALTER TABLE "about_content" DROP COLUMN "banner_alt";
  ALTER TABLE "about_content" DROP COLUMN "banner_focal_x";
  ALTER TABLE "about_content" DROP COLUMN "banner_focal_y";
  ALTER TABLE "about_content_sections" DROP COLUMN "image_id";
  ALTER TABLE "about_content_sections" DROP COLUMN "image_alt";
  ALTER TABLE "about_content_sections" DROP COLUMN "focal_x";
  ALTER TABLE "about_content_sections" DROP COLUMN "focal_y";`)
}
