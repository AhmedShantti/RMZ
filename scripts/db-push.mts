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

/**
 * Orphan tables — created by a field that has since been removed from the schema.
 *
 * `home_content_marquee_cards` is left over from HomeContent's old `marqueeCards`
 * field (removed in a later redesign; see commit "Maquee editing"). An orphan is
 * harmless on its own, but drizzle's push cannot tell a dropped table apart from
 * a renamed one: the moment the schema ALSO adds tables (as the portfolio
 * case-study blocks do), it asks "is home_content_marquee_cards renamed to
 * portfolio_projects_blocks_overview?" — an interactive prompt with no TTY on CI,
 * which aborts the build with exit code 13.
 *
 * We MOVE the orphan to an `archive` schema rather than dropping it. Push only
 * looks at `public`, so this settles the ambiguity (creates only, no prompt)
 * while the old rows stay recoverable — a build script should never be the thing
 * that destroys content. Matched by prefix because a removed array field leaves
 * sub-tables behind too.
 *
 * To recover:   ALTER TABLE archive.<table> SET SCHEMA public;
 * To discard:   DROP SCHEMA archive CASCADE;
 */
const ORPHAN_PREFIXES = ["home_content_marquee"];

async function archiveOrphanTables(uri: string) {
  // pg is CommonJS — reach through `default` for the namespace under ESM.
  const pg = await import("pg");
  const Client = pg.Client ?? pg.default.Client;
  const client = new Client({ connectionString: uri });
  await client.connect();
  try {
    const { rows } = await client.query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
          AND (${ORPHAN_PREFIXES.map((_, i) => `tablename LIKE $${i + 1}`).join(" OR ")})`,
      ORPHAN_PREFIXES.map((p) => `${p}%`),
    );

    if (!rows.length) {
      console.log("[db-push] no orphan tables to archive.");
      return;
    }

    await client.query(`CREATE SCHEMA IF NOT EXISTS archive`);
    for (const { tablename } of rows) {
      // A previous deploy may already have archived this name; keep the first
      // (oldest) copy and park the duplicate beside it.
      await client.query(
        `ALTER TABLE public."${tablename}" SET SCHEMA archive`,
      ).catch(async (e: Error) => {
        await client.query(
          `ALTER TABLE public."${tablename}" RENAME TO "${tablename}_dup"`,
        );
        await client.query(
          `ALTER TABLE public."${tablename}_dup" SET SCHEMA archive`,
        );
        console.warn(`[db-push] ${tablename} already archived (${e.message}); parked duplicate.`);
      });
      console.log(`[db-push] archived orphan table: public.${tablename} → archive.${tablename}`);
    }
  } finally {
    await client.end();
  }
}

try {
  const uri = process.env.DATABASE_URI || "";
  // Postgres (prod) only — SQLite dev DBs are recreated freely and never hit
  // the rename prompt.
  if (uri.startsWith("postgres")) {
    try {
      await archiveOrphanTables(uri);
    } catch (e) {
      // Non-fatal: if this fails the push below may still succeed.
      console.error("[db-push] orphan cleanup skipped:", (e as Error).message);
    }
  }

  const { default: configPromise } = await import("../payload.config.ts");
  const { getPayload } = await import("payload");
  const payload = await getPayload({ config: await configPromise });
  payload.logger.info("[db-push] schema sync complete.");
} catch (e) {
  console.error("[db-push] skipped:", (e as Error).message);
}

process.exit(0);
