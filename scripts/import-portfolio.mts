/**
 * Portfolio import — run with: `npm run import:portfolio [-- --dry] [-- --publish] [-- --update]`
 *
 * Reads portfolio-intake/projects/<slug>/project.json (see portfolio-intake/README.md)
 * and creates the projects in whatever database the env points at.
 *
 *   --dry      validate the files only; no database connection at all
 *   --publish  create as published (default: DRAFT — review in /studio, then publish)
 *   --update   overwrite projects whose slug already exists (default: skip them)
 *
 * Idempotent: matched by slug, never duplicates. Categories are matched by title
 * (created from portfolio-intake/categories.json if missing). Images referenced by
 * a `file` that exists on disk are uploaded to the media library; a missing file is
 * skipped (the page shows its placeholder tile). An empty/`TODO` market → "Egypt".
 */
import { createRequire } from "node:module";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");
const PUBLISH = args.has("--publish");
const UPDATE = args.has("--update");

const root = path.resolve(process.cwd(), "portfolio-intake");
type AnyObj = Record<string, unknown>;
type Img = { file?: string; ratio?: string; alt?: string; caption?: string };
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

// ── connect (env first, config second — same as scripts/seed.mts) ──────
const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd(), true);
const { default: configPromise } = await import("../payload.config.ts");
const { getPayload } = await import("payload");
const payload = await getPayload({ config: await configPromise });

// ── helpers ─────────────────────────────────────────────────────────────
const mediaCache = new Map<string, number>();
/** Upload an image file once; returns the media id, or undefined if the file isn't there. */
async function upload(slug: string, img: Img | undefined): Promise<number | undefined> {
  if (!img?.file) return undefined;
  const filePath = path.join(root, "projects", slug, img.file);
  if (!existsSync(filePath)) return undefined;
  const hit = mediaCache.get(filePath);
  if (hit) return hit;
  const doc = await payload.create({
    collection: "media",
    data: { alt: img.alt && img.alt !== "TODO" ? img.alt : slug.replace(/-/g, " ") },
    filePath,
  });
  mediaCache.set(filePath, doc.id as number);
  return doc.id as number;
}
const vis = async (slug: string, img?: Img) => ({
  image: await upload(slug, img),
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
  const found = await payload.find({ collection: "categories", where: { title: { equals: c.title } }, limit: 1, depth: 0 });
  if (found.docs[0]) catId.set(c.title, found.docs[0].id as number);
  else {
    const made = await payload.create({ collection: "categories", data: c });
    catId.set(c.title, made.id as number);
    console.log(`+ category ${c.title}`);
  }
}

// ── projects ────────────────────────────────────────────────────────────
let created = 0, updated = 0, skipped = 0;
for (const { slug, p } of projects) {
  const existing = await payload.find({ collection: "portfolioProjects", where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true });
  const doc = existing.docs[0];
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
    coverImage: await upload(slug, p.cover),
    coverRatio: p.cover?.ratio ?? "16/9",
    blocks: await Promise.all((p.blocks ?? []).map((b) => toBlock(slug, b))),
    _status: PUBLISH ? "published" : "draft",
  };
  if (doc) {
    await payload.update({ collection: "portfolioProjects", id: doc.id, data: data as never, draft: !PUBLISH });
    updated++;
    console.log(`~ ${slug} updated`);
  } else {
    await payload.create({ collection: "portfolioProjects", data: data as never, draft: !PUBLISH });
    created++;
    console.log(`+ ${slug}`);
  }
}
console.log(`Done — created ${created}, updated ${updated}, skipped ${skipped} (${PUBLISH ? "published" : "drafts"}).`);
process.exit(0);
