/**
 * The accent trio (TASK.md §2) — "diversity in thinking": three perspectives
 * in one mind. ALWAYS together as a trio, never a rainbow spread.
 * Storyboard order, left→right: green / orange / yellow.
 */
type Props = {
  size?: number; // px edge of each square
  gap?: number; // px between squares
  className?: string;
  vertical?: boolean;
};

const TRIO = [
  { c: "var(--acc-green)", label: "green" },
  { c: "var(--acc-orange)", label: "orange" },
  { c: "var(--acc-yellow)", label: "yellow" },
];

export default function AccentBlocks({
  size = 10,
  gap = 6,
  className = "",
  vertical = false,
}: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex ${vertical ? "flex-col" : "flex-row"} ${className}`}
      style={{ gap }}
    >
      {TRIO.map((b) => (
        <span
          key={b.label}
          style={{
            width: size,
            height: size,
            backgroundColor: b.c,
            display: "block",
          }}
        />
      ))}
    </span>
  );
}
