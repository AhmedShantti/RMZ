"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { homeContent, type ClientCardItem } from "@/content/home";

const INTERVAL_MS = 5000;
const SWEEP_MS = 900;
const STAGGER_MS = 420;

/** Cropped client photo (object-cover) or a labelled placeholder. */
function ClientImg({ item }: { item: ClientCardItem }) {
  if (item.photoUrl) {
    return (
      <Image
        src={item.photoUrl}
        alt={item.alt || item.name}
        fill
        unoptimized
        sizes="300px"
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

  useEffect(() => {
    const start = () => {
      intervalRef.current = setInterval(() => {
        setSweeping(true);
        timeoutRef.current = setTimeout(() => {
          setCurrent((c) => (c + 1) % len);
          setNext((c) => (c + 2) % len);
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
  const pad = (n: number) => (n + 1).toString().padStart(2, "0");

  return (
    <div className="relative w-[300px] h-[400px] rounded-2xl border border-white/10 overflow-hidden">
      <div className="absolute inset-0">
        <ClientImg item={active} />
      </div>
      <div
        className="absolute inset-0"
        style={{ opacity: sweeping ? 1 : 0, transition: "opacity 0.15s linear" }}
      >
        <ClientImg item={upcoming} />
      </div>

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
    </div>
  );
}

/**
 * Rotating client showcase — three cards, each cross-fading through the client
 * list on its own stagger. Heading + cards are CMS-driven (homeContent →
 * clientsHeading / clientCards); the defaults keep it rendering standalone.
 */
export default function ClientsSection({
  heading = homeContent.clientsHeading,
  clients = homeContent.clientCards,
}: {
  heading?: string;
  clients?: ClientCardItem[];
} = {}) {
  if (!clients?.length) return null;
  const last = clients.length - 1;
  return (
    <section data-squares-clients className="w-full py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="font-display text-white text-3xl md:text-4xl mb-12">
          {heading}
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <ClientCard clients={clients} startOffset={0} delay={0} accent="var(--acc-yellow)" />
          <ClientCard clients={clients} startOffset={Math.min(2, last)} delay={STAGGER_MS} accent="var(--acc-orange)" />
          <ClientCard clients={clients} startOffset={Math.min(4, last)} delay={STAGGER_MS * 2} accent="var(--acc-green)" />
        </div>
      </div>
    </section>
  );
}
