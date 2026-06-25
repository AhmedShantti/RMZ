import localFont from "next/font/local";

/**
 * Display typeface — Fraunces (variable, optical sizing + true italics).
 *
 * SWAP POINT → PP Editorial New:
 *   When Ahmad licenses PP Editorial New, drop its woff2 into public/fonts/
 *   and replace the `src` entries below. Keep `variable: "--font-display"`
 *   so nothing downstream changes. Everything that wants the editorial serif
 *   reads `var(--font-display)`.
 */
export const fraunces = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/Fraunces-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/Fraunces-Italic-Variable.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
});

/** Utility / body typeface — Inter (variable). */
export const inter = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/Inter-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
});
