import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { revalidate } from "../hooks/revalidate.ts";
import { projectBlocks } from "../fields/projectBlocks.ts";
import { slugify } from "../../lib/slug.ts";

/**
 * portfolioProjects (CMS_TASK §2) — the editorial portfolio cards AND the
 * block-based case study behind each one.
 *
 * Card fields: name, client, market, discipline, resultLine, coverImage.
 * Detail page: `slug` (the /portfolio/[slug] segment) + `blocks`, an ordered,
 * fully optional case-study body. A project may ship with no blocks at all —
 * the detail page still renders its hero.
 *
 * Draft/publish + manual order are unchanged.
 */
export const PortfolioProjects: CollectionConfig = {
  slug: "portfolioProjects",
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "client", "market", "discipline", "_status", "order"],
    group: "Collections",
  },
  defaultSort: "order",
  versions: { drafts: true },
  hooks: {
    // The project's own page, the index it appears on, and the neighbours whose
    // prev/next links point at it.
    afterChange: [
      revalidate(["/portfolio"]),
      async ({ doc }) => {
        const slug = (doc as { slug?: string }).slug;
        if (slug) await revalidate([`/portfolio/${slug}`])({ doc });
        return doc;
      },
    ],
    afterDelete: [revalidate(["/portfolio"])],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        description:
          "URL segment — /portfolio/<slug>. Left empty, it is derived from the name.",
      },
      hooks: {
        // Derive from the name when the editor leaves it blank, so a project can
        // never be published without a reachable URL.
        beforeValidate: [
          ({ value, data }) => {
            const source = (value as string) || (data?.name as string) || "";
            return source ? slugify(source) : value;
          },
        ],
      },
    },
    { name: "client", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "market", type: "text", required: true, admin: { width: "50%" } },
        { name: "discipline", type: "text", required: true, admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "year",
          type: "text",
          admin: { width: "50%", description: "e.g. 2025" },
        },
      ],
    },
    { name: "resultLine", type: "text", required: true, admin: { description: "The one-line result." } },
    {
      type: "row",
      fields: [
        {
          name: "coverImage",
          type: "upload",
          relationTo: "media",
          admin: { width: "60%", description: "Card + case-study hero visual." },
        },
        {
          name: "coverRatio",
          type: "select",
          defaultValue: "16/9",
          options: ["21/9", "16/9", "3/2", "4/3", "1/1", "4/5", "9/16"].map(
            (r) => ({ label: r, value: r }),
          ),
          admin: { width: "40%", description: "Shape of the hero visual." },
        },
      ],
    },
    {
      name: "blocks",
      type: "blocks",
      blocks: projectBlocks,
      admin: {
        description:
          "The case study. Add, remove and reorder freely — the page renders exactly what's here, in this order.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower shows first.", position: "sidebar" },
    },
  ],
};
