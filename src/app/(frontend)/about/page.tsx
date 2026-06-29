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

/** Image + dark-red caption card used in sections 5–9. */
function ContentCard({
  side,
  imageLabel,
}: {
  side: "left" | "right";
  imageLabel: string;
}) {
  return (
    <div
      className="absolute top-[18vh] w-[86%] max-w-[440px] sm:w-[40%]"
      style={{ zIndex: 3, [side]: "3vw" } as React.CSSProperties}
    >
      <ImgPlaceholder label={imageLabel} className="h-[26vh] w-full sm:h-[32vh]" />
      <div className="px-5 py-4" style={{ background: "rgba(100,30,20,0.7)" }}>
        <p
          className="font-body text-[13px] leading-[1.6] sm:text-[14px]"
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

      {/* SECTIONS 5–7 — Service cards (content right, squares float left) */}
      <section id="about-service-1" className="relative min-h-screen" style={{ zIndex: 1 }}>
        
        <ContentCard side="right" imageLabel="[ TEAM PHOTO — REPLACE ]" />
      </section>
      <section id="about-service-2" className="relative min-h-screen" style={{ zIndex: 1 }}>
        
        <ContentCard side="right" imageLabel="[ WORKSPACE — REPLACE ]" />
      </section>
      <section id="about-service-3" className="relative min-h-screen" style={{ zIndex: 1 }}>
        
        <ContentCard side="right" imageLabel="[ TEAM PHOTO — REPLACE ]" />
      </section>

      {/* SECTION 8 — Chaos (content LEFT, squares spread right) */}
      <section id="about-chaos" className="relative min-h-screen" style={{ zIndex: 1 }}>
        
        <ContentCard side="left" imageLabel="[ WORKSPACE — REPLACE ]" />
      </section>

      {/* SECTION 9 — Reset (content LEFT, squares reset to a row on the right) */}
      <section id="about-reset" className="relative min-h-screen" style={{ zIndex: 1 }}>
        
        <ContentCard side="left" imageLabel="[ DESK / LAPTOP — REPLACE ]" />
      </section>


    </div>
  );
}
