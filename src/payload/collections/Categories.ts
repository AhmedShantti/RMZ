import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { revalidate } from "../hooks/revalidate.ts";
import { slugify } from "../../lib/slug.ts";

/**
 * categories — powers the grouped sections on /portfolio. A project belongs to
 * one category (see `category` on portfolioProjects); a category with no
 * projects simply doesn't render a section.
 *
 * `sortOrder` controls the order categories appear in on /portfolio — lower
 * shows first.
 */
export const Categories: CollectionConfig = {
  slug: "categories",
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sortOrder"],
    group: "Collections",
  },
  defaultSort: "sortOrder",
  hooks: {
    afterChange: [revalidate(["/portfolio"])],
    afterDelete: [revalidate(["/portfolio"])],
  },
  fields: [
    { name: "title", type: "text", required: true, unique: true },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        description:
          "Derived from the title. Not used in a URL today — reserved for a future category page.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = (value as string) || (data?.title as string) || "";
            return source ? slugify(source) : value;
          },
        ],
      },
    },
    {
      name: "sortOrder",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Order on /portfolio — lower shows first." },
    },
  ],
};
