import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { runsField } from "../fields/runs.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * Alt text is required whenever the sibling image is set (validated here, not
 * `required`, so the column stays nullable and existing content keeps loading).
 */
const altRequired = (
  value: unknown,
  { siblingData, req }: { siblingData?: Record<string, unknown>; req?: { context?: Record<string, unknown> } },
) => {
  if (req?.context?.seed) return true;
  const hasImage = Boolean(siblingData?.image ?? siblingData?.bannerImage);
  if (hasImage && !(typeof value === "string" && value.trim())) {
    return "Alt text is required when an image is set — describe the image in a few words.";
  }
  return true;
};

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
      label: "Banner (top of the page)",
      admin: {
        description:
          "Full-width image at the very top of the About page. Empty shows a labelled placeholder.",
      },
      fields: [
        {
          name: "bannerImage",
          type: "upload",
          relationTo: "media",
          label: "Banner image",
          admin: {
            description:
              "Landscape, at least 2400px wide (about 2400×1350 is ideal), JPG/WebP, ideally under 500 KB.",
          },
        },
        {
          name: "bannerTitle",
          type: "textarea",
          label: "Banner title",
          admin: {
            rows: 2,
            description:
              "Heading shown at the bottom of the About banner. Leave empty to hide. Press Enter for a manual line break (about 2–8 words works best).",
          },
        },
        {
          name: "bannerAlt",
          type: "text",
          label: "Alt text (required with an image)",
          validate: altRequired as never,
          admin: { description: "Describes the banner for screen readers." },
        },
        {
          type: "row",
          fields: [
            { name: "bannerFocalX", type: "number", label: "Focal point X (%)", defaultValue: 50, min: 0, max: 100, admin: { width: "50%", description: "0 = left, 100 = right. Which part stays visible when the banner is cropped." } },
            { name: "bannerFocalY", type: "number", label: "Focal point Y (%)", defaultValue: 50, min: 0, max: 100, admin: { width: "50%", description: "0 = top, 100 = bottom." } },
          ],
        },
      ],
    },
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
      admin: {
        description:
          "Idea / character / personality, in order. Each section can have an image; sections alternate image-left / image-right. A section without an image is shown as full-width text.",
      },
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
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Image",
          admin: {
            description:
              "Portrait 4:5, about 1200×1500px, JPG/WebP around 300 KB. Shown beside this section.",
          },
        },
        {
          name: "imageAlt",
          type: "text",
          label: "Alt text (required with an image)",
          validate: altRequired as never,
        },
        {
          type: "row",
          fields: [
            { name: "focalX", type: "number", label: "Focal point X (%)", defaultValue: 50, min: 0, max: 100, admin: { width: "50%", description: "0 = left, 100 = right." } },
            { name: "focalY", type: "number", label: "Focal point Y (%)", defaultValue: 50, min: 0, max: 100, admin: { width: "50%", description: "0 = top, 100 = bottom." } },
          ],
        },
      ],
    },
    runsField("closingStatement", "Closing statement"),
    seoField,
  ],
};
