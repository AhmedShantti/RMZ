import type { Run } from "@/components/RunsText";

/** Portfolio page header — default + seed source. */
export const portfolioPage = {
  pageTitle: [
    { text: "We solved the problems of", style: "normal", tone: "cream" },
    { text: "dozens", style: "italic", tone: "cream" },
    { text: "of clients.", style: "normal", tone: "cream" },
  ] as Run[],
  lede: "A few of the stories we've built. (Placeholder work shown until the real case studies land.)",
};

/**
 * PLACEHOLDER portfolio (TASK.md §5 /portfolio) — invented projects, clearly
 * marked, until Ahmad supplies real case studies. See NOTES.md.
 *
 * Case studies are BLOCK-BASED: each project carries an ordered `blocks` array
 * and the detail page renders exactly the blocks it finds, in order. A project
 * may use one block or all of them — nothing else has to change. Adding a
 * project = appending one object here (and/or one doc in the CMS).
 */

/** Aspect ratios a visual may declare. Keeps images proportional — never stretched. */
export type VisualRatio = "21/9" | "16/9" | "3/2" | "4/3" | "1/1" | "4/5" | "9/16";

/**
 * One image. `src` is optional on purpose: no real project photography exists
 * yet, so a visual with no src renders the site's standard placeholder tile at
 * the correct ratio instead of collapsing the layout.
 */
export type Visual = {
  src?: string | null;
  alt: string;
  ratio?: VisualRatio;
  caption?: string;
};

/** A single measurable outcome, e.g. "+180%" / "showroom footfall". */
export type Stat = { value: string; label: string };

/** The kind of mockup surface — drives the frame the images sit in. */
export type MockupKind =
  | "mobile"
  | "desktop"
  | "branding"
  | "packaging"
  | "social"
  | "campaign";

/**
 * The composable block union. Add a variant here + a case in ProjectBlocks +
 * a block config in payload/fields/projectBlocks.ts and it's available to every
 * project.
 */
export type ProjectBlock =
  | {
      type: "overview";
      heading?: string;
      idea?: string;
      goal?: string;
      challenge?: string;
    }
  | { type: "services"; heading?: string; items: string[] }
  | { type: "imageFull"; image: Visual }
  | { type: "galleryTwo"; images: Visual[] }
  | { type: "galleryThree"; images: Visual[] }
  | { type: "mockups"; heading?: string; kind: MockupKind; images: Visual[] }
  | { type: "textBreak"; text: string; attribution?: string }
  | { type: "stats"; heading?: string; items: Stat[] }
  | {
      type: "beforeAfter";
      heading?: string;
      note?: string;
      before: Visual;
      after: Visual;
    }
  | { type: "video"; heading?: string; url?: string; poster?: Visual; caption?: string }
  | { type: "summary"; heading?: string; body: string; quote?: string; quoteAuthor?: string };

export type Project = {
  /** URL segment — /portfolio/[slug]. Unique. */
  slug: string;
  name: string;
  client: string;
  market: string;
  /** The discipline doubles as the project's category. */
  discipline: string;
  year: string;
  /** One-line result, shown on the card and under the hero. */
  result: string;
  /** Card + hero visual. */
  cover?: Visual;
  /** Ordered case-study body. Empty is valid — the hero still renders. */
  blocks: ProjectBlock[];
};

