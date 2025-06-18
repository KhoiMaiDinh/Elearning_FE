import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost', 'f87c-115-79-32-220.ngrok-free.app'],
    dangerouslyAllowSVG: true,
  },

  async rewrites() {
    return [
      {
        source: '/video/:path*',
        destination: 'http://192.168.111.133:9000/video/:path*',
      },
    ];
  },
};

export default nextConfig;
