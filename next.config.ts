import type { NextConfig } from "next";

type RemoteImagePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const localNetworkDevOrigins = [
  "192.168.*.*",
  "10.*.*.*",
  "172.*.*.*",
];

const imageCacheTtl = 7 * 24 * 60 * 60;
const fallbackRemoteImagePatterns: RemoteImagePattern[] = [
  {
    hostname: "images.unsplash.com",
    protocol: "https",
  },
  {
    hostname: "res.cloudinary.com",
    protocol: "https",
  },
];

function getHostnameFromUrl(value?: string) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

function getProductionImagePatterns() {
  // NEXT_PUBLIC_IMAGE_HOSTNAME permite declarar uno o varios hosts de imagenes
  // separados por coma. Si no se configura, se usa el host de NEXT_PUBLIC_API_URL.
  // En produccion evitamos hostname "**" para no optimizar imagenes de cualquier dominio.
  const configuredHostnames = process.env.NEXT_PUBLIC_IMAGE_HOSTNAME
    ?.split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean) ?? [];
  const apiHostname = getHostnameFromUrl(process.env.NEXT_PUBLIC_API_URL);

  const configuredPatterns = [...new Set([
    ...configuredHostnames,
    ...(apiHostname ? [apiHostname] : []),
  ])].map((hostname) => ({
    hostname,
    protocol: "https" as const,
  }));

  return [
    ...fallbackRemoteImagePatterns,
    ...configuredPatterns,
  ];
}

function getRemoteImagePatterns(): RemoteImagePattern[] {
  const productionPatterns = getProductionImagePatterns();

  if (process.env.NODE_ENV === "production") {
    return productionPatterns;
  }

  return [
    ...productionPatterns,
    {
      hostname: "localhost",
      port: "3003",
      protocol: "http" as const,
    },
    {
      hostname: "127.0.0.1",
      port: "3003",
      protocol: "http" as const,
    },
  ];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: localNetworkDevOrigins,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: imageCacheTtl,
    remotePatterns: getRemoteImagePatterns(),
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
