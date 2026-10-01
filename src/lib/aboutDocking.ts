/**
 * Docking points for the About page's three-point section.
 *
 * Each of the first three points reserves an empty slot (`[data-dock-slot]`) of
 * the shared logo-square size (lib/logoSquareSize). While the page scrolls, the
 * matching traveling square (AboutScrollSquares) is routed through its slot and
 * leaves a fixed copy behind (AboutPoints). Both sides derive the moment of the
 * pass from the SAME rule — "the slot's top edge is at DOCK_VIEWPORT_Y of the
 * viewport height" — read live from the DOM, so they can never drift apart and
 * nothing is cached across resizes / layout changes.
 */
import type { LogoSquareColor } from "./logoSquareSize";

/** The slot is crossed when its top edge sits at this fraction of the viewport height. */
export const DOCK_VIEWPORT_Y = 0.45;

export type Dock = {
  index: number;
  color: LogoSquareColor;
  /** Slot rect in DOCUMENT coordinates. */
  left: number;
  top: number;
  size: number;
};

/** Slots currently in the DOM, in point order. */
export function readDocks(): Dock[] {
  if (typeof document === "undefined") return [];
  const out: Dock[] = [];
  document.querySelectorAll<HTMLElement>("[data-dock-slot]").forEach((el) => {
    const r = el.getBoundingClientRect();
    out.push({
      index: Number(el.dataset.dockIndex ?? out.length),
      color: (el.dataset.dockColor as LogoSquareColor) ?? "yellow",
      left: r.left + window.scrollX,
      top: r.top + window.scrollY,
      size: r.width,
    });
  });
  return out.sort((a, b) => a.index - b.index);
}

/** The scroll offset (px) at which the traveling square crosses this slot. */
export const dockScroll = (topInDocument: number, viewportHeight: number) =>
  topInDocument - DOCK_VIEWPORT_Y * viewportHeight;
