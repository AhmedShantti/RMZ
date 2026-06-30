/**
 * SectionWatermark — a giant faded word sitting behind a section's content
 * (e.g. "CLIENTS" on the homepage). Decorative only: centred on both axes,
 * spans the section width, z-0, pointer/select disabled. Reused across the
 * clients collage + video sections.
 */
type Props = {
  text?: string;
  className?: string;
};

export default function SectionWatermark({
  text = "CLIENTS",
  className = "",
}: Props) {
  return (
    <span
      aria-hidden="true"
      className={`font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-bold uppercase leading-none ${className}`}
      style={{
        zIndex: 0,
        fontSize: "clamp(100px, 15vw, 200px)",
        color: "rgba(255, 255, 255, 0.11)",
        letterSpacing: "0.02em",
      }}
    >
      {text}
    </span>
  );
}
