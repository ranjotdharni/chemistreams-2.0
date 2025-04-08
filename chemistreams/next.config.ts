import type { NextConfig } from "next"
import { URL } from "next/dist/compiled/@edge-runtime/primitives/url";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
      }
    ]
  }
};

export default nextConfig;
