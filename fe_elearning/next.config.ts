import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/video/:path*",
        destination: "http://192.168.110.50:9000/video/:path*",
      },
      {
        source: "/video/:path*",
        destination: "http://localhost:9000/video/:path*",
      },
    ];
  },
};

export default nextConfig;
