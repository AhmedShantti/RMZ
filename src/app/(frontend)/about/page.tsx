import type { Metadata } from "next";
import AboutScrollSquares from "@/components/AboutScrollSquares";
import ScrollExploreBadge from "@/components/ScrollExploreBadge";
import SectionNav from "@/components/SectionNav";
import Logo from "@/components/Logo";
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
      className="absolute top-[15vh] w-[88%] sm:w-[52%]"
      style={{ zIndex: 3, [side]: "2vw" } as React.CSSProperties}
    >
      <ImgPlaceholder label={imageLabel} className="h-[45vh] w-full" />
      <div className="px-6 py-5" style={{ background: "rgba(100,30,20,0.7)" }}>
        <p
          className="font-body text-[15px] leading-[1.7]"
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
        overflowX: "hidden",
      }}
    >
      {/* Animated squares overlay (fixed, z-50) + hero badge (z-60) */}
      <AboutScrollSquares />
      <ScrollExploreBadge />

      {/* SECTION 1 — Hero (squares' Stage 1 stage; no text) */}
      <section id="about-hero" className="relative min-h-screen" />

      {/* SECTION 2 — Color Palette Statement (static decorative squares + lines) */}
      <section
        id="about-colorpalette"
        className="relative min-h-screen"
        style={{ zIndex: 1 }}
      >
        {/* Line 1 — yellow square (left edge) — "COLORPALATTE balances" */}
        <div className="absolute" style={{ left: 0, top: "35vh" }}>
          <Sq color={YELLOW} size={55} />
        </div>
        <div
          className="absolute hidden sm:block"
          style={{
            left: 55,
            top: "calc(35vh + 27px)",
            width: "calc(12vw - 55px)",
            height: 1,
            background: "rgba(255,255,255,0.6)",
          }}
        />
        <p
          className="font-body absolute"
          style={{
            left: "12vw",
            top: "calc(35vh + 6px)",
            fontSize: "clamp(18px,2.5vw,28px)",
            fontWeight: 400,
            color: CREAM,
          }}
        >
          COLORPALATTE balances
        </p>

        {/* Line 2 — "BOLD EXPRESSION" — green square (right edge) */}
        <p
          className="font-body absolute"
          style={{
            left: "18vw",
            top: "calc(45vh + 6px)",
            fontSize: "clamp(18px,2.5vw,28px)",
          }}
        >
          <span style={{ fontWeight: 900, fontStyle: "italic", color: CREAM }}>
            BOLD
          </span>{" "}
          <span style={{ fontWeight: 400, letterSpacing: "0.08em" }}>
            EXPRESSION
          </span>
        </p>
        <div
          className="absolute hidden sm:block"
          style={{
            right: 55,
            top: "calc(45vh + 27px)",
            width: "10vw",
            height: 1,
            background: "rgba(255,255,255,0.6)",
          }}
        />
        <div className="absolute" style={{ right: 0, top: "45vh" }}>
          <Sq color={GREEN} size={55} />
        </div>

        {/* Line 3 — red square (left) — "with Professional Presence" */}
        <div className="absolute" style={{ left: "2vw", top: "58vh" }}>
          <Sq color={RED} size={55} />
        </div>
        <div
          className="absolute hidden sm:block"
          style={{
            left: "calc(2vw + 55px)",
            top: "calc(58vh + 27px)",
            width: "calc(10vw - 55px)",
            height: 1,
            background: "rgba(255,255,255,0.6)",
          }}
        />
        <p
          className="font-body absolute"
          style={{
            left: "12vw",
            top: "calc(58vh + 6px)",
            fontSize: "clamp(18px,2.5vw,28px)",
            fontWeight: 400,
            color: CREAM,
          }}
        >
          with Professional Presence
        </p>
      </section>

      {/* SECTION 3 — Logo Reveal (squares converge into it) */}
      <section id="about-logo" className="relative min-h-screen" style={{ zIndex: 1 }}>
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "clamp(180px,30vw,380px)",
          }}
        >
          <Logo className="w-full" />
        </div>
      </section>

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
        <SectionNav />
        <ContentCard side="right" imageLabel="[ TEAM PHOTO — REPLACE ]" />
      </section>
      <section id="about-service-2" className="relative min-h-screen" style={{ zIndex: 1 }}>
        <SectionNav />
        <ContentCard side="right" imageLabel="[ WORKSPACE — REPLACE ]" />
      </section>
      <section id="about-service-3" className="relative min-h-screen" style={{ zIndex: 1 }}>
        <SectionNav />
        <ContentCard side="right" imageLabel="[ TEAM PHOTO — REPLACE ]" />
      </section>

      {/* SECTION 8 — Chaos (content LEFT, squares spread right) */}
      <section id="about-chaos" className="relative min-h-screen" style={{ zIndex: 1 }}>
        <SectionNav />
        <ContentCard side="left" imageLabel="[ WORKSPACE — REPLACE ]" />
      </section>

      {/* SECTION 9 — Reset (content LEFT, squares reset to a row on the right) */}
      <section id="about-reset" className="relative min-h-screen" style={{ zIndex: 1 }}>
        <SectionNav />
        <ContentCard side="left" imageLabel="[ DESK / LAPTOP — REPLACE ]" />
      </section>

      {/* SECTION 10 — Last Work preview + CLIENTS watermark */}
      <section
        id="about-lastwork"
        className="relative min-h-screen overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div
          className="font-body absolute flex items-center gap-2 uppercase"
          style={{
            right: "4vw",
            top: "3vh",
            fontSize: 13,
            letterSpacing: "0.1em",
            color: "rgba(245,240,232,0.6)",
          }}
        >
          Last Work
          <span className="flex gap-[5px]">
            <Sq color={YELLOW} size={16} />
            <Sq color={RED} size={16} />
            <Sq color={GREEN} size={16} />
          </span>
        </div>

        {/* image mosaic, anchored to the bottom (slight crop) */}
        <div className="absolute bottom-0 left-0 flex w-full">
          {["Work 1", "Work 2", "Work 3", "Work 4"].map((w) => (
            <ImgPlaceholder
              key={w}
              label={`[ ${w} — REPLACE ]`}
              className="h-[35vh] w-[25vw]"
            />
          ))}
        </div>

        {/* giant CLIENTS watermark (stroke only) */}
        <span
          aria-hidden="true"
          className="font-display absolute"
          style={{
            bottom: "-2vh",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            fontSize: "clamp(80px,14vw,180px)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(245,240,232,0.15)",
            whiteSpace: "nowrap",
          }}
        >
          CLIENTS
        </span>
      </section>
    </div>
  );
}
