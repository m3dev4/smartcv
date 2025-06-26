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

export async function fetchResumeById(id: string) {
  console.log('Fetching resume with ID in Prisma:', id);
  
  const resume = await prisma.resume.findUnique({
    where: { id },
    include: {
      personalInfo: true,
      educations: true,
      experiences: true,
      skills: true,
      languages: true,
      certifications: true,
      projects: true,
      template: true,
      theme: true,
      font: true,
    }
  });

  console.log('Fetched resume details:', JSON.stringify(resume, null, 2));

  return resume;
}
