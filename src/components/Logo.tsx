import AccentBlocks from "./AccentBlocks";

/**
 * rmz wordmark — FAITHFUL PLACEHOLDER (TASK.md §3, see NOTES.md).
 * Lowercase geometric `rmz`, the accent trio sitting above the `m` like roof
 * tiles, and a ® mark top-left. Replace with Ahmad's vector SVG when supplied
 * (public/brand/rmz-logo.svg).
 *
 * Variants:
 *   - "mark"      → icon-only `rmz`
 *   - "signature" → stacked `rmz` + REBEL / MIND / ZONE
 */
type Props = {
  variant?: "mark" | "signature";
  size?: number; // wordmark font-size in px
  className?: string;
  cream?: boolean; // cream-on-transparent (dark use) vs default cream
};

export default function Logo({
  variant = "mark",
  size = 28,
  className = "",
  cream = true,
}: Props) {
  const tileSize = Math.max(4, Math.round(size * 0.14));
  const color = cream ? "var(--cream)" : "var(--ink)";

  return (
    <span
      className={`inline-flex flex-col items-center leading-none ${className}`}
      role="img"
      aria-label="Rebel Mind Zone"
    >
      <span
        className="relative inline-flex items-start"
        style={{ color }}
      >
        {/* ® mark, top-left */}
        <sup
          aria-hidden="true"
          className="font-body"
          style={{
            fontSize: size * 0.2,
            lineHeight: 1,
            marginTop: size * 0.06,
            marginRight: size * 0.06,
            opacity: 0.85,
          }}
        >
          ®
        </sup>

        {/* the wordmark + roof tiles above the middle letter */}
        <span className="relative inline-block">
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: `calc(100% - ${size * 0.04}px)` }}
          >
            <AccentBlocks size={tileSize} gap={Math.round(tileSize * 0.5)} />
          </span>
          <span
            className="font-body block"
            style={{
              fontSize: size,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 1,
            }}
          >
            rmz
          </span>
        </span>
      </span>

      {variant === "signature" && (
        <span
          className="font-body mt-2 flex gap-[0.5em] uppercase"
          style={{
            fontSize: size * 0.18,
            letterSpacing: "0.42em",
            color: "var(--cream-dim)",
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
