import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // @ts-expect-error - turbopack is not yet in NextConfig type definitions
    turbopack: {}
  }
};

export default nextConfig;
