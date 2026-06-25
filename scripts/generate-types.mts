/**
 * Generate Payload TypeScript types — run with: `npm run generate:types`
 *
 * The stock `payload generate:types` CLI uses a bundled transpiler (tsx) that
 * breaks on this Node version (require-of-ESM + @next/env interop). We instead
 * use Node's native TS type-stripping and call Payload's `generateTypes`
 * function directly via the public `payload/node` subpath export.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd(), true);

const { default: configPromise } = await import("../payload.config.ts");
const { generateTypes } = await import("payload/node");

const config = await configPromise;
await generateTypes(config, { log: true });

process.exit(0);
