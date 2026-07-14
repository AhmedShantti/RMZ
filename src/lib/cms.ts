import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Run } from "@/components/RunsText";

// Code-side defaults — used as a safety fallback so the site renders identically
// when a CMS field is empty OR when Payload/the DB is unreachable (e.g. a deploy
// before env vars / Postgres are wired). The CMS was seeded from these values,
// so the public site is correct either way.
import { site as siteDefault } from "@/content/site";
import { mainNav } from "@/content/nav";
import { homeContent as homeDefault } from "@/content/home";
import { aboutContent as aboutDefault } from "@/content/about";
import { servicesPage as servicesPageDefault, services as servicesDefault } from "@/content/services";
import { markets as marketsDefault } from "@/content/markets";
import { contactContent as contactDefault } from "@/content/contact";
import { careersPage as careersDefault, roles as rolesDefault } from "@/content/careers";
import { projects as projectsDefault, portfolioPage as portfolioPageDefault } from "@/content/portfolio";
import type {
  MockupKind,
  Project,
  ProjectBlock,
  Visual,
  VisualRatio,
} from "@/content/portfolio";
import { privacyContent, termsContent } from "@/content/legal";
import { slugify } from "@/lib/slug";

/** Per-request Payload client (deduped). */
const client = cache(async () => getPayload({ config }));

let warned = false;
/**
 * Run a CMS query, falling back to code defaults on ANY failure (Payload init
 * without PAYLOAD_SECRET, DB unreachable, etc.). Keeps the public site rendering
 * — the build never hard-fails on a missing CMS, and a misconfigured deploy
 * still shows the (seed-equal) content until the DB is connected.
 */
async function safe<T>(
  label: string,
  run: (p: Awaited<ReturnType<typeof client>>) => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    const p = await client();
    return await run(p);
  } catch (e) {
    if (!warned) {
      warned = true;
      console.error(
        `[cms] ${label}: falling back to code defaults —`,
        (e as Error).message,
      );
    }
    return fallback;
  }
}

const f = <T>(value: T | null | undefined, fallback: T): T =>
  value === null || value === undefined || value === "" ? fallback : value;

const runs = (value: unknown, fallback: Run[]): Run[] =>
  Array.isArray(value) && value.length ? (value as Run[]) : fallback;

const labels = (arr: unknown): string[] =>
  Array.isArray(arr) ? arr.map((x) => (x as { label: string }).label) : [];

// ── Per-page SEO (CMS_TASK §2) ───────────────────────────────────────────────
type SeoSlug =
  | "homeContent"
  | "aboutContent"
  | "servicesContent"
  | "contactContent"
  | "careersContent"
  | "portfolioContent"
  | "legalPrivacy"
  | "legalTerms";

export const getMeta = cache(
  (slug: SeoSlug, fallback: { title: string; description: string }) =>
    safe(
      `meta:${slug}`,
      async (p) => {
        const g = (await p.findGlobal({ slug, depth: 1 })) as {
          seo?: {
            title?: string;
            description?: string;
            ogImage?: { url?: string };
          };
        };
        const seo = g.seo ?? {};
        return {
          title: f(seo.title, fallback.title),
          description: f(seo.description, fallback.description),
          ogImageUrl:
            seo.ogImage && typeof seo.ogImage === "object"
              ? seo.ogImage.url
              : undefined,
        };
      },
      { ...fallback, ogImageUrl: undefined as string | undefined },
    ),
);

// ── Globals ────────────────────────────────────────────────────────────────

