import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * btsContent — the Behind The Scenes page (/bts) AND the Home page's BTS
 * section (which replaced the old Clients cards). One ordered list of items:
 * each has a card image (shown on Home), the video (shown on /bts), a title and
 * a label. Clicking a Home card opens /bts at that item's video.
 */
export const BtsContent: GlobalConfig = {
  slug: "btsContent",
  label: "BTS (Behind the scenes)",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/bts", "/"])] },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Page title",
      defaultValue: "Behind the scenes",
      admin: { description: "The heading of the /bts page." },
    },
    {
      name: "lede",
      type: "textarea",
      label: "Intro line",
      admin: { description: "Shown under the page title." },
    },
    {
      name: "homeHeading",
      type: "text",
      label: "Home section heading",
      defaultValue: "Behind The Scenes",
      admin: { description: "The heading above the cards on the Home page." },
    },
    {
      name: "items",
      type: "array",
      label: "BTS items",
      labels: { singular: "BTS item", plural: "BTS items" },
      admin: {
        description:
          "In order. Each item is a card on the Home page (image + title + label) that opens its video on the BTS page. The Home section is hidden while this list is empty.",
      },
      fields: [
        { name: "title", type: "text", required: true, label: "Title" },
        {
          name: "label",
          type: "text",
          label: "Label",
          admin: { description: 'Small line under the title on the Home card, e.g. "Product shoot". Empty = "Behind the scenes".' },
        },
        {
          name: "cardImage",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Card image (Home)",
          admin: { description: "Portrait 3:4, about 1200×1600px, JPG/WebP ~300 KB. Shown on the Home card." },
        },
        {
          name: "video",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Video (BTS page)",
          admin: {
            description:
              "MP4/WebM. Keep it under about 4 MB (uploads go through the server, which has a 4.5 MB request limit).",
          },
        },
        {
          name: "poster",
          type: "upload",
          relationTo: "media",
          label: "Video poster (optional)",
          admin: { description: "Shown before the video plays on the BTS page. Empty = the card image." },
        },
        {
          name: "description",
          type: "textarea",
          label: "Description (optional)",
          admin: { description: "Shown under the video on the BTS page." },
        },
      ],
    },
    seoField,
  ],
};
