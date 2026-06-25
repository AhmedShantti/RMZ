"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media-query hook via useSyncExternalStore (no setState-in-effect).
 * Returns `false` on the server and during the first client render, then the
 * real match — so it never causes a hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
