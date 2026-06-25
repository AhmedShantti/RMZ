/** Six numbered offerings (TASK.md §5 /services). */
export type Service = {
  index: string;
  title: string;
  blurb: string;
  items: string[];
};

export const services: Service[] = [
  {
    index: "01",
    title: "Design",
    blurb:
      "Identity systems with a backbone — built to hold up in the wild, not just on a moodboard.",
    items: [
      "Brand Identity Design",
      "Packaging Design",
      "Web & App Design",
      "Print Design",
    ],
  },
  {
    index: "02",
    title: "Content Creation",
    blurb:
      "Words and stories with a point of view. Strategy first, then sentences that earn attention.",
    items: [
      "Content Strategy",
      "Copywriting",
      "Blog Writing",
      "Social Media Content",
    ],
  },
  {
    index: "03",
    title: "Photography",
    blurb:
      "Frames that carry the brand — composed, deliberate, never stock-shaped.",
    items: ["Art Direction", "Product & Still Life", "Lifestyle", "Campaign"],
  },
  {
    index: "04",
    title: "Video Production",
    blurb:
      "Motion with intent, from the first board to the final grade.",
    items: ["Concept & Script", "Direction", "Editing", "Motion & Grade"],
  },
  {
    index: "05",
    title: "Creative Consulting",
    blurb:
      "A second mind in the room — challenging ideas to improve them, not to disrupt.",
    items: [
      "Brand Strategy",
      "Positioning",
      "Naming",
      "Creative Direction",
    ],
  },
  {
    index: "06",
    title: "Web & App Development",
    blurb:
      "Design that ships. Fast, accessible, and faithful to the original intent.",
    items: [
      "Front-end Engineering",
      "Web Experiences",
      "App Development",
      "Performance & A11y",
    ],
  },
];
