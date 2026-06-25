import type { ArrayField } from "payload";

/**
 * Structured "runs" field (CMS_TASK §3) — models a mixed roman/italic/weight/
 * colour display line as an ordered array of runs, so the editorial typography
 * stays fully editable without flattening to a plain string.
 *
 * Each run maps 1:1 to the spans the existing display components already render:
 *   style: normal | italic | bold | bold-italic   (bold = the heavy display weight)
 *   tone:  cream | dim | red                       (cream/cream-dim/rebel-red)
 *   upper: render in uppercase
 *   noSpaceBefore: render with no leading space (e.g. "STORY" + "..")
 */
export const runsField = (
  name: string,
  label: string,
  defaultValue?: RunValue[],
): ArrayField => ({
  name,
  label,
  type: "array",
  labels: { singular: `${label} run`, plural: `${label} runs` },
  admin: {
    description:
      "Each row is one styled fragment of the line, in order. Space is added between runs unless 'No space before' is set.",
    initCollapsed: false,
  },
  ...(defaultValue ? { defaultValue } : {}),
  fields: [
    {
      type: "row",
      fields: [
        { name: "text", type: "text", required: true, admin: { width: "50%" } },
        {
          name: "style",
          type: "select",
          required: true,
          defaultValue: "normal",
          admin: { width: "25%" },
          options: [
            { label: "Normal", value: "normal" },
            { label: "Italic", value: "italic" },
            { label: "Bold", value: "bold" },
            { label: "Bold Italic", value: "bold-italic" },
          ],
        },
        {
          name: "tone",
          type: "select",
          required: true,
          defaultValue: "cream",
          admin: { width: "25%" },
          options: [
            { label: "Cream", value: "cream" },
            { label: "Dim", value: "dim" },
            { label: "Red", value: "red" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "upper",
          type: "checkbox",
          label: "Uppercase",
          defaultValue: false,
          admin: { width: "50%" },
        },
        {
          name: "noSpaceBefore",
          type: "checkbox",
          label: "No space before",
          defaultValue: false,
          admin: { width: "50%" },
        },
      ],
    },
  ],
});

export type RunValue = {
  text: string;
  style: "normal" | "italic" | "bold" | "bold-italic";
  tone: "cream" | "dim" | "red";
  upper?: boolean;
  noSpaceBefore?: boolean;
};
