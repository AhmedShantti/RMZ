import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * careerRoles (CMS_TASK §2) — open roles on /careers. Draft/publish + order.
 * Fields match the role cards: title, type, location, description, applyTarget.
 */
export const CareerRoles: CollectionConfig = {
  slug: "careerRoles",
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "location", "_status", "order"],
    group: "Collections",
  },
  defaultSort: "order",
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidate(["/careers"])],
    afterDelete: [revalidate(["/careers"])],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "type", type: "text", required: true, admin: { width: "50%", description: "Full-time, Contract…" } },
        { name: "location", type: "text", required: true, admin: { width: "50%" } },
      ],
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "applyTarget",
      type: "text",
      defaultValue: "/contact",
      admin: { description: 'Where "apply" links — a route or mailto:.' },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower shows first.", position: "sidebar" },
    },
  ],
};
