/**
 * Seed script — run with: `npm run seed`
 *
 * Loaded via Node's native TS type-stripping (no transpiler) — see NOTES.md.
 * Loads env first, then dynamically imports the config so process.env is
 * populated before the config evaluates.
 *
 * Seeds: first admin (from env) + every global/collection from src/content/*,
 * so the live site is identical immediately after the read-swap. Idempotent:
 * globals are upserted; collections are only seeded when empty.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd(), true);

const { default: configPromise } = await import("../payload.config.ts");
const { getPayload } = await import("payload");

// Content sources (the same modules the components fall back to).
const { site } = await import("../src/content/site.ts");
const { mainNav } = await import("../src/content/nav.ts");
const { homeContent } = await import("../src/content/home.ts");
const { aboutContent } = await import("../src/content/about.ts");
const { servicesPage, services } = await import("../src/content/services.ts");
const { markets } = await import("../src/content/markets.ts");
const { contactContent } = await import("../src/content/contact.ts");
const { careersPage, roles } = await import("../src/content/careers.ts");
const { portfolioPage, projects } = await import("../src/content/portfolio.ts");
const { privacyContent, termsContent } = await import("../src/content/legal.ts");

const payload = await getPayload({ config: await configPromise });

// ── helpers ──────────────────────────────────────────────────────────────
type AnyObj = Record<string, unknown>;

/** Build Lexical editor state from {heading, body[]} sections. */
function sectionsToLexical(sections: { heading: string; body: string[] }[]) {
  const text = (t: string) => ({
    type: "text",
    text: t,
    detail: 0,
    format: 0,
    mode: "normal",
    style: "",
    version: 1,
  });
  const heading = (t: string) => ({
    type: "heading",
    tag: "h2",
    children: [text(t)],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
  });
  const paragraph = (t: string) => ({
    type: "paragraph",
    children: [text(t)],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
    textFormat: 0,
    textStyle: "",
  });
  const children = sections.flatMap((s) => [
    heading(s.heading),
    ...s.body.map(paragraph),
  ]);
  return {
    root: {
      type: "root",
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    payload.logger.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin.");
    return;
  }
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });
  if (existing.totalDocs > 0) {
    payload.logger.info(`Admin already exists: ${email}`);
    return;
  }
  await payload.create({
    collection: "users",
    data: { email, password, name: "Admin", role: "admin" },
  });
  payload.logger.info(`Created admin: ${email}`);
}

async function updateGlobal(slug: string, data: AnyObj) {
  await payload.updateGlobal({ slug: slug as never, data: data as never });
  payload.logger.info(`Seeded global: ${slug}`);
}

async function seedCollection(
  slug: "portfolioProjects" | "careerRoles",
  rows: AnyObj[],
) {
  const existing = await payload.count({ collection: slug });
  if (existing.totalDocs > 0) {
    payload.logger.info(`Collection ${slug} already has docs — skipping.`);
    return;
  }
  for (const data of rows) {
    await payload.create({
      collection: slug,
      data: { ...data, _status: "published" } as never,
    });
  }
  payload.logger.info(`Seeded ${rows.length} into ${slug}`);
}

// ── run ──────────────────────────────────────────────────────────────────
await seedAdmin();

await updateGlobal("siteSettings", {
  siteName: site.name,
  shortName: site.shortName,
  ideaTagline: site.idea,
  email: site.email,
  phone: site.phone,
  socials: site.socials.map((s) => ({ label: s.label, url: s.href })),
  letsChatLabel: "Let’s chat",
  letsChatTarget: "/contact",
  menuItems: mainNav.map((n) => ({ label: n.label, route: n.href })),
  footerCredit: site.footerCredit,
  seoTitleTemplate: `%s — ${site.shortName}`,
  seoDefaultTitle: `${site.name} — ${site.idea}`,
  seoDefaultDescription: site.description,
});

await updateGlobal("homeContent", {
  showIntroLoader: homeContent.showIntroLoader,
  heroKicker: homeContent.heroKicker,
  heroStatement: homeContent.heroStatement,
  heroSubline: homeContent.heroSubline,
  teaserCtaLabel: homeContent.teaserCtaLabel,
});

await updateGlobal("aboutContent", {
  pageTitle: aboutContent.pageTitle,
  lede: aboutContent.lede,
  sections: aboutContent.sections.map((s) => ({
    kicker: s.kicker,
    title: s.title,
    body: s.body.map((text) => ({ text })),
  })),
  closingStatement: aboutContent.closingStatement,
});

await updateGlobal("servicesContent", {
  pageTitle: servicesPage.pageTitle,
  lede: servicesPage.lede,
  services: services.map((s) => ({
    title: s.title,
    blurb: s.blurb,
    items: s.items.map((label) => ({ label })),
    featuredOnHome: true,
  })),
});

await updateGlobal("contactContent", {
  heroStory: contactContent.heroStory,
  lede: contactContent.lede,
  whereWeWorkLabel: contactContent.whereWeWorkLabel,
  markets: markets.map((m) => ({
    label: m.name,
    categories: m.sectors.map((label) => ({ label })),
    blurb: m.line,
    contactLine: m.contact,
    isHighlighted: Boolean(m.home),
  })),
  form: {
    recipientEmail: contactContent.form.recipientEmail,
    submitLabel: contactContent.form.submitLabel,
    successHeading: contactContent.form.successHeading,
    successBody: contactContent.form.successBody,
    errorSummary: contactContent.form.errorSummary,
    fieldErrors: contactContent.form.fieldErrors,
  },
});

await updateGlobal("careersContent", {
  pageTitle: careersPage.pageTitle,
  lede: careersPage.lede,
  openApplicationHeading: careersPage.openApplicationHeading,
  ctaLabel: careersPage.ctaLabel,
  ctaTarget: careersPage.ctaTarget,
});

await updateGlobal("legalPrivacy", {
  title: privacyContent.title,
  lastUpdated: privacyContent.lastUpdated,
  showTemplateNotice: privacyContent.showTemplateNotice,
  intro: privacyContent.intro,
  body: sectionsToLexical(privacyContent.sections),
});

await updateGlobal("legalTerms", {
  title: termsContent.title,
  lastUpdated: termsContent.lastUpdated,
  showTemplateNotice: termsContent.showTemplateNotice,
  intro: termsContent.intro,
  body: sectionsToLexical(termsContent.sections),
});

await seedCollection(
  "portfolioProjects",
  projects.map((p, i) => ({
    name: p.name,
    client: p.client,
    market: p.market,
    discipline: p.discipline,
    resultLine: p.result,
    order: i,
  })),
);

await seedCollection(
  "careerRoles",
  roles.map((r, i) => ({
    title: r.title,
    type: r.type,
    location: r.location,
    description: r.blurb,
    applyTarget: "/contact",
    order: i,
  })),
);

payload.logger.info("Seed complete.");
process.exit(0);
