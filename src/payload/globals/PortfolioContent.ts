import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { runsField } from "../fields/runs.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * portfolioContent — the /portfolio page header (title + lede) and SEO. The
 * projects themselves live in the portfolioProjects collection; this global
 * only owns the editorial header, which was previously hardcoded.
 */
export const PortfolioContent: GlobalConfig = {
  slug: "portfolioContent",
  label: "Portfolio",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/portfolio"])] },
  fields: [
    runsField("pageTitle", "Page title"),
    {
      name: "lede",
      type: "textarea",
      admin: { description: "The intro line under the page title." },
    },
    seoField,
  ],
};
