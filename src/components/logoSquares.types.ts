import type { RefObject } from "react";

/** The three brand squares, keyed by colour. Shared by the logo + stairs. */
export type ColorKey = "yellow" | "orange" | "green";
export const COLORS: ColorKey[] = ["yellow", "orange", "green"];

/** Refs to the static squares inside the logo mark. */
export type SquareRefs = Record<ColorKey, RefObject<HTMLSpanElement | null>>;

/** Refs to the empty landing slots in the About stairs section. */
export type StairRefs = Record<ColorKey, RefObject<HTMLDivElement | null>>;
