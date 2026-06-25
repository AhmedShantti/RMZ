/**
 * The four markets (TASK.md §5 /contact, storyboard p.7).
 * The Egyptian market is the "home / active" market — rendered in red.
 */
export type Market = {
  name: string;
  sectors: string[];
  line: string;
  contact: string;
  home?: boolean;
};

export const markets: Market[] = [
  {
    name: "The Gulf market",
    sectors: ["Restaurants", "Automotive", "Decorations"],
    line: "We solved the problems of dozens of clients.",
    contact: "gulf@rebelmindzone.com", // PLACEHOLDER
  },
  {
    name: "The Levantine market",
    sectors: ["Restaurants", "Automotive", "Decorations"],
    line: "We solved the problems of dozens of clients.",
    contact: "levant@rebelmindzone.com", // PLACEHOLDER
  },
  {
    name: "The Arab market",
    sectors: ["Restaurants", "Automotive", "Decorations"],
    line: "We solved the problems of dozens of clients.",
    contact: "arab@rebelmindzone.com", // PLACEHOLDER
  },
  {
    name: "The Egyptian market",
    sectors: ["Restaurants", "Automotive", "Decorations"],
    line: "We solved the problems of dozens of clients.",
    contact: "+02 01000 45 666", // PLACEHOLDER — storyboard format
    home: true,
  },
];
