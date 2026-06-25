/**
 * Site-wide constants. Several values are placeholders flagged for Ahmad —
 * see NOTES.md. Keep this the single source of truth so swaps are one-line.
 */
export const site = {
  name: "Rebel Mind Zone",
  shortName: "RMZ",
  idea: "Creative Rebellion is not chaos",
  url: "https://rebelmindzone.com", // PLACEHOLDER — confirm final domain
  description:
    "Rebel Mind Zone (RMZ) — a creative marketing studio for brands with the courage to challenge the ordinary. Brand identity, content, photography, video and creative consulting.",
  // PLACEHOLDER — confirm/replace (storyboard format kept verbatim)
  phone: "+02 01000 45 666",
  email: "hello@rebelmindzone.com", // PLACEHOLDER
  footerCredit: "All rights reserved. fromanother.", // exact storyboard credit
  socials: [
    { label: "Instagram", href: "https://instagram.com" }, // PLACEHOLDER URL
    { label: "Facebook", href: "https://facebook.com" }, // PLACEHOLDER URL
    { label: "LinkedIn", href: "https://linkedin.com" }, // PLACEHOLDER URL
  ],
} as const;
