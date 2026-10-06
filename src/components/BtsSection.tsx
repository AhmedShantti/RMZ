"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ClientCardItem as BaseCardItem } from "@/content/home";
import { parseVideoSource } from "@/lib/videoSource";
import { prefersReducedMotion } from "@/lib/reducedMotion";

/** A Home card, plus (for BTS) the video that plays while it is hovered. */
export type ClientCardItem = BaseCardItem & {
  videoUrl?: string | null;
  /** The video is horizontal (default vertical). */
  landscape?: boolean;
};

const INTERVAL_MS = 5000;
const SWEEP_MS = 900;
const STAGGER_MS = 420;

/** Fallback alt when the CMS photo has none — the cards show behind-the-scenes content. */
const BTS_ALT = "Behind the scenes at Rebel Mind Zone";

/** Cropped client photo (object-cover) or a labelled placeholder. */
function ClientImg({ item }: { item: ClientCardItem }) {
  if (item.photoUrl) {
    return (
      <Image
        src={item.photoUrl}
        alt={item.alt || BTS_ALT}
        fill
        sizes="(max-width: 639px) 100vw, (max-width: 899px) 50vw, 360px"
        className="object-cover"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a]">
      <span className="font-body px-3 text-center text-xs uppercase tracking-wide text-[#666]">
        {item.name}
      </span>
    </div>
  );
}

/**
 * The card's video, played muted + looped while the card is hovered. Sized to
 * COVER the card (the card is 3:4; the video is 9:16 or 16:9), and faded in
 * once it has loaded so the photo never flashes away to a black player.
 */
function HoverVideo({ item }: { item: ClientCardItem }) {
  const [ready, setReady] = useState(false);
  const source = item.videoUrl ? parseVideoSource(item.videoUrl) : null;
  if (!source || source.kind === "hls") return null;
  const fit = item.landscape
    ? "absolute top-0 h-full aspect-video start-1/2 -translate-x-1/2 rtl:translate-x-1/2"
    : "absolute start-0 top-1/2 w-full aspect-[9/16] -translate-y-1/2";
  const style = { opacity: ready ? 1 : 0, transition: "opacity 0.4s ease" };
  if (source.kind === "iframe") {
    const loop = source.provider === "youtube" ? {} : { loop: source.provider === "vimeo" ? "1" : "true" };
    const u = new URL(source.autoplaySrc);
    for (const [k, v] of Object.entries(loop)) u.searchParams.set(k, v);
    // The hover preview always starts by itself, muted, and preloads so it begins
    // at once (the plain player URL is the opposite: no autoplay, no preload).
    u.searchParams.set("autoplay", source.provider === "vimeo" || source.provider === "youtube" ? "1" : "true");
    if (source.provider === "bunny") u.searchParams.set("preload", "true");
    return (
      <iframe
        src={u.toString()}
        title=""
        aria-hidden="true"
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        onLoad={() => setReady(true)}
        className={`${fit} pointer-events-none border-0`}
        style={style}
      />
    );
  }
  return (
    <video
      src={source.src}
      muted
      loop
      autoPlay
      playsInline
      aria-hidden="true"
      onPlaying={() => setReady(true)}
      className={`${fit} pointer-events-none object-cover`}
      style={style}
    />
  );
}

