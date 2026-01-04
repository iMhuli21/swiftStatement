import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'pc92dhkjxi.ufs.sh',
        pathname: '/*/**',
        protocol: 'https',
      },
      {
        hostname: '7xoo6hqv0o.ufs.sh',
        pathname: '/*/**',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
