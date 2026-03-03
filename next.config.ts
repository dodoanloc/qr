import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/qr' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/qr' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
