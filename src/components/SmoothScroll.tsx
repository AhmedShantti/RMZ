"use client";

import { useSmoothScroll } from "@/lib/useSmoothScroll";

/** Mounts Lenis smooth scroll for the whole app (no-op under reduced motion). */
export default function SmoothScroll() {
  useSmoothScroll();
  return null;
}
