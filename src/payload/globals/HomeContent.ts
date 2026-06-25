import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { runsField } from "../fields/runs.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * homeContent (CMS_TASK §2) — the Home page: intro-loader toggle, the hero
 * (kicker + structured statement + subline) and the markets-teaser CTA label.
 * (Which services show in the Home teaser = the `featuredOnHome` flag on each
 * service in servicesContent.)
 */
export const HomeContent: GlobalConfig = {
  slug: "homeContent",
  label: "Home",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/"])] },
  fields: [
    {
      name: "showIntroLoader",
      type: "checkbox",
      label: "Show first-visit intro loader",
      defaultValue: true,
    },
    {
      type: "collapsible",
      label: "Hero",
      fields: [
        { name: "heroKicker", type: "text", defaultValue: "Creative Rebellion" },
        runsField("heroStatement", "Hero statement"),
        {
          name: "heroSubline",
          type: "textarea",
          admin: { description: "The small line under the hero statement." },
        },
      ],
    },
    {
      name: "teaserCtaLabel",
      type: "text",
      label: "Markets teaser CTA label",
      defaultValue: "Start a project",
    },
    seoField,
  ],
};
