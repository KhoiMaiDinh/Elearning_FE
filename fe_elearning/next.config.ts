import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost', '866d-123-21-84-127.ngrok-free.app'],
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
