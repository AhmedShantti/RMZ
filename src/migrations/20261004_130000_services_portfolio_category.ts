import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_content_services" ADD COLUMN "portfolio_category_id" integer;
  ALTER TABLE "services_content_services" ADD CONSTRAINT "services_content_services_portfolio_category_id_categories_id_fk" FOREIGN KEY ("portfolio_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_content_services_portfolio_category_idx" ON "services_content_services" USING btree ("portfolio_category_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_content_services" DROP CONSTRAINT "services_content_services_portfolio_category_id_categories_id_fk";

  DROP INDEX "services_content_services_portfolio_category_idx";
  ALTER TABLE "services_content_services" DROP COLUMN "portfolio_category_id";`)
}
