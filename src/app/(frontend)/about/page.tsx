import type { Metadata } from "next";
import AboutScrollSquares from "@/components/AboutScrollSquares";
import { getMeta } from "@/lib/cms";
import AboutAnimationController from "@/components/AboutAnimationController";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import PageBanner from "@/components/PageBanner";
import AboutPoints from "@/components/AboutPoints";
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
        
      
      
      
      {/* Full-bleed banner + animated title (behind the header and page content).
          The fixed scroll-squares overlay is its overlay slot: above the photo,
          below the title. */}
      <PageBanner
        placement="absolute"
        image={about.banner ? { url: about.banner.url } : null}
        alt={about.banner?.alt}
        focalX={about.banner?.focalX}
        focalY={about.banner?.focalY}
        title={about.bannerTitle}
        headingLevel="h2" // the page's h1 is the PageIntro title below
        placeholderLabel="[ ABOUT BANNER — 2400×1350 · UPLOAD IN /studio ]"
        overlayStrength={0.4} // lighter darkening over the photo
        fadeFrom={78} // fade out only near the bottom edge
      >
        <AboutScrollSquares />
      </PageBanner>

      {/* SECTION 1 — Hero (squares' Stage 1 stage; no text — the banner sits
          behind it and provides the scroll space). The colour-palette sentences
          that used to follow were removed; aboutContent.colorPalette is no
          longer rendered. */}
      <section id="about-hero" className="relative h-[50svh] sm:h-[65svh]" />

      <PageIntro
        kicker="About"
        accent={false}
        tight
        title={<RunsText runs={about.pageTitle} />}
        lede={about.lede}
      />

      {/* The numbered points — staggered three-column layout (AboutPoints). Title
          = each section's small label, text = its paragraphs, image = its
          image. The big italic section headline (sections[].title in the CMS)
          is no longer rendered; its data is untouched. */}
      <section className="px-5 pb-20 pt-4 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <AboutPoints
            points={about.sections.map((s) => ({
              title: s.kicker,
              paragraphs: s.body,
              image: s.image,
            }))}
          />
        </div>
      </section>

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