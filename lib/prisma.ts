import { PrismaClient } from './generated/prisma';

// PrismaClient est attaché au scope global en développement pour éviter
// d'épuiser les connexions de base de données pendant le hot-reloading
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
