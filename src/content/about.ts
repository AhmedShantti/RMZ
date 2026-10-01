import type { Run } from "@/components/RunsText";

/** An About image (banner or section) with its crop focus, as % from the top-left. */
export type AboutImage = {
  url: string;
  alt: string;
  focalX: number;
  focalY: number;
};

/** About page — canonical default + seed source for `aboutContent`. */
export const aboutContent = {
  pageTitle: [
    {
      text: "A bold creative mind that dares to challenge the",
      style: "normal",
      tone: "cream",
    },
    { text: "ordinary", style: "italic", tone: "cream" },
    { text: ".", style: "normal", tone: "cream", noSpaceBefore: true },
  ] as Run[],
  lede: "Rebel Mind Zone is a creative studio built on a simple, stubborn belief: discipline is what makes boldness work.",
  // Section 2 — the scroll-revealed colour-palette statement (three lines).
  // Line 2 is split into its heavy-italic lead + letter-spaced rest; the
  // styling and 3-line layout stay fixed in ColorPaletteSection.
  colorPalette: {
    line1: "COLORPALATTE balances",
    line2Lead: "BOLD",
    line2Rest: "EXPRESSION",
    line3: "with Professional Presence",
  },
  // Banner at the top of the page. TODO: upload a landscape image (≥2400px
  // wide) in /studio → About → Banner; until then a labelled placeholder shows.
  banner: null as AboutImage | null,
  // Heading at the bottom of the banner; empty = hidden. Suggested text to enter
  // in /studio → About → Banner title: "Discipline makes\nboldness work." (a
  // newline becomes a line break).
  bannerTitle: "",
  sections: [
    {
      image: null as AboutImage | null, // TODO: upload in /studio → About → Sections (4:5, ~1200×1500)
      kicker: "The idea",
      title: "Creative Rebellion",
      body: [
        "Not rebellion for the sake of rebellion. Ours is disciplined creativity — guided by experience, curiosity and innovation.",
        "We challenge the ordinary not to make noise, but to make better. The discipline is the point; the boldness is what it buys.",
      ],
    },
    {
      image: null as AboutImage | null,
      kicker: "The character",
      title: "Thoughtful, confident, bold",
      body: [
        "We challenge ideas to improve them, not to disrupt for its own sake. Strong opinions, lightly held — and always in service of the work.",
        "We connect people, perspectives and possibilities. The interesting answer usually lives where three of them meet.",
      ],
    },
    {
      image: null as AboutImage | null,
      kicker: "The personality",
      title: "Calm. Curious. A great listener.",
      body: [
        "Picture a mind that's confident without being loud — intelligent without being overwhelming, and relatable across generations.",
        "Someone who listens first, asks the better question, then says the bold thing once it's earned. That's the room we try to be.",
      ],
    },
  ],
  closingStatement: [
    {
      text: "A bold creative mind that dares to challenge the",
      style: "normal",
      tone: "cream",
    },
    { text: "ordinary", style: "italic", tone: "cream" },
    { text: "in order to create", style: "normal", tone: "cream" },
    { text: "extraordinary", style: "italic", tone: "red" },
    { text: "ideas.", style: "normal", tone: "cream" },
  ] as Run[],
};
