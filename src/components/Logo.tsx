import Image from "next/image";

/**
 * rmz wordmark — the real brand vector (`public/LOGO.svg`): the lowercase `rmz`
 * with the accent trio above the `m` and the ® mark, in brand colour.
 *
 * Variants:
 *   - "mark"      → the logo only
 *   - "signature" → the logo + stacked REBEL / MIND / ZONE
 *
 * Size with `className` on the wrapper (e.g. a width utility); the SVG scales
 * to fill it while preserving its aspect ratio.
 */
type Props = {
  variant?: "mark" | "signature";
  className?: string;
};

export default function Logo({ variant = "mark", className = "" }: Props) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <Image
        src="/LOGO.svg"
        alt="Rebel Mind Zone"
        width={550}
        height={178}
        unoptimized
        className="block h-auto w-full"
      />
      {variant === "signature" && (
        <span
          aria-hidden="true"
          className="font-body text-cream-dim mt-3 flex gap-[0.5em] uppercase"
          style={{
            fontSize: "clamp(0.5rem, 1.1vw, 0.8rem)",
            letterSpacing: "0.42em",
            paddingLeft: "0.42em",
          }}
        >
          <span>Rebel</span>
          <span>Mind</span>
          <span>Zone</span>
        </span>
      )}
    </span>
  );
}
