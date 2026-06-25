import type { Run } from "@/components/RunsText";
import { site } from "./site.ts";

/** Careers page header + open-application CTA — default + seed source. */
export const careersPage = {
  pageTitle: [
    { text: "Creative", style: "normal", tone: "cream" },
    { text: "rebels", style: "italic", tone: "cream" },
    { text: "welcome.", style: "normal", tone: "cream" },
  ] as Run[],
  lede: "We hire for point of view and the discipline to back it up. If you challenge the brief to make it better — not just louder — we should talk.",
  openApplicationHeading: "Don’t see your role? Make the case anyway.",
  ctaLabel: "Send an open application",
  ctaTarget: `mailto:${site.email}?subject=Open application — RMZ`,
};

/**
 * PLACEHOLDER careers roles (TASK.md §5 /careers) — clearly marked, replace
 * with real openings. See NOTES.md.
 */
export type Role = {
  title: string;
  type: string;
  location: string;
  blurb: string;
};

export const roles: Role[] = [
  {
    title: "Brand Designer",
    type: "Full-time",
    location: "Cairo / Hybrid",
    blurb:
      "You make identity systems with a backbone — and you can argue for every decision.",
  },
  {
    title: "Copywriter (Arabic & English)",
    type: "Full-time",
    location: "Remote",
    blurb:
      "You write with a point of view in two languages, and you cut the line that doesn't earn its place.",
  },
  {
    title: "Motion Designer",
    type: "Contract",
    location: "Remote",
    blurb:
      "You give ideas momentum — from the first board to the final grade.",
  },
  {
    title: "Creative Intern",
    type: "Internship",
    location: "Cairo",
    blurb:
      "You're curious, fast, and unafraid to challenge the brief in the room.",
  },
];
