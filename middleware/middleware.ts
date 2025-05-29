import { NextRequest, NextResponse } from 'next/server';

//Route privée
const protectedRoutes = ['/dashboard'];

//Route publique
const publicRoutes = ['/sign-in', '/sign-up', '/verify-email'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    //Récuperer le token de session depuis les cookies
    const sessionToken = request.cookies.get('sessionToken')?.value;
    const isAuthenticated = !!sessionToken;

    //Si l'utilisateur accéde à une route protégée mais n'est pas authentifié
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
        const url = new URL('/sign-in', request.url);
        url.searchParams.set('callbackURL', pathname);
        return NextResponse.redirect(url);
    }

    //Si l'utilisateur est authentifié mais tente d'accéder à une route d'authentification
    if (protectedRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}
//Config le middleware poru qu'il s'exécute sur les routes spécifiques
export const config = {
    matcher: [
        /**
         * Correspond à toutes les routes requises
         */
        ...protectedRoutes,
        ...publicRoutes,
    ],
};
