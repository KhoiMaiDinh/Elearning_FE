import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost', '7f31-115-78-5-112.ngrok-free.app'],
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
