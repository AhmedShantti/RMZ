import type { Run } from "@/components/RunsText";

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
};
