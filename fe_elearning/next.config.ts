import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/video/:path*",
        destination: "http://192.168.111.133:9000/video/:path*",
      },
    ];
  },
};

export default nextConfig;
