export type Market = {
  name: string;
  sectors: string[];
  line: string;
  contact: string;
  home?: boolean;
};

/** The four market columns (Egyptian in red). Shared by Home + Contact. */
export default function MarketsColumns({ markets }: { markets: Market[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
      {markets.map((m) => {
        const home = !!m.home;
        return (
          <li key={m.name} className="flex flex-col gap-2">
            <h3
              className="font-display text-lg italic"
              style={{ color: home ? "var(--rebel-red)" : "var(--cream)" }}
            >
              {m.name}
            </h3>
            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: home ? "var(--rebel-red)" : "var(--cream)" }}
            >
              {m.sectors.join(" / ")}
            </p>
            <p
              className="font-body text-sm leading-relaxed"
              style={{
                color: home ? "var(--rebel-red)" : "var(--cream-dim)",
              }}
            >
              {m.line}
            </p>
            <span
              className="font-body mt-1 text-sm"
              style={{ color: home ? "var(--rebel-red)" : "var(--cream)" }}
            >
              {m.contact}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
