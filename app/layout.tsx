import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/providers/nexttheme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { allGoogleFonts, fontVariables } from '@/utils/fonts/google-fonts';

export const metadata: Metadata = {
  title: 'Smart CV',
  description: 'Un outil pour créer un CV professionnel',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables}`}>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
