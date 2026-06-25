import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { runsField } from "../fields/runs.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * servicesContent (CMS_TASK §2) — the six numbered services (title + blurb +
 * sub-items, ordered) plus the page title/lede. `featuredOnHome` controls the
 * Home teaser. Numbers (01…06) are derived from order.
 */
export const ServicesContent: GlobalConfig = {
  slug: "servicesContent",
  label: "Services",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/services", "/"])] },
  fields: [
    runsField("pageTitle", "Page title"),
    { name: "lede", type: "textarea" },
    {
      name: "services",
      type: "array",
      labels: { singular: "Service", plural: "Services" },
      admin: { description: "Ordered. The number (01, 02…) follows this order." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "blurb", type: "textarea", required: true },
        {
          name: "items",
          type: "array",
          labels: { singular: "Sub-item", plural: "Sub-items" },
          fields: [{ name: "label", type: "text", required: true }],
        },
        {
          name: "featuredOnHome",
          type: "checkbox",
          label: "Show in Home teaser",
          defaultValue: true,
        },
      ],
    },
    seoField,
  ],
};
