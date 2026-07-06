import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { runsField } from "../fields/runs.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * aboutContent (CMS_TASK §2) — modelled as the page actually renders: a title,
 * a lede, ordered titled sections (idea / character / personality), and the
 * full-bleed closing statement. (No field that invites naming a real person —
 * personality is expressed as the section's own prose.)
 */
export const AboutContent: GlobalConfig = {
  slug: "aboutContent",
  label: "About",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/about"])] },
  fields: [
    runsField("pageTitle", "Page title"),
    { name: "lede", type: "textarea" },
    {
      type: "collapsible",
      label: "Colour-palette statement (Section 2)",
      admin: {
        description:
          "The three scroll-revealed lines. Styling and layout are fixed in code.",
      },
      fields: [
        {
          name: "colorPalette",
          type: "group",
          label: false,
          fields: [
            { name: "line1", type: "text", label: "Line 1", defaultValue: "COLORPALATTE balances" },
            {
              type: "row",
              fields: [
                { name: "line2Lead", type: "text", label: "Line 2 — bold word", defaultValue: "BOLD", admin: { width: "50%" } },
                { name: "line2Rest", type: "text", label: "Line 2 — spaced word", defaultValue: "EXPRESSION", admin: { width: "50%" } },
              ],
            },
            { name: "line3", type: "text", label: "Line 3", defaultValue: "with Professional Presence" },
          ],
        },
      ],
    },
    {
      name: "sections",
      type: "array",
      labels: { singular: "Section", plural: "Sections" },
      admin: { description: "Idea / character / personality, in order." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "kicker", type: "text", required: true, admin: { width: "35%" } },
            { name: "title", type: "text", required: true, admin: { width: "65%" } },
          ],
        },
        {
          name: "body",
          type: "array",
          labels: { singular: "Paragraph", plural: "Paragraphs" },
          fields: [{ name: "text", type: "textarea", required: true }],
        },
      ],
    },
    runsField("closingStatement", "Closing statement"),
    seoField,
  ],
};
