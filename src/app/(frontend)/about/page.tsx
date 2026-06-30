import type { Metadata } from "next";
import AboutScrollSquares from "@/components/AboutScrollSquares";
import ColorPaletteSection from "@/components/ColorPaletteSection";
import { getMeta } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMeta("aboutContent", {
    title: "About",
    description:
      "Creative Rebellion is not chaos. Rebel Mind Zone is disciplined creativity — guided by experience, curiosity and innovation.",
  });
  return {
    title: m.title,
    description: m.description,
    ...(m.ogImageUrl ? { openGraph: { images: [m.ogImageUrl] } } : {}),
  };
}

// Brand square colors (static decorative — never the animated overlay)
const YELLOW = "#fdc82f";
const RED = "#e85d1e";
const GREEN = "#8dc63f";

const CREAM = "#f5f0e8";
const MUTED = "rgba(245,240,232,0.7)";

const TAGLINE =
  "Through strategy, creativity, and smart marketing solutions, we help brands grow, stand out, and connect with their audience.";
const ABOUT_BODY =
  "Powered by Creativity. We are a full-service digital agency blending strategy with bold design to help brands stand out, connect deeply, and grow with purpose in a fast-moving world.";

/** Project thumbnail labels (placeholders — swap for real photos). */
const WORK_CARDS = [
  "[ TEAM PHOTO — REPLACE ]",
  "[ WORKSPACE — REPLACE ]",
  "[ TEAM PHOTO — REPLACE ]",
  "[ WORKSPACE — REPLACE ]",
  "[ DESK / LAPTOP — REPLACE ]",
];

/** Labeled dark image placeholder (project convention; swap for real assets). */
function ImgPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    // TODO: Replace with a real photo
    <div
      className={`flex items-center justify-center bg-[#1a1a1a] ${className}`}
    >
      <span className="font-body text-sm text-[#666]">{label}</span>
    </div>
  );
}

/**
 * Project thumbnail card — identical 16/9 image box + fixed-height caption so
 * every card is the same shape and equal height in the grid.
 */
function ContentCard({ imageLabel }: { imageLabel: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg">
      {/* 16/9 image box. For a real photo, replace <ImgPlaceholder> with:
          <Image src={…} alt={…} fill className="object-cover"
                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw" /> */}
      <div className="relative aspect-[16/9] w-full">
        <ImgPlaceholder label={imageLabel} className="absolute inset-0" />
      </div>
      <div
        className="flex min-h-[88px] flex-1 flex-col justify-center p-6"
        style={{ background: "rgba(100,30,20,0.7)" }}
      >
        <p
          className="font-body line-clamp-3 text-[14px] leading-[1.6]"
          style={{ color: CREAM }}
        >
          {TAGLINE}
        </p>
      </div>
    </div>
  );
}

/** Tiny flat decorative square. */
function Sq({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, backgroundColor: color, display: "block" }}
    />
  );
}

export default function AboutPage() {
  return (
    <div
      className="relative"
      style={{
        background:
          "radial-gradient(ellipse at bottom right, #5c0000 0%, #1a0000 40%, #000000 100%)",
        color: CREAM,
      }}
    >
      {/* Animated squares overlay (fixed, z-50) + hero badge (z-60) */}
      <AboutScrollSquares />

      {/* SECTION 1 — Hero (squares' Stage 1 stage; no text) */}
      <section id="about-hero" className="relative min-h-screen" />

      {/* SECTION 2 — Color Palette Statement (scroll-driven reveal + freeze) */}
      <ColorPaletteSection />

      

      {/* SECTION 4 — About Us Intro (two columns) */}
      <section id="about-us" className="relative min-h-screen px-[8vw]" style={{ zIndex: 1 }}>
        {/* Left column */}
        <div className="absolute left-[8vw] w-[45%]" style={{ top: "20vh" }}>
          <div className="flex items-center gap-3">
            <h2
              className="font-body"
              style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, color: CREAM }}
            >
              About Us
            </h2>
            <span className="flex gap-1.5">
              <Sq color={YELLOW} /> <Sq color={RED} /> <Sq color={GREEN} />
            </span>
          </div>
          <p
            className="font-body mt-[10vh] max-w-[420px]"
            style={{ fontSize: 14, lineHeight: 1.8, color: MUTED }}
          >
            {ABOUT_BODY}
          </p>
        </div>

        {/* Right column — kept below the square zone (top 0–30vh left clear) */}
        <div className="absolute left-1/2 w-[45%]" style={{ top: "35vh" }}>
          <p
            className="font-body max-w-[420px]"
            style={{ fontSize: 14, lineHeight: 1.8, color: MUTED }}
          >
            {TAGLINE} We challenge ideas to improve them, not to disrupt — and we
            connect people, perspectives and possibilities into work that lasts.
          </p>
        </div>
      </section>

      {/* SECTIONS 5–9 — Project thumbnails in a consistent responsive grid
          (1 col mobile, 2 col desktop; equal-size 16/9 cards, even gaps). */}
      <section
        id="about-work"
        className="relative px-[8vw] py-24 sm:py-32"
        style={{ zIndex: 1 }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {WORK_CARDS.map((label, i) => (
            <ContentCard key={`${label}-${i}`} imageLabel={label} />
          ))}
        </div>
      </section>


    </div>
  );
}
