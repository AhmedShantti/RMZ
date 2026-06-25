import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { runsField } from "../fields/runs.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * contactContent (CMS_TASK §2) — the contact hero line (shared with the Home
 * markets teaser), the four markets (Egyptian highlighted), and the contact
 * form's microcopy. Socials/phone come from siteSettings (not duplicated here).
 */
export const ContactContent: GlobalConfig = {
  slug: "contactContent",
  label: "Contact",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/contact", "/"])] },
  fields: [
    runsField("heroStory", "Hero line (STORY)"),
    { name: "lede", type: "textarea" },
    {
      name: "whereWeWorkLabel",
      type: "text",
      defaultValue: "Where we work",
    },
    {
      name: "markets",
      type: "array",
      labels: { singular: "Market", plural: "Markets" },
      admin: { description: "The four markets, in order. Highlight = rendered in red." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true, admin: { width: "70%" } },
            {
              name: "isHighlighted",
              type: "checkbox",
              label: "Highlight (red)",
              defaultValue: false,
              admin: { width: "30%" },
            },
          ],
        },
        {
          name: "categories",
          type: "array",
          labels: { singular: "Category", plural: "Categories" },
          fields: [{ name: "label", type: "text", required: true }],
        },
        { name: "blurb", type: "text", admin: { description: '"We solved the problems of…"' } },
        { name: "contactLine", type: "text", admin: { description: "Email or phone for this market." } },
      ],
    },
    {
      name: "form",
      type: "group",
      label: "Contact form",
      fields: [
        {
          name: "recipientEmail",
          type: "email",
          admin: { description: "Where the form sends. Blank = the site email." },
        },
        { name: "submitLabel", type: "text", defaultValue: "Send it" },
        { name: "successHeading", type: "text" },
        { name: "successBody", type: "textarea" },
        {
          name: "errorSummary",
          type: "text",
          admin: { description: "Shown above the form when validation fails." },
        },
        {
          name: "fieldErrors",
          type: "group",
          label: "Field validation messages",
          fields: [
            { name: "nameRequired", type: "text" },
            { name: "emailRequired", type: "text" },
            { name: "emailInvalid", type: "text" },
            { name: "messageRequired", type: "text" },
          ],
        },
      ],
    },
    seoField,
  ],
};
