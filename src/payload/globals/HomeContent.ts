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
        description:
          "Pinned swipe showreel: scrolling slides from one video to the next. Videos are always muted, looping and inline (needed for autoplay); only the active one plays. 0 videos hides the section, 1 video is shown without pinning.",
      },
      fields: [
        {
          name: "showreelVideoWidth",
          type: "number",
          label: "Video width (% of screen)",
          defaultValue: 91,
          min: 70,
          max: 100,
          admin: { description: "Desktop/tablet width, 70–100 (capped at 1800px). Phones are always full-width. Recommended: 85–95." },
        },
        {
          name: "showreelAspectRatio",
          type: "select",
          label: "Aspect ratio",
          defaultValue: "16:9",
          options: [
            { label: "16:9 (default)", value: "16:9" },
            { label: "21:9 (cinematic)", value: "21:9" },
            { label: "4:5 (portrait)", value: "4:5" },
            { label: "Match each video's own ratio", value: "source" },
          ],
        },
        {
          name: "showreelObjectFit",
          type: "select",
          label: "Fit",
          defaultValue: "cover",
          options: [
            { label: "Cover (fill, may crop)", value: "cover" },
            { label: "Contain (show all, may letterbox)", value: "contain" },
          ],
        },
        { name: "showreelShowCounter", type: "checkbox", label: "Show counter (01/03)", defaultValue: true },
        { name: "showreelShowDots", type: "checkbox", label: "Show dots", defaultValue: true },
        {
          name: "showreelShowCaptions",
          type: "checkbox",
          label: "Show captions",
          defaultValue: true,
          admin: { description: "Shows each video's caption next to the counter, when it has one." },
        },
        {
          name: "showreelTransitionSpeed",
          type: "select",
          label: "Transition speed",
          defaultValue: "normal",
          options: [
            { label: "Fast (0.5s)", value: "fast" },
            { label: "Normal (0.8s)", value: "normal" },
            { label: "Slow (1.1s)", value: "slow" },
          ],
        },
        {
          name: "showreelScrollPerVideo",
          type: "select",
          label: "Scroll per video",
          defaultValue: "normal",
          options: [
            { label: "Short (80vh)", value: "short" },
            { label: "Normal (100vh)", value: "normal" },
            { label: "Long (140vh)", value: "long" },
          ],
          admin: { description: "How far the visitor scrolls (while the section is pinned) to move to the next video." },
        },
        {
          name: "showreelVideos",
          type: "array",
          label: "Videos",
          labels: { singular: "Video", plural: "Videos" },
          fields: [
            {
              name: "video",
              type: "upload",
              relationTo: "media",
              required: true,
              admin: { description: "MP4/WebM video file (standard quality — used on phones/tablets)." },
            },
            {
              name: "hdVideo",
              type: "upload",
              relationTo: "media",
              label: "High-res version (optional)",
              admin: {
                description:
                  "1080p+ MP4/WebM of the same video. Used on wide screens, where the video is shown at ~80% of the viewport width — 640×360 sources look soft there.",
              },
            },
            {
              name: "poster",
              type: "upload",
              relationTo: "media",
              label: "Poster image (optional)",
              admin: { description: "Shown while the video loads." },
            },
            {
              name: "title",
              type: "text",
              label: "Caption (optional)",
              admin: { description: "Shown next to the counter when 'Show captions' is on." },
            },
            {
              name: "ariaLabel",
              type: "text",
              label: "Accessible description (optional)",
              admin: { description: "Read by screen readers. Falls back to the caption." },
            },
          ],
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
      name: "clientsHeading",
      type: "text",
      label: "Clients section heading",
      defaultValue: "Clients",
    },
    {
      name: "clientCards",
      type: "array",
      label: "Client cards (rotating showcase)",
      admin: {
        description:
          "Clients shown in the rotating card showcase — each a name, category and photo. Leave a photo empty to show a placeholder.",
      },
      fields: [
        { name: "name", type: "text", required: true, label: "Client name" },
        { name: "category", type: "text", label: "Category" },
        {
          name: "photo",
          type: "upload",
          relationTo: "media",
          label: "Photo",
        },
        {
          name: "project",
          type: "relationship",
          relationTo: "portfolioProjects",
          label: "Portfolio project",
          admin: {
            description:
              "Clicking this card opens this project's case study. Leave empty and the card is not clickable.",
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "About / Stairs titles",
      admin: {
        description:
          "How the small title next to the 01 / 04 counter looks. The title text itself is edited per step below.",
      },
      fields: [
        {
          name: "stairsTitleSize",
          type: "select",
          label: "Title size",
          defaultValue: "large",
          options: [
            { label: "Small (≈11–13px)", value: "small" },
            { label: "Medium (≈12–16px)", value: "medium" },
            { label: "Large (≈13–20px, default)", value: "large" },
            { label: "Extra large (≈16–26px)", value: "xl" },
          ],
          admin: { description: "Scales with the screen width. Recommended: Large." },
        },
        {
          name: "stairsTitleUppercase",
          type: "checkbox",
          label: "Uppercase titles",
          defaultValue: true,
        },
        {
          name: "stairsTitleOpacity",
          type: "number",
          label: "Title opacity",
          defaultValue: 0.6,
          min: 0.4,
          max: 1,
          admin: {
            step: 0.05,
            description: "0.4 (faint) – 1 (same as the number). Recommended: 0.55–0.7.",
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Stairs section",
      admin: {
        description:
          "Size and spacing of the 01 / NN stacked-image section. The steps themselves are the list below.",
      },
      fields: [
        {
          name: "stairsImageScale",
          type: "number",
          label: "Image scale (%)",
          defaultValue: 125,
          min: 80,
          max: 140,
          admin: {
            step: 5,
            description:
              "Card size, 80–140. 100 = the original size; the default 125 is 25% larger. Recommended: 110–130.",
          },
        },
        {
          name: "stairsOffset",
          type: "select",
          label: "Stair spacing",
          defaultValue: "normal",
          options: [
            { label: "Tight", value: "tight" },
            { label: "Normal", value: "normal" },
            { label: "Wide", value: "wide" },
          ],
          admin: { description: "Distance between one step and the next in the staircase." },
        },
        {
          name: "stairsAspectRatio",
          type: "select",
          label: "Image aspect ratio",
          defaultValue: "3:4",
          options: [
            { label: "3:4 (portrait, default)", value: "3:4" },
            { label: "4:5", value: "4:5" },
            { label: "1:1 (square)", value: "1:1" },
            { label: "16:9 (landscape)", value: "16:9" },
          ],
        },
      ],
    },
    {
      name: "stairs",
      type: "array",
      label: "Stairs steps (logo-squares journey)",
      minRows: 2,
      maxRows: 8,
      labels: { singular: "Step", plural: "Steps" },
      admin: {
        description:
          "2–8 steps. The counter (01 / NN) and the scroll length follow the number of steps — add, remove or drag to reorder. Each step: image, alt text, title and paragraph.",
      },
      fields: [
        {
          name: "photo",
          type: "upload",
          relationTo: "media",
          label: "Image (required)",
          // Enforced by validate (not `required`) so the DB column stays
          // nullable — older documents without a photo keep loading.
          validate: ((v: unknown, o: { req?: { context?: Record<string, unknown> } }) =>
            v || o?.req?.context?.seed ? true : "An image is required.") as never,
          admin: { description: "Recommended: at least 1200px on the long edge." },
        },
        {
          name: "alt",
          type: "text",
          label: "Alt text (required)",
          validate: ((v: unknown, o: { req?: { context?: Record<string, unknown> } }) =>
            (typeof v === "string" && v.trim()) || o?.req?.context?.seed
              ? true
              : "Alt text is required — describe the image in a few words.") as never,
          admin: {
            description: "Describes the image for screen readers. Falls back to the media item's alt, then the title.",
          },
        },
        {
          name: "imagePosition",
          type: "select",
          label: "Image focus (crop)",
          defaultValue: "center",
          options: [
            { label: "Center", value: "center" },
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
            { label: "Top left", value: "top left" },
            { label: "Top right", value: "top right" },
            { label: "Bottom left", value: "bottom left" },
            { label: "Bottom right", value: "bottom right" },
          ],
          admin: { description: "Which part of the image stays visible when it is cropped to the card shape." },
        },
        {
          name: "title",
          type: "text",
          label: "Title (2–4 words)",
          maxLength: 60,
          admin: {
            description:
              "Small label shown next to the counter (e.g. 01 / 04 — Questioning First). Empty = the built-in default for steps 1–4.",
          },
        },
        {
          name: "showTitle",
          type: "checkbox",
          label: "Show the title",
          defaultValue: true,
          admin: { description: "Untick to hide this step's title (the counter still shows)." },
        },
        {
          name: "paragraph",
          type: "textarea",
          required: true,
          label: "Paragraph",
        },
      ],
    },
    {
      name: "marqueeCards",
      type: "array",
      label: "Marquee cards (post-stairs scrolling row)",
      admin: {
        description:
          "The scrolling card row the three brand squares morph into. Brand colours (yellow → orange → green) cycle automatically per card; upload a photo to fill a card (object-cover). Leave empty to show the colour + number placeholders.",
      },
      fields: [
        {
          name: "photo",
          type: "upload",
          relationTo: "media",
          label: "Photo",
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
