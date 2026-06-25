import type { Run } from "@/components/RunsText";

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
  sections: [
    {
      kicker: "The idea",
      title: "Creative Rebellion",
      body: [
        "Not rebellion for the sake of rebellion. Ours is disciplined creativity — guided by experience, curiosity and innovation.",
        "We challenge the ordinary not to make noise, but to make better. The discipline is the point; the boldness is what it buys.",
      ],
    },
    {
      kicker: "The character",
      title: "Thoughtful, confident, bold",
      body: [
        "We challenge ideas to improve them, not to disrupt for its own sake. Strong opinions, lightly held — and always in service of the work.",
        "We connect people, perspectives and possibilities. The interesting answer usually lives where three of them meet.",
      ],
    },
    {
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
