import type { LegalSection } from "@/components/LegalDoc";

/**
 * Convert a Lexical editor state (as stored by Payload richText) back into the
 * site's numbered-section legal layout: each H2 starts a section, the following
 * paragraphs belong to it. Inline formatting is flattened to text (the legal
 * boilerplate is plain prose; this keeps before/after parity exact).
 */
type LexNode = {
  type?: string;
  tag?: string;
  text?: string;
  children?: LexNode[];
};

function textOf(node: LexNode): string {
  if (typeof node.text === "string") return node.text;
  if (Array.isArray(node.children)) return node.children.map(textOf).join("");
  return "";
}

export function lexicalToSections(body: unknown): LegalSection[] {
  const root = (body as { root?: { children?: LexNode[] } } | null)?.root;
  if (!root?.children?.length) return [];

  const sections: LegalSection[] = [];
  let current: LegalSection | null = null;

  for (const node of root.children) {
    if (node.type === "heading") {
      current = { heading: textOf(node), body: [] };
      sections.push(current);
    } else if (node.type === "paragraph") {
      const text = textOf(node).trim();
      if (!text) continue;
      if (!current) {
        current = { heading: "", body: [] };
        sections.push(current);
      }
      current.body.push(text);
    }
  }
  return sections;
}
