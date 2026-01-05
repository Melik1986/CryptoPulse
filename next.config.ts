import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
    images: {
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {
                protocol: "https",
                hostname: "assets.coingecko.com",
            }, {
                protocol: "https",
                hostname: "coin-images.coingecko.com",
            },
        ]
    }
};

export default nextConfig;
