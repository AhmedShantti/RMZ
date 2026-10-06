import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_projects_blocks_image_full" ADD COLUMN "image_url" varchar;
  ALTER TABLE "portfolio_projects_blocks_gallery_two_images" ADD COLUMN "url" varchar;
  ALTER TABLE "portfolio_projects_blocks_gallery_three_images" ADD COLUMN "url" varchar;
  ALTER TABLE "portfolio_projects_blocks_mockups_images" ADD COLUMN "url" varchar;
  ALTER TABLE "portfolio_projects_blocks_before_after" ADD COLUMN "before_url" varchar;
  ALTER TABLE "portfolio_projects_blocks_before_after" ADD COLUMN "after_url" varchar;
  ALTER TABLE "portfolio_projects_blocks_video" ADD COLUMN "poster_url" varchar;
  ALTER TABLE "portfolio_projects" ADD COLUMN "cover_image_url" varchar;
  ALTER TABLE "_portfolio_projects_v_blocks_image_full" ADD COLUMN "image_url" varchar;
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_two_images" ADD COLUMN "url" varchar;
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_three_images" ADD COLUMN "url" varchar;
  ALTER TABLE "_portfolio_projects_v_blocks_mockups_images" ADD COLUMN "url" varchar;
  ALTER TABLE "_portfolio_projects_v_blocks_before_after" ADD COLUMN "before_url" varchar;
  ALTER TABLE "_portfolio_projects_v_blocks_before_after" ADD COLUMN "after_url" varchar;
  ALTER TABLE "_portfolio_projects_v_blocks_video" ADD COLUMN "poster_url" varchar;
  ALTER TABLE "_portfolio_projects_v" ADD COLUMN "version_cover_image_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_projects_blocks_image_full" DROP COLUMN "image_url";
  ALTER TABLE "portfolio_projects_blocks_gallery_two_images" DROP COLUMN "url";
  ALTER TABLE "portfolio_projects_blocks_gallery_three_images" DROP COLUMN "url";
  ALTER TABLE "portfolio_projects_blocks_mockups_images" DROP COLUMN "url";
  ALTER TABLE "portfolio_projects_blocks_before_after" DROP COLUMN "before_url";
  ALTER TABLE "portfolio_projects_blocks_before_after" DROP COLUMN "after_url";
  ALTER TABLE "portfolio_projects_blocks_video" DROP COLUMN "poster_url";
  ALTER TABLE "portfolio_projects" DROP COLUMN "cover_image_url";
  ALTER TABLE "_portfolio_projects_v_blocks_image_full" DROP COLUMN "image_url";
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_two_images" DROP COLUMN "url";
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_three_images" DROP COLUMN "url";
  ALTER TABLE "_portfolio_projects_v_blocks_mockups_images" DROP COLUMN "url";
  ALTER TABLE "_portfolio_projects_v_blocks_before_after" DROP COLUMN "before_url";
  ALTER TABLE "_portfolio_projects_v_blocks_before_after" DROP COLUMN "after_url";
  ALTER TABLE "_portfolio_projects_v_blocks_video" DROP COLUMN "poster_url";
  ALTER TABLE "_portfolio_projects_v" DROP COLUMN "version_cover_image_url";`)
}
