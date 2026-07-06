import type { Run } from "@/components/RunsText";

export type ClientPhoto = {
  label: string;
  badgeName: string;
  badgeAccent: "orange" | "green" | "none";
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
  // Showreel section — the two coloured vertical-text strips flanking the video.
  showreel: {
    leftLabel: "How to Success",
    rightLabel: "How to be Rebel",
  },
  // Clients collage — three portrait photos with optional sticker badges. Photos
  // stay placeholder until real imagery lands; the labels/badges are editable.
  clients: [
    { label: "[ CLIENT PHOTO 1 — REPLACE ]", badgeName: "CLIENT NAME", badgeAccent: "orange" },
    { label: "[ CLIENT PHOTO 2 — REPLACE ]", badgeName: "", badgeAccent: "none" },
    { label: "[ CLIENT PHOTO 3 — REPLACE ]", badgeName: "CLIENT NAME", badgeAccent: "green" },
  ] as ClientPhoto[],
};
