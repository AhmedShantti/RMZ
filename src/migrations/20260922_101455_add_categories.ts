import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** "marketing" -> "Marketing", " fragrance campaign" -> "Fragrance Campaign". */
const titleCase = (raw: string): string =>
  raw
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ---- Schema: the categories table + the new relationship/order fields ----
  await db.execute(sql`
   CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"sort_order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "portfolio_projects" ADD COLUMN "category_id" integer;
  ALTER TABLE "portfolio_projects" ADD COLUMN "sort_order" numeric DEFAULT 0;
  ALTER TABLE "_portfolio_projects_v" ADD COLUMN "version_category_id" integer;
  ALTER TABLE "_portfolio_projects_v" ADD COLUMN "version_sort_order" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  CREATE UNIQUE INDEX "categories_title_idx" ON "categories" USING btree ("title");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "portfolio_projects_category_idx" ON "portfolio_projects" USING btree ("category_id");
  CREATE INDEX "_portfolio_projects_v_version_version_category_idx" ON "_portfolio_projects_v" USING btree ("version_category_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");`)

  // ---- Data: one category per distinct (trimmed, Title Case) `discipline`
  // value. `payload.find` with the same `sort: 'order'` the site's own
  // getPortfolio() uses gives us projects in exactly today's on-site order —
  // both the category creation order (so a first-seen discipline like
  // "Branding" becomes sortOrder 0) and each project's position within its
  // group are derived from that, so the migration doesn't change what
  // visitors currently see. Every project (any status) is linked to a
  // category — none is left without one, since the field is required. ----
  const { docs: projectDocs } = await payload.find({
    collection: 'portfolioProjects',
    sort: 'order',
    limit: 1000,
    depth: 0,
    req,
  })

  const categoryIdByTitle = new Map<string, number>()
  const nextSortOrderByTitle = new Map<string, number>()
  let nextCategorySortOrder = 0

  for (const project of projectDocs) {
    const title = titleCase(project.discipline as string)

    let categoryId = categoryIdByTitle.get(title)
    if (categoryId === undefined) {
      const category = await payload.create({
        collection: 'categories',
        data: { title, sortOrder: nextCategorySortOrder },
        overrideAccess: true,
        req,
      })
      categoryId = category.id as number
      categoryIdByTitle.set(title, categoryId)
      nextSortOrderByTitle.set(title, 0)
      nextCategorySortOrder += 1
    }

    const projectSortOrder = nextSortOrderByTitle.get(title) ?? 0
    nextSortOrderByTitle.set(title, projectSortOrder + 1)

    await payload.update({
      collection: 'portfolioProjects',
      id: project.id,
      data: { category: categoryId, sortOrder: projectSortOrder },
      overrideAccess: true,
      req,
    })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "categories" CASCADE;
  ALTER TABLE "portfolio_projects" DROP CONSTRAINT "portfolio_projects_category_id_categories_id_fk";
  
  ALTER TABLE "_portfolio_projects_v" DROP CONSTRAINT "_portfolio_projects_v_version_category_id_categories_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_categories_fk";
  
  DROP INDEX "portfolio_projects_category_idx";
  DROP INDEX "_portfolio_projects_v_version_version_category_idx";
  DROP INDEX "payload_locked_documents_rels_categories_id_idx";
  ALTER TABLE "portfolio_projects" DROP COLUMN "category_id";
  ALTER TABLE "portfolio_projects" DROP COLUMN "sort_order";
  ALTER TABLE "_portfolio_projects_v" DROP COLUMN "version_category_id";
  ALTER TABLE "_portfolio_projects_v" DROP COLUMN "version_sort_order";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";`)
}
