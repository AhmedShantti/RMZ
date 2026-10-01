"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/reducedMotion";

/**
 * Animated banner heading (CMS: `bannerTitle` on the About / Portfolio pages),
 * rendered by <PageBanner>, which owns its position on the photo.
 *
 * Animation (once, on load): each word fades in and rises 28px, staggered
 * 0.08s, 0.9s, power3.out, starting 0.4s after load. The hidden start state
 * lives in CSS (globals.css, `.about-title-word`, only when motion is allowed),
 * so there is no flash before GSAP runs; only transform/opacity animate, so
 * nothing shifts. Under prefers-reduced-motion nothing is hidden or animated.
 *
 * A newline in the CMS text becomes a line break. The words are aria-hidden and
 * the full sentence is exposed once via a visually-hidden span, so screen
 * readers read it as one title.
 */
export default function BannerTitle({
  title,
  as = "h2",
}: {
  title: string;
  /** Heading level — h1 only when the page has no other h1. */
  as?: "h1" | "h2";
}) {
  const Tag = as;
  const ref = useRef<HTMLHeadingElement>(null);
  const text = title.trim();

  useGSAP(
    () => {
      if (!text || prefersReducedMotion()) return;
      const words = gsap.utils.toArray<HTMLElement>(".about-title-word", ref.current);
      if (!words.length) return;
      gsap.fromTo(
        words,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 0.4, ease: "power3.out" },
      );
    },
    { scope: ref, dependencies: [text] },
  );

  if (!text) return null;

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  return (
    <Tag
      ref={ref}
      className="font-display text-cream pointer-events-auto max-w-[16ch] text-start italic lg:max-w-[18ch]"
      style={{
        // 28–36px phones, 32–48px tablet, 40–72px desktop; also capped by the
        // viewport height so three lines always fit between the header and the
        // title's bottom edge (60% of the banner), never below 28px.
        fontSize:
          "max(1.75rem, min(clamp(1.75rem, 1.1rem + 2.6vw, 4.5rem), calc((30svh - 4.5rem) / 3.3)))",
        lineHeight: 1.1,
        letterSpacing: "-0.01em",
        textWrap: "balance",
        // soft halo so the title stays legible even over a very bright photo
        textShadow: "0 1px 20px rgba(0,0,0,0.45)",
      }}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true">
        {lines.map((line, li) => (
          <Fragment key={li}>
            {li > 0 && <br />}
            {line.split(/\s+/).map((word, wi, arr) => (
              <Fragment key={wi}>
                <span className="about-title-word inline-block">{word}</span>
                {wi < arr.length - 1 ? " " : null}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
