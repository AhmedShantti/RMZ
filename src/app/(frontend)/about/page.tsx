import type { Metadata } from "next";
import AboutScrollSquares from "@/components/AboutScrollSquares";
import ColorPaletteSection from "@/components/ColorPaletteSection";
import { getMeta } from "@/lib/cms";
import AboutAnimationController from "@/components/AboutAnimationController";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import AccentBlocks from "@/components/AccentBlocks";
import RunsText from "@/components/RunsText";
import { getAbout } from "@/lib/cms";
import ScrollIndicator from "@/components/ScrollIndecator";



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

export default async function AboutPage() {
  const about = await getAbout();
 
  return (
    
    <AboutAnimationController>
      
    <div
      className="relative"
      style={{
        background:
          "radial-gradient(ellipse at bottom right, #5c0000 0%, #1a0000 40%, #000000 100%)",
        color: CREAM,
        isolation: "isolate",
      }}>
        
      
      
      <section><ScrollIndicator /></section>
      {/* Animated squares overlay (fixed, z-50) + hero badge (z-60) */}
      <AboutScrollSquares />

      {/* SECTION 1 — Hero (squares' Stage 1 stage; no text) */}
      <section id="about-hero" className="relative min-h-screen" />

      {/* SECTION 2 — Color Palette Statement (scroll-driven reveal + freeze).
          Trimmed from 190vh: the text now fades out by ~20% of total scroll
          progress (see ColorPaletteSection's HARD_CUTOFF), so the old height
          left a long stretch of dead scrolling before the content below. */}
      <ColorPaletteSection />

      <PageIntro
        kicker="About"
        title={<RunsText runs={about.pageTitle} />}
        lede={about.lede}
      />

      <div className="px-5 pb-12 sm:px-8" style={{ zIndex: 2 }}>
        <div className="mx-auto flex max-w-6xl flex-col">
          {about.sections.map((s, i) => (
            <Reveal key={s.kicker}>
              <section className="grid gap-6 border-t border-cream-dim/15 py-14 sm:py-20 lg:grid-cols-[280px_1fr] lg:gap-16">
                <div className="flex items-start gap-4">
                  <span className="font-body text-rebel-red text-xs tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="font-body text-cream-dim text-xs uppercase tracking-[0.3em]">
                    {s.kicker}
                  </span>
                </div>
                <div className="flex flex-col gap-6">
                  <h2 className="font-display text-cream text-[clamp(1.9rem,4.5vw,3.2rem)] italic leading-tight">
                    {s.title}
                  </h2>
                  {s.body.map((p) => (
                    <p
                      key={p.slice(0, 24)}
                      className="font-body text-cream-dim max-w-2xl text-lg leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>

      {/* full-bleed editorial closer (logo deck p.9) */}
      <section className="relative overflow-hidden px-5 py-28 sm:px-8 sm:py-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 90% at 100% 100%, color-mix(in srgb, var(--rebel-red) 28%, transparent), transparent 55%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-5xl">
          <AccentBlocks size={14} gap={8} className="mb-8" />
          <p className="display-statement text-cream text-[clamp(2.2rem,6vw,4.8rem)]">
            <RunsText runs={about.closingStatement} />
          </p>
        </Reveal>
      </section>


    </div>
    </AboutAnimationController>
  );
}