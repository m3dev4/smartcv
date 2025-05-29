import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/nexttheme-provider';

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
    title: 'Smart CV',
    description: 'Un outil pour créer un CV professionnel',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={ibmPlexSans.className}>
                <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
