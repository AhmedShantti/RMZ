import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_content_stairs" ADD COLUMN "title" varchar;
  ALTER TABLE "home_content_showreel_videos" ADD COLUMN "hd_video_id" integer;
  ALTER TABLE "home_content_showreel_videos" ADD COLUMN "poster_id" integer;
  ALTER TABLE "home_content_showreel_videos" ADD CONSTRAINT "home_content_showreel_videos_hd_video_id_media_id_fk" FOREIGN KEY ("hd_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_content_showreel_videos" ADD CONSTRAINT "home_content_showreel_videos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_content_showreel_videos_hd_video_idx" ON "home_content_showreel_videos" USING btree ("hd_video_id");
  CREATE INDEX "home_content_showreel_videos_poster_idx" ON "home_content_showreel_videos" USING btree ("poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_content_showreel_videos" DROP CONSTRAINT "home_content_showreel_videos_hd_video_id_media_id_fk";
  ALTER TABLE "home_content_showreel_videos" DROP CONSTRAINT "home_content_showreel_videos_poster_id_media_id_fk";

  DROP INDEX "home_content_showreel_videos_hd_video_idx";
  DROP INDEX "home_content_showreel_videos_poster_idx";
  ALTER TABLE "home_content_showreel_videos" DROP COLUMN "hd_video_id";
  ALTER TABLE "home_content_showreel_videos" DROP COLUMN "poster_id";
  ALTER TABLE "home_content_stairs" DROP COLUMN "title";`)
}
