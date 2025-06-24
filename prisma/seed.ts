// Polices intégrées localement pour éviter les alias
const systemFonts = {
  Arial: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'Times New Roman': '"Times New Roman", Georgia, serif',
  Georgia: 'Georgia, "Times New Roman", serif',
  Verdana: 'Verdana, Arial, sans-serif',
  Helvetica: 'Helvetica, Arial, sans-serif',
  Tahoma: 'Tahoma, Geneva, sans-serif',
  'Trebuchet MS': '"Trebuchet MS", Arial, sans-serif',
  'Courier New': '"Courier New", monospace',
  Garamond: 'Garamond, serif',
  Palatino: 'Palatino, "Palatino Linotype", serif',
  Bookman: '"Bookman Old Style", serif',
  'Comic Sans MS': '"Comic Sans MS", cursive',
  Impact: 'Impact, Charcoal, sans-serif',
  Lucida: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
};

const googleFonts = {
  'IBM Plex Sans': 'var(--font-ibm-plex-sans), sans-serif',
  Inter: 'var(--font-inter), sans-serif',
};
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
    name: 'clean',
    description: 'A clean and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/clean.png',
    isDefault: false,
  },
  {
    name: 'compact',
    description: 'A compact and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/compact.png',
    isDefault: false,
  },
  {
    name: 'contemporain',
    description: 'A contemporain and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/contemporain.png',
    isDefault: false,
  },
  {
    name: 'elegant',
    description: 'A elegant and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/elegant.png',
    isDefault: false,
  },
  {
    name: 'executive',
    description: 'A executive and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/executive.png',
    isDefault: false,
  },
  {
    name: 'minimalist',
    description: 'A minimalist and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/minimalist.png',
    isDefault: false,
  },
  {
    name: 'mint',
    description: 'A mint and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/mint.png',
    isDefault: false,
  },
  {
    name: 'stylish',
    description: 'A stylish and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/stylish.png',
    isDefault: false,
  },
  {
    name: 'timeline',
    description: 'A timeline and sleek template, perfect for any professional resume.',
    thumbnail: '/resumes/timeline.png',
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
        // ---- Seed des polices ----
    const fontNames = [...Object.keys(systemFonts), ...Object.keys(googleFonts), 'default'];

    for (const name of fontNames) {
      try {
        const existingFont = await prisma.font.findFirst({ where: { name } });
        if (existingFont) {
          console.log(`Font ${name} existe déjà`);
          continue;
        }
        const fontData = {
          name,
          category: name.toLowerCase().includes('serif') ? 'SERIF' : 'SANS_SERIF',
          url: `https://fonts.google.com/specimen/${name.replace(/\s+/g, '+')}`,
          isDefault: name === 'default',
        } as any;
        await prisma.font.create({ data: fontData });
        console.log(`Font créée : ${name}`);
      } catch (error) {
        console.error(`Erreur lors de la création de la font ${name}:`, error);
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