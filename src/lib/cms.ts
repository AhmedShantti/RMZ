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
import { homeContent as homeDefault, DEFAULT_STAIR_TITLES } from "@/content/home";
import { btsContent as btsDefault } from "@/content/bts";
import { aboutContent as aboutDefault, type AboutImage } from "@/content/about";
import { servicesPage as servicesPageDefault, services as servicesDefault } from "@/content/services";
import { markets as marketsDefault } from "@/content/markets";
import { contactContent as contactDefault } from "@/content/contact";
import { careersPage as careersDefault, roles as rolesDefault } from "@/content/careers";
import { projects as projectsDefault, portfolioPage as portfolioPageDefault } from "@/content/portfolio";
import type {
  MockupKind,
  Project,
  ProjectBlock,
  ProjectCategory,
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
  | "btsContent"
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
          videos: (
            Array.isArray(g.showreelVideos) ? g.showreelVideos : []
          ).flatMap((v) => {
            const m = v.video && typeof v.video === "object" ? v.video : null;
            const hd =
              v.hdVideo && typeof v.hdVideo === "object" ? v.hdVideo : null;
            const poster =
              v.poster && typeof v.poster === "object" ? v.poster : null;
            return m?.url
              ? [
                  {
                    url: m.url,
                    hdUrl: hd?.url ?? undefined,
                    poster: poster?.url ?? undefined,
                    title: v.title ?? undefined,
                  },
                ]
              : [];
          }),
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
                title: f(
                  s.title,
                  DEFAULT_STAIR_TITLES[i] ?? homeDefault.stairs[i]?.title ?? "",
                ),
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
        clientsHeading: f(g.clientsHeading, homeDefault.clientsHeading),
        clientCards: g.clientCards?.length
          ? g.clientCards.map((c) => {
              const photo =
                c.photo && typeof c.photo === "object" ? c.photo : null;
              // Same slug rule as getPortfolio; unpublished projects have no
              // page (getProject 404s), so they don't get a link.
              const project =
                c.project && typeof c.project === "object" ? c.project : null;
              return {
                name: f(c.name, ""),
                category: f(c.category, ""),
                photoUrl: photo?.url ?? null,
                alt: photo?.alt ?? "",
                href:
                  project && project._status === "published"
                    ? `/portfolio/${f(project.slug, slugify(project.name))}`
                    : null,
              };
            })
          : homeDefault.clientCards,
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
      clientsHeading: homeDefault.clientsHeading,
      clientCards: homeDefault.clientCards,
    },
  ),
);

