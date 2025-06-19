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
    domains: ['img.freepik.com', 'media.licdn.com'],
  },
  expireTime: {
    turbopack: false,
  },
  api: {
    bodyParser: false,
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
  siteUrl: ['https://smartcv.vercel.app', 'https://smart-cv-sn.netlify.app'],
  generateRobotsTxt: true,
  exclude: ['admin', '/dashboard/**', 'settings', '/editor/**'],
};

export default nextConfig;
