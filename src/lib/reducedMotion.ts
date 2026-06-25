"use client";

import { useMediaQuery } from "./useMediaQuery";

/** Reactive `prefers-reduced-motion` flag. SSR-safe (defaults to false). */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** One-shot, non-reactive check for imperative code (canvas setup, etc.). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
