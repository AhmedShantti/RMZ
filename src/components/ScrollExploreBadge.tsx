"use client";

import { useEffect, useRef } from "react";

/**
 * "Scroll to explore!" pill shown over the About hero. Fixed on the right,
 * fades out (opacity 1 → 0) across the first 20% of scroll progress, then is
 * non-interactive. Driven by the same native scroll Lenis updates.
 */
export default function ScrollExploreBadge() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const loop = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      // opacity 1 at p=0 → 0 at p=0.2
      const o = Math.max(0, Math.min(1, 1 - p / 0.2));
      el.style.opacity = String(o);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="font-body pointer-events-none fixed flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] backdrop-blur-[4px]"
      style={{
        right: "5vw",
        top: "50vh",
        zIndex: 60,
        color: "#f5f0e8",
        border: "1.5px solid rgba(255,255,255,0.4)",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M4 12L12 4M12 4H5M12 4V11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Scroll to explore!
    </div>
  );
}
