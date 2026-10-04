import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bts_content_items" ALTER COLUMN "video_id" DROP NOT NULL;
  ALTER TABLE "bts_content_items" ADD COLUMN "video_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bts_content_items" DROP COLUMN "video_url";
  ALTER TABLE "bts_content_items" ALTER COLUMN "video_id" SET NOT NULL;`)
}
