"use client";
import { motion } from "motion/react";
import { prefersReducedMotion } from "@/lib/reducedMotion";
import { useEffect, useRef } from "react";


export default function ScrollIndicator() {
  const reduce = prefersReducedMotion();
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
    
     <motion.div
    ref={ref}
    aria-hidden="true"
    className="pointer-events-none fixed flex flex-col items-center gap-2"
    style={{
      zIndex: 1,
      top: "calc(50vh + 75px)",
      left: 0,
      right: 0,
      marginLeft: "auto",
      marginRight: "auto",
      width: "fit-content",
    }}
    animate={reduce ? undefined : { y: [0, 6, 0] }}
    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
  >
    <span className="font-body text-cream-dim text-[0.65rem] uppercase tracking-[0.3em]">
      Scroll
    </span>
    <span aria-hidden="true" className="text-cream-dim text-base leading-none">
      ↓
    </span>
  </motion.div>
  );
}