import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { runsField } from "../fields/runs.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * homeContent (CMS_TASK §2) — the Home page: intro-loader toggle, the hero
 * (kicker + structured statement + subline) and the markets-teaser CTA label.
 * (Which services show in the Home teaser = the `featuredOnHome` flag on each
 * service in servicesContent.)
 */
export const HomeContent: GlobalConfig = {
  slug: "homeContent",
  label: "Home",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/"])] },
  fields: [
    {
      name: "showIntroLoader",
      type: "checkbox",
      label: "Show first-visit intro loader",
      defaultValue: true,
    },
    {
      type: "collapsible",
      label: "Hero",
      fields: [
        { name: "heroKicker", type: "text", defaultValue: "Creative Rebellion" },
        runsField("heroStatement", "Hero statement"),
        {
          name: "heroSubline",
          type: "textarea",
          admin: { description: "The small line under the hero statement." },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Showreel",
      admin: {
        description: "The two coloured vertical-text strips beside the video.",
      },
      fields: [
        {
          name: "showreelLeftLabel",
          type: "text",
          label: "Left strip (green)",
          defaultValue: "How to Success",
        },
        {
          name: "showreelRightLabel",
          type: "text",
          label: "Right strip (orange)",
          defaultValue: "How to be Rebel",
        },
      ],
    },
    {
      name: "clients",
      type: "array",
      label: "Clients collage",
      admin: {
        description:
          "Portrait client photos with optional sticker badges. Leave empty to use the built-in placeholders.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Placeholder caption",
          admin: {
            description: "Shown until a real photo replaces the placeholder.",
          },
        },
        { name: "badgeName", type: "text", label: "Badge name (optional)" },
        {
          name: "badgeAccent",
          type: "select",
          label: "Badge colour",
          defaultValue: "none",
          options: [
            { label: "None", value: "none" },
            { label: "Orange", value: "orange" },
            { label: "Green", value: "green" },
          ],
        },
      ],
    },
    {
      name: "teaserCtaLabel",
      type: "text",
      label: "Markets teaser CTA label",
      defaultValue: "Start a project",
    },
    seoField,
  ],
};
