// Configuration des polices système et Google Fonts
const systemFonts = {
  'Arial': 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'Times New Roman': '"Times New Roman", Georgia, serif',
  'Georgia': 'Georgia, "Times New Roman", serif',
  'Verdana': 'Verdana, Arial, sans-serif',
  'Helvetica': 'Helvetica, Arial, sans-serif',
  'Tahoma': 'Tahoma, Geneva, sans-serif',
  'Trebuchet MS': '"Trebuchet MS", Arial, sans-serif',
  'Courier New': '"Courier New", monospace',
  'Garamond': 'Garamond, serif',
  'Palatino': 'Palatino, "Palatino Linotype", serif',
  'Bookman': '"Bookman Old Style", serif',
  'Comic Sans MS': '"Comic Sans MS", cursive',
  'Impact': 'Impact, Charcoal, sans-serif',
  'Lucida': '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
};

// Configuration des Google Fonts
const googleFonts = {
  'IBM Plex Sans': 'var(--font-ibm-plex-sans), sans-serif',
  'Inter': 'var(--font-inter), sans-serif',
  'Roboto': 'var(--font-roboto), sans-serif',
  'Open Sans': 'var(--font-open-sans), sans-serif',
  'Lato': 'var(--font-lato), sans-serif',
  'Montserrat': 'var(--font-montserrat), sans-serif',
  'Poppins': 'var(--font-poppins), sans-serif',
  'Source Sans 3': 'var(--font-source-sans), sans-serif',
};

// Combinaison des polices système et Google Fonts
const allFonts = { ...systemFonts, ...googleFonts };

// Configuration des tailles de police
export const fontSizes = {
  'très-petit': { value: 12, label: 'Très petit' },
  'petit': { value: 14, label: 'Petit' },
  'normal': { value: 16, label: 'Normal' },
  'grand': { value: 18, label: 'Grand' },
  'très-grand': { value: 20, label: 'Très grand' },
} as const;

// Configuration des hauteurs de ligne
export const lineHeights = {
  'serré': { value: 1.2, label: 'Serré' },
  'normal': { value: 1.5, label: 'Normal' },
  'aéré': { value: 1.8, label: 'Aéré' },
  'très-aéré': { value: 2.0, label: 'Très aéré' },
} as const;

// Fonction pour obtenir la famille de police
export const getFontClass = (fontName?: string): string => {
  return allFonts[fontName as keyof typeof allFonts] || systemFonts['Arial'];
};

// Utilitaire pour obtenir les styles de typographie
export const getTypographyStyles = (
  fontName?: string,
  fontSize?: number,
  lineHeight?: number
) => {
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
    type: 'system'
  })),
  ...Object.entries(googleFonts).map(([name]) => ({
    name,
    category: name.includes('serif') || name.includes('Serif') ? 'Serif' : 'Sans-serif',
    type: 'google'
  }))
];

// Liste des polices disponibles pour l'interface utilisateur
export const availableFonts = Object.keys(allFonts);
