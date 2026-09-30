import type { Run } from "@/components/RunsText";
import {
  STAIRS_DEFAULTS,
  SHOWREEL_DEFAULTS,
  type ImagePosition,
  type StairsSettings,
  type ShowreelSettings,
} from "../lib/homeSettings.ts";

export type ClientPhoto = {
  label: string;
  badgeName: string;
  badgeAccent: "orange" | "green" | "none";
};

/** A stairs step (logo-squares journey): a photo window + its paragraph. */
export type StairStep = {
  photoUrl: string | null;
  alt: string;
  /** Short label (2–4 words) shown beside the counter. */
  title: string;
  /** false hides this step's title (the counter still shows). */
  showTitle: boolean;
  /** CSS object-position — which part of the photo survives the crop. */
  imagePosition: ImagePosition;
  paragraph: string;
};

/** A marquee card — the scrolling row the brand squares become. Colour + label
 * are assigned in code (brand cycle); the CMS only owns the photo. */
export type MarqueePhoto = {
  photoUrl: string | null;
  alt: string;
};

/** A client card in the rotating showcase (ClientsSection). */
export type ClientCardItem = {
  name: string;
  category: string;
  photoUrl: string | null;
  alt: string;
  /** The linked portfolio project's page (/portfolio/<slug>); none = not clickable. */
  href?: string | null;
};

/**
 * Home page content — the canonical default (matches what the page rendered
 * before the CMS). Used as the component fallback AND as the seed source for
 * the `homeContent` global. Keep in sync with the CMS schema shape.
 */
/** Fallback counter titles per stairs step, used when the CMS title is empty. */
export const DEFAULT_STAIR_TITLES = [
  "Questioning First",
  "Discipline Meets Boldness",
  "Work Meets World",
  "The Story Climbs",
];

export const homeContent = {
  showIntroLoader: true,
  heroKicker: "Creative Rebellion",
  // The mixed roman/italic/heavy + red statement, as structured runs (§3).
  heroStatement: [
    { text: "Color palette", style: "normal", tone: "cream", upper: true },
    { text: "balances", style: "italic", tone: "dim" },
    { text: "bold expression", style: "bold", tone: "red", upper: true },
    { text: "with", style: "italic", tone: "dim" },
    { text: "Professional Presence.", style: "italic", tone: "cream" },
  ] as Run[],
  heroSubline:
    "A creative studio for brands with the courage to challenge the ordinary.",
  teaserCtaLabel: "Start a project",
  // Showreel section — the full-width video marquee. Videos are CMS-uploaded;
  // empty here falls back to the built-in placeholders.
  showreel: {
    videos: [] as { url: string; hdUrl?: string; poster?: string; title?: string; ariaLabel?: string }[],
    settings: SHOWREEL_DEFAULTS as ShowreelSettings,
  },
  // Clients collage — three portrait photos with optional sticker badges. Photos
  // stay placeholder until real imagery lands; the labels/badges are editable.
  clients: [
    { label: "[ CLIENT PHOTO 1 — REPLACE ]", badgeName: "CLIENT NAME", badgeAccent: "orange" },
    { label: "[ CLIENT PHOTO 2 — REPLACE ]", badgeName: "", badgeAccent: "none" },
    { label: "[ CLIENT PHOTO 3 — REPLACE ]", badgeName: "CLIENT NAME", badgeAccent: "green" },
  ] as ClientPhoto[],
  // Logo-squares stairs — exactly 4 steps (the animation lands 3 squares on the
  // first three cards + one extra). Each step: a photo + its paragraph.
  stairsSettings: STAIRS_DEFAULTS as StairsSettings,
  stairs: [
    { photoUrl: null, alt: "", showTitle: true, imagePosition: "center", title: DEFAULT_STAIR_TITLES[0], paragraph: "Step one — where the idea is born. Placeholder copy describing the first image." },
    { photoUrl: null, alt: "", showTitle: true, imagePosition: "center", title: DEFAULT_STAIR_TITLES[1], paragraph: "Step two — discipline shapes the boldness. Placeholder copy for the second image." },
    { photoUrl: null, alt: "", showTitle: true, imagePosition: "center", title: DEFAULT_STAIR_TITLES[2], paragraph: "Step three — the work meets the world. Placeholder copy for the third image." },
    { photoUrl: null, alt: "", showTitle: true, imagePosition: "center", title: DEFAULT_STAIR_TITLES[3], paragraph: "Step four — the story keeps climbing. Placeholder copy for the fourth image." },
  ] as StairStep[],
  // Marquee cards — the scrolling row the three brand squares morph into. Brand
  // colours cycle in code; photos stay placeholder until real imagery lands.
  marqueeCards: [
    { photoUrl: null, alt: "" },
    { photoUrl: null, alt: "" },
    { photoUrl: null, alt: "" },
  ] as MarqueePhoto[],
  // Rotating client showcase (ClientsSection). Heading + cards are CMS-driven;
  // photos stay placeholder until real imagery lands.
  clientsHeading: "Clients",
  // TODO(BTS): upload three behind-the-scenes photos in the CMS (/studio → Home →
  // Client cards) — bts-1, bts-2, bts-3: portrait 3:4, 1200×1600px (min 720×960),
  // JPG or WebP, ≤ ~300 KB each, with descriptive alt text on the media item.
  // Until then each card shows its placeholder label.
  clientCards: [
    { name: "bts-1 — add photo", category: "Behind the scenes", photoUrl: null, alt: "" },
    { name: "bts-2 — add photo", category: "Behind the scenes", photoUrl: null, alt: "" },
    { name: "bts-3 — add photo", category: "Behind the scenes", photoUrl: null, alt: "" },
  ] as ClientCardItem[],
};
