import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled until Clerk ships full compatibility with Next.js 16 Cache Components.
  // See: https://github.com/vercel/next.js/issues/85490
  cacheComponents: false,
};

export default nextConfig;