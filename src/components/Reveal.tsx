"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/reducedMotion";

/**
 * Restrained scroll reveal (TASK.md §7): cream content rises + fades on entry,
 * once. Under prefers-reduced-motion it renders statically (no transform).
 *
 * Implemented with IntersectionObserver + a CSS transition rather than a motion
 * library so it adds no JS to the initial hydration path — the reveal is pure
 * compositor work. Timing/easing/movement match the previous Motion version
 * exactly (0.7s, cubic-bezier(0.16,1,0.3,1), rises `y`px, fires once when ~12%
 * into the viewport).
 */
type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      // Matches Motion's viewport margin "-12% 0px -12% 0px".
      { rootMargin: "-12% 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
