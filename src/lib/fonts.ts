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
    { path: "../../public/fonts/IvarDisplay-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/IvarDisplay-Italic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/IvarDisplay-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/IvarDisplay-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../../public/fonts/IvarDisplay-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/IvarDisplay-SemiBoldItalic.otf", weight: "600", style: "italic" },
    { path: "../../public/fonts/IvarDisplay-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/IvarDisplay-BoldItalic.otf", weight: "700", style: "italic" },
  ],
});
