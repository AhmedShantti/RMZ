import type Lenis from "lenis";

/**
 * Module singleton for the app's Lenis instance. `useSmoothScroll` registers
 * the live instance here so GSAP ScrollTrigger can sync to it
 * (`lenis.on("scroll", ScrollTrigger.update)`) — without this, ScrollTrigger's
 * scrub/pin fight Lenis's smooth scroll. Null when Lenis is off (reduced
 * motion) or before mount; callers must handle that.
 */
let current: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  current = l;
};

export const getLenis = (): Lenis | null => current;