export const getSiteSettings = cache(() =>
  safe(
    "siteSettings",
    async (p) => {
      const g = await p.findGlobal({ slug: "siteSettings", depth: 1 });
      return {
        siteName: f(g.siteName, siteDefault.name),
        shortName: f(g.shortName, siteDefault.shortName),
        ideaTagline: f(g.ideaTagline, siteDefault.idea),
        email: f(g.email, siteDefault.email),
        phone: f(g.phone, siteDefault.phone),
        footerCredit: f(g.footerCredit, siteDefault.footerCredit),
        socials: g.socials?.length
          ? g.socials.map((s) => ({ label: s.label, href: s.url }))
          : siteDefault.socials.map((s) => ({ label: s.label, href: s.href })),
        letsChatLabel: f(g.letsChatLabel, "Let’s chat"),
        letsChatTarget: f(g.letsChatTarget, "/contact"),
        menuItems: g.menuItems?.length
          ? g.menuItems.map((m) => ({ label: m.label, href: m.route }))
          : mainNav.map((n) => ({ label: n.label, href: n.href })),
        seo: {
          titleTemplate: f(g.seoTitleTemplate, `%s — ${siteDefault.shortName}`),
          defaultTitle: f(
            g.seoDefaultTitle,
            `${siteDefault.name} — ${siteDefault.idea}`,
          ),
          defaultDescription: f(g.seoDefaultDescription, siteDefault.description),
        },
      };
    },
    {
      siteName: siteDefault.name,
      shortName: siteDefault.shortName,
      ideaTagline: siteDefault.idea,
      email: siteDefault.email,
      phone: siteDefault.phone,
      footerCredit: siteDefault.footerCredit,
      socials: siteDefault.socials.map((s) => ({
        label: s.label,
        href: s.href,
      })),
      letsChatLabel: "Let’s chat",
      letsChatTarget: "/contact",
      menuItems: mainNav.map((n) => ({ label: n.label, href: n.href })),
      seo: {
        titleTemplate: `%s — ${siteDefault.shortName}`,
        defaultTitle: `${siteDefault.name} — ${siteDefault.idea}`,
        defaultDescription: siteDefault.description,
      },
    },
  ),
);

export const getHome = cache(() =>
  safe(
    "home",
    async (p) => {
      // depth 1 so the stairs `photo` upload is populated with its media doc.
      const g = await p.findGlobal({ slug: "homeContent", depth: 1 });
      return {
        showIntroLoader: g.showIntroLoader ?? homeDefault.showIntroLoader,
        heroKicker: f(g.heroKicker, homeDefault.heroKicker),
        heroStatement: runs(g.heroStatement, homeDefault.heroStatement),
        heroSubline: f(g.heroSubline, homeDefault.heroSubline),
        teaserCtaLabel: f(g.teaserCtaLabel, homeDefault.teaserCtaLabel),
        showreel: {
          leftLabel: f(g.showreelLeftLabel, homeDefault.showreel.leftLabel),
          rightLabel: f(g.showreelRightLabel, homeDefault.showreel.rightLabel),
        },
        clients: g.clients?.length
          ? g.clients.map((c) => ({
              label: f(c.label, ""),
              badgeName: f(c.badgeName, ""),
              badgeAccent: (c.badgeAccent ?? "none") as
                | "orange"
                | "green"
                | "none",
            }))
          : homeDefault.clients,
        stairs: g.stairs?.length
          ? g.stairs.map((s, i) => {
              const photo =
                s.photo && typeof s.photo === "object" ? s.photo : null;
              return {
                photoUrl: photo?.url ?? null,
                alt: photo?.alt ?? "",
                paragraph: f(
                  s.paragraph,
                  homeDefault.stairs[i]?.paragraph ?? "",
                ),
              };
            })
          : homeDefault.stairs,
        marqueeCards: g.marqueeCards?.length
          ? g.marqueeCards.map((m) => {
              const photo =
                m.photo && typeof m.photo === "object" ? m.photo : null;
              return { photoUrl: photo?.url ?? null, alt: photo?.alt ?? "" };
            })
          : homeDefault.marqueeCards,
      };
    },
    {
      showIntroLoader: homeDefault.showIntroLoader,
      heroKicker: homeDefault.heroKicker,
      heroStatement: homeDefault.heroStatement,
      heroSubline: homeDefault.heroSubline,
      teaserCtaLabel: homeDefault.teaserCtaLabel,
      showreel: homeDefault.showreel,
      clients: homeDefault.clients,
      stairs: homeDefault.stairs,
      marqueeCards: homeDefault.marqueeCards,
    },
  ),
);

