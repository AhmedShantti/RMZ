import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access.ts";
import { runsField } from "../fields/runs.ts";
import { seoField } from "../fields/seo.ts";
import { revalidate } from "../hooks/revalidate.ts";

/**
 * contactContent (CMS_TASK §2) — the contact hero line (shared with the Home
 * markets teaser), the four markets (Egyptian highlighted), and the contact
 * form's microcopy. Socials/phone come from siteSettings (not duplicated here).
 */
export const ContactContent: GlobalConfig = {
  slug: "contactContent",
  label: "Contact",
  access: { read: anyone, update: authenticated },
  admin: { group: "Pages" },
  hooks: { afterChange: [revalidate(["/contact", "/"])] },
  fields: [
    runsField("heroStory", "Hero line (STORY)"),
    { name: "lede", type: "textarea", label: "Intro line (under the hero)" },
    {
      type: "collapsible",
      label: "Info bar (address + email)",
      admin: {
        description: "The line between the intro and the form: office address on one side, email on the other.",
      },
      fields: [
        {
          name: "officeAddress",
          type: "text",
          label: "Office address",
          defaultValue: "Office 102: Nasr City, Cairo, Egypt",
          admin: { description: "Shown on the left of the info bar. Empty = the built-in address." },
        },
        {
          name: "contactEmail",
          type: "email",
          label: "Contact email",
          admin: {
            description:
              "Shown (and used as the mailto link) on the right of the info bar. Empty = the site email from Site settings.",
          },
        },
        {
          name: "emailLinkLabel",
          type: "text",
          label: "Email arrow — accessible label",
          defaultValue: "Email us",
          admin: { description: "Read by screen readers for the arrow icon next to the email." },
        },
      ],
    },
    {
      name: "whereWeWorkLabel",
      type: "text",
      defaultValue: "Where we work",
    },
    {
      name: "markets",
      type: "array",
      labels: { singular: "Market", plural: "Markets" },
      admin: { description: "The four markets, in order. Highlight = rendered in red." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true, admin: { width: "70%" } },
            {
              name: "isHighlighted",
              type: "checkbox",
              label: "Highlight (red)",
              defaultValue: false,
              admin: { width: "30%" },
            },
          ],
        },
        {
          name: "categories",
          type: "array",
          labels: { singular: "Category", plural: "Categories" },
          fields: [{ name: "label", type: "text", required: true }],
        },
        { name: "blurb", type: "text", admin: { description: '"We solved the problems of…"' } },
        { name: "contactLine", type: "text", admin: { description: "Email or phone for this market." } },
      ],
    },
    {
      name: "form",
      type: "group",
      label: "Contact form",
      fields: [
        {
          name: "recipientEmail",
          type: "email",
          admin: { description: "Where the form sends. Blank = the site email." },
        },
        { name: "submitLabel", type: "text", defaultValue: "Send it" },
        {
          name: "sendingLabel",
          type: "text",
          label: "Submit button — while sending",
          defaultValue: "Sending…",
        },
        {
          name: "sendAnotherLabel",
          type: "text",
          label: "“Send another” link (after success)",
          defaultValue: "Send another →",
        },
        {
          name: "submitError",
          type: "text",
          label: "Message when sending fails",
          defaultValue: "Something went wrong sending your message. Please try again in a moment.",
          admin: { description: "Shown above the form if the server can't be reached or rejects the message." },
        },
        {
          name: "labels",
          type: "group",
          label: "Field labels",
          fields: [
            { name: "fullName", type: "text", label: "Full name", defaultValue: "Full Name" },
            { name: "email", type: "text", label: "Email", defaultValue: "Email" },
            { name: "company", type: "text", label: "Company", defaultValue: "Company Name" },
            { name: "phone", type: "text", label: "Phone", defaultValue: "Phone Number" },
            { name: "country", type: "text", label: "Country", defaultValue: "Country" },
            { name: "countryPlaceholder", type: "text", label: "Country — placeholder option", defaultValue: "Select country" },
            { name: "message", type: "text", label: "Message (project brief)", defaultValue: "Give us a brief about your project" },
          ],
        },
        {
          name: "countries",
          type: "array",
          label: "Country list",
          labels: { singular: "Country", plural: "Countries" },
          admin: { description: "The options in the Country drop-down, in order. Empty = the built-in list." },
          fields: [{ name: "label", type: "text", required: true }],
        },
        { name: "successHeading", type: "text" },
        { name: "successBody", type: "textarea" },
        {
          name: "errorSummary",
          type: "text",
          admin: { description: "Shown above the form when validation fails." },
        },
        {
          name: "fieldErrors",
          type: "group",
          label: "Field validation messages",
          fields: [
            { name: "nameRequired", type: "text" },
            { name: "emailRequired", type: "text" },
            { name: "emailInvalid", type: "text" },
            { name: "messageRequired", type: "text" },
          ],
        },
      ],
    },
    seoField,
  ],
};
