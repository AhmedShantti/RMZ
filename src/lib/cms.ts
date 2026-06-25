import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Run } from "@/components/RunsText";

// Code-side defaults — used as a safety fallback so the site renders identically
// even if a CMS field is empty. (The CMS was seeded from these same values.)
import { site as siteDefault } from "@/content/site";
import { mainNav } from "@/content/nav";
import { homeContent as homeDefault } from "@/content/home";
import { aboutContent as aboutDefault } from "@/content/about";
import { servicesPage as servicesPageDefault, services as servicesDefault } from "@/content/services";
import { markets as marketsDefault } from "@/content/markets";
import { contactContent as contactDefault } from "@/content/contact";
import { careersPage as careersDefault, roles as rolesDefault } from "@/content/careers";
import { projects as projectsDefault } from "@/content/portfolio";
import { privacyContent, termsContent } from "@/content/legal";

/** Per-request Payload client (deduped). */
const client = cache(async () => getPayload({ config }));

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
  | "legalPrivacy"
  | "legalTerms";

export const getMeta = cache(
  async (slug: SeoSlug, fallback: { title: string; description: string }) => {
    const p = await client();
    const g = (await p.findGlobal({ slug, depth: 1 })) as {
      seo?: { title?: string; description?: string; ogImage?: { url?: string } };
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
);

// ── Globals ────────────────────────────────────────────────────────────────

export const getSiteSettings = cache(async () => {
  const p = await client();
  const g = await p.findGlobal({ slug: "siteSettings", depth: 1 });
  return {
    siteName: f(g.siteName, siteDefault.name),
    shortName: f(g.shortName, siteDefault.shortName),
    ideaTagline: f(g.ideaTagline, siteDefault.idea),
    email: f(g.email, siteDefault.email),
    phone: f(g.phone, siteDefault.phone),
    footerCredit: f(g.footerCredit, siteDefault.footerCredit),
    socials:
      g.socials?.length
        ? g.socials.map((s) => ({ label: s.label, href: s.url }))
        : siteDefault.socials.map((s) => ({ label: s.label, href: s.href })),
    letsChatLabel: f(g.letsChatLabel, "Let’s chat"),
    letsChatTarget: f(g.letsChatTarget, "/contact"),
    menuItems:
      g.menuItems?.length
        ? g.menuItems.map((m) => ({ label: m.label, href: m.route }))
        : mainNav.map((n) => ({ label: n.label, href: n.href })),
    seo: {
      titleTemplate: f(g.seoTitleTemplate, `%s — ${siteDefault.shortName}`),
      defaultTitle: f(g.seoDefaultTitle, `${siteDefault.name} — ${siteDefault.idea}`),
      defaultDescription: f(g.seoDefaultDescription, siteDefault.description),
    },
  };
});

export const getHome = cache(async () => {
  const p = await client();
  const g = await p.findGlobal({ slug: "homeContent", depth: 0 });
  return {
    showIntroLoader: g.showIntroLoader ?? homeDefault.showIntroLoader,
    heroKicker: f(g.heroKicker, homeDefault.heroKicker),
    heroStatement: runs(g.heroStatement, homeDefault.heroStatement),
    heroSubline: f(g.heroSubline, homeDefault.heroSubline),
    teaserCtaLabel: f(g.teaserCtaLabel, homeDefault.teaserCtaLabel),
  };
});

export const getAbout = cache(async () => {
  const p = await client();
  const g = await p.findGlobal({ slug: "aboutContent", depth: 0 });
  return {
    pageTitle: runs(g.pageTitle, aboutDefault.pageTitle),
    lede: f(g.lede, aboutDefault.lede),
    sections:
      g.sections?.length
        ? g.sections.map((s) => ({
            kicker: s.kicker,
            title: s.title,
            body: (s.body ?? []).map((b) => b.text),
          }))
        : aboutDefault.sections,
    closingStatement: runs(g.closingStatement, aboutDefault.closingStatement),
  };
});

export const getServices = cache(async () => {
  const p = await client();
  const g = await p.findGlobal({ slug: "servicesContent", depth: 0 });
  const services =
    g.services?.length
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
});

export const getContact = cache(async () => {
  const p = await client();
  const g = await p.findGlobal({ slug: "contactContent", depth: 0 });
  const fd = contactDefault.form;
  return {
    heroStory: runs(g.heroStory, contactDefault.heroStory),
    lede: f(g.lede, contactDefault.lede),
    whereWeWorkLabel: f(g.whereWeWorkLabel, contactDefault.whereWeWorkLabel),
    markets:
      g.markets?.length
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
        nameRequired: f(g.form?.fieldErrors?.nameRequired, fd.fieldErrors.nameRequired),
        emailRequired: f(g.form?.fieldErrors?.emailRequired, fd.fieldErrors.emailRequired),
        emailInvalid: f(g.form?.fieldErrors?.emailInvalid, fd.fieldErrors.emailInvalid),
        messageRequired: f(g.form?.fieldErrors?.messageRequired, fd.fieldErrors.messageRequired),
      },
    },
  };
});

export const getCareers = cache(async () => {
  const p = await client();
  const g = await p.findGlobal({ slug: "careersContent", depth: 0 });
  return {
    pageTitle: runs(g.pageTitle, careersDefault.pageTitle),
    lede: f(g.lede, careersDefault.lede),
    openApplicationHeading: f(g.openApplicationHeading, careersDefault.openApplicationHeading),
    ctaLabel: f(g.ctaLabel, careersDefault.ctaLabel),
    ctaTarget: f(g.ctaTarget, careersDefault.ctaTarget),
  };
});

export const getLegal = cache(async (which: "privacy" | "terms") => {
  const p = await client();
  const slug = which === "privacy" ? "legalPrivacy" : "legalTerms";
  const def = which === "privacy" ? privacyContent : termsContent;
  const g = await p.findGlobal({ slug, depth: 0 });
  return {
    title: f(g.title, def.title),
    lastUpdated: f(g.lastUpdated, def.lastUpdated),
    showTemplateNotice: g.showTemplateNotice ?? def.showTemplateNotice,
    intro: f(g.intro, def.intro),
    body: g.body ?? null,
  };
});

// ── Collections ──────────────────────────────────────────────────────────────

export const getPortfolio = cache(async () => {
  const p = await client();
  const res = await p.find({
    collection: "portfolioProjects",
    sort: "order",
    limit: 100,
    where: { _status: { equals: "published" } },
    depth: 0,
  });
  if (!res.docs.length) return projectsDefault;
  return res.docs.map((d) => ({
    name: d.name,
    client: d.client,
    market: d.market,
    discipline: d.discipline,
    result: d.resultLine,
  }));
});

export const getCareerRoles = cache(async () => {
  const p = await client();
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
});
