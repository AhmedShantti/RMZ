import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * portfolioProjects (CMS_TASK §2) — the editorial portfolio cards.
 * Fields match what the cards actually render: name, client, market,
 * discipline, result. Draft/publish + manual order.
 *
 * Intentionally omitted (no render home on the public site today — would be a
 * redesign, not a content swap): coverImage, slug/detail page, externalLink,
 * per-item SEO. See NOTES.md / the approved schema.
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
    afterChange: [revalidate(["/portfolio"])],
    afterDelete: [revalidate(["/portfolio"])],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "client", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "market", type: "text", required: true, admin: { width: "50%" } },
        { name: "discipline", type: "text", required: true, admin: { width: "50%" } },
      ],
    },
    { name: "resultLine", type: "text", required: true, admin: { description: "The one-line result." } },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower shows first.", position: "sidebar" },
    },
  ],
};
