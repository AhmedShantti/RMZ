import type { Metadata } from "next";
import AboutScrollSquares from "@/components/AboutScrollSquares";
import { getMeta } from "@/lib/cms";
import AboutAnimationController from "@/components/AboutAnimationController";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import AboutBanner from "@/components/AboutBanner";
import Image from "next/image";
import RunsText from "@/components/RunsText";
import { getAbout } from "@/lib/cms";
import ScrollIndicator from "@/components/ScrollIndicator";



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
        
      
      
      
      {/* Animated squares overlay (fixed, z-50) + hero badge (z-60) */}
      <AboutScrollSquares />

      {/* Full-bleed banner (behind the squares overlay and the fixed header) */}
      <AboutBanner image={about.banner} />

      {/* SECTION 1 — Hero (squares' Stage 1 stage; no text — the banner sits
          behind it). The colour-palette sentences that used to follow were
          removed; aboutContent.colorPalette is no longer rendered. */}
      <section id="about-hero" className="relative min-h-screen" />

      <PageIntro
        kicker="About"
        accent={false}
        title={<RunsText runs={about.pageTitle} />}
        lede={about.lede}
      />

      <div className="px-5 pb-12 sm:px-8" style={{ zIndex: 2 }}>
        <div className="mx-auto flex max-w-6xl flex-col">
          {(() => {
            // Zigzag: sections WITH an image alternate image-left / image-right
            // (logical placement via grid `order`, so it flips correctly in
            // RTL). Sections without an image keep the original text-only layout.
            let withImage = 0;
            return about.sections.map((s, i) => {
              const head = (
                <div className="flex items-start gap-4">
                  <span className="font-body text-rebel-red text-xs tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="font-body text-cream-dim text-xs uppercase tracking-[0.3em]">
                    {s.kicker}
                  </span>
                </div>
              );
              const title = (
                <h2 className="font-display text-cream text-[clamp(1.9rem,4.5vw,3.2rem)] italic leading-tight">
                  {s.title}
                </h2>
              );
              const paras = s.body.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="font-body text-cream-dim max-w-2xl text-lg leading-relaxed"
                >
                  {p}
                </p>
              ));

              if (!s.image) {
                return (
                  <Reveal key={s.kicker}>
                    <section className="grid gap-6 border-t border-cream-dim/15 py-14 sm:py-20 lg:grid-cols-[280px_1fr] lg:gap-16">
                      {head}
                      <div className="flex flex-col gap-6">
                        {title}
                        {paras}
                      </div>
                    </section>
                  </Reveal>
                );
              }

              const imageFirst = withImage++ % 2 === 0;
              return (
                <section
                  key={s.kicker}
                  // --about-img-ratio: the image aspect ratio (default 4:5).
                  className="grid items-center gap-8 border-t border-cream-dim/15 py-14 [--about-img-ratio:4/5] sm:py-20 lg:grid-cols-2 lg:gap-16"
                >
                  {/* DOM order = image first, so on mobile the image is always above its text */}
                  <Reveal className={imageFirst ? "" : "lg:order-2"}>
                    <div
                      className="relative w-full overflow-hidden rounded-lg"
                      style={{ aspectRatio: "var(--about-img-ratio)" }}
                    >
                      <Image
                        src={s.image.url}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 1024px) min(45vw, 544px), (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
                        quality={85}
                        className="object-cover"
                        style={{ objectPosition: `${s.image.focalX}% ${s.image.focalY}%` }}
                      />
                    </div>
                  </Reveal>
                  <Reveal delay={0.1} className={imageFirst ? "" : "lg:order-1"}>
                    <div className="flex flex-col gap-6">
                      {head}
                      {title}
                      {paras}
                    </div>
                  </Reveal>
                </section>
              );
            });
          })()}
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
          <p className="display-statement text-cream text-[clamp(2.2rem,6vw,4.8rem)]">
            <RunsText runs={about.closingStatement} />
          </p>
        </Reveal>
      </section>


    </div>
    </AboutAnimationController>
  );
}