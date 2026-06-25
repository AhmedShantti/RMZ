import type { GlobalConfig } from "payload";
import { anyone, adminsOnly } from "../access.ts";
import { revalidate } from "../hooks/revalidate.ts";

/** Real site routes — menu items / link targets may only point at these. */
export const ROUTE_OPTIONS = [
  { label: "Home", value: "/" },
  { label: "About Us", value: "/about" },
  { label: "Services", value: "/services" },
  { label: "Portfolio", value: "/portfolio" },
  { label: "Careers", value: "/careers" },
  { label: "Contact", value: "/contact" },
  { label: "Privacy Policy", value: "/privacy" },
  { label: "Terms & Conditions", value: "/terms" },
];

/**
 * siteSettings (CMS_TASK §2) — global chrome: socials, phone, email, footer
 * credit, the Let's-chat target, the menu items, and default SEO.
 * Admin-only writes (it's "settings", not page content).
 */
export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  label: "Site Settings",
  access: { read: anyone, update: adminsOnly },
  admin: { group: "Settings" },
  // chrome appears on every page → revalidate the whole layout tree
  hooks: { afterChange: [revalidate([], ["/"])] },
  fields: [
    {
      type: "collapsible",
      label: "Identity",
      fields: [
        { name: "siteName", type: "text", required: true },
        { name: "shortName", type: "text", required: true },
        {
          name: "ideaTagline",
          type: "text",
          label: "Idea / tagline",
          admin: { description: 'e.g. "Creative Rebellion is not chaos"' },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Contact details",
      fields: [
        { name: "email", type: "email", required: true },
        { name: "phone", type: "text" },
        {
          name: "socials",
          type: "array",
          labels: { singular: "Social", plural: "Socials" },
          fields: [
            {
              type: "row",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "url", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Navigation",
      fields: [
        {
          name: "letsChatLabel",
          type: "text",
          defaultValue: "Let’s chat",
        },
        {
          name: "letsChatTarget",
          type: "select",
          options: ROUTE_OPTIONS,
          defaultValue: "/contact",
        },
        {
          name: "menuItems",
          type: "array",
          labels: { singular: "Menu item", plural: "Menu items" },
          admin: {
            description:
              "Overlay menu, in order. Numbers (01, 02…) are added automatically.",
          },
          fields: [
            {
              type: "row",
              fields: [
                { name: "label", type: "text", required: true },
                {
                  name: "route",
                  type: "select",
                  required: true,
                  options: ROUTE_OPTIONS,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Footer",
      fields: [
        {
          name: "footerCredit",
          type: "text",
          admin: {
            description:
              'Year is added automatically, e.g. "© 2026 {this text}".',
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Default SEO",
      fields: [
        {
          name: "seoTitleTemplate",
          type: "text",
          admin: { description: 'Use %s for the page title, e.g. "%s — RMZ".' },
        },
        { name: "seoDefaultTitle", type: "text" },
        { name: "seoDefaultDescription", type: "textarea" },
        {
          name: "seoDefaultOgImage",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};
