import type { Block, Field } from "payload";

/**
 * Case-study blocks for portfolioProjects — the CMS mirror of the `ProjectBlock`
 * union in src/content/portfolio.ts. Block slugs match the union's `type` values
 * exactly, so lib/cms.ts can map a CMS block to a code block by name alone.
 *
 * Editors compose a project by adding/removing/reordering these. Every block is
 * optional; the detail page renders only what's present.
 *
 * When adding a block: add it here AND to the ProjectBlock union AND to the
 * switch in components/portfolio/ProjectBlocks.tsx.
 */

const RATIOS = ["21/9", "16/9", "3/2", "4/3", "1/1", "4/5", "9/16"] as const;

/**
 * One image: the upload + how it should be framed.
 *
 * The upload is deliberately NOT required. A block can be composed — and its
 * shape reviewed — before the photography exists; the page renders the standard
 * placeholder tile at the chosen ratio until an image is attached.
 */
const visual = (name: string, label: string): Field => ({
  name,
  label,
  type: "group",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: { width: "60%" },
        },
        {
          name: "ratio",
          type: "select",
          options: RATIOS.map((r) => ({ label: r, value: r })),
          admin: {
            width: "40%",
            description: "Aspect ratio the image is framed to (never stretched).",
          },
        },
      ],
    },
    { name: "caption", type: "text" },
  ],
});

/** A repeating list of images (galleries, mockups). */
const visualList = (min: number, max: number): Field => ({
  name: "images",
  type: "array",
  minRows: min,
  maxRows: max,
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: { width: "60%" },
        },
        {
          name: "ratio",
          type: "select",
          options: RATIOS.map((r) => ({ label: r, value: r })),
          admin: { width: "40%" },
        },
      ],
    },
    { name: "caption", type: "text" },
  ],
});

const heading: Field = {
  name: "heading",
  type: "text",
  admin: { description: "Optional — a sensible default is used when empty." },
};

export const projectBlocks: Block[] = [
  {
    slug: "overview",
    labels: { singular: "Overview", plural: "Overview" },
    fields: [
      heading,
      { name: "idea", type: "textarea" },
      { name: "goal", type: "textarea" },
      { name: "challenge", type: "textarea" },
    ],
  },
  {
    slug: "services",
    labels: { singular: "Services / Scope", plural: "Services / Scope" },
    fields: [
      heading,
      {
        name: "items",
        type: "array",
        minRows: 1,
        fields: [{ name: "label", type: "text", required: true }],
      },
    ],
  },
  {
    slug: "imageFull",
    labels: { singular: "Full-width image", plural: "Full-width images" },
    fields: [visual("image", "Image")],
  },
  {
    slug: "galleryTwo",
    labels: { singular: "Gallery — two columns", plural: "Galleries — two columns" },
    fields: [visualList(2, 2)],
  },
  {
    slug: "galleryThree",
    labels: { singular: "Gallery — three columns", plural: "Galleries — three columns" },
    fields: [visualList(3, 3)],
  },
  {
    slug: "mockups",
    labels: { singular: "Mockups", plural: "Mockups" },
    fields: [
      heading,
      {
        name: "kind",
        type: "select",
        required: true,
        defaultValue: "branding",
        options: [
          { label: "Mobile", value: "mobile" },
          { label: "Desktop", value: "desktop" },
          { label: "Branding", value: "branding" },
          { label: "Packaging", value: "packaging" },
          { label: "Social media", value: "social" },
          { label: "Campaign", value: "campaign" },
        ],
      },
      visualList(1, 6),
    ],
  },
  {
    slug: "textBreak",
    labels: { singular: "Text between visuals", plural: "Text between visuals" },
    fields: [
      { name: "text", type: "textarea", required: true },
      { name: "attribution", type: "text" },
    ],
  },
  {
    slug: "stats",
    labels: { singular: "Results / numbers", plural: "Results / numbers" },
    fields: [
      heading,
      {
        name: "items",
        type: "array",
        minRows: 1,
        maxRows: 4,
        fields: [
          {
            type: "row",
            fields: [
              {
                name: "value",
                type: "text",
                required: true,
                admin: { width: "40%", description: 'e.g. "+180%"' },
              },
              {
                name: "label",
                type: "text",
                required: true,
                admin: { width: "60%", description: 'e.g. "Retail sell-through"' },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "beforeAfter",
    labels: { singular: "Before / After", plural: "Before / After" },
    fields: [
      heading,
      visual("before", "Before"),
      visual("after", "After"),
      { name: "note", type: "textarea" },
    ],
  },
  {
    slug: "video",
    labels: { singular: "Video", plural: "Videos" },
    fields: [
      heading,
      {
        name: "url",
        type: "text",
        admin: {
          description:
            "Direct video file URL. Leave empty to show the poster with the play mark.",
        },
      },
      visual("poster", "Poster"),
      { name: "caption", type: "text" },
    ],
  },
  {
    slug: "summary",
    labels: { singular: "Final summary", plural: "Final summaries" },
    fields: [
      heading,
      { name: "body", type: "textarea", required: true },
      { name: "quote", type: "textarea" },
      { name: "quoteAuthor", type: "text" },
    ],
  },
];
