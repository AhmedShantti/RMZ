import localFont from "next/font/local";

/**
 * Site typeface — IvarDisplay (self-hosted OTF). Used for the WHOLE site: both
 * the display role (`--font-display`) and the body/utility role (`--font-body`,
 * aliased to this in globals.css) read the same family.
 *
 * Faces provided: 400 / 500 / 600 / 700, each with a true italic. Weight values
 * already in the markup are unchanged — heavier requests (e.g. 800/900) match
 * the nearest available face (700) since synthesis is disabled.
 */
export const ivarDisplay = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../../public/fonts/IvarDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/IvarDisplay-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/IvarDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/IvarDisplay-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/fonts/IvarDisplay-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/IvarDisplay-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "../../public/fonts/IvarDisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/IvarDisplay-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});
