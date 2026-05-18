import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.18.9"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
