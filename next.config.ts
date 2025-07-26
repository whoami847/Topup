
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Ignore build errors during production builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  // Enable experimental features for better build performance
  experimental: {
    // Improve build performance
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
