import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * legalPrivacy & legalTerms (CMS_TASK §2) — calm single-column legal pages:
 * title, lastUpdated, a "template text — review with counsel" notice toggle,
 * an intro line, and a rich-text body (rendered with the site's numbered-
 * heading typography on the public side).
 */
const makeLegalGlobal = (
  slug: "legalPrivacy" | "legalTerms",
  label: string,
  route: string,
): GlobalConfig => ({
  slug,
  label,
  access: { read: anyone, update: authenticated },
  admin: { group: "Legal" },
  hooks: { afterChange: [revalidate([route])] },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "lastUpdated", type: "text", admin: { width: "50%", description: 'e.g. "2026"' } },
        {
          name: "showTemplateNotice",
          type: "checkbox",
          label: 'Show "template text — review with counsel" notice',
          defaultValue: true,
          admin: { width: "50%" },
        },
      ],
    },
    { name: "intro", type: "textarea" },
    {
      name: "body",
      type: "richText",
      admin: {
        description:
          "Use Heading 2 for each numbered section; paragraphs for the prose.",
      },
    },
    seoField,
  ],
});

export const LegalPrivacy = makeLegalGlobal("legalPrivacy", "Privacy Policy", "/privacy");
export const LegalTerms = makeLegalGlobal("legalTerms", "Terms & Conditions", "/terms");
