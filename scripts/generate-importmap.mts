/**
 * Generate the Payload admin import map — run with: `npm run generate:importmap`
 *
 * The stock `payload generate:importmap` CLI uses a bundled transpiler that
 * breaks on this Node version (ERR_REQUIRE_ASYNC_MODULE), same as the types
 * CLI. We call Payload's `generateImportMap` from the public `payload` export
 * directly instead.
 *
 * IMPORTANT: the vercel-blob storage plugin is enabled only when
 * BLOB_READ_WRITE_TOKEN is set, and it registers admin components that must be
 * in the import map. So the map must be generated with the token present (any
 * non-empty value works for generation) — otherwise prod (token set) renders a
 * blank /studio because the runtime config references components the committed
 * map doesn't have.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd(), true);

// Force the vercel-blob plugin ON for generation (a valid-format placeholder if
// no real token locally) so the map ALWAYS includes its admin component. The
// component path is static, so this placeholder produces the correct prod map;
// without it, generating in a token-less env silently drops the component and
// blanks /studio in prod.
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_placeholder000_placeholder000";
}

const { default: configPromise } = await import("../payload.config.ts");
const { generateImportMap } = await import("payload");

const config = await configPromise;
await generateImportMap(config, { log: true });

process.exit(0);
