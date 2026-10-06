import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_projects_blocks_image_full" ADD COLUMN "flush" boolean DEFAULT false;
  ALTER TABLE "_portfolio_projects_v_blocks_image_full" ADD COLUMN "flush" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_projects_blocks_image_full" DROP COLUMN "flush";
  ALTER TABLE "_portfolio_projects_v_blocks_image_full" DROP COLUMN "flush";`)
}
