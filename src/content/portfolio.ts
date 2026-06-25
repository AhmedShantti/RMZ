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
 */
export type Project = {
  name: string;
  client: string;
  market: string;
  discipline: string;
  result: string;
};

export const projects: Project[] = [
  {
    name: "Maydan",
    client: "Maydan Coffee Co.",
    market: "Egyptian",
    discipline: "Brand Identity",
    result: "A street-corner roaster turned a regional name.",
  },
  {
    name: "Carrera Lab",
    client: "Carrera Automotive",
    market: "Gulf",
    discipline: "Campaign",
    result: "Launch films that doubled showroom footfall.",
  },
  {
    name: "Olive & Ash",
    client: "Olive & Ash Kitchen",
    market: "Levantine",
    discipline: "Packaging",
    result: "Shelf presence that reads from across the aisle.",
  },
  {
    name: "Noor Living",
    client: "Noor Decorations",
    market: "Arab",
    discipline: "Web & App",
    result: "A catalogue people actually finish scrolling.",
  },
  {
    name: "Sahil",
    client: "Sahil Resorts",
    market: "Gulf",
    discipline: "Content Strategy",
    result: "A voice that sounds like the coast, not a brochure.",
  },
  {
    name: "Tahrir Press",
    client: "Tahrir Press",
    market: "Egyptian",
    discipline: "Print Design",
    result: "An editorial system that respects the reader.",
  },
];
