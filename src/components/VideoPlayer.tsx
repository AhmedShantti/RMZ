"use client";

import { useEffect, useMemo, useRef } from "react";
import { parseVideoSource } from "@/lib/videoSource";

/**
 * Plays whatever link an editor pastes (see lib/videoSource): a hosted player
 * (Bunny / Cloudflare / Vimeo / YouTube → iframe), an HLS stream (.m3u8 → our
 * <video> + hls.js where the browser lacks native HLS) or a plain file. Fills
 * its parent (absolute inset-0) — the parent sets the shape. Used by the BTS
 * page and the portfolio "Video" block.
 */
export default function VideoPlayer({
  url,
  title,
  poster,
  autoplay = false,
  onPlay,
}: {
  url: string;
  title: string;
  poster?: string | null;
  autoplay?: boolean;
  onPlay?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}) {
  const source = useMemo(() => parseVideoSource(url), [url]);
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
        title={title}
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
      poster={poster ?? undefined}
      controls
      playsInline
      preload="metadata"
      onPlay={onPlay}
      aria-label={title}
    />
  );
}
