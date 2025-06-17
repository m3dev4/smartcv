import {
  IBM_Plex_Sans,
  Lato,
  Lora,
  Merriweather,
  PT_Sans,
  PT_Serif,
  Roboto_Condensed,
  Roboto_Slab,
  Roboto,
  Roboto_Mono,
  Montserrat,
  Open_Sans,
  Playfair_Display,
} from 'next/font/google';

// Configuration des polices Google
export const lato = Lato({ 
  subsets: ['latin'], 
  weight: ['400', '700'], 
  variable: '--font-lato',
  display: 'swap',
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const ibmPlexSerif = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif',
  display: 'swap',
});

export const lora = Lora({ 
  subsets: ['latin'], 
  weight: ['400', '700'], 
  variable: '--font-lora',
  display: 'swap',
});

export const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-serif',
  display: 'swap',
});

export const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-condensed',
  display: 'swap',
});

export const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-slab',
  display: 'swap',
});

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

// Créer un objet qui combine toutes les polices avec leurs classes CSS
export const allGoogleFonts = {
  lato,
  ibmPlexSans,
  ibmPlexSerif,
  lora,
  merriweather,
  openSans,
  playfairDisplay,
  ptSans,
  ptSerif,
  robotoCondensed,
  robotoSlab,
  roboto,
  robotoMono,
  montserrat,
};

// Variables CSS pour toutes les polices
export const fontVariables = Object.values(allGoogleFonts)
  .map((font) => font.variable)
  .join(' ');

// Mapping des noms de polices vers leurs classes CSS
export const getFontClass = (fontName: string): string => {
  const fontMap: Record<string, string> = {
    // Polices système
    'Arial': 'Arial, sans-serif',
    'Times New Roman': '"Times New Roman", serif',
    'Cambria': 'Cambria, serif',
    'Garamond': 'Garamond, serif',
    
    // Polices Google
    'Lato': 'var(--font-lato)',
    'IBM Plex Sans': 'var(--font-ibm-plex-sans)',
    'IBM Plex Serif': 'var(--font-ibm-plex-serif)',
    'Lora': 'var(--font-lora)',
    'Merriweather': 'var(--font-merriweather)',
    'Open Sans': 'var(--font-open-sans)',
    'Playfair Display': 'var(--font-playfair-display)',
    'PT Sans': 'var(--font-pt-sans)',
    'PT Serif': 'var(--font-pt-serif)',
    'Roboto Condensed': 'var(--font-roboto-condensed)',
    'Roboto Slab': 'var(--font-roboto-slab)',
    'Roboto': 'var(--font-roboto)',
    'Roboto Mono': 'var(--font-roboto-mono)',
    'Montserrat': 'var(--font-montserrat)',
    'Monserrat': 'var(--font-montserrat)', // Correction de la faute de frappe
    'Monserrat Subrayada': 'var(--font-montserrat)', // Fallback
    'Monserrat Alternates': 'var(--font-montserrat)', // Fallback
  };

  return fontMap[fontName] || 'Arial, sans-serif';
};
