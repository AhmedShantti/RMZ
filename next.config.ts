import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats (AVIF first, WebP fallback) at device-appropriate
    // sizes. This is what lets <Image> shrink the CMS PNGs (~450-500 KiB each)
    // to a fraction of the bytes without any visual change.
    formats: ["image/avif", "image/webp"],
    // Payload serves media through its own route on the app's own domain
    // (https://<deployment>.vercel.app/api/media/file/...). Next treats an
    // absolute URL as remote even when it's same-origin, so the host must be
    // allow-listed — `**.vercel.app` covers the production + every preview URL.
    // The Blob host is kept in case media is ever served straight from Blob.
    remotePatterns: [
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