export const getAbout = cache(() =>
  safe(
    "about",
    async (p) => {
      const g = await p.findGlobal({ slug: "aboutContent", depth: 0 });
      const cp = g.colorPalette ?? {};
      return {
        pageTitle: runs(g.pageTitle, aboutDefault.pageTitle),
        lede: f(g.lede, aboutDefault.lede),
        colorPalette: {
          line1: f(cp.line1, aboutDefault.colorPalette.line1),
          line2Lead: f(cp.line2Lead, aboutDefault.colorPalette.line2Lead),
          line2Rest: f(cp.line2Rest, aboutDefault.colorPalette.line2Rest),
          line3: f(cp.line3, aboutDefault.colorPalette.line3),
        },
        sections: g.sections?.length
          ? g.sections.map((s) => ({
              kicker: s.kicker,
              title: s.title,
              body: (s.body ?? []).map((b) => b.text),
            }))
          : aboutDefault.sections,
        closingStatement: runs(
          g.closingStatement,
          aboutDefault.closingStatement,
        ),
      };
    },
    {
      pageTitle: aboutDefault.pageTitle,
      lede: aboutDefault.lede,
      colorPalette: aboutDefault.colorPalette,
      sections: aboutDefault.sections,
      closingStatement: aboutDefault.closingStatement,
    },
  ),
);

export const getServices = cache(() =>
  safe(
    "services",
    async (p) => {
      const g = await p.findGlobal({ slug: "servicesContent", depth: 0 });
      const services = g.services?.length
        ? g.services.map((s) => ({
            title: s.title,
            blurb: s.blurb,
            items: labels(s.items),
            featuredOnHome: s.featuredOnHome ?? true,
          }))
        : servicesDefault.map((s) => ({ ...s, featuredOnHome: true }));
      return {
        pageTitle: runs(g.pageTitle, servicesPageDefault.pageTitle),
        lede: f(g.lede, servicesPageDefault.lede),
        services,
      };
    },
    {
      pageTitle: servicesPageDefault.pageTitle,
      lede: servicesPageDefault.lede,
      services: servicesDefault.map((s) => ({ ...s, featuredOnHome: true })),
    },
  ),
);

export const getContact = cache(() => {
  const fd = contactDefault.form;
  const fallback = {
    heroStory: contactDefault.heroStory,
    lede: contactDefault.lede,
    whereWeWorkLabel: contactDefault.whereWeWorkLabel,
    markets: marketsDefault,
    form: { ...fd },
  };
  return safe(
    "contact",
    async (p) => {
      const g = await p.findGlobal({ slug: "contactContent", depth: 0 });
      return {
        heroStory: runs(g.heroStory, contactDefault.heroStory),
        lede: f(g.lede, contactDefault.lede),
        whereWeWorkLabel: f(
          g.whereWeWorkLabel,
          contactDefault.whereWeWorkLabel,
        ),
        markets: g.markets?.length
          ? g.markets.map((m) => ({
              name: m.label,
              sectors: labels(m.categories),
              line: f(m.blurb, ""),
              contact: f(m.contactLine, ""),
              home: Boolean(m.isHighlighted),
            }))
          : marketsDefault,
        form: {
          recipientEmail: f(g.form?.recipientEmail, fd.recipientEmail),
          submitLabel: f(g.form?.submitLabel, fd.submitLabel),
          successHeading: f(g.form?.successHeading, fd.successHeading),
          successBody: f(g.form?.successBody, fd.successBody),
          errorSummary: f(g.form?.errorSummary, fd.errorSummary),
          fieldErrors: {
            nameRequired: f(
              g.form?.fieldErrors?.nameRequired,
              fd.fieldErrors.nameRequired,
            ),
            emailRequired: f(
              g.form?.fieldErrors?.emailRequired,
              fd.fieldErrors.emailRequired,
            ),
            emailInvalid: f(
              g.form?.fieldErrors?.emailInvalid,
              fd.fieldErrors.emailInvalid,
            ),
            messageRequired: f(
              g.form?.fieldErrors?.messageRequired,
              fd.fieldErrors.messageRequired,
            ),
          },
        },
      };
    },
    fallback,
  );
});

