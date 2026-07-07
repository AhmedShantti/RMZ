"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { getLenis } from "./lenis";

// Register once (client-only). Flip + ScrollTrigger ship inside core gsap.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
}

/**
 * Wire Lenis → ScrollTrigger.update so scrub/pin stay in sync with smooth
 * scroll. Returns a cleanup. GSAP's useGSAP runs as a layout effect, which
 * fires BEFORE SmoothScroll's passive effect that creates Lenis — so we retry
 * on rAF until the instance exists (and give up cleanly under reduced motion,
 * where Lenis is intentionally absent and ScrollTrigger uses native scroll).
 */
export function syncScrollTriggerWithLenis(): () => void {
  let raf = 0;
  let attached: ReturnType<typeof getLenis> = null;
  const onScroll = () => ScrollTrigger.update();

  let tries = 0;
  const attach = () => {
    const lenis = getLenis();
    if (lenis) {
      attached = lenis;
      lenis.on("scroll", onScroll);
    } else if (tries++ < 120) {
      raf = requestAnimationFrame(attach);
    }
  };
  attach();

  return () => {
    cancelAnimationFrame(raf);
    if (attached) attached.off("scroll", onScroll);
  };
}

export { gsap, ScrollTrigger, Flip, useGSAP };
