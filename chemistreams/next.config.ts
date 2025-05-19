import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com"
      }, 
      {
        protocol: "https",
        hostname: "cdn.pixabay.com"
      }
    ]
  }
};

export default nextConfig;
