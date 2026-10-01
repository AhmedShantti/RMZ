import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

/**
 * Hosts the site can be served from, for /api/media/file/** (Payload's media
 * route). Media URLs are absolute and built from the site URL, so whichever
 * domain serves the page must be allow-listed or next/image answers 400.
 * The fixed list is ALWAYS included; hosts from the env vars the project
 * already uses (payload.config.ts: NEXT_PUBLIC_SERVER_URL,
 * VERCEL_PROJECT_PRODUCTION_URL) plus the current deployment (VERCEL_URL) are
 * added, so a future domain change doesn't break images again.
 */
const MEDIA_PATH = "/api/media/file/**";
const FIXED_MEDIA_HOSTS = ["www.rmz.solutions", "rmz.solutions", "rmz-psi.vercel.app"];

const hostOf = (value?: string) => {
  if (!value) return null;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).hostname;
  } catch {
    return null;
  }
};

const MEDIA_HOSTS = [
  ...new Set(
    [
      ...FIXED_MEDIA_HOSTS,
      hostOf(process.env.NEXT_PUBLIC_SERVER_URL),
      hostOf(process.env.VERCEL_PROJECT_PRODUCTION_URL),
      hostOf(process.env.VERCEL_URL),
    ].filter((h): h is string => Boolean(h) && h !== "localhost"),
  ),
];

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats (AVIF first, WebP fallback) at device-appropriate
    // sizes. This is what lets <Image> shrink the CMS PNGs (~450-500 KiB each)
    // to a fraction of the bytes without any visual change.
    formats: ["image/avif", "image/webp"],
    // 75 (default) + 85/90 for the About banner and section images.
    qualities: [75, 85, 90],
    // Payload serves media through its own route on the app's own domain
    // (https://<deployment>.vercel.app/api/media/file/...). Next treats an
    // absolute URL as remote even when it's same-origin, so the host must be
    // allow-listed — `**.vercel.app` covers the production + every preview URL.
    // The Blob host is kept in case media is ever served straight from Blob.
    remotePatterns: [
      // Explicit media hosts (custom domain, non-www, vercel.app, env-derived).
      ...MEDIA_HOSTS.map((hostname) => ({
        protocol: "https" as const,
        hostname,
        pathname: MEDIA_PATH,
      })),
      // Local dev (any port; omitted `port` = any).
      { protocol: "http" as const, hostname: "localhost", pathname: MEDIA_PATH },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

// withPayload mounts the embedded admin + API and wires the import map.
export default withPayload(nextConfig);
