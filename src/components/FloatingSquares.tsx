/**
 * FloatingSquares (Redesigning Stage 4 + reused Stage 8) — a decorative layer of
 * two overlapping rotated brand squares that frame a heading. Purely decorative:
 * absolutely positioned, sits behind text (z-0), never affects layout or blocks
 * pointer events.
 *
 * Position it by passing a `className` with the absolute offsets (top/left/…).
 */
type Props = {
  /** edge length of each square in px */
  size?: number;
  /** absolute-position utilities for the wrapper, e.g. "-left-4 -top-6" */
  className?: string;
};

export default function FloatingSquares({ size = 80, className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ zIndex: 0, width: size * 1.6, height: size * 1.6 }}
    >
      {/* orange — rotated 15deg, upper-left */}
      <span
        className="absolute block"
        style={{
          width: size,
          height: size,
          top: 0,
          left: 0,
          backgroundColor: "var(--acc-orange)",
          transform: "rotate(15deg)",
        }}
      />
      {/* green — rotated -10deg, overlapping down-right */}
      <span
        className="absolute block"
        style={{
          width: size,
          height: size,
          top: size * 0.5,
          left: size * 0.55,
          backgroundColor: "var(--acc-green)",
          transform: "rotate(-10deg)",
        }}
      />
    </div>
  );
}