export const projects: Project[] = [
  // ── Full case study: every block type in play ───────────────────────────────
  {
    slug: "maydan",
    name: "Maydan",
    client: "Maydan Coffee Co.",
    market: "Egyptian",
    discipline: "Brand Identity",
    year: "2024",
    result: "A street-corner roaster turned a regional name.",
    cover: { alt: "Maydan Coffee Co. brand identity", ratio: "4/3" },
    blocks: [
      {
        type: "overview",
        idea: "A roaster on a Cairo street corner with a queue down the block and nothing to put its name on.",
        goal: "Build an identity that travels — from a paper cup to a shopfront to a shelf in another country.",
        challenge:
          "Keep the neighbourhood in it. The moment it looks imported, the queue stops trusting it.",
      },
      {
        type: "services",
        items: [
          "Brand Strategy",
          "Visual Identity",
          "Arabic + Latin Wordmark",
          "Packaging",
          "Art Direction",
        ],
      },
      { type: "imageFull", image: { alt: "Maydan wordmark on a shopfront", ratio: "16/9" } },
      {
        type: "galleryTwo",
        images: [
          { alt: "Maydan cup and sleeve", ratio: "4/5" },
          { alt: "Maydan bag detail", ratio: "4/5" },
        ],
      },
      {
        type: "textBreak",
        text: "The name was already on the street. We just gave it something to be written on.",
      },
      {
        type: "mockups",
        kind: "branding",
        heading: "The system in the wild",
        images: [
          { alt: "Maydan business cards", ratio: "1/1" },
          { alt: "Maydan signage", ratio: "1/1" },
          { alt: "Maydan apron and uniform", ratio: "1/1" },
        ],
      },
      {
        type: "stats",
        items: [
          { value: "6", label: "New cities" },
          { value: "+180%", label: "Retail sell-through" },
          { value: "2.4k", label: "Cups a day" },
        ],
      },
      {
        type: "beforeAfter",
        note: "Same coffee. Same corner. A name you can now hand to someone.",
        before: { alt: "Maydan packaging before the rebrand", ratio: "4/3" },
        after: { alt: "Maydan packaging after the rebrand", ratio: "4/3" },
      },
      {
        type: "summary",
        body: "Maydan went from a corner everybody knew to a name people ask for by name. The identity holds at the size of a stamp and the size of a wall.",
        quote: "They gave us a name we could grow into.",
        quoteAuthor: "Founder, Maydan Coffee Co.",
      },
    ],
  },

  // ── Campaign: video-led, no packaging or before/after ───────────────────────
  {
    slug: "carrera-lab",
    name: "Carrera Lab",
    client: "Carrera Automotive",
    market: "Gulf",
    discipline: "Campaign",
    year: "2025",
    result: "Launch films that doubled showroom footfall.",
    cover: { alt: "Carrera Lab launch campaign", ratio: "16/9" },
    blocks: [
      {
        type: "overview",
        idea: "A launch nobody was waiting for, in a market that has seen every launch.",
        goal: "Make the car the second most interesting thing in the film.",
      },
      {
        type: "video",
        heading: "The launch film",
        caption: "60-second cut — the version that ran in-market.",
        poster: { alt: "Carrera Lab launch film still", ratio: "16/9" },
      },
      { type: "imageFull", image: { alt: "Carrera Lab key visual", ratio: "21/9" } },
      {
        type: "galleryThree",
        images: [
          { alt: "Carrera Lab out-of-home placement", ratio: "1/1" },
          { alt: "Carrera Lab press still", ratio: "1/1" },
          { alt: "Carrera Lab showroom takeover", ratio: "1/1" },
        ],
      },
      {
        type: "stats",
        heading: "Six weeks in",
        items: [
          { value: "2×", label: "Showroom footfall" },
          { value: "11M", label: "Views, organic" },
          { value: "38%", label: "Lift in test drives" },
        ],
      },
      {
        type: "summary",
        body: "The film gave people a reason to walk in before they had a reason to buy. Footfall doubled and stayed there.",
      },
    ],
  },

  // ── Packaging: short and visual, no stats, no video ─────────────────────────
  {
    slug: "olive-and-ash",
    name: "Olive & Ash",
    client: "Olive & Ash Kitchen",
    market: "Levantine",
    discipline: "Packaging",
    year: "2024",
    result: "Shelf presence that reads from across the aisle.",
    cover: { alt: "Olive & Ash packaging range", ratio: "4/5" },
    blocks: [
      {
        type: "overview",
        idea: "Good food losing an argument with the shelf next to it.",
        challenge: "Twelve SKUs that had to look like one family from three metres away.",
      },
      {
        type: "services",
        items: ["Packaging Design", "Structural Design", "Print Production", "Photography"],
      },
      {
        type: "mockups",
        kind: "packaging",
        heading: "The range",
        images: [
          { alt: "Olive & Ash jar range", ratio: "4/5" },
          { alt: "Olive & Ash label detail", ratio: "4/5" },
          { alt: "Olive & Ash carton", ratio: "4/5" },
        ],
      },
      {
        type: "galleryTwo",
        images: [
          { alt: "Olive & Ash on shelf", ratio: "3/2" },
          { alt: "Olive & Ash product still life", ratio: "3/2" },
        ],
      },
      {
        type: "summary",
        body: "One system, twelve products, and a shelf that finally reads as a brand instead of a queue of labels.",
      },
    ],
  },

  // ── Web & App: mockup-heavy, two mockup blocks of different kinds ───────────
  {
    slug: "noor-living",
    name: "Noor Living",
    client: "Noor Decorations",
    market: "Arab",
    discipline: "Web & App",
    year: "2025",
    result: "A catalogue people actually finish scrolling.",
    cover: { alt: "Noor Living web and app design", ratio: "16/9" },
    blocks: [
      {
        type: "overview",
        idea: "A beautiful catalogue nobody reached the bottom of.",
        goal: "Make browsing feel like walking through the showroom, not filling in a form.",
        challenge: "Two thousand products, one attention span.",
      },
      {
        type: "services",
        items: ["UX Architecture", "UI Design", "Design System", "Front-end Build"],
      },
      {
        type: "mockups",
        kind: "desktop",
        heading: "The catalogue",
        images: [
          { alt: "Noor Living desktop catalogue", ratio: "16/9" },
          { alt: "Noor Living product detail page", ratio: "16/9" },
        ],
      },
      {
        type: "mockups",
        kind: "mobile",
        heading: "In the hand",
        images: [
          { alt: "Noor Living mobile home", ratio: "9/16" },
          { alt: "Noor Living mobile browse", ratio: "9/16" },
          { alt: "Noor Living mobile product", ratio: "9/16" },
        ],
      },
      { type: "imageFull", image: { alt: "Noor Living design system", ratio: "16/9" } },
      {
        type: "stats",
        items: [
          { value: "+64%", label: "Scroll depth" },
          { value: "−41%", label: "Bounce rate" },
          { value: "3.1×", label: "Enquiries" },
        ],
      },
      {
        type: "summary",
        body: "People now reach the bottom of the catalogue — and then send an enquiry from it.",
      },
    ],
  },

  // ── Deliberately minimal: hero + overview + one gallery. Proves the system
  //    holds when almost every block is absent. ─────────────────────────────────
  {
    slug: "sahil",
    name: "Sahil",
    client: "Sahil Resorts",
    market: "Gulf",
    discipline: "Content Strategy",
    year: "2025",
    result: "A voice that sounds like the coast, not a brochure.",
    cover: { alt: "Sahil Resorts content direction", ratio: "16/9" },
    blocks: [
      {
        type: "overview",
        idea: "A coastline that photographs itself, described in the language of a brochure.",
      },
      {
        type: "galleryThree",
        images: [
          { alt: "Sahil coastline", ratio: "4/5" },
          { alt: "Sahil interiors", ratio: "4/5" },
          { alt: "Sahil detail", ratio: "4/5" },
        ],
      },
    ],
  },

  // ── Print: text-led, no stats, no mockups ──────────────────────────────────
  {
    slug: "tahrir-press",
    name: "Tahrir Press",
    client: "Tahrir Press",
    market: "Egyptian",
    discipline: "Print Design",
    year: "2023",
    result: "An editorial system that respects the reader.",
    cover: { alt: "Tahrir Press editorial system", ratio: "3/2" },
    blocks: [
      {
        type: "overview",
        idea: "A press with a century of writing and a layout that fought every word of it.",
        goal: "A grid that gets out of the way.",
      },
      { type: "imageFull", image: { alt: "Tahrir Press spread", ratio: "16/9" } },
      {
        type: "galleryTwo",
        images: [
          { alt: "Tahrir Press cover", ratio: "3/2" },
          { alt: "Tahrir Press typographic detail", ratio: "3/2" },
        ],
      },
      {
        type: "textBreak",
        text: "Design that respects the reader is mostly design you don't notice.",
      },
      {
        type: "summary",
        body: "One grid, one type system, and a paper that reads the way it was written.",
      },
    ],
  },
];
