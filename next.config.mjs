/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Configuration pour Prisma sur Vercel
      config.externals.push('@prisma/client');
    }
    return config;
  },
  images: {
    domains: ['img.freepik.com'],
  },
  output: 'standalone',
  experimental: {
    // Important pour Prisma sur Vercel
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
