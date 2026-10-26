import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    unoptimized: process.env.PLAYWRIGHT_TEST === "1",
  },
};

export default function config(phase: string): NextConfig {
  const oneDriveWorkspace =
    process.platform === "win32" &&
    process.cwd().toLowerCase().includes("\\onedrive\\");
  return {
    ...nextConfig,
    // OneDrive cloud directories can be misclassified during Next's cache cleanup.
    cleanDistDir: !oneDriveWorkspace,
    // Isolate local OneDrive builds; hosting adapters expect the standard .next output.
    distDir:
      oneDriveWorkspace && phase !== PHASE_DEVELOPMENT_SERVER
        ? ".next-production"
        : ".next",
  };
}
