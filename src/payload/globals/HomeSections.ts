import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * homeSections — three extra sections of the Home page, each fully editable and
 * switchable on/off here: Selected work (featured projects), Client logos, and a
 * closing call-to-action banner. They sit lower on the page (after the services
 * list), never at the top.
 */
export const HomeSections: GlobalConfig = {
  slug: "homeSections",
  label: "Home sections",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/"])] },
  fields: [
    {
      name: "featuredWork",
      type: "group",
      label: "Selected work",
      admin: { description: "A grid of featured projects, below the services list." },
      fields: [
        { name: "enabled", type: "checkbox", label: "Show this section", defaultValue: true },
        { name: "kicker", type: "text", defaultValue: "Selected work" },
        { name: "heading", type: "text", defaultValue: "Work we are proud of" },
        {
          name: "projects",
          type: "relationship",
          relationTo: "portfolioProjects",
          hasMany: true,
          maxRows: 6,
          admin: {
            description:
              "Pick up to 6 projects, in the order they should appear. Left empty, the first 6 projects of the Portfolio are shown. Unpublished projects are skipped.",
          },
        },
        { name: "buttonLabel", type: "text", defaultValue: "See all work" },
        { name: "buttonLink", type: "text", defaultValue: "/portfolio", admin: { description: "Where the button goes." } },
      ],
    },
    {
      name: "clientLogos",
      type: "group",
      label: "Client logos",
      admin: { description: "A slowly scrolling row of the brands you have worked with. Hidden while there are no logos." },
      fields: [
        { name: "enabled", type: "checkbox", label: "Show this section", defaultValue: true },
        { name: "heading", type: "text", defaultValue: "Brands we have built with" },
        {
          name: "logos",
          type: "array",
          labels: { singular: "Logo", plural: "Logos" },
          fields: [
            { name: "name", type: "text", required: true, admin: { description: "Brand name — shown as text if there is no logo image, and read by screen readers." } },
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              admin: { description: "Optional. A white or light logo on a transparent background (PNG/SVG/WebP) looks best." },
            },
          ],
        },
      ],
    },
    {
      name: "ctaBanner",
      type: "group",
      label: "Call-to-action banner",
      admin: { description: "A big closing banner with a button, just above the contact block." },
      fields: [
        { name: "enabled", type: "checkbox", label: "Show this section", defaultValue: true },
        { name: "kicker", type: "text", defaultValue: "Have a project in mind?" },
        { name: "heading", type: "text", defaultValue: "Let’s make something bold." },
        { name: "text", type: "textarea", admin: { description: "Optional line under the heading." } },
        { name: "buttonLabel", type: "text", defaultValue: "Start a project" },
        { name: "buttonLink", type: "text", defaultValue: "/contact" },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Background image",
          admin: { description: "Optional. Shown dimmed behind the text. Wide, about 2400×1200px." },
        },
      ],
    },
  ],
};
