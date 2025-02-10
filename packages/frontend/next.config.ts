import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-media.choiceqr.com",
      },
    ],
  },
};

export default nextConfig;
