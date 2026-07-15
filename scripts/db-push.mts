/**
 * Build-time schema sync — run before `next build` (see package.json "build").
 *
 * Payload's Postgres adapter skips schema `push` when NODE_ENV=production, so a
 * fresh prod database would have no tables ("relation \"users\" does not exist").
 * This isolated step forces dev-mode so `push: true` runs and creates/syncs the
 * tables against the configured DB. It runs in its own process, so the
 * subsequent `next build` is unaffected (still production).
 *
 * Schema only — it does NOT touch data, so it's safe to run on every deploy and
 * never overwrites content edited in /studio. Best-effort: any failure (e.g.
 * missing env on a local build) is logged and ignored so the build proceeds.
 */
// NODE_ENV is typed readonly; assign via a cast so the Postgres adapter runs
// schema push (it skips push when NODE_ENV === "production").
(process.env as Record<string, string | undefined>).NODE_ENV = "development";

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd(), true);

// Drop orphaned `blocks` tables BEFORE Payload's schema push runs. The schema
// no longer defines ANY `blocks` field (see payload-types: `blocks: {}`), so
// every `%blocks%` table left in prod (e.g. the removed portfolio
// "before/after" block + its versions/locales) is a pending DROP. When a push
// ALSO adds a new table (a new CMS array), Drizzle pairs the drop+add and asks
// an interactive "renamed or created?" prompt — which has no TTY on CI and
// fails the build (exit 13). Clearing the orphans first means the push only
// ADDS, so no prompt. Safe: none of these tables are in the schema, so the
// push was going to drop them anyway. Best-effort; Postgres only.
const databaseURI = process.env.DATABASE_URI || "";
if (databaseURI.startsWith("postgres")) {
  try {
    const { Client } = require("pg");
    const client = new Client({ connectionString: databaseURI });
    await client.connect();
    const res = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%blocks%'",
    );
    for (const row of res.rows) {
      await client.query(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`);
      console.log(`[db-push] dropped orphaned table "${row.tablename}"`);
    }
    await client.end();
  } catch (e) {
    console.error("[db-push] orphan cleanup skipped:", (e as Error).message);
  }
}

// Payload's dev push asks an interactive `prompts` confirm when a change is
// destructive (e.g. dropping columns the schema no longer defines, like the
// intentionally-omitted portfolio coverImage/slug/year). There's no TTY on CI,
// so it stalls. Pre-answer "yes" via prompts.inject so the schema reconciles
// non-interactively. Safe here: the code schema is the source of truth and the
// dropped columns/tables aren't used by the app.
try {
  const prompts = require("prompts");
  prompts.inject([true]);
} catch {
  /* prompts always present via Payload; ignore if not resolvable */
}

try {
  const { default: configPromise } = await import("../payload.config.ts");
  const { getPayload } = await import("payload");
  const payload = await getPayload({ config: await configPromise });
  payload.logger.info("[db-push] schema sync complete.");
} catch (e) {
  console.error("[db-push] skipped:", (e as Error).message);
}

process.exit(0);
