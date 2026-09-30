/**
 * CMS-controlled sizing/behaviour for the Home stairs + showreel sections.
 * Everything an editor can set (homeContent global) is normalised here: the
 * presets map to CSS/numbers, and every value is clamped to a safe range so a
 * bad entry can never break the layout. The constants below are also the
 * fallbacks used when a field is empty (existing documents).
 */

const num = (v: unknown, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

/* ---------------------------------------------------------------- Stairs */

export const STAIR_STEPS_MIN = 2;
export const STAIR_STEPS_MAX = 8;

/** Title font size presets → CSS clamp() (large ≈ 13px mobile … 20px desktop). */
export const TITLE_SIZES = {
  small: "clamp(0.6875rem, 0.6rem + 0.2vw, 0.8125rem)",
  medium: "clamp(0.75rem, 0.5rem + 0.5vw, 1rem)",
  large: "clamp(0.8125rem, 0.55rem + 0.75vw, 1.25rem)",
  xl: "clamp(1rem, 0.7rem + 1vw, 1.625rem)",
} as const;
export type TitleSize = keyof typeof TITLE_SIZES;

/** Card height ÷ width for each aspect-ratio option. */
export const STAIR_RATIOS = {
  "3:4": 4 / 3,
  "4:5": 5 / 4,
  "1:1": 1,
  "16:9": 9 / 16,
} as const;
export type StairAspect = keyof typeof STAIR_RATIOS;

/** Stair stride as a fraction of min(viewport w, h). */
export const STAIR_OFFSETS = { tight: 0.34, normal: 0.45, wide: 0.58 } as const;
export type StairOffset = keyof typeof STAIR_OFFSETS;

export const IMAGE_POSITIONS = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
] as const;
export type ImagePosition = (typeof IMAGE_POSITIONS)[number];

export type StairsSettings = {
  titleSize: TitleSize;
  titleUppercase: boolean;
  titleOpacity: number;
  /** Percent of the base card size (100 = the original pre-scale-up size). */
  imageScale: number;
  offset: StairOffset;
  aspect: StairAspect;
};

export const STAIRS_DEFAULTS: StairsSettings = {
  titleSize: "large",
  titleUppercase: true,
  titleOpacity: 0.6,
  imageScale: 125,
  offset: "normal",
  aspect: "3:4",
};

export function normalizeStairsSettings(raw?: Partial<Record<keyof StairsSettings, unknown>> | null): StairsSettings {
  const d = STAIRS_DEFAULTS;
  return {
    titleSize: pick(raw?.titleSize, Object.keys(TITLE_SIZES) as TitleSize[], d.titleSize),
    titleUppercase: typeof raw?.titleUppercase === "boolean" ? raw.titleUppercase : d.titleUppercase,
    titleOpacity: clamp(num(raw?.titleOpacity, d.titleOpacity), 0.4, 1),
    imageScale: clamp(num(raw?.imageScale, d.imageScale), 80, 140),
    offset: pick(raw?.offset, Object.keys(STAIR_OFFSETS) as StairOffset[], d.offset),
    aspect: pick(raw?.aspect, Object.keys(STAIR_RATIOS) as StairAspect[], d.aspect),
  };
}

export const normalizeImagePosition = (v: unknown): ImagePosition =>
  pick(v, IMAGE_POSITIONS, "center");

/* --------------------------------------------------------------- Showreel */

export const SHOWREEL_ASPECTS = ["16:9", "21:9", "4:5", "source"] as const;
export type ShowreelAspect = (typeof SHOWREEL_ASPECTS)[number];
export const SHOWREEL_RATIOS: Record<Exclude<ShowreelAspect, "source">, number> = {
  "16:9": 16 / 9,
  "21:9": 21 / 9,
  "4:5": 4 / 5,
};

/** Seconds for a step transition (snap duration). */
export const TRANSITION_SPEEDS = { fast: 0.5, normal: 0.8, slow: 1.1 } as const;
export type TransitionSpeed = keyof typeof TRANSITION_SPEEDS;

/** Pinned scroll per video, in viewport heights. */
export const SCROLL_PER_VIDEO = { short: 0.8, normal: 1, long: 1.4 } as const;
export type ScrollPerVideo = keyof typeof SCROLL_PER_VIDEO;

/** Hard cap (px) for the video box on ultra-wide screens. */
export const SHOWREEL_MAX_WIDTH_PX = 1800;

export type ShowreelSettings = {
  /** % of viewport width on desktop (phones are always full-bleed). */
  videoWidth: number;
  aspect: ShowreelAspect;
  objectFit: "cover" | "contain";
  showCounter: boolean;
  showDots: boolean;
  showCaptions: boolean;
  transitionSpeed: TransitionSpeed;
  scrollPerVideo: ScrollPerVideo;
};

export const SHOWREEL_DEFAULTS: ShowreelSettings = {
  videoWidth: 91,
  aspect: "16:9",
  objectFit: "cover",
  showCounter: true,
  showDots: true,
  showCaptions: true,
  transitionSpeed: "normal",
  scrollPerVideo: "normal",
};

export function normalizeShowreelSettings(raw?: Partial<Record<keyof ShowreelSettings, unknown>> | null): ShowreelSettings {
  const d = SHOWREEL_DEFAULTS;
  const bool = (v: unknown, f: boolean) => (typeof v === "boolean" ? v : f);
  return {
    videoWidth: clamp(num(raw?.videoWidth, d.videoWidth), 70, 100),
    aspect: pick(raw?.aspect, SHOWREEL_ASPECTS, d.aspect),
    objectFit: pick(raw?.objectFit, ["cover", "contain"] as const, d.objectFit),
    showCounter: bool(raw?.showCounter, d.showCounter),
    showDots: bool(raw?.showDots, d.showDots),
    showCaptions: bool(raw?.showCaptions, d.showCaptions),
    transitionSpeed: pick(raw?.transitionSpeed, Object.keys(TRANSITION_SPEEDS) as TransitionSpeed[], d.transitionSpeed),
    scrollPerVideo: pick(raw?.scrollPerVideo, Object.keys(SCROLL_PER_VIDEO) as ScrollPerVideo[], d.scrollPerVideo),
  };
}
