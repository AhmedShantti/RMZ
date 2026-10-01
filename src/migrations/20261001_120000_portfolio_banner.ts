import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_content" ADD COLUMN "banner_image_id" integer;
  ALTER TABLE "portfolio_content" ADD COLUMN "banner_alt" varchar;
  ALTER TABLE "portfolio_content" ADD COLUMN "banner_focal_x" numeric DEFAULT 50;
  ALTER TABLE "portfolio_content" ADD COLUMN "banner_focal_y" numeric DEFAULT 50;
  ALTER TABLE "portfolio_content" ADD COLUMN "banner_title" varchar;
  ALTER TABLE "portfolio_content" ADD CONSTRAINT "portfolio_content_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "portfolio_content_banner_image_idx" ON "portfolio_content" USING btree ("banner_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_content" DROP CONSTRAINT "portfolio_content_banner_image_id_media_id_fk";

  DROP INDEX "portfolio_content_banner_image_idx";
  ALTER TABLE "portfolio_content" DROP COLUMN "banner_image_id";
  ALTER TABLE "portfolio_content" DROP COLUMN "banner_alt";
  ALTER TABLE "portfolio_content" DROP COLUMN "banner_focal_x";
  ALTER TABLE "portfolio_content" DROP COLUMN "banner_focal_y";
  ALTER TABLE "portfolio_content" DROP COLUMN "banner_title";`)
}
