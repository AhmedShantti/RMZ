import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_content_stairs_title_size" AS ENUM('small', 'medium', 'large', 'xl');
  CREATE TYPE "public"."enum_home_content_stairs_offset" AS ENUM('tight', 'normal', 'wide');
  CREATE TYPE "public"."enum_home_content_stairs_aspect_ratio" AS ENUM('3:4', '4:5', '1:1', '16:9');
  CREATE TYPE "public"."enum_home_content_showreel_aspect_ratio" AS ENUM('16:9', '21:9', '4:5', 'source');
  CREATE TYPE "public"."enum_home_content_showreel_object_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum_home_content_showreel_transition_speed" AS ENUM('fast', 'normal', 'slow');
  CREATE TYPE "public"."enum_home_content_showreel_scroll_per_video" AS ENUM('short', 'normal', 'long');
  CREATE TYPE "public"."enum_home_content_stairs_image_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right');
  ALTER TABLE "home_content" ADD COLUMN "stairs_title_size" "public"."enum_home_content_stairs_title_size" DEFAULT 'large';
  ALTER TABLE "home_content" ADD COLUMN "stairs_title_uppercase" boolean DEFAULT true;
  ALTER TABLE "home_content" ADD COLUMN "stairs_title_opacity" numeric DEFAULT 0.6;
  ALTER TABLE "home_content" ADD COLUMN "stairs_image_scale" numeric DEFAULT 125;
  ALTER TABLE "home_content" ADD COLUMN "stairs_offset" "public"."enum_home_content_stairs_offset" DEFAULT 'normal';
  ALTER TABLE "home_content" ADD COLUMN "stairs_aspect_ratio" "public"."enum_home_content_stairs_aspect_ratio" DEFAULT '3:4';
  ALTER TABLE "home_content" ADD COLUMN "showreel_video_width" numeric DEFAULT 91;
  ALTER TABLE "home_content" ADD COLUMN "showreel_aspect_ratio" "public"."enum_home_content_showreel_aspect_ratio" DEFAULT '16:9';
  ALTER TABLE "home_content" ADD COLUMN "showreel_object_fit" "public"."enum_home_content_showreel_object_fit" DEFAULT 'cover';
  ALTER TABLE "home_content" ADD COLUMN "showreel_show_counter" boolean DEFAULT true;
  ALTER TABLE "home_content" ADD COLUMN "showreel_show_dots" boolean DEFAULT true;
  ALTER TABLE "home_content" ADD COLUMN "showreel_show_captions" boolean DEFAULT true;
  ALTER TABLE "home_content" ADD COLUMN "showreel_transition_speed" "public"."enum_home_content_showreel_transition_speed" DEFAULT 'normal';
  ALTER TABLE "home_content" ADD COLUMN "showreel_scroll_per_video" "public"."enum_home_content_showreel_scroll_per_video" DEFAULT 'normal';
  ALTER TABLE "home_content_stairs" ADD COLUMN "alt" varchar;
  ALTER TABLE "home_content_stairs" ADD COLUMN "image_position" "public"."enum_home_content_stairs_image_position" DEFAULT 'center';
  ALTER TABLE "home_content_stairs" ADD COLUMN "show_title" boolean DEFAULT true;
  ALTER TABLE "home_content_showreel_videos" ADD COLUMN "aria_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_content_showreel_videos" DROP COLUMN "aria_label";
  ALTER TABLE "home_content_stairs" DROP COLUMN "show_title";
  ALTER TABLE "home_content_stairs" DROP COLUMN "image_position";
  ALTER TABLE "home_content_stairs" DROP COLUMN "alt";
  ALTER TABLE "home_content" DROP COLUMN "showreel_scroll_per_video";
  ALTER TABLE "home_content" DROP COLUMN "showreel_transition_speed";
  ALTER TABLE "home_content" DROP COLUMN "showreel_show_captions";
  ALTER TABLE "home_content" DROP COLUMN "showreel_show_dots";
  ALTER TABLE "home_content" DROP COLUMN "showreel_show_counter";
  ALTER TABLE "home_content" DROP COLUMN "showreel_object_fit";
  ALTER TABLE "home_content" DROP COLUMN "showreel_aspect_ratio";
  ALTER TABLE "home_content" DROP COLUMN "showreel_video_width";
  ALTER TABLE "home_content" DROP COLUMN "stairs_aspect_ratio";
  ALTER TABLE "home_content" DROP COLUMN "stairs_offset";
  ALTER TABLE "home_content" DROP COLUMN "stairs_image_scale";
  ALTER TABLE "home_content" DROP COLUMN "stairs_title_opacity";
  ALTER TABLE "home_content" DROP COLUMN "stairs_title_uppercase";
  ALTER TABLE "home_content" DROP COLUMN "stairs_title_size";
  DROP TYPE "public"."enum_home_content_stairs_image_position";
  DROP TYPE "public"."enum_home_content_showreel_scroll_per_video";
  DROP TYPE "public"."enum_home_content_showreel_transition_speed";
  DROP TYPE "public"."enum_home_content_showreel_object_fit";
  DROP TYPE "public"."enum_home_content_showreel_aspect_ratio";
  DROP TYPE "public"."enum_home_content_stairs_aspect_ratio";
  DROP TYPE "public"."enum_home_content_stairs_offset";
  DROP TYPE "public"."enum_home_content_stairs_title_size";`)
}
