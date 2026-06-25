import type { CollectionConfig } from "payload";

/**
 * Uploads — feeds OG images (and can hold the rmz logo asset when supplied).
 * `alt` is required to preserve the site's alt-text discipline.
 * Local disk in dev; Vercel Blob in prod (wired via storage adapter).
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true, // public read (images are served publicly)
  },
  admin: { group: "Library" },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image for screen readers + SEO." },
    },
  ],
};
