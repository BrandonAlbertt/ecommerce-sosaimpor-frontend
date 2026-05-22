import type { NextConfig } from "next";

const localNetworkDevOrigins = [
  "192.168.*.*",
  "10.*.*.*",
  "172.*.*.*",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: localNetworkDevOrigins,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
