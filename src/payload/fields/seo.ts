import type { Field } from "payload";

/**
 * Per-page SEO overrides (CMS_TASK §2) — feed the existing per-page metadata.
 * All optional; empty falls back to the site defaults in code.
 */
export const seoField: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  admin: {
    description: "Optional overrides for this page's metadata. Blank = defaults.",
  },
  fields: [
    { name: "title", type: "text", admin: { description: "Overrides the <title>." } },
    {
      name: "description",
      type: "textarea",
      admin: { description: "Overrides the meta description / OG description." },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Overrides the Open Graph image." },
    },
  ],
};
