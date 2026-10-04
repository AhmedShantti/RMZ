import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_content" ADD COLUMN "office_address" varchar DEFAULT 'Office 102: Nasr City, Cairo, Egypt';
  ALTER TABLE "contact_content" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "contact_content" ADD COLUMN "email_link_label" varchar DEFAULT 'Email us';
  ALTER TABLE "contact_content" ADD COLUMN "form_sending_label" varchar DEFAULT 'Sending…';
  ALTER TABLE "contact_content" ADD COLUMN "form_send_another_label" varchar DEFAULT 'Send another →';
  ALTER TABLE "contact_content" ADD COLUMN "form_submit_error" varchar DEFAULT 'Something went wrong sending your message. Please try again in a moment.';
  ALTER TABLE "contact_content" ADD COLUMN "form_labels_full_name" varchar DEFAULT 'Full Name';
  ALTER TABLE "contact_content" ADD COLUMN "form_labels_email" varchar DEFAULT 'Email';
  ALTER TABLE "contact_content" ADD COLUMN "form_labels_company" varchar DEFAULT 'Company Name';
  ALTER TABLE "contact_content" ADD COLUMN "form_labels_phone" varchar DEFAULT 'Phone Number';
  ALTER TABLE "contact_content" ADD COLUMN "form_labels_country" varchar DEFAULT 'Country';
  ALTER TABLE "contact_content" ADD COLUMN "form_labels_country_placeholder" varchar DEFAULT 'Select country';
  ALTER TABLE "contact_content" ADD COLUMN "form_labels_message" varchar DEFAULT 'Give us a brief about your project';
  CREATE TABLE "contact_content_form_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  ALTER TABLE "contact_content_form_countries" ADD CONSTRAINT "contact_content_form_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_content_form_countries_order_idx" ON "contact_content_form_countries" USING btree ("_order");
  CREATE INDEX "contact_content_form_countries_parent_id_idx" ON "contact_content_form_countries" USING btree ("_parent_id");

  -- Pre-fill the Country drop-down list for the existing Contact document, so the
  -- editor sees today's options in the admin (the site shows the same list either way).
  INSERT INTO "contact_content_form_countries" ("_order", "_parent_id", "id", "label")
  SELECT t.n, c."id", substr(md5(random()::text || c."id"::text || t.n::text), 1, 24), t.l
  FROM "contact_content" c
  CROSS JOIN LATERAL unnest(ARRAY['Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Other']) WITH ORDINALITY AS t(l, n);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "contact_content_form_countries" CASCADE;
  ALTER TABLE "contact_content" DROP COLUMN "office_address";
  ALTER TABLE "contact_content" DROP COLUMN "contact_email";
  ALTER TABLE "contact_content" DROP COLUMN "email_link_label";
  ALTER TABLE "contact_content" DROP COLUMN "form_sending_label";
  ALTER TABLE "contact_content" DROP COLUMN "form_send_another_label";
  ALTER TABLE "contact_content" DROP COLUMN "form_submit_error";
  ALTER TABLE "contact_content" DROP COLUMN "form_labels_full_name";
  ALTER TABLE "contact_content" DROP COLUMN "form_labels_email";
  ALTER TABLE "contact_content" DROP COLUMN "form_labels_company";
  ALTER TABLE "contact_content" DROP COLUMN "form_labels_phone";
  ALTER TABLE "contact_content" DROP COLUMN "form_labels_country";
  ALTER TABLE "contact_content" DROP COLUMN "form_labels_country_placeholder";
  ALTER TABLE "contact_content" DROP COLUMN "form_labels_message";`)
}
