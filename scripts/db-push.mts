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

try {
  const { default: configPromise } = await import("../payload.config.ts");
  const { getPayload } = await import("payload");
  const payload = await getPayload({ config: await configPromise });
  payload.logger.info("[db-push] schema sync complete.");
} catch (e) {
  console.error("[db-push] skipped:", (e as Error).message);
}

process.exit(0);
