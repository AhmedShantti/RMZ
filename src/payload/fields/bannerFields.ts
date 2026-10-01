import type { Field } from "payload";

/**
 * Alt text is required whenever the banner image is set (validated here, not
 * `required`, so the column stays nullable and existing content keeps loading).
 * The site falls back to the media item's own alt if this is left empty in code
 * paths that bypass validation.
 */
const altRequired = (
  value: unknown,
  { siblingData, req }: { siblingData?: Record<string, unknown>; req?: { context?: Record<string, unknown> } },
) => {
  if (req?.context?.seed) return true;
  if (siblingData?.bannerImage && !(typeof value === "string" && value.trim())) {
    return "Alt text is required when an image is set — describe the image in a few words.";
  }
  return true;
};

/**
 * Page banner fields (image + alt + focal point + animated title), shared by
 * pages that render <PageBanner>. Same shape as the About page's banner.
 */
export const bannerFields: Field = {
  type: "collapsible",
  label: "Banner (top of the page)",
  admin: {
    description:
      "Full-width image at the very top of the page, with an optional animated title on it. No image = no banner (the page looks as before).",
  },
  fields: [
    {
      name: "bannerImage",
      type: "upload",
      relationTo: "media",
      label: "Banner image",
      admin: {
        description:
          "Landscape, at least 2400px wide (about 2400×1350 is ideal), JPG/WebP, under about 4 MB (ideally under 500 KB).",
      },
    },
    {
      name: "bannerAlt",
      type: "text",
      label: "Alt text (required with an image)",
      validate: altRequired as never,
      admin: {
        description: "Describes the banner for screen readers. Falls back to the media item's alt text.",
      },
    },
    {
      type: "row",
      fields: [
        { name: "bannerFocalX", type: "number", label: "Focal point X (%)", defaultValue: 50, min: 0, max: 100, admin: { width: "50%", description: "0 = left, 100 = right. Which part stays visible when the banner is cropped." } },
        { name: "bannerFocalY", type: "number", label: "Focal point Y (%)", defaultValue: 50, min: 0, max: 100, admin: { width: "50%", description: "0 = top, 100 = bottom." } },
      ],
    },
    {
      name: "bannerTitle",
      type: "textarea",
      label: "Banner title",
      admin: {
        rows: 2,
        description:
          "Heading shown on the banner photo. Leave empty to hide. Press Enter for a manual line break (about 2–8 words works best).",
      },
    },
  ],
};
