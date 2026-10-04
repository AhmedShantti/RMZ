"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { parseVideoSource } from "@/lib/videoSource";
import type { BtsItem } from "@/lib/cms";

/**
 * The BTS page's videos — one section per item, each with an anchor id (its
 * slug) so a Home card can deep-link to it (/bts#<slug>). Arriving on an anchor
 * scrolls that video to the middle of the screen and starts it.
 *
 * Each item's "video link" can be a hosted player (Bunny / Cloudflare / Vimeo /
 * YouTube → iframe, started muted), an HLS stream (.m3u8 → our <video> + hls.js
 * where the browser lacks native HLS), or a plain file (<video>). Large 4K
 * videos belong on a video host; the CMS upload only fits small clips.
 * Only one <video> plays at a time. Reduced motion: scroll only, no autoplay.
 */
function Player({
  item,
  autoplay,
  onPlay,
}: {
  item: BtsItem;
  autoplay: boolean;
  onPlay: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}) {
  const source = useMemo(() => parseVideoSource(item.videoUrl), [item.videoUrl]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wantPlay = useRef(false);
  useEffect(() => {
    wantPlay.current = autoplay;
  }, [autoplay]);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      v.muted = true; // sound first (the visit came from a click), else muted
      v.play().catch(() => {});
    });
  };

  // HLS: native in Safari; elsewhere hls.js, loaded only when this item needs it.
  useEffect(() => {
    if (source.kind !== "hls") return;
    const v = videoRef.current;
    if (!v) return;
    let hls: { destroy: () => void } | null = null;
    let cancelled = false;
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = source.src;
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled || !Hls.isSupported()) return;
        const h = new Hls();
        hls = h;
        h.loadSource(source.src);
        h.attachMedia(v);
        h.on(Hls.Events.MANIFEST_PARSED, () => {
          if (wantPlay.current) play();
        });
      });
    }
    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [source]);

  useEffect(() => {
    if (autoplay && source.kind !== "iframe") play();
  }, [autoplay, source.kind]);

  if (source.kind === "iframe") {
    return (
      <iframe
        // The muted-autoplay variant only for a click-through link; otherwise a plain player.
        src={autoplay ? source.autoplaySrc : source.src}
        title={item.title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    );
  }
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      src={source.kind === "file" ? source.src : undefined}
      poster={item.posterUrl ?? undefined}
      controls
      playsInline
      preload="metadata"
      onPlay={onPlay}
      aria-label={item.title}
    />
  );
}

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
              <Player item={it} autoplay={focus === it.slug} onPlay={onPlay} />
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
