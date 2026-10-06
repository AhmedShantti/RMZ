/**
 * Images pasted as a link (Bunny / any CDN) are shown straight from that link —
 * the site never downloads or re-encodes them, so they keep their exact quality
 * and size. Images uploaded to the CMS (relative `/api/media/…` or the Vercel
 * Blob host) still go through Next's optimizer.
 */
export const isExternalImage = (src?: string | null): boolean => {
  if (!src || !/^https?:\/\//i.test(src)) return false;
  try {
    return !new URL(src).hostname.endsWith("blob.vercel-storage.com");
  } catch {
    return false;
  }
};
