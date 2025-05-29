/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ajout d'une exception pour éviter que Webpack n'essaie de bundler le module binaire de Prisma
      config.externals.push('@prisma/client/runtime');
    }
    return config;
  },
  output: 'standalone', // Cette option est cruciale pour Vercel
};

export default nextConfig;
