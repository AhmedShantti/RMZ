/**
 * Portfolio import — run with: `npm run import:portfolio [-- --dry] [-- --publish] [-- --update]`
 *
 * Reads portfolio-intake/projects/<slug>/project.json (see portfolio-intake/README.md)
 * and creates the projects in whatever database the env points at.
 *
 *   --dry      validate the files only; no database connection at all
 *   --publish  create as published (default: DRAFT — review in /studio, then publish)
 *   --update   overwrite projects whose slug already exists (default: skip them)
 *   --remote=<site url>  talk to the site's REST API over HTTPS instead of the
 *              database (use this when port 5432 is blocked on your network).
 *              Needs IMPORT_EMAIL + IMPORT_PASSWORD (an admin login) in the env.
 *
 * Idempotent: matched by slug, never duplicates. Categories are matched by title
 * (created from portfolio-intake/categories.json if missing). Images referenced by
 * a `file` that exists on disk are uploaded to the media library; a missing file is
 * skipped (the page shows its placeholder tile). An image given as `"url"` (Bunny / CDN)
 * is stored as that link and shown straight from it — nothing is uploaded. An empty/`TODO` market → "Egypt".
 */
import { createRequire } from "node:module";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");
const PUBLISH = args.has("--publish");
const UPDATE = args.has("--update");
const REMOTE = process.argv.find((a) => a.startsWith("--remote="))?.slice(9).replace(/\/$/, "");

const root = path.resolve(process.cwd(), "portfolio-intake");
type AnyObj = Record<string, unknown>;
type Img = { file?: string; url?: string; ratio?: string; alt?: string; caption?: string };
type Block = AnyObj & { type: string };
type Project = {
  name: string;
  client: string;
  market?: string;
  discipline: string;
  category: string;
  sortOrder?: number;
  year?: string;
  resultLine: string;
  cover?: Img;
  blocks?: Block[];
};

