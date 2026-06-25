/**
 * On-demand revalidation (CMS_TASK §5) — when content is saved in the dashboard,
 * regenerate the affected static routes so edits go live without a redeploy.
 *
 * `next/cache` is imported lazily inside the hook so this module stays safe to
 * load from the seed script / non-request contexts (where revalidatePath throws);
 * any such error is swallowed.
 */
type AfterChange = (args: { doc: unknown }) => Promise<unknown>;

const run = async (paths: string[], layoutRoots: string[]) => {
  try {
    const { revalidatePath } = await import("next/cache");
    for (const p of paths) revalidatePath(p);
    for (const r of layoutRoots) revalidatePath(r, "layout");
  } catch {
    // not in a request context (e.g. seed) — nothing to revalidate
  }
};

/** Revalidate specific page paths after a global/collection change. */
export const revalidate =
  (paths: string[], layoutRoots: string[] = []): AfterChange =>
  async ({ doc }) => {
    await run(paths, layoutRoots);
    return doc;
  };
