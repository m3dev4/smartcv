import { ResumeTemplateType } from '@/enums/resumeEnum';

// Définition des thèmes par défaut pour chaque template
export const getDefaultThemeForTemplate = (templateName: string) => {
  const templateThemes: Record<
    string,
    {
      name: string;
      description: string;
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    }
  > = {
    modern: {
      name: 'modern-blue',
      description: 'Thème dark moderne',
      primary: '#363636',
      secondary: '#16191d',
      accent: '#ffffff',
      background: '#ffffff',
      text: '#1f2937',
    },
    classic: {
      name: 'classic-navy',
      description: 'Thème classique navy',
      primary: '#1e3a8a',
      secondary: '#38014b',
      accent: '#fafafa',
      background: '#ffffff',
      text: '#374151',
    },
    performance: {
      name: 'performance',
      description: 'Thème performance',
      primary: '#3e1704',
      secondary: '#f6eef3',
      accent: '#fb923c',
      background: '#ffffff',
      text: '#1f2937',
    },
    contemporain: {
      name: 'contemporain-purple',
      description: 'Thème violet contemporain',
      primary: '#2563EB',
      secondary: '#F1F5F9',
      accent: '#1E40AF',
      background: '#ffffff',
      text: '#1E293B',
    },
    mint: {
      name: 'mint-green',
      description: 'Thème vert menthe',
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#ffffff',
      text: '#1f2937',
    },
    compact: {
      name: 'compact-gray',
      description: 'Thème gris compact',
      primary: '#3B82F6',
      secondary: '#EFF6FF',
      accent: '#1E40AF',
      background: '#F8FAFC',
      text: '#1E293B',
    },
    clean: {
      name: 'clean-teal',
      description: 'Thème turquoise propre',
      primary: '#0d9488',
      secondary: '#14b8a6',
      accent: '#2dd4bf',
      background: '#ffffff',
      text: '#1f2937',
    },
    stylish: {
      name: 'stylish-pink',
      description: 'Thème rose stylé',
      primary: '#2563EB',
      secondary: '#F1F5F9',
      accent: '#1E40AF',
      background: '#ffffff',
      text: '#1F2937',
    },
    timeline: {
      name: 'timeline-indigo',
      description: 'Thème indigo chronologique',
      primary: '#4338ca',
      secondary: '#5b21b6',
      accent: '#7c3aed',
      background: '#ffffff',
      text: '#1f2937',
    },
    minimalist: {
      name: 'minimalist-black',
      description: 'Thème noir minimaliste',
      primary: '#111827',
      secondary: '#374151',
      accent: '#4b5563',
      background: '#ffffff',
      text: '#111827',
    },
    elegant: {
      name: 'elegant-gold',
      description: 'Thème doré élégant',
      primary: '#6366F1',
      secondary: '#F8FAFC',
      accent: '#EC4899',
      background: '#ffffff',
      text: '#0F172A',
    },
    executive: {
      name: 'executive-dark',
      description: 'Thème sombre exécutif',
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#4b5563',
      background: '#ffffff',
      text: '#111827',
    },
  };

  return templateThemes[templateName.toLowerCase()] || templateThemes.modern;
};

// Fonction pour créer ou récupérer un thème pour un template
export const getOrCreateThemeForTemplate = async (prisma: any, templateName: string) => {
  const themeConfig = getDefaultThemeForTemplate(templateName);

  // Chercher d'abord si le thème existe déjà
  let theme = await prisma.theme.findUnique({
    where: { name: themeConfig.name },
  });

  // Si le thème n'existe pas, le créer
  if (!theme) {
    theme = await prisma.theme.create({
      data: {
        name: themeConfig.name,
        description: themeConfig.description,
        primary: themeConfig.primary,
        secondary: themeConfig.secondary,
        accent: themeConfig.accent,
        background: themeConfig.background,
        text: themeConfig.text,
        isDefault: templateName.toLowerCase() === 'modern', // Seul le template modern est par défaut
      },
    });
  }

  return theme;
};
