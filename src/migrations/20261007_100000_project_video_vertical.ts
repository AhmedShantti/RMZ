import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_projects_blocks_video" ADD COLUMN "vertical" boolean DEFAULT false;
  ALTER TABLE "_portfolio_projects_v_blocks_video" ADD COLUMN "vertical" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio_projects_blocks_video" DROP COLUMN "vertical";
  ALTER TABLE "_portfolio_projects_v_blocks_video" DROP COLUMN "vertical";`)
}
