/**
 * Turns whatever an editor pastes into the "Video link" field into something
 * the BTS page can play. Provider-agnostic on purpose, so the video host can be
 * Bunny Stream, Cloudflare Stream, Vimeo, YouTube, a bare HLS stream or a plain
 * file URL — all common for large (4K) videos that can't go through the CMS's
 * 4.5 MB upload limit.
 *
 *   iframe — the provider's hosted player (adaptive streaming, their controls).
 *            `autoplaySrc` is the same player started MUTED (browsers only
 *            allow muted autoplay inside iframes), used for click-through links.
 *   hls    — an `.m3u8` stream played in our own <video> (hls.js where needed).
 *   file   — a direct MP4/WebM URL in a <video>.
 */
export type VideoSource =
  | { kind: "iframe"; src: string; autoplaySrc: string; provider: string }
  | { kind: "hls"; src: string }
  | { kind: "file"; src: string };

const withParams = (url: string, params: Record<string, string>) => {
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
};

export function parseVideoSource(raw: string): VideoSource {
  let input = raw.trim();
  // An embed snippet (<iframe src="…">) pasted from the video host — use its src.
  const embed = /<iframe[^>]*?\ssrc\s*=\s*["']([^"']+)["']/i.exec(input);
  if (embed) input = embed[1].replace(/&amp;/g, "&").trim();
  let u: URL;
  try {
    u = new URL(input, "https://placeholder.invalid");
  } catch {
    return { kind: "file", src: input };
  }
  const host = u.hostname.replace(/^www\./, "");
  const parts = u.pathname.split("/").filter(Boolean);

  // YouTube — watch?v=ID · youtu.be/ID · /embed/ID · /shorts/ID
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com") {
    const id =
      host === "youtu.be"
        ? parts[0]
        : u.searchParams.get("v") ?? (["embed", "shorts", "live"].includes(parts[0]) ? parts[1] : undefined);
    if (id) {
      const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
      return { kind: "iframe", provider: "youtube", src, autoplaySrc: withParams(src, { autoplay: "1", mute: "1" }) };
    }
  }

  // Vimeo — vimeo.com/ID[/HASH] · player.vimeo.com/video/ID[?h=HASH]
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const idIdx = parts.findIndex((p) => /^\d+$/.test(p));
    const id = idIdx >= 0 ? parts[idIdx] : undefined;
    // private-video hash: ?h=… or the path segment AFTER the id (vimeo.com/ID/HASH)
    const hash = u.searchParams.get("h") ?? (idIdx >= 0 ? parts.slice(idIdx + 1).find((p) => /^[a-f0-9]{8,}$/.test(p)) : undefined);
    if (id) {
      const src = `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}`;
      return { kind: "iframe", provider: "vimeo", src, autoplaySrc: withParams(src, { autoplay: "1", muted: "1" }) };
    }
  }

  // Bunny Stream — (iframe|player).mediadelivery.net/(play|embed)/LIBRARY/VIDEO
  if ((host === "iframe.mediadelivery.net" || host === "player.mediadelivery.net") && parts.length >= 3 && ["play", "embed"].includes(parts[0])) {
    const src = `https://iframe.mediadelivery.net/embed/${parts[1]}/${parts[2]}?preload=true&responsive=true`;
    return { kind: "iframe", provider: "bunny", src, autoplaySrc: withParams(src, { autoplay: "true", muted: "true" }) };
  }

  // Cloudflare Stream — <customer>.cloudflarestream.com/ID/(watch|iframe) · videodelivery.net/ID
  if (host.endsWith("cloudflarestream.com") || host === "videodelivery.net") {
    if (u.pathname.endsWith(".m3u8")) return { kind: "hls", src: u.toString() };
    const id = parts[0];
    if (id) {
      const base = host === "videodelivery.net" ? "https://iframe.videodelivery.net" : `https://${u.hostname}`;
      const src = `${base}/${id}${host === "videodelivery.net" ? "" : "/iframe"}`;
      return { kind: "iframe", provider: "cloudflare", src, autoplaySrc: withParams(src, { autoplay: "true", muted: "true" }) };
    }
  }

  if (/\.m3u8(\?|$)/i.test(u.pathname + u.search)) return { kind: "hls", src: input };
  return { kind: "file", src: input };
}
