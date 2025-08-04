import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  sassOptions: {
    implementation: "sass",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_SKIP_BUILD_AUTH: process.env.NEXT_PUBLIC_SKIP_BUILD_AUTH,
  },
  output: "standalone",
};

export default nextConfig;
