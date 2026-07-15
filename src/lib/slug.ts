/**
 * URL-safe slug from a project name. Used as the fallback when a CMS doc predates
 * the `slug` field, so existing published projects still resolve to a detail page
 * instead of 404ing.
 *
 * NFKD splits accented letters into base + combining mark; the non-alphanumeric
 * collapse below then drops the mark, so "Café" → "cafe" without a separate pass.
 */
export const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
