import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow external images from fakestoreapi
    remotePatterns: [
      { protocol: "https", hostname: "fakestoreapi.com" },
    ],
  },
};

export default nextConfig;
