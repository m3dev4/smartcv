import { PrismaClient } from '../lib/generated/prisma/index.js';

console.log('Début du script de seed');

const prisma = new PrismaClient();

console.log('Client Prisma initialisé');
console.log('Modèles disponibles:', Object.keys(prisma).filter(key => !key.startsWith('$')));

const templates = [
  {
    name: 'classic',
    description: 'A classic and elegant template, perfect for any professional resume.',
    thumbnail: '/resumes/classic.png',
    isDefault: true,
  },
  {
    name: 'modern',
    description: 'A modern and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/modern.png',
    isDefault: false,
  },
  {
    name: 'performance',
    description: 'A performance and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/performance.png',
    isDefault: false,
  },
];

async function main() {
  try {
    console.log('Début de la fonction main');
    
    // Vérifier les templates existants
    const existingTemplates = await prisma.template.findMany();
    console.log('Templates existants:', existingTemplates);
    
    for (const template of templates) {
      try {
        const existingTemplate = await prisma.template.findUnique({
          where: { name: template.name },
        });
        
        if (existingTemplate) {
          console.log(`Template ${template.name} existe déjà`);
          continue;
        }
        
        const result = await prisma.template.create({
          data: template,
        });
        console.log(`Template créé : ${template.name}`);
        console.log(result);
      } catch (error) {
        console.error(`Erreur lors de la création du template ${template.name}:`, error);
      }
    }
    console.log('Seed terminé');
  } catch (error) {
    console.error('Erreur globale :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error('Erreur finale :', e);
    process.exit(1);
  });