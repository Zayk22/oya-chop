import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled until Clerk ships full compatibility with Next.js 16 Cache Components.
  // See: https://github.com/vercel/next.js/issues/85490
  cacheComponents: false,

  // Turbopack wiring for Tailwind CSS v4.
  // Without this block, `@import "tailwindcss"` in globals.css does nothing.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;