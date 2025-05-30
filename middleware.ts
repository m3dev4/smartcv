import { NextRequest, NextResponse } from 'next/server';

// Route privée
const protectedRoutes = ['/dashboard'];

// Route publique
const publicRoutes = ['/sign-in', '/sign-up', '/verify-email'];

// Ce format est nécessaire pour que Next.js détecte correctement le middleware
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Récupérer le token de session depuis les cookies
  const sessionToken = request.cookies.get('sessionToken')?.value;
  const isAuthenticated = !!sessionToken;

  // Si l'utilisateur accède à une route protégée mais n'est pas authentifié
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur est authentifié mais tente d'accéder à une route d'authentification
  if (publicRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard/resumes', request.url));
  }

  return NextResponse.next();
}

// Configuration pour les routes où le middleware s'applique
export const config = {
  matcher: [
    // Routes protégées
    '/dashboard/:path*',
    
    // Routes publiques
    '/sign-in/:path*',
    '/sign-up/:path*',
    '/verify-email/:path*'
  ]
};