export const getCareers = cache(() =>
  safe(
    "careers",
    async (p) => {
      const g = await p.findGlobal({ slug: "careersContent", depth: 0 });
      return {
        pageTitle: runs(g.pageTitle, careersDefault.pageTitle),
        lede: f(g.lede, careersDefault.lede),
        openApplicationHeading: f(
          g.openApplicationHeading,
          careersDefault.openApplicationHeading,
        ),
        ctaLabel: f(g.ctaLabel, careersDefault.ctaLabel),
        ctaTarget: f(g.ctaTarget, careersDefault.ctaTarget),
      };
    },
    {
      pageTitle: careersDefault.pageTitle,
      lede: careersDefault.lede,
      openApplicationHeading: careersDefault.openApplicationHeading,
      ctaLabel: careersDefault.ctaLabel,
      ctaTarget: careersDefault.ctaTarget,
    },
  ),
);

export const getLegal = cache((which: "privacy" | "terms") => {
  const slug = which === "privacy" ? "legalPrivacy" : "legalTerms";
  const def = which === "privacy" ? privacyContent : termsContent;
  return safe(
    `legal:${which}`,
    async (p) => {
      const g = await p.findGlobal({ slug, depth: 0 });
      return {
        title: f(g.title, def.title),
        lastUpdated: f(g.lastUpdated, def.lastUpdated),
        showTemplateNotice: g.showTemplateNotice ?? def.showTemplateNotice,
        intro: f(g.intro, def.intro),
        body: g.body ?? null,
      };
    },
    {
      title: def.title,
      lastUpdated: def.lastUpdated,
      showTemplateNotice: def.showTemplateNotice,
      intro: def.intro,
      body: null as unknown,
    },
  );
});

// ── Collections ──────────────────────────────────────────────────────────────

export const getPortfolioPage = cache(() =>
  safe(
    "portfolioPage",
    async (p) => {
      const g = await p.findGlobal({ slug: "portfolioContent", depth: 0 });
      return {
        pageTitle: runs(g.pageTitle, portfolioPageDefault.pageTitle),
        lede: f(g.lede, portfolioPageDefault.lede),
      };
    },
    {
      pageTitle: portfolioPageDefault.pageTitle,
      lede: portfolioPageDefault.lede,
    },
  ),
);

// ── Portfolio projects + case studies ────────────────────────────────────────

/** A populated `media` doc, once depth ≥ 1 has resolved the upload. */
type MediaDoc = { url?: string | null; alt?: string | null };

/** The CMS shape of a single image field (upload + framing). */
type CmsVisual = {
  image?: unknown;
  ratio?: string | null;
  caption?: string | null;
} | null;

const visual = (v: CmsVisual): Visual | undefined => {
  if (!v) return undefined;
  const media =
    v.image && typeof v.image === "object" ? (v.image as MediaDoc) : null;
  return {
    src: media?.url ?? null,
    alt: media?.alt ?? "",
    ratio: (v.ratio ?? undefined) as VisualRatio | undefined,
    caption: v.caption ?? undefined,
  };
};

const visuals = (list: CmsVisual[] | null | undefined): Visual[] =>
  (list ?? []).map((v) => visual(v)).filter((v): v is Visual => Boolean(v));

/** A visual field that is required in the CMS — always yields a Visual. */
const requiredVisual = (v: CmsVisual): Visual =>
  visual(v) ?? { src: null, alt: "" };

/**
 * Map one CMS block onto the code-side `ProjectBlock` union. Block slugs are
 * identical on both sides, so this is a straight rename of the CMS's nullable
 * fields into the code model's optional ones. An unrecognised block is dropped.
 */
type CmsBlock = { blockType: string } & Record<string, unknown>;

