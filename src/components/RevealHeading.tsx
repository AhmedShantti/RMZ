"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * Scoped client wrapper for a heading whose `RunsText` uses `reveal`. Toggles
 * `data-reveal="in"` once the heading scrolls into view; the per-character CSS
 * stagger (globals.css) does the rest — transform/opacity only. Under
 * prefers-reduced-motion it renders the heading plain (no `data-reveal`, so the
 * units stay visible), mirroring the existing `Reveal` component's contract.
 *
 * Kept intentionally small so a Server Component (e.g. MarketsBlock) can wrap
 * just its heading without becoming a Client Component itself.
 */
export default function RevealHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "in">("idle");

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      { rootMargin: "-12% 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} data-reveal={state} className={className}>
      {children}
    </div>
  );
}
