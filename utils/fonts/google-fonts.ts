import { googleFonts, systemFonts } from '@/constants';

// Combinaison des polices système et Google Fonts
const allFonts = { ...systemFonts, ...googleFonts };

// Configuration des tailles de police
export const fontSizes = {
  'très-petit': { value: 12, label: 'Très petit' },
  petit: { value: 14, label: 'Petit' },
  normal: { value: 16, label: 'Normal' },
  grand: { value: 18, label: 'Grand' },
  'très-grand': { value: 20, label: 'Très grand' },
} as const;

// Configuration des hauteurs de ligne
export const lineHeights = {
  serré: { value: 1.2, label: 'Serré' },
  normal: { value: 1.5, label: 'Normal' },
  aéré: { value: 1.8, label: 'Aéré' },
  'très-aéré': { value: 2.0, label: 'Très aéré' },
} as const;

// Fonction pour obtenir la famille de police
export const getFontClass = (fontName?: string): string => {
  return allFonts[fontName as keyof typeof allFonts] || systemFonts['Arial'];
};

// Utilitaire pour obtenir les styles de typographie
export const getTypographyStyles = (fontName?: string, fontSize?: number, lineHeight?: number) => {
  return {
    fontFamily: getFontClass(fontName),
    fontSize: fontSize ? `${fontSize}px` : '16px',
    lineHeight: lineHeight || 1.5,
  };
};

// Métadonnées des polices pour l'interface utilisateur
export const fontMetadata = [
  ...Object.entries(systemFonts).map(([name]) => ({
    name,
    category: name.includes('serif') ? 'Serif' : 'Sans-serif',
    type: 'system',
  })),
  ...Object.entries(googleFonts).map(([name]) => ({
    name,
    category: name.includes('serif') || name.includes('Serif') ? 'Serif' : 'Sans-serif',
    type: 'google',
  })),
];

// Liste des polices disponibles pour l'interface utilisateur
export const availableFonts = Object.keys(allFonts);
