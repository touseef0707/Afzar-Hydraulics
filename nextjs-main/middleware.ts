import { NextRequest, NextResponse, userAgent } from 'next/server';

/**
 * This middleware protects /dashboard and all its sub-routes.
 * It expects the browser to send a cookie named `session`; if the cookie is
 * missing the user is considered anonymous and is redirected to /login.
 */

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const { device } = userAgent(request);
    const isMobile = device?.type === 'mobile';
    // Only run the auth-check for the dashboard area
    if (pathname.startsWith('/dashboard')) {
        
        if (isMobile) {
            return NextResponse.redirect(new URL('/desktop-only-page', request.url));
        }

        const sessionCookie = request.cookies.get('__session')?.value;
        console.log(sessionCookie)

        // Not logged in → kick to login (you can change the path)
        if (!sessionCookie) {
            const loginUrl = new URL('/login', request.url);
            // optional: remember where the user wanted to go
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Either the route is public or the cookie exists → continue
    return NextResponse.next();
}

/**
 * Tell Next.js to invoke the middleware only for /dashboard and its
 * sub-routes, which is more efficient than checking every single request.
 */
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*'],
};