function toBlock(b: CmsBlock): ProjectBlock | null {
  const heading = (b.heading as string | null) ?? undefined;

  switch (b.blockType) {
    case "overview":
      return {
        type: "overview",
        heading,
        idea: (b.idea as string | null) ?? undefined,
        goal: (b.goal as string | null) ?? undefined,
        challenge: (b.challenge as string | null) ?? undefined,
      };
    case "services":
      return { type: "services", heading, items: labels(b.items) };
    case "imageFull":
      return { type: "imageFull", image: requiredVisual(b.image as CmsVisual) };
    case "galleryTwo":
      return { type: "galleryTwo", images: visuals(b.images as CmsVisual[]) };
    case "galleryThree":
      return { type: "galleryThree", images: visuals(b.images as CmsVisual[]) };
    case "mockups":
      return {
        type: "mockups",
        heading,
        kind: (b.kind as MockupKind) ?? "branding",
        images: visuals(b.images as CmsVisual[]),
      };
    case "textBreak":
      return {
        type: "textBreak",
        text: b.text as string,
        attribution: (b.attribution as string | null) ?? undefined,
      };
    case "stats":
      return {
        type: "stats",
        heading,
        items: Array.isArray(b.items)
          ? (b.items as { value: string; label: string }[]).map((s) => ({
              value: s.value,
              label: s.label,
            }))
          : [],
      };
    case "beforeAfter":
      return {
        type: "beforeAfter",
        heading,
        note: (b.note as string | null) ?? undefined,
        before: requiredVisual(b.before as CmsVisual),
        after: requiredVisual(b.after as CmsVisual),
      };
    case "video":
      return {
        type: "video",
        heading,
        url: (b.url as string | null) ?? undefined,
        poster: visual(b.poster as CmsVisual),
        caption: (b.caption as string | null) ?? undefined,
      };
    case "summary":
      return {
        type: "summary",
        heading,
        body: b.body as string,
        quote: (b.quote as string | null) ?? undefined,
        quoteAuthor: (b.quoteAuthor as string | null) ?? undefined,
      };
    default:
      return null;
  }
}

/**
 * Every published project, in order, with its full case study.
 *
 * One query serves the index cards, generateStaticParams and the detail pages
 * (React `cache` dedupes it per request).
 *
 * The CMS is authoritative for the detail pages: whatever blocks a project has
 * in the studio are exactly what renders, and removing them all removes them
 * from the page. The code defaults are only a whole-collection safety net (via
 * `safe`, and the empty-collection check below) for when Payload or the DB is
 * unreachable — never a per-field override of a live doc.
 *
 * The one derivation kept: a doc with no `slug` (seeded before the field
 * existed) falls back to a slug derived from its name, so it still has a
 * reachable URL rather than 404ing.
 */
export const getPortfolio = cache(() =>
  safe(
    "portfolio",
    async (p) => {
      const res = await p.find({
        collection: "portfolioProjects",
        sort: "order",
        limit: 100,
        where: { _status: { equals: "published" } },
        // depth 2: blocks → upload field → the media doc (url + alt).
        depth: 2,
      });
      if (!res.docs.length) return projectsDefault;

      return res.docs.map((d): Project => {
        const cover = visual(
          d.coverImage && typeof d.coverImage === "object"
            ? { image: d.coverImage, ratio: d.coverRatio }
            : null,
        );

        return {
          slug: f(d.slug, slugify(d.name)),
          name: d.name,
          client: d.client,
          market: d.market,
          discipline: d.discipline,
          year: f(d.year, ""),
          result: d.resultLine,
          cover,
          blocks: (d.blocks ?? [])
            .map((b) => toBlock(b as CmsBlock))
            .filter((b): b is ProjectBlock => b !== null),
        };
      });
    },
    projectsDefault,
  ),
);

/** Slugs of every published project — feeds generateStaticParams. */
export const getProjectSlugs = cache(async () =>
  (await getPortfolio()).map((p) => p.slug),
);

/**
 * One project plus its neighbours. Prev/next wrap around the ordered list so a
 * case study is never a dead end. Returns null for an unknown slug — the page
 * turns that into a 404.
 */
export const getProject = cache(async (slug: string) => {
  const all = await getPortfolio();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  const neighbour = (i: number) => {
    if (all.length < 2) return null;
    const { slug, name, discipline } = all[(i + all.length) % all.length];
    return { slug, name, discipline };
  };

  return {
    project: all[index],
    prev: neighbour(index - 1),
    next: neighbour(index + 1),
  };
});

export const getCareerRoles = cache(() =>
  safe(
    "careerRoles",
    async (p) => {
      const res = await p.find({
        collection: "careerRoles",
        sort: "order",
        limit: 100,
        where: { _status: { equals: "published" } },
        depth: 0,
      });
      if (!res.docs.length)
        return rolesDefault.map((r) => ({ ...r, applyTarget: "/contact" }));
      return res.docs.map((d) => ({
        title: d.title,
        type: d.type,
        location: d.location,
        blurb: d.description,
        applyTarget: f(d.applyTarget, "/contact"),
      }));
    },
    rolesDefault.map((r) => ({ ...r, applyTarget: "/contact" })),
  ),
);
