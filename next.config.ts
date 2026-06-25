import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* config options here */
};

// withPayload mounts the embedded admin + API and wires the import map.
export default withPayload(nextConfig);
