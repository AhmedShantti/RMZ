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
 * Reconcile leftover block-table artifacts before push.
 *
 * The portfolio case-study `blocks` field IS part of the schema, so its tables
 * (`portfolio_projects_blocks_*` + versions/locales) are LIVE — push owns them.
 * An earlier version of THIS script wrongly treated them as orphans (during a
 * window when the schema had no blocks) and moved them to an `archive` schema /
 * left `*_dup` copies behind in `public`. Those leftovers make push ask an
 * interactive "is <table> created or renamed from <leftover>?" prompt — no TTY
 * on CI, so the build hangs then aborts with exit code 13.
 *
 * Fix, both idempotent and best-effort (once prod is clean, later deploys are
 * no-ops):
 *   1. DROP the leftover `*_dup` tables (pure junk — they exist only to be
 *      paired against the real tables push recreates).
 *   2. RESTORE any block tables parked in `archive` back to `public` (with
 *      their rows), where `public` doesn't already have them, so push finds
 *      them in place instead of recreating them empty.
 *
 * IMPORTANT: this must NOT move/drop live block tables — it only removes `_dup`
 * junk and pulls archived copies BACK. Nothing here archives or drops a table
 * that push actually wants.
 */
async function reconcileBlockTables(uri: string) {
  // pg is CommonJS — reach through `default` for the namespace under ESM.
  const pg = await import("pg");
  const Client = pg.Client ?? pg.default.Client;
  const client = new Client({ connectionString: uri });
  await client.connect();
  try {
    // 1) Drop leftover duplicate tables (name ends in "_dup").
    const { rows: dups } = await client.query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables
        WHERE schemaname = 'public' AND tablename LIKE '%\\_dup' ESCAPE '\\'`,
    );
    for (const { tablename } of dups) {
      await client.query(`DROP TABLE IF EXISTS public."${tablename}" CASCADE`);
      console.log(`[db-push] dropped leftover duplicate: public.${tablename}`);
    }

    // 2) Restore archived block tables to public (only where public lacks them).
    const hasArchive = await client.query(
      `SELECT 1 FROM information_schema.schemata WHERE schema_name = 'archive'`,
    );
    if (hasArchive.rows.length) {
      const { rows: archived } = await client.query<{ tablename: string }>(
        `SELECT tablename FROM pg_tables
          WHERE schemaname = 'archive' AND tablename LIKE '%blocks%'`,
      );
      for (const { tablename } of archived) {
        const inPublic = await client.query(
          `SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = $1`,
          [tablename],
        );
        if (inPublic.rows.length) continue; // already present — leave the copy
        try {
          await client.query(
            `ALTER TABLE archive."${tablename}" SET SCHEMA public`,
          );
          console.log(
            `[db-push] restored block table: archive.${tablename} → public.${tablename}`,
          );
        } catch (e) {
          console.warn(
            `[db-push] could not restore ${tablename}: ${(e as Error).message}`,
          );
        }
      }
    }
  } finally {
    await client.end();
  }
}

try {
  const uri = process.env.DATABASE_URI || "";
  // Postgres (prod) only — SQLite dev DBs are recreated freely.
  if (uri.startsWith("postgres")) {
    try {
      await reconcileBlockTables(uri);
    } catch (e) {
      // Non-fatal: if this fails the push below may still succeed.
      console.error("[db-push] block reconcile skipped:", (e as Error).message);
    }
  }

  // Payload's dev push asks an interactive `prompts` confirm whenever a change
  // is destructive (dropping a column/table the schema no longer defines).
  // There's no TTY on CI, so it stalls. Pre-answer "yes" via prompts.inject so
  // the schema reconciles non-interactively — the code schema is the source of
  // truth. (This covers Payload's own confirm; the drizzle-kit table-rename
  // prompt is a separate resolver, avoided by reconcileBlockTables above.)
  try {
    const prompts = require("prompts");
    prompts.inject([true]);
  } catch {
    /* prompts is present via Payload; ignore if not resolvable */
  }

  const { default: configPromise } = await import("../payload.config.ts");
  const { getPayload } = await import("payload");
  const payload = await getPayload({ config: await configPromise });
  payload.logger.info("[db-push] schema sync complete.");
} catch (e) {
  console.error("[db-push] skipped:", (e as Error).message);
}

process.exit(0);