function ClientCard({
  clients,
  startOffset,
  delay,
  accent,
}: {
  clients: ClientCardItem[];
  startOffset: number;
  delay: number;
  accent: string;
}) {
  const len = clients.length;
  const [current, setCurrent] = useState(startOffset % len);
  const [next, setNext] = useState((startOffset + 1) % len);
  const [sweeping, setSweeping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  // Live `current` for the interval closure (which is created once).
  const currentRef = useRef(current);
  currentRef.current = current;
  // Hover: the rotation pauses and the shown item's video plays (mouse only).
  const [hovering, setHovering] = useState(false);
  const hoverRef = useRef(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    hoverRef.current = true;
    // Small delay so sweeping the mouse across the cards doesn't start every video.
    hoverTimer.current = setTimeout(() => setHovering(true), 250);
  };
  const onLeave = () => {
    hoverRef.current = false;
    clearTimeout(hoverTimer.current);
    setHovering(false);
  };
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  useEffect(() => {
    const start = () => {
      intervalRef.current = setInterval(() => {
        if (hoverRef.current) return; // paused while hovered
        // Load the incoming image at sweep START and HOLD it through the whole
        // sweep — including the upcoming layer's fade-out. Advancing it at sweep
        // end (the old `setNext(c+2)`) flipped this layer to the *next-next*
        // image while it was still opaque, flashing that wrong image over the
        // just-revealed card ~1s later. Now the fade-out layer always shows the
        // same image as the settled card, so there's nothing to flash.
        setNext((currentRef.current + 1) % len);
        setSweeping(true);
        timeoutRef.current = setTimeout(() => {
          setCurrent((c) => (c + 1) % len);
          setSweeping(false);
        }, SWEEP_MS);
      }, INTERVAL_MS);
    };

    const kickoff = setTimeout(start, delay);
    return () => {
      clearTimeout(kickoff);
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [delay, len]);

  const active = clients[current];
  const upcoming = clients[next];
  // The client whose photo is on screen: `upcoming` is what's showing for the
  // whole sweep, `active` otherwise. Derived every render, never captured.
  const shown = sweeping ? upcoming : active;
  const pad = (n: number) => (n + 1).toString().padStart(2, "0");

  return (
    <div className="relative aspect-[3/4] w-[min(360px,calc(100vw-3rem))] sm:w-[min(360px,calc((100vw-4.5rem)/2))] rounded-2xl border border-white/10 overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform hover:scale-[1.04] hover:z-10 motion-reduce:hover:scale-100"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <div className="absolute inset-0">
        <ClientImg item={active} />
      </div>
      <div
        className="absolute inset-0"
        style={{ opacity: sweeping ? 1 : 0, transition: "opacity 0.15s linear" }}
      >
        <ClientImg item={upcoming} />
      </div>

      {hovering && !sweeping && shown.videoUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <HoverVideo key={shown.videoUrl} item={shown} />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />

      <div
        className="absolute inset-0"
        style={{
          background: accent,
          transform: sweeping ? "translateY(-100%)" : "translateY(100%)",
          transition: sweeping
            ? `transform ${SWEEP_MS * 0.55}ms cubic-bezier(0.65,0,0.35,1)`
            : "none",
        }}
      />

      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
        <div className="flex items-start justify-between">
          <span className="font-body text-[11px] tabular-nums tracking-wider text-white/60">
            {pad(current)}/{pad(len - 1)}
          </span>
          
        </div>

        <div
          style={{
            opacity: sweeping ? 0 : 1,
            transition: sweeping ? "none" : `opacity 300ms ease ${SWEEP_MS * 0.55}ms`,
          }}
        >
          <p className="font-display text-2xl font-medium text-white mb-1.5">
            {active.name}
          </p>
          <p className="font-body text-[11px] uppercase tracking-wide text-white/50">
            {active.category}
          </p>
        </div>
      </div>

      {/* Stretched link over the whole card. Sits outside the animated layers
          and the timer, and reads `shown` fresh each render. Inset focus ring —
          the card's overflow-hidden would clip the global +3px offset. */}
      {shown.href && (
        <Link
          href={shown.href}
          aria-label={`${shown.name} — watch the video`}
          className="absolute inset-0 focus-visible:rounded-2xl! focus-visible:outline-offset-[-3px]!"
        />
      )}
    </div>
  );
}

/**
 * Rotating BTS (behind-the-scenes) showcase — three cards, each cross-fading
 * through the BTS items on its own stagger. (This was the Clients section; the
 * design is unchanged, only the content + links.) Heading + items come from the
 * CMS (btsContent); each card links to its video on /bts. Renders nothing while
 * there are no items.
 */
export default function BtsSection({
  heading,
  items: clients,
}: {
  heading: string;
  items: ClientCardItem[];
}) {
  if (!clients?.length) return null;
  // Spread the three cards' starting points evenly through the list (6 → 0/2/4,
  // 3 → 0/1/2) so they never all show the same photo at once.
  const offset = (i: number) => Math.floor((clients.length * i) / 3);
  return (
    <section data-squares-clients className="w-full py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="font-display text-white text-3xl md:text-4xl mb-12">
          {heading}
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <ClientCard clients={clients} startOffset={0} delay={0} accent="var(--acc-yellow)" />
          <ClientCard clients={clients} startOffset={offset(1)} delay={STAGGER_MS} accent="var(--acc-orange)" />
          <ClientCard clients={clients} startOffset={offset(2)} delay={STAGGER_MS * 2} accent="var(--acc-green)" />
        </div>
      </div>
    </section>
  );
}
