/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Configuration pour Prisma sur Vercel
      config.externals.push('@prisma/client');
    }
    return config;
  },
  output: 'standalone',
  experimental: {
    // Important pour Prisma sur Vercel
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
};

export default nextConfig;