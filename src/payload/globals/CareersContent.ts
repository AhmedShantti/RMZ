import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { runsField } from "../fields/runs.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * careersContent (CMS_TASK §2) — page title/lede + the open-application block.
 * The actual roles live in the `careerRoles` collection (CRUD + draft/ordering).
 */
export const CareersContent: GlobalConfig = {
  slug: "careersContent",
  label: "Careers",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/careers"])] },
  fields: [
    runsField("pageTitle", "Page title"),
    { name: "lede", type: "textarea" },
    {
      type: "collapsible",
      label: "Open application",
      fields: [
        { name: "openApplicationHeading", type: "text" },
        {
          type: "row",
          fields: [
            { name: "ctaLabel", type: "text", admin: { width: "50%" } },
            {
              name: "ctaTarget",
              type: "text",
              admin: {
                width: "50%",
                description: 'Route or mailto:, e.g. "mailto:hello@…".',
              },
            },
          ],
        },
      ],
    },
    seoField,
  ],
};
