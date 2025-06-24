import type { Metadata } from 'next';
import {
  IBM_Plex_Sans,
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Source_Sans_3,
} from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/nexttheme-provider';
import { AuthProvider } from '@/providers/auth-provider';

// Configuration des polices Google
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart CV',
  description: 'Un outil pour créer un CV professionnel',
  icons: {
    icon: '/scv.svg',
  },
  alternates: { canonical: 'https://smart-cv-sn.netlify.app/' },
  openGraph: {
    title: 'Smart CV',
    description: 'Un outil super puissant pour créér des CVs gratuitement',
    url: 'https://smart-cv-sn.netlify.app/',
    siteName: 'Smart CV',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: 'https://smart-cv-sn.netlify.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Smart CV',
      },
    ],
  },
  keywords: ['CV', 'CV gratuit', 'CV professionnel', 'CV en ligne', 'CV en PDF'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="keywords" content="CV, CV gratuit, CV professionnel, CV en ligne, CV en PDF" />
      </head>
      <body
        className={`
        ${ibmPlexSans.variable} 
        ${inter.variable} 
        ${roboto.variable} 
        ${openSans.variable} 
        ${lato.variable} 
        ${montserrat.variable} 
        ${poppins.variable} 
        ${sourceSans.variable}
      `}
      >
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
