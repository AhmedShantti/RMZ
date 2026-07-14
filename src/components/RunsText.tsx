import { Fragment } from "react";

/**
 * Render adapter for the structured "runs" display lines (CMS_TASK §3).
 * Maps each run to the exact span class the site already used, so the editorial
 * typography (roman/italic/heavy + cream/dim/red + uppercase) is byte-for-byte
 * the same whether the runs come from code or the CMS.
 *
 * Space is inserted between runs unless a run sets `noSpaceBefore` (e.g. the
 * "STORY" + ".." pair on the contact line).
 *
 * `reveal` opt-in: splits each run into per-character `.rt-unit` spans (grouped
 * into `.rt-word` wrappers so wrapping stays intact) for a staggered entrance —
 * animated by GSAP (hero) or CSS (`[data-reveal]` ancestor, see globals.css).
 * Markup is identical on server and client (pure render, no JS injection). The
 * split is `aria-hidden`; a visually-hidden copy carries the real text so
 * screen readers read the line normally instead of letter-by-letter.
 * `revealStartIndex` offsets the `--i` stagger counter so a heading split across
 * two RunsText calls (e.g. the stacked CTA) staggers as one continuous line.
 */
export type Run = {
  text: string;
  style: "normal" | "italic" | "bold" | "bold-italic";
  tone: "cream" | "dim" | "red";
  upper?: boolean | null;
  noSpaceBefore?: boolean | null;
};

const STYLE_CLASS: Record<Run["style"], string> = {
  normal: "",
  italic: "italic",
  bold: "font-black",
  "bold-italic": "font-black italic",
};

const TONE_CLASS: Record<Run["tone"], string> = {
  cream: "",
  dim: "text-cream-dim",
  red: "text-rebel-red",
};

function runClass(r: Run): string | undefined {
  return (
    [STYLE_CLASS[r.style], TONE_CLASS[r.tone], r.upper ? "uppercase" : ""]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

/**
 * Split runs into per-character `.rt-unit` spans (grouped by `.rt-word`) plus
 * the concatenated plain text. Module-scope so the running counters are local
 * to this pure builder, not the component render.
 */
function buildReveal(runs: Run[], startIndex: number) {
  let unit = startIndex;
  let plain = "";
  const visual = runs.map((r, i) => {
    const space = i > 0 && !r.noSpaceBefore ? " " : "";
    plain += space + r.text;
    // Keep whitespace tokens so intra-run spaces still render and allow breaks.
    const tokens = r.text.split(/(\s+)/);
    return (
      <Fragment key={i}>
        {space}
        <span className={runClass(r)}>
          {tokens.map((tok, ti) => {
            if (tok === "") return null;
            if (/^\s+$/.test(tok)) return <Fragment key={ti}>{tok}</Fragment>;
            return (
              <span key={ti} className="rt-word">
                {Array.from(tok).map((ch, ci) => (
                  <span
                    key={ci}
                    className="rt-unit"
                    style={{ "--i": unit++ } as React.CSSProperties}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            );
          })}
        </span>
      </Fragment>
    );
  });
  return { visual, plain };
}

export default function RunsText({
  runs,
  reveal = false,
  revealStartIndex = 0,
}: {
  runs?: Run[] | null;
  reveal?: boolean;
  revealStartIndex?: number;
}) {
  if (!runs?.length) return null;

  if (!reveal) {
    return (
      <>
        {runs.map((r, i) => {
          const space = i > 0 && !r.noSpaceBefore ? " " : "";
          return (
            <Fragment key={i}>
              {space}
              <span className={runClass(r)}>{r.text}</span>
            </Fragment>
          );
        })}
      </>
    );
  }

  // Reveal mode — split into staggerable units + a screen-reader real-text copy.
  const { visual, plain } = buildReveal(runs, revealStartIndex);
  return (
    <>
      <span aria-hidden="true">{visual}</span>
      <span className="sr-only">{plain}</span>
    </>
  );
}
