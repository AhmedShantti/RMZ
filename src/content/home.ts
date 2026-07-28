import type { Run } from "@/components/RunsText";

export type ClientPhoto = {
  label: string;
  badgeName: string;
  badgeAccent: "orange" | "green" | "none";
};

/** A stairs step (logo-squares journey): a photo window + its paragraph. */
export type StairStep = {
  photoUrl: string | null;
  alt: string;
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
};

/**
 * Home page content — the canonical default (matches what the page rendered
 * before the CMS). Used as the component fallback AND as the seed source for
 * the `homeContent` global. Keep in sync with the CMS schema shape.
 */
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
    videos: [] as { url: string; topLabel?: string; bottomLabel?: string }[],
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
  stairs: [
    { photoUrl: null, alt: "", paragraph: "Step one — where the idea is born. Placeholder copy describing the first image." },
    { photoUrl: null, alt: "", paragraph: "Step two — discipline shapes the boldness. Placeholder copy for the second image." },
    { photoUrl: null, alt: "", paragraph: "Step three — the work meets the world. Placeholder copy for the third image." },
    { photoUrl: null, alt: "", paragraph: "Step four — the story keeps climbing. Placeholder copy for the fourth image." },
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
  clientCards: [
    { name: "Client one", category: "Restaurants", photoUrl: null, alt: "" },
    { name: "Client two", category: "Automotive", photoUrl: null, alt: "" },
    { name: "Client three", category: "Decorations", photoUrl: null, alt: "" },
    { name: "Client four", category: "Restaurants", photoUrl: null, alt: "" },
    { name: "Client five", category: "Automotive", photoUrl: null, alt: "" },
    { name: "Client six", category: "Decorations", photoUrl: null, alt: "" },
  ] as ClientCardItem[],
};