const slugs = readdirSync(path.join(root, "projects"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
  .map((d) => d.name)
  .sort();

const projects = slugs.map((slug) => ({
  slug,
  p: JSON.parse(readFileSync(path.join(root, "projects", slug, "project.json"), "utf8")) as Project,
}));
const categories = JSON.parse(readFileSync(path.join(root, "categories.json"), "utf8")) as {
  title: string;
  sortOrder: number;
}[];

// ── validate ────────────────────────────────────────────────────────────
const problems: string[] = [];
for (const { slug, p } of projects) {
  for (const k of ["name", "client", "discipline", "category", "resultLine"] as const)
    if (!p[k]) problems.push(`${slug}: missing "${k}"`);
  if (!categories.some((c) => c.title === p.category))
    problems.push(`${slug}: category "${p.category}" is not in categories.json`);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`${projects.length} projects valid.`);
if (DRY) {
  for (const { slug, p } of projects)
    console.log(`  ${slug.padEnd(26)} ${p.category.padEnd(22)} market=${p.market && p.market !== "TODO" ? p.market : "Egypt (default)"}`);
  process.exit(0);
}

// ── backend: Payload local API (database) or the site's REST API ───────
type Doc = { id: number };
type Backend = {
  find(collection: string, field: string, value: string): Promise<Doc | undefined>;
  create(collection: string, data: AnyObj, draft?: boolean): Promise<Doc>;
  update(collection: string, id: number, data: AnyObj, draft: boolean): Promise<void>;
  media(filePath: string, alt: string): Promise<number>;
};

async function localBackend(): Promise<Backend> {
  const require = createRequire(import.meta.url);
  const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
  loadEnvConfig(process.cwd(), true);
  const { default: configPromise } = await import("../payload.config.ts");
  const { getPayload } = await import("payload");
  const payload = await getPayload({ config: await configPromise });
  return {
    async find(collection, field, value) {
      const r = await payload.find({ collection: collection as never, where: { [field]: { equals: value } }, limit: 1, depth: 0, draft: true });
      return r.docs[0] as unknown as Doc | undefined;
    },
    async create(collection, data, draft) {
      return (await payload.create({ collection: collection as never, data: data as never, draft })) as unknown as Doc;
    },
    async update(collection, id, data, draft) {
      await payload.update({ collection: collection as never, id, data: data as never, draft });
    },
    async media(filePath, alt) {
      return (await payload.create({ collection: "media", data: { alt }, filePath })).id as number;
    },
  };
}

async function remoteBackend(site: string): Promise<Backend> {
  const email = process.env.IMPORT_EMAIL;
  const password = process.env.IMPORT_PASSWORD;
  if (!email || !password) throw new Error("--remote needs IMPORT_EMAIL and IMPORT_PASSWORD in the environment.");
  const login = await fetch(`${site}/api/users/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const { token } = (await login.json()) as { token?: string };
  if (!login.ok || !token) throw new Error(`Login failed (${login.status}).`);
  const auth = { Authorization: `JWT ${token}` };
  const call = async (url: string, init: RequestInit) => {
    const res = await fetch(`${site}/api/${url}`, { ...init, headers: { ...auth, ...(init.headers as object) } });
    const body = (await res.json()) as AnyObj;
    if (!res.ok) throw new Error(`${init.method ?? "GET"} ${url} → ${res.status} ${JSON.stringify(body).slice(0, 300)}`);
    return body;
  };
  const json = { "content-type": "application/json" };
  return {
    async find(collection, field, value) {
      const q = `where[${field}][equals]=${encodeURIComponent(value)}&limit=1&depth=0&draft=true`;
      return ((await call(`${collection}?${q}`, {})).docs as Doc[])[0];
    },
    async create(collection, data, draft) {
      return (await call(`${collection}${draft ? "?draft=true" : ""}`, { method: "POST", headers: json, body: JSON.stringify(data) })).doc as Doc;
    },
    async update(collection, id, data, draft) {
      await call(`${collection}/${id}${draft ? "?draft=true" : ""}`, { method: "PATCH", headers: json, body: JSON.stringify(data) });
    },
    async media(filePath, alt) {
      const form = new FormData();
      form.append("_payload", JSON.stringify({ alt }));
      form.append("file", new Blob([readFileSync(filePath)]), path.basename(filePath));
      return ((await call("media", { method: "POST", body: form })).doc as Doc).id;
    },
  };
}

const api = REMOTE ? await remoteBackend(REMOTE) : await localBackend();

// ── helpers ─────────────────────────────────────────────────────────────
const mediaCache = new Map<string, number>();
/** Upload an image file once; returns the media id, or undefined if the file isn't there. */
async function upload(slug: string, img: Img | undefined): Promise<number | undefined> {
  if (!img?.file) return undefined;
  const filePath = path.join(root, "projects", slug, img.file);
  if (!existsSync(filePath)) return undefined;
  const hit = mediaCache.get(filePath);
  if (hit) return hit;
  const id = await api.media(filePath, img.alt && img.alt !== "TODO" ? img.alt : slug.replace(/-/g, " "));
  mediaCache.set(filePath, id);
  return id;
}
// An image is either `url` (a Bunny / CDN link, shown straight from there) or `file` (uploaded).
const vis = async (slug: string, img?: Img) => ({
  image: img?.url ? undefined : await upload(slug, img),
  url: img?.url,
  ratio: img?.ratio,
  caption: img?.caption,
});
const visList = async (slug: string, list: Img[] = []) =>
  Promise.all(list.map((i) => vis(slug, i)));

async function toBlock(slug: string, b: Block): Promise<AnyObj> {
  switch (b.type) {
    case "overview":
      return { blockType: "overview", heading: b.heading, idea: b.idea, goal: b.goal, challenge: b.challenge };
    case "services":
      return { blockType: "services", heading: b.heading, items: (b.items as string[]).map((label) => ({ label })) };
    case "textBreak":
      return { blockType: "textBreak", text: b.text, attribution: b.attribution };
    case "stats":
      return { blockType: "stats", heading: b.heading, items: b.items };
    case "summary":
      return { blockType: "summary", heading: b.heading, body: b.body, quote: b.quote, quoteAuthor: b.quoteAuthor };
    case "imageFull":
      return { blockType: "imageFull", image: await vis(slug, b.image as Img) };
    case "galleryTwo":
    case "galleryThree":
      return { blockType: b.type, images: await visList(slug, b.images as Img[]) };
    case "mockups":
      return { blockType: "mockups", heading: b.heading, kind: b.kind, images: await visList(slug, b.images as Img[]) };
    case "beforeAfter":
      return {
        blockType: "beforeAfter",
        heading: b.heading,
        note: b.note,
        before: await vis(slug, b.before as Img),
        after: await vis(slug, b.after as Img),
      };
    case "video":
      return {
        blockType: "video",
        heading: b.heading,
        url: b.url,
        vertical: b.vertical === true,
        poster: await vis(slug, b.poster as Img),
        caption: b.caption,
      };
    default:
      throw new Error(`${slug}: unknown block type "${b.type}"`);
  }
}

// ── categories ──────────────────────────────────────────────────────────
const catId = new Map<string, number>();
for (const c of categories) {
  const found = await api.find("categories", "title", c.title);
  if (found) catId.set(c.title, found.id);
  else {
    const made = await api.create("categories", c);
    catId.set(c.title, made.id);
    console.log(`+ category ${c.title}`);
  }
}

// ── projects ────────────────────────────────────────────────────────────
let created = 0, updated = 0, skipped = 0;
for (const { slug, p } of projects) {
  const doc = await api.find("portfolioProjects", "slug", slug);
  if (doc && !UPDATE) {
    console.log(`= ${slug} exists — skipped (use --update to overwrite)`);
    skipped++;
    continue;
  }
  const data = {
    name: p.name,
    slug,
    client: p.client,
    market: p.market && p.market !== "TODO" ? p.market : "Egypt",
    discipline: p.discipline,
    category: catId.get(p.category),
    sortOrder: p.sortOrder ?? 0,
    year: p.year,
    resultLine: p.resultLine,
    coverImage: p.cover?.url ? undefined : await upload(slug, p.cover),
    coverImageUrl: p.cover?.url,
    coverRatio: p.cover?.ratio ?? "16/9",
    blocks: await Promise.all((p.blocks ?? []).map((b) => toBlock(slug, b))),
    _status: PUBLISH ? "published" : "draft",
  };
  if (doc) {
    await api.update("portfolioProjects", doc.id, data, !PUBLISH);
    updated++;
    console.log(`~ ${slug} updated`);
  } else {
    await api.create("portfolioProjects", data, !PUBLISH);
    created++;
    console.log(`+ ${slug}`);
  }
}
console.log(`Done — created ${created}, updated ${updated}, skipped ${skipped} (${PUBLISH ? "published" : "drafts"}).`);
process.exit(0);