export const getAbout = cache(() =>
  safe(
    "about",
    async (p) => {
      // depth 1 so the banner + section images are populated with their media docs.
      const g = await p.findGlobal({ slug: "aboutContent", depth: 1 });
      const pct = (v: unknown) =>
        typeof v === "number" && Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 50;
      const img = (
        media: unknown,
        alt: string | null | undefined,
        fx: unknown,
        fy: unknown,
        fallbackAlt: string,
      ): AboutImage | null => {
        const m = media && typeof media === "object" ? (media as { url?: string | null; alt?: string | null }) : null;
        if (!m?.url) return null;
        return { url: m.url, alt: f(alt, m.alt ?? fallbackAlt), focalX: pct(fx), focalY: pct(fy) };
      };
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
        bannerTitle: f(g.bannerTitle, aboutDefault.bannerTitle).trim(),
        banner: img(g.bannerImage, g.bannerAlt, g.bannerFocalX, g.bannerFocalY, "Rebel Mind Zone"),
        sections: g.sections?.length
          ? g.sections.map((s) => ({
              kicker: s.kicker,
              title: s.title,
              body: (s.body ?? []).map((b) => b.text),
              image: img(s.image, s.imageAlt, s.focalX, s.focalY, s.title),
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
      banner: aboutDefault.banner,
      bannerTitle: aboutDefault.bannerTitle,
      sections: aboutDefault.sections,
      closingStatement: aboutDefault.closingStatement,
    },
  ),
);

export const getServices = cache(() =>
  safe(
    "services",
    async (p) => {
      // depth 1 so the hero + per-service `workImage` uploads are populated.
      const g = await p.findGlobal({ slug: "servicesContent", depth: 1 });
      const heroImages = (
        Array.isArray(g.heroImages) ? g.heroImages : []
      ).flatMap((h) => {
        const m = h.image && typeof h.image === "object" ? h.image : null;
        return m?.url ? [{ url: m.url, alt: m.alt ?? "" }] : [];
      });
      const services = g.services?.length
        ? g.services.map((s) => {
            const work =
              s.workImage && typeof s.workImage === "object"
                ? s.workImage
                : null;
            return {
              title: s.title,
              blurb: s.blurb,
              items: labels(s.items),
              workImageUrl: work?.url ?? null,
              workImageAlt: work?.alt ?? "",
              featuredOnHome: s.featuredOnHome ?? true,
              // Slug of the chosen portfolio category (relationship populated at depth 1).
              portfolioCategorySlug:
                s.portfolioCategory && typeof s.portfolioCategory === "object"
                  ? (s.portfolioCategory.slug ?? slugify(s.portfolioCategory.title))
                  : null,
            };
          })
        : servicesDefault.map((s) => ({
            ...s,
            workImageUrl: null,
            workImageAlt: "",
            featuredOnHome: true,
            portfolioCategorySlug: null as string | null,
          }));
      return {
        pageTitle: runs(g.pageTitle, servicesPageDefault.pageTitle),
        lede: f(g.lede, servicesPageDefault.lede),
        heroImages,
        services,
      };
    },
    {
      pageTitle: servicesPageDefault.pageTitle,
      lede: servicesPageDefault.lede,
      heroImages: [] as { url: string; alt: string }[],
      services: servicesDefault.map((s) => ({
        ...s,
        workImageUrl: null,
        workImageAlt: "",
        featuredOnHome: true,
        portfolioCategorySlug: null as string | null,
      })),
    },
  ),
);

export const getContact = cache(() => {
  const fd = contactDefault.form;
  const fallback = {
    heroStory: contactDefault.heroStory,
    lede: contactDefault.lede,
    whereWeWorkLabel: contactDefault.whereWeWorkLabel,
    officeAddress: contactDefault.officeAddress,
    contactEmail: "",
    emailLinkLabel: contactDefault.emailLinkLabel,
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
        officeAddress: f(g.officeAddress, contactDefault.officeAddress),
        // blank = the site email (resolved on the page from Site settings)
        contactEmail: f(g.contactEmail, ""),
        emailLinkLabel: f(g.emailLinkLabel, contactDefault.emailLinkLabel),
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
          sendingLabel: f(g.form?.sendingLabel, fd.sendingLabel),
          sendAnotherLabel: f(g.form?.sendAnotherLabel, fd.sendAnotherLabel),
          submitError: f(g.form?.submitError, fd.submitError),
          labels: {
            fullName: f(g.form?.labels?.fullName, fd.labels.fullName),
            email: f(g.form?.labels?.email, fd.labels.email),
            company: f(g.form?.labels?.company, fd.labels.company),
            phone: f(g.form?.labels?.phone, fd.labels.phone),
            country: f(g.form?.labels?.country, fd.labels.country),
            countryPlaceholder: f(g.form?.labels?.countryPlaceholder, fd.labels.countryPlaceholder),
            message: f(g.form?.labels?.message, fd.labels.message),
          },
          countries: labels(g.form?.countries).length
            ? labels(g.form?.countries)
            : fd.countries,
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
      // depth 1 so the banner upload is populated with its media doc.
      const g = await p.findGlobal({ slug: "portfolioContent", depth: 1 });
      const m =
        g.bannerImage && typeof g.bannerImage === "object"
          ? (g.bannerImage as { url?: string | null; alt?: string | null })
          : null;
      const pct = (v: unknown) =>
        typeof v === "number" && Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 50;
      return {
        pageTitle: runs(g.pageTitle, portfolioPageDefault.pageTitle),
        lede: f(g.lede, portfolioPageDefault.lede),
        banner: m?.url
          ? {
              url: m.url,
              alt: f(g.bannerAlt, m.alt ?? "Portfolio"),
              focalX: pct(g.bannerFocalX),
              focalY: pct(g.bannerFocalY),
            }
          : null,
        bannerTitle: f(g.bannerTitle, portfolioPageDefault.bannerTitle).trim(),
      };
    },
    {
      pageTitle: portfolioPageDefault.pageTitle,
      lede: portfolioPageDefault.lede,
      banner: portfolioPageDefault.banner,
      bannerTitle: portfolioPageDefault.bannerTitle,
    },
  ),
);

// ── BTS (Behind the scenes): the /bts page + the Home section ────────────────

export type BtsItem = {
  /** Anchor id on /bts (and the Home card's link target) — from the title, unique. */
  slug: string;
  title: string;
  label: string;
  imageUrl: string | null;
  imageAlt: string;
  videoUrl: string;
  /** Horizontal (16:9) video; default is vertical (9:16). */
  landscape: boolean;
  posterUrl: string | null;
  description: string;
};

export const getBts = cache(() =>
  safe(
    "bts",
    async (p) => {
      // depth 1 so the card image / video / poster uploads are populated.
      const g = await p.findGlobal({ slug: "btsContent", depth: 1 });
      const used = new Map<string, number>();
      const items: BtsItem[] = (Array.isArray(g.items) ? g.items : []).flatMap(
        (it, i) => {
          const media = (v: unknown) =>
            v && typeof v === "object"
              ? (v as { url?: string | null; alt?: string | null })
              : null;
          // The pasted video link (Bunny / Cloudflare / Vimeo / YouTube / .m3u8 / .mp4)
          // wins over an uploaded file; an item with neither can't open anything.
          const link = (it.videoUrl ?? "").trim();
          const video = link ? { url: link } : media(it.video);
          if (!video?.url) return [];
          const img = media(it.cardImage);
          const poster = media(it.poster);
          const base = slugify(it.title) || `video-${i + 1}`;
          const n = used.get(base) ?? 0;
          used.set(base, n + 1);
          return [
            {
              slug: n ? `${base}-${n + 1}` : base,
              title: it.title,
              label: f(it.label, "Behind the scenes"),
              imageUrl: img?.url ?? null,
              imageAlt: img?.alt ?? "",
              videoUrl: video.url,
              landscape: it.landscape === true,
              posterUrl: poster?.url ?? img?.url ?? null,
              description: f(it.description, ""),
            },
          ];
        },
      );
      return {
        title: f(g.title, btsDefault.title),
        lede: f(g.lede, btsDefault.lede),
        homeHeading: f(g.homeHeading, btsDefault.homeHeading),
        items,
      };
    },
    {
      title: btsDefault.title,
      lede: btsDefault.lede,
      homeHeading: btsDefault.homeHeading,
      items: [] as BtsItem[],
    },
  ),
);

// ── Home sections: Selected work · Client logos · CTA banner ─────────────────

export type HomeSectionsData = {
  featured: {
    enabled: boolean;
    kicker: string;
    heading: string;
    buttonLabel: string;
    buttonLink: string;
    /** Resolved at render time — see getHomeSections. */
    slugs: string[];
  };
  logos: {
    enabled: boolean;
    heading: string;
    items: { name: string; url: string | null; alt: string }[];
  };
  cta: {
    enabled: boolean;
    kicker: string;
    heading: string;
    text: string;
    buttonLabel: string;
    buttonLink: string;
    imageUrl: string | null;
  };
};

const homeSectionsDefault: HomeSectionsData = {
  featured: {
    enabled: true,
    kicker: "Selected work",
    heading: "Work we are proud of",
    buttonLabel: "See all work",
    buttonLink: "/portfolio",
    slugs: [],
  },
  logos: { enabled: true, heading: "Brands we have built with", items: [] },
  cta: {
    enabled: true,
    kicker: "Have a project in mind?",
    heading: "Let’s make something bold.",
    text: "",
    buttonLabel: "Start a project",
    buttonLink: "/contact",
    imageUrl: null,
  },
};

export const getHomeSections = cache(() =>
  safe(
    "homeSections",
    async (p): Promise<HomeSectionsData> => {
      // depth 1: the picked projects + the logo / banner uploads are populated.
      const g = await p.findGlobal({ slug: "homeSections", depth: 1 });
      const d = homeSectionsDefault;
      const media = (v: unknown) =>
        v && typeof v === "object" ? (v as { url?: string | null; alt?: string | null }) : null;
      const fw = g.featuredWork ?? {};
      const cl = g.clientLogos ?? {};
      const cta = g.ctaBanner ?? {};
      return {
        featured: {
          enabled: fw.enabled !== false,
          kicker: f(fw.kicker, d.featured.kicker),
          heading: f(fw.heading, d.featured.heading),
          buttonLabel: f(fw.buttonLabel, d.featured.buttonLabel),
          buttonLink: f(fw.buttonLink, d.featured.buttonLink),
          slugs: (Array.isArray(fw.projects) ? fw.projects : []).flatMap((x) =>
            x && typeof x === "object" && typeof x.slug === "string" ? [x.slug] : [],
          ),
        },
        logos: {
          enabled: cl.enabled !== false,
          heading: f(cl.heading, d.logos.heading),
          items: (Array.isArray(cl.logos) ? cl.logos : []).map((l) => {
            const m = media(l.logo);
            return { name: l.name, url: m?.url ?? null, alt: m?.alt || l.name };
          }),
        },
        cta: {
          enabled: cta.enabled !== false,
          kicker: f(cta.kicker, d.cta.kicker),
          heading: f(cta.heading, d.cta.heading),
          text: f(cta.text, d.cta.text),
          buttonLabel: f(cta.buttonLabel, d.cta.buttonLabel),
          buttonLink: f(cta.buttonLink, d.cta.buttonLink),
          imageUrl: cta.imageUrl?.trim() || media(cta.image)?.url || null,
        },
      };
    },
    homeSectionsDefault,
  ),
);

/** The projects the Selected-work section shows: the ones picked in the CMS (published
 *  only, in the picked order), else the first six of the Portfolio. */
export const getFeaturedProjects = cache(async (slugs: string[]) => {
  const all = await getPortfolio();
  const picked = slugs.flatMap((s) => all.find((p) => p.slug === s) ?? []);
  return (picked.length ? picked : all).slice(0, 6);
});

// ── Portfolio projects + case studies ────────────────────────────────────────

/** A populated `media` doc, once depth ≥ 1 has resolved the upload. */
type MediaDoc = { url?: string | null; alt?: string | null };

/** The CMS shape of a single image field (upload + framing). */
type CmsVisual = {
  image?: unknown;
  ratio?: string | null;
  caption?: string | null;
  /** A pasted image link (Bunny / CDN) — wins over the upload. */
  url?: string | null;
} | null;

const visual = (v: CmsVisual): Visual | undefined => {
  if (!v) return undefined;
  const media =
    v.image && typeof v.image === "object" ? (v.image as MediaDoc) : null;
  return {
    src: v.url?.trim() || media?.url || null,
    alt: media?.alt ?? v.caption ?? "",
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
      return { type: "galleryTwo", images: visuals(b.images as CmsVisual[]), flush: b.flush === true };
    case "galleryThree":
      return { type: "galleryThree", images: visuals(b.images as CmsVisual[]), flush: b.flush === true };
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
        url: (b.url as string | null)?.trim() || undefined,
        vertical: b.vertical === true,
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
/** A populated `categories` doc, once depth ≥ 1 has resolved the relationship. */
type CmsCategory = { id: number; title: string; slug?: string | null; sortOrder: number };

/**
 * The `category` relationship is required in the CMS, so this is always a
 * populated doc in practice. The synthetic fallback (derived from the legacy
 * `discipline` field) only guards against an unpopulated relationship —
 * unrelated to the whole-collection `projectsDefault` fallback above — so a
 * project never crashes the page for want of a category.
 */
const toCategory = (raw: unknown, fallbackTitle: string): ProjectCategory => {
  if (raw && typeof raw === "object") {
    const c = raw as CmsCategory;
    return {
      id: c.id,
      title: c.title,
      slug: f(c.slug, slugify(c.title)),
      sortOrder: c.sortOrder,
    };
  }
  return { id: 0, title: fallbackTitle, slug: slugify(fallbackTitle), sortOrder: 0 };
};

export const getPortfolio = cache(() =>
  safe(
    "portfolio",
    async (p) => {
      const res = await p.find({
        collection: "portfolioProjects",
        sort: "order",
        limit: 100,
        where: { _status: { equals: "published" } },
        // depth 2: blocks → upload field → the media doc (url + alt); also
        // populates the `category` relationship.
        depth: 2,
      });
      if (!res.docs.length) return projectsDefault;

      return res.docs.map((d): Project => {
        const cover = visual(
          (d.coverImage && typeof d.coverImage === "object") || d.coverImageUrl
            ? { image: d.coverImage, ratio: d.coverRatio, url: d.coverImageUrl }
            : null,
        );

        return {
          slug: f(d.slug, slugify(d.name)),
          name: d.name,
          client: d.client,
          market: d.market,
          discipline: d.discipline,
          category: toCategory(d.category, d.discipline),
          sortOrder: d.sortOrder,
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
