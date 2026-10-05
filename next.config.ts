import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The floating dev badge sits over the bottom-left of every page, which
  // ruins screenshots taken for client review. Errors still surface.
  devIndicators: false,

  // Pin the workspace root. Without this, Turbopack walks up and finds the
  // stray package-lock.json in the home directory and warns on every build.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
