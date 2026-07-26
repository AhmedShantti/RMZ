export type Market = {
  name: string;
  sectors: string[];
  line: string;
  contact: string;
  home?: boolean;
};

/**
 * The four market columns (Egyptian in red). Shared by Home + Contact.
 *
 * Each item's text is cream by default (the home market red). On hover the text
 * colour reverses using the same two brand colours — cream ↔ red — and goes
 * bold + scales up (no background). The colouring lives in `.market-item`
 * (globals.css) via `--mk`/`--mk-hover` so the :hover rule can override it
 * (inline styles couldn't).
 */
export default function MarketsColumns({ markets }: { markets: Market[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
      {markets.map((m) => (
        <li
          key={m.name}
          className="market-item flex flex-col gap-2"
          data-home={m.home ? "true" : undefined}
        >
          <h3 className="font-display text-lg italic">{m.name}</h3>
          <p className="font-body text-sm leading-relaxed">
            {m.sectors.join(" / ")}
          </p>
          <p className="market-line font-body text-sm leading-relaxed">
            {m.line}
          </p>
          <span className="font-body mt-1 text-sm">{m.contact}</span>
        </li>
      ))}
    </ul>
  );
}
