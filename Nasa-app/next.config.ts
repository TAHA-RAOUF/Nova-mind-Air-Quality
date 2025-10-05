import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'm.media-amazon.com',
      'www2.purpleair.com',
      'media-amazon.com',
      'images-na.ssl-images-amazon.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www2.purpleair.com',
        port: '',
        pathname: '/cdn/shop/**',
      }
    ]
  }
};

export default nextConfig;
