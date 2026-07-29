import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_image_full_image_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_gallery_two_images_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_gallery_three_images_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_mockups_images_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_mockups_kind" AS ENUM('mobile', 'desktop', 'branding', 'packaging', 'social', 'campaign');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_before_after_before_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_before_after_after_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_video_poster_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum_portfolio_projects_cover_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum_portfolio_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_image_full_image_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_gallery_two_images_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_gallery_three_images_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_mockups_images_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_mockups_kind" AS ENUM('mobile', 'desktop', 'branding', 'packaging', 'social', 'campaign');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_before_after_before_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_before_after_after_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_video_poster_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_cover_ratio" AS ENUM('21/9', '16/9', '3/2', '4/3', '1/1', '4/5', '9/16');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_career_roles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__career_roles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_menu_items_route" AS ENUM('/', '/about', '/services', '/portfolio', '/careers', '/contact', '/privacy', '/terms');
  CREATE TYPE "public"."enum_site_settings_lets_chat_target" AS ENUM('/', '/about', '/services', '/portfolio', '/careers', '/contact', '/privacy', '/terms');
  CREATE TYPE "public"."enum_home_content_hero_statement_style" AS ENUM('normal', 'italic', 'bold', 'bold-italic');
  CREATE TYPE "public"."enum_home_content_hero_statement_tone" AS ENUM('cream', 'dim', 'red');
  CREATE TYPE "public"."enum_home_content_clients_badge_accent" AS ENUM('none', 'orange', 'green');
  CREATE TYPE "public"."enum_about_content_page_title_style" AS ENUM('normal', 'italic', 'bold', 'bold-italic');
  CREATE TYPE "public"."enum_about_content_page_title_tone" AS ENUM('cream', 'dim', 'red');
  CREATE TYPE "public"."enum_about_content_closing_statement_style" AS ENUM('normal', 'italic', 'bold', 'bold-italic');
  CREATE TYPE "public"."enum_about_content_closing_statement_tone" AS ENUM('cream', 'dim', 'red');
  CREATE TYPE "public"."enum_services_content_page_title_style" AS ENUM('normal', 'italic', 'bold', 'bold-italic');
  CREATE TYPE "public"."enum_services_content_page_title_tone" AS ENUM('cream', 'dim', 'red');
  CREATE TYPE "public"."enum_contact_content_hero_story_style" AS ENUM('normal', 'italic', 'bold', 'bold-italic');
  CREATE TYPE "public"."enum_contact_content_hero_story_tone" AS ENUM('cream', 'dim', 'red');
  CREATE TYPE "public"."enum_careers_content_page_title_style" AS ENUM('normal', 'italic', 'bold', 'bold-italic');
  CREATE TYPE "public"."enum_careers_content_page_title_tone" AS ENUM('cream', 'dim', 'red');
  CREATE TYPE "public"."enum_portfolio_content_page_title_style" AS ENUM('normal', 'italic', 'bold', 'bold-italic');
  CREATE TYPE "public"."enum_portfolio_content_page_title_tone" AS ENUM('cream', 'dim', 'red');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "portfolio_projects_blocks_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"idea" varchar,
  	"goal" varchar,
  	"challenge" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_image_full" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_image_id" integer,
  	"image_ratio" "enum_portfolio_projects_blocks_image_full_image_ratio",
  	"image_caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_gallery_two_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"ratio" "enum_portfolio_projects_blocks_gallery_two_images_ratio",
  	"caption" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_gallery_two" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_gallery_three_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"ratio" "enum_portfolio_projects_blocks_gallery_three_images_ratio",
  	"caption" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_gallery_three" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_mockups_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"ratio" "enum_portfolio_projects_blocks_mockups_images_ratio",
  	"caption" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_mockups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kind" "enum_portfolio_projects_blocks_mockups_kind" DEFAULT 'branding',
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_text_break" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"before_image_id" integer,
  	"before_ratio" "enum_portfolio_projects_blocks_before_after_before_ratio",
  	"before_caption" varchar,
  	"after_image_id" integer,
  	"after_ratio" "enum_portfolio_projects_blocks_before_after_after_ratio",
  	"after_caption" varchar,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"url" varchar,
  	"poster_image_id" integer,
  	"poster_ratio" "enum_portfolio_projects_blocks_video_poster_ratio",
  	"poster_caption" varchar,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_summary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"quote" varchar,
  	"quote_author" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"client" varchar,
  	"market" varchar,
  	"discipline" varchar,
  	"year" varchar,
  	"result_line" varchar,
  	"cover_image_id" integer,
  	"cover_ratio" "enum_portfolio_projects_cover_ratio" DEFAULT '16/9',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_portfolio_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_overview" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"idea" varchar,
  	"goal" varchar,
  	"challenge" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_image_full" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_image_id" integer,
  	"image_ratio" "enum__portfolio_projects_v_blocks_image_full_image_ratio",
  	"image_caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_gallery_two_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"ratio" "enum__portfolio_projects_v_blocks_gallery_two_images_ratio",
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_gallery_two" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_gallery_three_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"ratio" "enum__portfolio_projects_v_blocks_gallery_three_images_ratio",
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_gallery_three" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_mockups_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"ratio" "enum__portfolio_projects_v_blocks_mockups_images_ratio",
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_mockups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kind" "enum__portfolio_projects_v_blocks_mockups_kind" DEFAULT 'branding',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_text_break" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"before_image_id" integer,
  	"before_ratio" "enum__portfolio_projects_v_blocks_before_after_before_ratio",
  	"before_caption" varchar,
  	"after_image_id" integer,
  	"after_ratio" "enum__portfolio_projects_v_blocks_before_after_after_ratio",
  	"after_caption" varchar,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"url" varchar,
  	"poster_image_id" integer,
  	"poster_ratio" "enum__portfolio_projects_v_blocks_video_poster_ratio",
  	"poster_caption" varchar,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_summary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"quote" varchar,
  	"quote_author" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_client" varchar,
  	"version_market" varchar,
  	"version_discipline" varchar,
  	"version_year" varchar,
  	"version_result_line" varchar,
  	"version_cover_image_id" integer,
  	"version_cover_ratio" "enum__portfolio_projects_v_version_cover_ratio" DEFAULT '16/9',
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__portfolio_projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "career_roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"type" varchar,
  	"location" varchar,
  	"description" varchar,
  	"apply_target" varchar DEFAULT '/contact',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_career_roles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_career_roles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_type" varchar,
  	"version_location" varchar,
  	"version_description" varchar,
  	"version_apply_target" varchar DEFAULT '/contact',
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__career_roles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"company" varchar,
  	"phone" varchar,
  	"country" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"portfolio_projects_id" integer,
  	"career_roles_id" integer,
  	"contact_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"route" "enum_site_settings_menu_items_route" NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"short_name" varchar NOT NULL,
  	"idea_tagline" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"lets_chat_label" varchar DEFAULT 'Let’s chat',
  	"lets_chat_target" "enum_site_settings_lets_chat_target" DEFAULT '/contact',
  	"footer_credit" varchar,
  	"seo_title_template" varchar,
  	"seo_default_title" varchar,
  	"seo_default_description" varchar,
  	"seo_default_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_content_hero_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"style" "enum_home_content_hero_statement_style" DEFAULT 'normal' NOT NULL,
  	"tone" "enum_home_content_hero_statement_tone" DEFAULT 'cream' NOT NULL,
  	"upper" boolean DEFAULT false,
  	"no_space_before" boolean DEFAULT false
  );
  
  CREATE TABLE "home_content_showreel_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "home_content_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"badge_name" varchar,
  	"badge_accent" "enum_home_content_clients_badge_accent" DEFAULT 'none'
  );
  
  CREATE TABLE "home_content_client_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "home_content_stairs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"paragraph" varchar NOT NULL
  );
  
  CREATE TABLE "home_content_marquee_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer
  );
  
  CREATE TABLE "home_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_intro_loader" boolean DEFAULT true,
  	"hero_kicker" varchar DEFAULT 'Creative Rebellion',
  	"hero_subline" varchar,
  	"clients_heading" varchar DEFAULT 'Clients',
  	"teaser_cta_label" varchar DEFAULT 'Start a project',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_content_page_title" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"style" "enum_about_content_page_title_style" DEFAULT 'normal' NOT NULL,
  	"tone" "enum_about_content_page_title_tone" DEFAULT 'cream' NOT NULL,
  	"upper" boolean DEFAULT false,
  	"no_space_before" boolean DEFAULT false
  );
  
  CREATE TABLE "about_content_sections_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_content_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "about_content_closing_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"style" "enum_about_content_closing_statement_style" DEFAULT 'normal' NOT NULL,
  	"tone" "enum_about_content_closing_statement_tone" DEFAULT 'cream' NOT NULL,
  	"upper" boolean DEFAULT false,
  	"no_space_before" boolean DEFAULT false
  );
  
  CREATE TABLE "about_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lede" varchar,
  	"color_palette_line1" varchar DEFAULT 'COLORPALATTE balances',
  	"color_palette_line2_lead" varchar DEFAULT 'BOLD',
  	"color_palette_line2_rest" varchar DEFAULT 'EXPRESSION',
  	"color_palette_line3" varchar DEFAULT 'with Professional Presence',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_content_page_title" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"style" "enum_services_content_page_title_style" DEFAULT 'normal' NOT NULL,
  	"tone" "enum_services_content_page_title_tone" DEFAULT 'cream' NOT NULL,
  	"upper" boolean DEFAULT false,
  	"no_space_before" boolean DEFAULT false
  );
  
  CREATE TABLE "services_content_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "services_content_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "services_content_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"blurb" varchar NOT NULL,
  	"work_image_id" integer,
  	"featured_on_home" boolean DEFAULT true
  );
  
  CREATE TABLE "services_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lede" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_content_hero_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"style" "enum_contact_content_hero_story_style" DEFAULT 'normal' NOT NULL,
  	"tone" "enum_contact_content_hero_story_tone" DEFAULT 'cream' NOT NULL,
  	"upper" boolean DEFAULT false,
  	"no_space_before" boolean DEFAULT false
  );
  
  CREATE TABLE "contact_content_markets_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "contact_content_markets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"is_highlighted" boolean DEFAULT false,
  	"blurb" varchar,
  	"contact_line" varchar
  );
  
  CREATE TABLE "contact_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lede" varchar,
  	"where_we_work_label" varchar DEFAULT 'Where we work',
  	"form_recipient_email" varchar,
  	"form_submit_label" varchar DEFAULT 'Send it',
  	"form_success_heading" varchar,
  	"form_success_body" varchar,
  	"form_error_summary" varchar,
  	"form_field_errors_name_required" varchar,
  	"form_field_errors_email_required" varchar,
  	"form_field_errors_email_invalid" varchar,
  	"form_field_errors_message_required" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "careers_content_page_title" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"style" "enum_careers_content_page_title_style" DEFAULT 'normal' NOT NULL,
  	"tone" "enum_careers_content_page_title_tone" DEFAULT 'cream' NOT NULL,
  	"upper" boolean DEFAULT false,
  	"no_space_before" boolean DEFAULT false
  );
  
  CREATE TABLE "careers_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lede" varchar,
  	"open_application_heading" varchar,
  	"cta_label" varchar,
  	"cta_target" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "portfolio_content_page_title" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"style" "enum_portfolio_content_page_title_style" DEFAULT 'normal' NOT NULL,
  	"tone" "enum_portfolio_content_page_title_tone" DEFAULT 'cream' NOT NULL,
  	"upper" boolean DEFAULT false,
  	"no_space_before" boolean DEFAULT false
  );
  
  CREATE TABLE "portfolio_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lede" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "legal_privacy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"last_updated" varchar,
  	"show_template_notice" boolean DEFAULT true,
  	"intro" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "legal_terms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"last_updated" varchar,
  	"show_template_notice" boolean DEFAULT true,
  	"intro" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_overview" ADD CONSTRAINT "portfolio_projects_blocks_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_services_items" ADD CONSTRAINT "portfolio_projects_blocks_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_services" ADD CONSTRAINT "portfolio_projects_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_image_full" ADD CONSTRAINT "portfolio_projects_blocks_image_full_image_image_id_media_id_fk" FOREIGN KEY ("image_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_image_full" ADD CONSTRAINT "portfolio_projects_blocks_image_full_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_gallery_two_images" ADD CONSTRAINT "portfolio_projects_blocks_gallery_two_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_gallery_two_images" ADD CONSTRAINT "portfolio_projects_blocks_gallery_two_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects_blocks_gallery_two"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_gallery_two" ADD CONSTRAINT "portfolio_projects_blocks_gallery_two_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_gallery_three_images" ADD CONSTRAINT "portfolio_projects_blocks_gallery_three_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_gallery_three_images" ADD CONSTRAINT "portfolio_projects_blocks_gallery_three_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects_blocks_gallery_three"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_gallery_three" ADD CONSTRAINT "portfolio_projects_blocks_gallery_three_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_mockups_images" ADD CONSTRAINT "portfolio_projects_blocks_mockups_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_mockups_images" ADD CONSTRAINT "portfolio_projects_blocks_mockups_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects_blocks_mockups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_mockups" ADD CONSTRAINT "portfolio_projects_blocks_mockups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_text_break" ADD CONSTRAINT "portfolio_projects_blocks_text_break_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_stats_items" ADD CONSTRAINT "portfolio_projects_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_stats" ADD CONSTRAINT "portfolio_projects_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_before_after" ADD CONSTRAINT "portfolio_projects_blocks_before_after_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_before_after" ADD CONSTRAINT "portfolio_projects_blocks_before_after_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_before_after" ADD CONSTRAINT "portfolio_projects_blocks_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_video" ADD CONSTRAINT "portfolio_projects_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_video" ADD CONSTRAINT "portfolio_projects_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_summary" ADD CONSTRAINT "portfolio_projects_blocks_summary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_overview" ADD CONSTRAINT "_portfolio_projects_v_blocks_overview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_services_items" ADD CONSTRAINT "_portfolio_projects_v_blocks_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_services" ADD CONSTRAINT "_portfolio_projects_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_image_full" ADD CONSTRAINT "_portfolio_projects_v_blocks_image_full_image_image_id_media_id_fk" FOREIGN KEY ("image_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_image_full" ADD CONSTRAINT "_portfolio_projects_v_blocks_image_full_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_two_images" ADD CONSTRAINT "_portfolio_projects_v_blocks_gallery_two_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_two_images" ADD CONSTRAINT "_portfolio_projects_v_blocks_gallery_two_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v_blocks_gallery_two"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_two" ADD CONSTRAINT "_portfolio_projects_v_blocks_gallery_two_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_three_images" ADD CONSTRAINT "_portfolio_projects_v_blocks_gallery_three_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_three_images" ADD CONSTRAINT "_portfolio_projects_v_blocks_gallery_three_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v_blocks_gallery_three"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_gallery_three" ADD CONSTRAINT "_portfolio_projects_v_blocks_gallery_three_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_mockups_images" ADD CONSTRAINT "_portfolio_projects_v_blocks_mockups_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_mockups_images" ADD CONSTRAINT "_portfolio_projects_v_blocks_mockups_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v_blocks_mockups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_mockups" ADD CONSTRAINT "_portfolio_projects_v_blocks_mockups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_text_break" ADD CONSTRAINT "_portfolio_projects_v_blocks_text_break_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_stats_items" ADD CONSTRAINT "_portfolio_projects_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_stats" ADD CONSTRAINT "_portfolio_projects_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_before_after" ADD CONSTRAINT "_portfolio_projects_v_blocks_before_after_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_before_after" ADD CONSTRAINT "_portfolio_projects_v_blocks_before_after_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_before_after" ADD CONSTRAINT "_portfolio_projects_v_blocks_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_video" ADD CONSTRAINT "_portfolio_projects_v_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_video" ADD CONSTRAINT "_portfolio_projects_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_summary" ADD CONSTRAINT "_portfolio_projects_v_blocks_summary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_parent_id_portfolio_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_career_roles_v" ADD CONSTRAINT "_career_roles_v_parent_id_career_roles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."career_roles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_projects_fk" FOREIGN KEY ("portfolio_projects_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_career_roles_fk" FOREIGN KEY ("career_roles_id") REFERENCES "public"."career_roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_menu_items" ADD CONSTRAINT "site_settings_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_default_og_image_id_media_id_fk" FOREIGN KEY ("seo_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_content_hero_statement" ADD CONSTRAINT "home_content_hero_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_showreel_videos" ADD CONSTRAINT "home_content_showreel_videos_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_content_showreel_videos" ADD CONSTRAINT "home_content_showreel_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_clients" ADD CONSTRAINT "home_content_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_client_cards" ADD CONSTRAINT "home_content_client_cards_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_content_client_cards" ADD CONSTRAINT "home_content_client_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_stairs" ADD CONSTRAINT "home_content_stairs_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_content_stairs" ADD CONSTRAINT "home_content_stairs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_marquee_cards" ADD CONSTRAINT "home_content_marquee_cards_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_content_marquee_cards" ADD CONSTRAINT "home_content_marquee_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content" ADD CONSTRAINT "home_content_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_content_page_title" ADD CONSTRAINT "about_content_page_title_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_content_sections_body" ADD CONSTRAINT "about_content_sections_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_content_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_content_sections" ADD CONSTRAINT "about_content_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_content_closing_statement" ADD CONSTRAINT "about_content_closing_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_content" ADD CONSTRAINT "about_content_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_content_page_title" ADD CONSTRAINT "services_content_page_title_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_content_hero_images" ADD CONSTRAINT "services_content_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_content_hero_images" ADD CONSTRAINT "services_content_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_content_services_items" ADD CONSTRAINT "services_content_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_content_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_content_services" ADD CONSTRAINT "services_content_services_work_image_id_media_id_fk" FOREIGN KEY ("work_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_content_services" ADD CONSTRAINT "services_content_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_content" ADD CONSTRAINT "services_content_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_content_hero_story" ADD CONSTRAINT "contact_content_hero_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_content_markets_categories" ADD CONSTRAINT "contact_content_markets_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_content_markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_content_markets" ADD CONSTRAINT "contact_content_markets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_content" ADD CONSTRAINT "contact_content_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "careers_content_page_title" ADD CONSTRAINT "careers_content_page_title_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_content" ADD CONSTRAINT "careers_content_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_content_page_title" ADD CONSTRAINT "portfolio_content_page_title_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_content" ADD CONSTRAINT "portfolio_content_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_privacy" ADD CONSTRAINT "legal_privacy_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_terms" ADD CONSTRAINT "legal_terms_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "portfolio_projects_blocks_overview_order_idx" ON "portfolio_projects_blocks_overview" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_overview_parent_id_idx" ON "portfolio_projects_blocks_overview" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_overview_path_idx" ON "portfolio_projects_blocks_overview" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_services_items_order_idx" ON "portfolio_projects_blocks_services_items" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_services_items_parent_id_idx" ON "portfolio_projects_blocks_services_items" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_services_order_idx" ON "portfolio_projects_blocks_services" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_services_parent_id_idx" ON "portfolio_projects_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_services_path_idx" ON "portfolio_projects_blocks_services" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_image_full_order_idx" ON "portfolio_projects_blocks_image_full" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_image_full_parent_id_idx" ON "portfolio_projects_blocks_image_full" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_image_full_path_idx" ON "portfolio_projects_blocks_image_full" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_image_full_image_image_image_idx" ON "portfolio_projects_blocks_image_full" USING btree ("image_image_id");
  CREATE INDEX "portfolio_projects_blocks_gallery_two_images_order_idx" ON "portfolio_projects_blocks_gallery_two_images" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_gallery_two_images_parent_id_idx" ON "portfolio_projects_blocks_gallery_two_images" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_gallery_two_images_image_idx" ON "portfolio_projects_blocks_gallery_two_images" USING btree ("image_id");
  CREATE INDEX "portfolio_projects_blocks_gallery_two_order_idx" ON "portfolio_projects_blocks_gallery_two" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_gallery_two_parent_id_idx" ON "portfolio_projects_blocks_gallery_two" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_gallery_two_path_idx" ON "portfolio_projects_blocks_gallery_two" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_gallery_three_images_order_idx" ON "portfolio_projects_blocks_gallery_three_images" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_gallery_three_images_parent_id_idx" ON "portfolio_projects_blocks_gallery_three_images" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_gallery_three_images_image_idx" ON "portfolio_projects_blocks_gallery_three_images" USING btree ("image_id");
  CREATE INDEX "portfolio_projects_blocks_gallery_three_order_idx" ON "portfolio_projects_blocks_gallery_three" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_gallery_three_parent_id_idx" ON "portfolio_projects_blocks_gallery_three" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_gallery_three_path_idx" ON "portfolio_projects_blocks_gallery_three" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_mockups_images_order_idx" ON "portfolio_projects_blocks_mockups_images" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_mockups_images_parent_id_idx" ON "portfolio_projects_blocks_mockups_images" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_mockups_images_image_idx" ON "portfolio_projects_blocks_mockups_images" USING btree ("image_id");
  CREATE INDEX "portfolio_projects_blocks_mockups_order_idx" ON "portfolio_projects_blocks_mockups" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_mockups_parent_id_idx" ON "portfolio_projects_blocks_mockups" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_mockups_path_idx" ON "portfolio_projects_blocks_mockups" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_text_break_order_idx" ON "portfolio_projects_blocks_text_break" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_text_break_parent_id_idx" ON "portfolio_projects_blocks_text_break" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_text_break_path_idx" ON "portfolio_projects_blocks_text_break" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_stats_items_order_idx" ON "portfolio_projects_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_stats_items_parent_id_idx" ON "portfolio_projects_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_stats_order_idx" ON "portfolio_projects_blocks_stats" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_stats_parent_id_idx" ON "portfolio_projects_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_stats_path_idx" ON "portfolio_projects_blocks_stats" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_before_after_order_idx" ON "portfolio_projects_blocks_before_after" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_before_after_parent_id_idx" ON "portfolio_projects_blocks_before_after" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_before_after_path_idx" ON "portfolio_projects_blocks_before_after" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_before_after_before_before_ima_idx" ON "portfolio_projects_blocks_before_after" USING btree ("before_image_id");
  CREATE INDEX "portfolio_projects_blocks_before_after_after_after_image_idx" ON "portfolio_projects_blocks_before_after" USING btree ("after_image_id");
  CREATE INDEX "portfolio_projects_blocks_video_order_idx" ON "portfolio_projects_blocks_video" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_video_parent_id_idx" ON "portfolio_projects_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_video_path_idx" ON "portfolio_projects_blocks_video" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_video_poster_poster_image_idx" ON "portfolio_projects_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "portfolio_projects_blocks_summary_order_idx" ON "portfolio_projects_blocks_summary" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_summary_parent_id_idx" ON "portfolio_projects_blocks_summary" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_summary_path_idx" ON "portfolio_projects_blocks_summary" USING btree ("_path");
  CREATE UNIQUE INDEX "portfolio_projects_slug_idx" ON "portfolio_projects" USING btree ("slug");
  CREATE INDEX "portfolio_projects_cover_image_idx" ON "portfolio_projects" USING btree ("cover_image_id");
  CREATE INDEX "portfolio_projects_updated_at_idx" ON "portfolio_projects" USING btree ("updated_at");
  CREATE INDEX "portfolio_projects_created_at_idx" ON "portfolio_projects" USING btree ("created_at");
  CREATE INDEX "portfolio_projects__status_idx" ON "portfolio_projects" USING btree ("_status");
  CREATE INDEX "_portfolio_projects_v_blocks_overview_order_idx" ON "_portfolio_projects_v_blocks_overview" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_overview_parent_id_idx" ON "_portfolio_projects_v_blocks_overview" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_overview_path_idx" ON "_portfolio_projects_v_blocks_overview" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_services_items_order_idx" ON "_portfolio_projects_v_blocks_services_items" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_services_items_parent_id_idx" ON "_portfolio_projects_v_blocks_services_items" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_services_order_idx" ON "_portfolio_projects_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_services_parent_id_idx" ON "_portfolio_projects_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_services_path_idx" ON "_portfolio_projects_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_image_full_order_idx" ON "_portfolio_projects_v_blocks_image_full" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_image_full_parent_id_idx" ON "_portfolio_projects_v_blocks_image_full" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_image_full_path_idx" ON "_portfolio_projects_v_blocks_image_full" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_image_full_image_image_imag_idx" ON "_portfolio_projects_v_blocks_image_full" USING btree ("image_image_id");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_two_images_order_idx" ON "_portfolio_projects_v_blocks_gallery_two_images" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_two_images_parent_id_idx" ON "_portfolio_projects_v_blocks_gallery_two_images" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_two_images_image_idx" ON "_portfolio_projects_v_blocks_gallery_two_images" USING btree ("image_id");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_two_order_idx" ON "_portfolio_projects_v_blocks_gallery_two" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_two_parent_id_idx" ON "_portfolio_projects_v_blocks_gallery_two" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_two_path_idx" ON "_portfolio_projects_v_blocks_gallery_two" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_three_images_order_idx" ON "_portfolio_projects_v_blocks_gallery_three_images" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_three_images_parent_id_idx" ON "_portfolio_projects_v_blocks_gallery_three_images" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_three_images_image_idx" ON "_portfolio_projects_v_blocks_gallery_three_images" USING btree ("image_id");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_three_order_idx" ON "_portfolio_projects_v_blocks_gallery_three" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_three_parent_id_idx" ON "_portfolio_projects_v_blocks_gallery_three" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_gallery_three_path_idx" ON "_portfolio_projects_v_blocks_gallery_three" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_mockups_images_order_idx" ON "_portfolio_projects_v_blocks_mockups_images" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_mockups_images_parent_id_idx" ON "_portfolio_projects_v_blocks_mockups_images" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_mockups_images_image_idx" ON "_portfolio_projects_v_blocks_mockups_images" USING btree ("image_id");
  CREATE INDEX "_portfolio_projects_v_blocks_mockups_order_idx" ON "_portfolio_projects_v_blocks_mockups" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_mockups_parent_id_idx" ON "_portfolio_projects_v_blocks_mockups" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_mockups_path_idx" ON "_portfolio_projects_v_blocks_mockups" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_text_break_order_idx" ON "_portfolio_projects_v_blocks_text_break" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_text_break_parent_id_idx" ON "_portfolio_projects_v_blocks_text_break" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_text_break_path_idx" ON "_portfolio_projects_v_blocks_text_break" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_stats_items_order_idx" ON "_portfolio_projects_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_stats_items_parent_id_idx" ON "_portfolio_projects_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_stats_order_idx" ON "_portfolio_projects_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_stats_parent_id_idx" ON "_portfolio_projects_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_stats_path_idx" ON "_portfolio_projects_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_before_after_order_idx" ON "_portfolio_projects_v_blocks_before_after" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_before_after_parent_id_idx" ON "_portfolio_projects_v_blocks_before_after" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_before_after_path_idx" ON "_portfolio_projects_v_blocks_before_after" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_before_after_before_before__idx" ON "_portfolio_projects_v_blocks_before_after" USING btree ("before_image_id");
  CREATE INDEX "_portfolio_projects_v_blocks_before_after_after_after_im_idx" ON "_portfolio_projects_v_blocks_before_after" USING btree ("after_image_id");
  CREATE INDEX "_portfolio_projects_v_blocks_video_order_idx" ON "_portfolio_projects_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_video_parent_id_idx" ON "_portfolio_projects_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_video_path_idx" ON "_portfolio_projects_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_video_poster_poster_image_idx" ON "_portfolio_projects_v_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "_portfolio_projects_v_blocks_summary_order_idx" ON "_portfolio_projects_v_blocks_summary" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_summary_parent_id_idx" ON "_portfolio_projects_v_blocks_summary" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_summary_path_idx" ON "_portfolio_projects_v_blocks_summary" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_parent_idx" ON "_portfolio_projects_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_projects_v_version_version_slug_idx" ON "_portfolio_projects_v" USING btree ("version_slug");
  CREATE INDEX "_portfolio_projects_v_version_version_cover_image_idx" ON "_portfolio_projects_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_portfolio_projects_v_version_version_updated_at_idx" ON "_portfolio_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_projects_v_version_version_created_at_idx" ON "_portfolio_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_projects_v_version_version__status_idx" ON "_portfolio_projects_v" USING btree ("version__status");
  CREATE INDEX "_portfolio_projects_v_created_at_idx" ON "_portfolio_projects_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_projects_v_updated_at_idx" ON "_portfolio_projects_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_projects_v_latest_idx" ON "_portfolio_projects_v" USING btree ("latest");
  CREATE INDEX "career_roles_updated_at_idx" ON "career_roles" USING btree ("updated_at");
  CREATE INDEX "career_roles_created_at_idx" ON "career_roles" USING btree ("created_at");
  CREATE INDEX "career_roles__status_idx" ON "career_roles" USING btree ("_status");
  CREATE INDEX "_career_roles_v_parent_idx" ON "_career_roles_v" USING btree ("parent_id");
  CREATE INDEX "_career_roles_v_version_version_updated_at_idx" ON "_career_roles_v" USING btree ("version_updated_at");
  CREATE INDEX "_career_roles_v_version_version_created_at_idx" ON "_career_roles_v" USING btree ("version_created_at");
  CREATE INDEX "_career_roles_v_version_version__status_idx" ON "_career_roles_v" USING btree ("version__status");
  CREATE INDEX "_career_roles_v_created_at_idx" ON "_career_roles_v" USING btree ("created_at");
  CREATE INDEX "_career_roles_v_updated_at_idx" ON "_career_roles_v" USING btree ("updated_at");
  CREATE INDEX "_career_roles_v_latest_idx" ON "_career_roles_v" USING btree ("latest");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_projects_id");
  CREATE INDEX "payload_locked_documents_rels_career_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("career_roles_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_menu_items_order_idx" ON "site_settings_menu_items" USING btree ("_order");
  CREATE INDEX "site_settings_menu_items_parent_id_idx" ON "site_settings_menu_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seo_default_og_image_idx" ON "site_settings" USING btree ("seo_default_og_image_id");
  CREATE INDEX "home_content_hero_statement_order_idx" ON "home_content_hero_statement" USING btree ("_order");
  CREATE INDEX "home_content_hero_statement_parent_id_idx" ON "home_content_hero_statement" USING btree ("_parent_id");
  CREATE INDEX "home_content_showreel_videos_order_idx" ON "home_content_showreel_videos" USING btree ("_order");
  CREATE INDEX "home_content_showreel_videos_parent_id_idx" ON "home_content_showreel_videos" USING btree ("_parent_id");
  CREATE INDEX "home_content_showreel_videos_video_idx" ON "home_content_showreel_videos" USING btree ("video_id");
  CREATE INDEX "home_content_clients_order_idx" ON "home_content_clients" USING btree ("_order");
  CREATE INDEX "home_content_clients_parent_id_idx" ON "home_content_clients" USING btree ("_parent_id");
  CREATE INDEX "home_content_client_cards_order_idx" ON "home_content_client_cards" USING btree ("_order");
  CREATE INDEX "home_content_client_cards_parent_id_idx" ON "home_content_client_cards" USING btree ("_parent_id");
  CREATE INDEX "home_content_client_cards_photo_idx" ON "home_content_client_cards" USING btree ("photo_id");
  CREATE INDEX "home_content_stairs_order_idx" ON "home_content_stairs" USING btree ("_order");
  CREATE INDEX "home_content_stairs_parent_id_idx" ON "home_content_stairs" USING btree ("_parent_id");
  CREATE INDEX "home_content_stairs_photo_idx" ON "home_content_stairs" USING btree ("photo_id");
  CREATE INDEX "home_content_marquee_cards_order_idx" ON "home_content_marquee_cards" USING btree ("_order");
  CREATE INDEX "home_content_marquee_cards_parent_id_idx" ON "home_content_marquee_cards" USING btree ("_parent_id");
  CREATE INDEX "home_content_marquee_cards_photo_idx" ON "home_content_marquee_cards" USING btree ("photo_id");
  CREATE INDEX "home_content_seo_seo_og_image_idx" ON "home_content" USING btree ("seo_og_image_id");
  CREATE INDEX "about_content_page_title_order_idx" ON "about_content_page_title" USING btree ("_order");
  CREATE INDEX "about_content_page_title_parent_id_idx" ON "about_content_page_title" USING btree ("_parent_id");
  CREATE INDEX "about_content_sections_body_order_idx" ON "about_content_sections_body" USING btree ("_order");
  CREATE INDEX "about_content_sections_body_parent_id_idx" ON "about_content_sections_body" USING btree ("_parent_id");
  CREATE INDEX "about_content_sections_order_idx" ON "about_content_sections" USING btree ("_order");
  CREATE INDEX "about_content_sections_parent_id_idx" ON "about_content_sections" USING btree ("_parent_id");
  CREATE INDEX "about_content_closing_statement_order_idx" ON "about_content_closing_statement" USING btree ("_order");
  CREATE INDEX "about_content_closing_statement_parent_id_idx" ON "about_content_closing_statement" USING btree ("_parent_id");
  CREATE INDEX "about_content_seo_seo_og_image_idx" ON "about_content" USING btree ("seo_og_image_id");
  CREATE INDEX "services_content_page_title_order_idx" ON "services_content_page_title" USING btree ("_order");
  CREATE INDEX "services_content_page_title_parent_id_idx" ON "services_content_page_title" USING btree ("_parent_id");
  CREATE INDEX "services_content_hero_images_order_idx" ON "services_content_hero_images" USING btree ("_order");
  CREATE INDEX "services_content_hero_images_parent_id_idx" ON "services_content_hero_images" USING btree ("_parent_id");
  CREATE INDEX "services_content_hero_images_image_idx" ON "services_content_hero_images" USING btree ("image_id");
  CREATE INDEX "services_content_services_items_order_idx" ON "services_content_services_items" USING btree ("_order");
  CREATE INDEX "services_content_services_items_parent_id_idx" ON "services_content_services_items" USING btree ("_parent_id");
  CREATE INDEX "services_content_services_order_idx" ON "services_content_services" USING btree ("_order");
  CREATE INDEX "services_content_services_parent_id_idx" ON "services_content_services" USING btree ("_parent_id");
  CREATE INDEX "services_content_services_work_image_idx" ON "services_content_services" USING btree ("work_image_id");
  CREATE INDEX "services_content_seo_seo_og_image_idx" ON "services_content" USING btree ("seo_og_image_id");
  CREATE INDEX "contact_content_hero_story_order_idx" ON "contact_content_hero_story" USING btree ("_order");
  CREATE INDEX "contact_content_hero_story_parent_id_idx" ON "contact_content_hero_story" USING btree ("_parent_id");
  CREATE INDEX "contact_content_markets_categories_order_idx" ON "contact_content_markets_categories" USING btree ("_order");
  CREATE INDEX "contact_content_markets_categories_parent_id_idx" ON "contact_content_markets_categories" USING btree ("_parent_id");
  CREATE INDEX "contact_content_markets_order_idx" ON "contact_content_markets" USING btree ("_order");
  CREATE INDEX "contact_content_markets_parent_id_idx" ON "contact_content_markets" USING btree ("_parent_id");
  CREATE INDEX "contact_content_seo_seo_og_image_idx" ON "contact_content" USING btree ("seo_og_image_id");
  CREATE INDEX "careers_content_page_title_order_idx" ON "careers_content_page_title" USING btree ("_order");
  CREATE INDEX "careers_content_page_title_parent_id_idx" ON "careers_content_page_title" USING btree ("_parent_id");
  CREATE INDEX "careers_content_seo_seo_og_image_idx" ON "careers_content" USING btree ("seo_og_image_id");
  CREATE INDEX "portfolio_content_page_title_order_idx" ON "portfolio_content_page_title" USING btree ("_order");
  CREATE INDEX "portfolio_content_page_title_parent_id_idx" ON "portfolio_content_page_title" USING btree ("_parent_id");
  CREATE INDEX "portfolio_content_seo_seo_og_image_idx" ON "portfolio_content" USING btree ("seo_og_image_id");
  CREATE INDEX "legal_privacy_seo_seo_og_image_idx" ON "legal_privacy" USING btree ("seo_og_image_id");
  CREATE INDEX "legal_terms_seo_seo_og_image_idx" ON "legal_terms" USING btree ("seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "portfolio_projects_blocks_overview" CASCADE;
  DROP TABLE "portfolio_projects_blocks_services_items" CASCADE;
  DROP TABLE "portfolio_projects_blocks_services" CASCADE;
  DROP TABLE "portfolio_projects_blocks_image_full" CASCADE;
  DROP TABLE "portfolio_projects_blocks_gallery_two_images" CASCADE;
  DROP TABLE "portfolio_projects_blocks_gallery_two" CASCADE;
  DROP TABLE "portfolio_projects_blocks_gallery_three_images" CASCADE;
  DROP TABLE "portfolio_projects_blocks_gallery_three" CASCADE;
  DROP TABLE "portfolio_projects_blocks_mockups_images" CASCADE;
  DROP TABLE "portfolio_projects_blocks_mockups" CASCADE;
  DROP TABLE "portfolio_projects_blocks_text_break" CASCADE;
  DROP TABLE "portfolio_projects_blocks_stats_items" CASCADE;
  DROP TABLE "portfolio_projects_blocks_stats" CASCADE;
  DROP TABLE "portfolio_projects_blocks_before_after" CASCADE;
  DROP TABLE "portfolio_projects_blocks_video" CASCADE;
  DROP TABLE "portfolio_projects_blocks_summary" CASCADE;
  DROP TABLE "portfolio_projects" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_overview" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_services_items" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_services" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_image_full" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_gallery_two_images" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_gallery_two" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_gallery_three_images" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_gallery_three" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_mockups_images" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_mockups" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_text_break" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_stats_items" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_stats" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_before_after" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_video" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_summary" CASCADE;
  DROP TABLE "_portfolio_projects_v" CASCADE;
  DROP TABLE "career_roles" CASCADE;
  DROP TABLE "_career_roles_v" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings_menu_items" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_content_hero_statement" CASCADE;
  DROP TABLE "home_content_showreel_videos" CASCADE;
  DROP TABLE "home_content_clients" CASCADE;
  DROP TABLE "home_content_client_cards" CASCADE;
  DROP TABLE "home_content_stairs" CASCADE;
  DROP TABLE "home_content_marquee_cards" CASCADE;
  DROP TABLE "home_content" CASCADE;
  DROP TABLE "about_content_page_title" CASCADE;
  DROP TABLE "about_content_sections_body" CASCADE;
  DROP TABLE "about_content_sections" CASCADE;
  DROP TABLE "about_content_closing_statement" CASCADE;
  DROP TABLE "about_content" CASCADE;
  DROP TABLE "services_content_page_title" CASCADE;
  DROP TABLE "services_content_hero_images" CASCADE;
  DROP TABLE "services_content_services_items" CASCADE;
  DROP TABLE "services_content_services" CASCADE;
  DROP TABLE "services_content" CASCADE;
  DROP TABLE "contact_content_hero_story" CASCADE;
  DROP TABLE "contact_content_markets_categories" CASCADE;
  DROP TABLE "contact_content_markets" CASCADE;
  DROP TABLE "contact_content" CASCADE;
  DROP TABLE "careers_content_page_title" CASCADE;
  DROP TABLE "careers_content" CASCADE;
  DROP TABLE "portfolio_content_page_title" CASCADE;
  DROP TABLE "portfolio_content" CASCADE;
  DROP TABLE "legal_privacy" CASCADE;
  DROP TABLE "legal_terms" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_portfolio_projects_blocks_image_full_image_ratio";
  DROP TYPE "public"."enum_portfolio_projects_blocks_gallery_two_images_ratio";
  DROP TYPE "public"."enum_portfolio_projects_blocks_gallery_three_images_ratio";
  DROP TYPE "public"."enum_portfolio_projects_blocks_mockups_images_ratio";
  DROP TYPE "public"."enum_portfolio_projects_blocks_mockups_kind";
  DROP TYPE "public"."enum_portfolio_projects_blocks_before_after_before_ratio";
  DROP TYPE "public"."enum_portfolio_projects_blocks_before_after_after_ratio";
  DROP TYPE "public"."enum_portfolio_projects_blocks_video_poster_ratio";
  DROP TYPE "public"."enum_portfolio_projects_cover_ratio";
  DROP TYPE "public"."enum_portfolio_projects_status";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_image_full_image_ratio";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_gallery_two_images_ratio";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_gallery_three_images_ratio";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_mockups_images_ratio";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_mockups_kind";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_before_after_before_ratio";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_before_after_after_ratio";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_video_poster_ratio";
  DROP TYPE "public"."enum__portfolio_projects_v_version_cover_ratio";
  DROP TYPE "public"."enum__portfolio_projects_v_version_status";
  DROP TYPE "public"."enum_career_roles_status";
  DROP TYPE "public"."enum__career_roles_v_version_status";
  DROP TYPE "public"."enum_site_settings_menu_items_route";
  DROP TYPE "public"."enum_site_settings_lets_chat_target";
  DROP TYPE "public"."enum_home_content_hero_statement_style";
  DROP TYPE "public"."enum_home_content_hero_statement_tone";
  DROP TYPE "public"."enum_home_content_clients_badge_accent";
  DROP TYPE "public"."enum_about_content_page_title_style";
  DROP TYPE "public"."enum_about_content_page_title_tone";
  DROP TYPE "public"."enum_about_content_closing_statement_style";
  DROP TYPE "public"."enum_about_content_closing_statement_tone";
  DROP TYPE "public"."enum_services_content_page_title_style";
  DROP TYPE "public"."enum_services_content_page_title_tone";
  DROP TYPE "public"."enum_contact_content_hero_story_style";
  DROP TYPE "public"."enum_contact_content_hero_story_tone";
  DROP TYPE "public"."enum_careers_content_page_title_style";
  DROP TYPE "public"."enum_careers_content_page_title_tone";
  DROP TYPE "public"."enum_portfolio_content_page_title_style";
  DROP TYPE "public"."enum_portfolio_content_page_title_tone";`)
}
