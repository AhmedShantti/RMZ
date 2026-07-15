import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats (AVIF first, WebP fallback) at device-appropriate
    // sizes. This is what lets <Image> shrink the CMS PNGs (~450-500 KiB each)
    // to a fraction of the bytes without any visual change.
    formats: ["image/avif", "image/webp"],
    // CMS media lives in Vercel Blob in prod; allow the optimizer to fetch it.
    // (Local dev serves media same-origin, which needs no pattern.)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

// withPayload mounts the embedded admin + API and wires the import map.
export default withPayload(nextConfig);
