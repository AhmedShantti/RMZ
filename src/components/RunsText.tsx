import { Fragment } from "react";

/**
 * Render adapter for the structured "runs" display lines (CMS_TASK §3).
 * Maps each run to the exact span class the site already used, so the editorial
 * typography (roman/italic/heavy + cream/dim/red + uppercase) is byte-for-byte
 * the same whether the runs come from code or the CMS.
 *
 * Space is inserted between runs unless a run sets `noSpaceBefore` (e.g. the
 * "STORY" + ".." pair on the contact line).
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

export default function RunsText({ runs }: { runs?: Run[] | null }) {
  if (!runs?.length) return null;
  return (
    <>
      {runs.map((r, i) => {
        const className = [
          STYLE_CLASS[r.style],
          TONE_CLASS[r.tone],
          r.upper ? "uppercase" : "",
        ]
          .filter(Boolean)
          .join(" ");
        const space = i > 0 && !r.noSpaceBefore ? " " : "";
        return (
          <Fragment key={i}>
            {space}
            <span className={className || undefined}>{r.text}</span>
          </Fragment>
        );
      })}
    </>
  );
}
