import type { NextConfig } from "next";

const localNetworkDevOrigins = [
  "192.168.*.*",
  "10.*.*.*",
  "172.*.*.*",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: localNetworkDevOrigins,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
