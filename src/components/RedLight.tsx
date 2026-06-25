/**
 * The red light (TASK.md §2) — a diagonal radial bleed entering from the
 * bottom-right, fading to pure black toward the top-left. Fixed, sits UNDER
 * the grain and content.
 *
 * `intensity`:
 *   - "ember"  → faint global default (every inner page)
 *   - "strong" → hero / contact sections
 * The cursor-reactive focal point on the Home hero is a separate layer
 * (HeroCursorField); this is the always-present ambient bed.
 */
type Props = { intensity?: "ember" | "strong" };

export default function RedLight({ intensity = "ember" }: Props) {
  const strong = intensity === "strong";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: "var(--z-redlight)" }}
    >
      {/* Main diagonal bleed from bottom-right */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 100% 100%,
            color-mix(in srgb, var(--rebel-red) ${strong ? 42 : 22}%, transparent) 0%,
            color-mix(in srgb, var(--red-deep) ${strong ? 50 : 26}%, transparent) ${strong ? 18 : 14}%,
            transparent ${strong ? 58 : 46}%)`,
        }}
      />
      {/* Deep ember core, lower-right corner */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 96% 104%,
            color-mix(in srgb, var(--rebel-red) ${strong ? 34 : 16}%, transparent) 0%,
            transparent 55%)`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
