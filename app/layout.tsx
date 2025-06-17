import type { Metadata } from 'next';
import { IBM_Plex_Sans, Inter, Roboto, Open_Sans, Lato, Montserrat, Poppins, Source_Sans_3 } from 'next/font/google';
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
      <body className={`
        ${ibmPlexSans.variable} 
        ${inter.variable} 
        ${roboto.variable} 
        ${openSans.variable} 
        ${lato.variable} 
        ${montserrat.variable} 
        ${poppins.variable} 
        ${sourceSans.variable}
      `}>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
