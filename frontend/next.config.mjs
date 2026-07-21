/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: false, // Disables double-rendering check in development to optimize memory and speed up rendering
  swcMinify: true,        // Uses Rust SWC compiler for minifying and compiling files rapidly
  poweredByHeader: false, // Extra slight speedup by removing powered by headers
};

export default nextConfig;
