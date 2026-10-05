"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import VideoPlayer from "./VideoPlayer";
import type { BtsItem } from "@/lib/cms";

/**
 * The BTS page's videos — one section per item, each with an anchor id (its
 * slug) so a Home card can deep-link to it (/bts#<slug>). Arriving on an anchor
 * scrolls that video to the middle of the screen and starts it (muted for hosted
 * iframes). Only one <video> plays at a time. Reduced motion: scroll only.
 */
export default function BtsVideos({ items }: { items: BtsItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<string | null>(null);

  useEffect(() => {
    const focusHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      const el = slug
        ? root.current?.querySelector<HTMLElement>(`[data-bts="${CSS.escape(slug)}"]`)
        : null;
      if (!el) return;
      el.scrollIntoView({ block: "center" });
      if (!prefersReducedMotion()) setFocus(slug);
    };
    const t = window.setTimeout(focusHash, 120); // after Next's own hash scroll
    window.addEventListener("hashchange", focusHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", focusHash);
    };
  }, []);

  const onPlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    root.current?.querySelectorAll("video").forEach((v) => {
      if (v !== e.currentTarget) v.pause();
    });
  };

  return (
    <div ref={root} className="mx-auto flex max-w-5xl flex-col gap-24 sm:gap-32">
      {items.map((it, i) => (
        <Reveal key={it.slug}>
          <article
            id={it.slug}
            data-bts={it.slug}
            // Vertical (default): a centred phone-shaped column that always fits the screen's
            // height; horizontal: the full-width 16:9 frame.
            className={`scroll-mt-28 ${it.landscape ? "" : "mx-auto w-full max-w-[min(26rem,calc((100svh-9rem)*9/16))]"}`}
          >
            <div
              className={`relative w-full overflow-hidden bg-[#0e0e0e] ${it.landscape ? "aspect-video" : "aspect-[9/16]"}`}
            >
              <VideoPlayer url={it.videoUrl} title={it.title} poster={it.posterUrl} autoplay={focus === it.slug} onPlay={onPlay} />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <p className="font-body text-cream-dim text-xs uppercase tracking-[0.3em]">
                <span className="text-rebel-red tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="mx-3" aria-hidden="true">/</span>
                {it.label}
              </p>
              <h2 className="font-display text-cream text-[clamp(1.9rem,4.5vw,3.2rem)] italic leading-tight">
                {it.title}
              </h2>
              {it.description && (
                <p className="font-body text-cream-dim max-w-2xl text-lg leading-relaxed">
                  {it.description}
                </p>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
