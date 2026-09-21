import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_content_client_cards" ADD COLUMN "project_id" integer;
  ALTER TABLE "home_content_client_cards" ADD CONSTRAINT "home_content_client_cards_project_id_portfolio_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_content_client_cards_project_idx" ON "home_content_client_cards" USING btree ("project_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_content_client_cards" DROP CONSTRAINT "home_content_client_cards_project_id_portfolio_projects_id_fk";

  DROP INDEX "home_content_client_cards_project_idx";
  ALTER TABLE "home_content_client_cards" DROP COLUMN "project_id";`)
}
