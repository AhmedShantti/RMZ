import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./src/payload/collections/Users.ts";
import { Media } from "./src/payload/collections/Media.ts";
import { PortfolioProjects } from "./src/payload/collections/PortfolioProjects.ts";
import { CareerRoles } from "./src/payload/collections/CareerRoles.ts";
import { ContactSubmissions } from "./src/payload/collections/ContactSubmissions.ts";
import { SiteSettings } from "./src/payload/globals/SiteSettings.ts";
import { HomeContent } from "./src/payload/globals/HomeContent.ts";
import { AboutContent } from "./src/payload/globals/AboutContent.ts";
import { ServicesContent } from "./src/payload/globals/ServicesContent.ts";
import { ContactContent } from "./src/payload/globals/ContactContent.ts";
import { CareersContent } from "./src/payload/globals/CareersContent.ts";
import { LegalPrivacy, LegalTerms } from "./src/payload/globals/legal.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Database: Postgres in prod (DATABASE_URI = postgres://…), SQLite for local
 * dev (default file). Choosing by the URI scheme keeps one config for both.
 */
const databaseURI = process.env.DATABASE_URI || "file:./rmz.db";
const usePostgres = databaseURI.startsWith("postgres");

/** Vercel Blob token is only present in prod — enable the adapter when set. */
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

/** Public origin in prod (e.g. https://rmz.vercel.app) for cookies + CSRF. */
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export default buildConfig({
  ...(serverURL ? { serverURL, csrf: [serverURL], cors: [serverURL] } : {}),
  // Admin lives at a configurable, non-default path (default /studio).
  routes: { admin: process.env.PAYLOAD_ADMIN_PATH || "/studio" },
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: "— RMZ Studio",
    },
  },
  collections: [
    Users,
    Media,
    PortfolioProjects,
    CareerRoles,
    ContactSubmissions,
  ],
  globals: [
    SiteSettings,
    HomeContent,
    AboutContent,
    ServicesContent,
    ContactContent,
    CareersContent,
    LegalPrivacy,
    LegalTerms,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
  db: usePostgres
    ? // `push: true` auto-syncs the schema (creates tables) on init, so the
      // admin works on a fresh prod Postgres without a separate migrate step.
      // For stricter prod control, set push:false and use Payload migrations.
      postgresAdapter({ pool: { connectionString: databaseURI }, push: true })
    : sqliteAdapter({ client: { url: databaseURI } }),
  sharp,
  plugins: [
    ...(blobToken
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: { media: true },
            token: blobToken,
          }),
        ]
      : []),
  ],
});
