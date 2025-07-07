// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'no'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if the pathname already contains a supported locale (e.g., /en/dashboard)
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If a locale is present in the path, ensure it's a *supported* one.
    // This handles cases like /fr/dashboard where 'fr' is not supported.
    if (pathnameHasLocale) {
        const [, requestedLocale] = pathname.split('/');
        if (requestedLocale && !locales.includes(requestedLocale)) {
            // If an unsupported locale is requested, redirect to the default locale's path
            // For example, /fr/dashboard -> /en/dashboard
            request.nextUrl.pathname = `/${defaultLocale}${pathname.substring(`/${requestedLocale}`.length)}`;
            return NextResponse.redirect(request.nextUrl);
        }
    } else {
        // 2. If no locale in the pathname, attempt to detect and rewrite to include the locale.
        let detectedLocale = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || defaultLocale;

        // Ensure the detected locale is one of our supported locales
        if (!locales.includes(detectedLocale)) {
            detectedLocale = defaultLocale;
        }

        // Rewrite the URL to include the detected or default locale
        request.nextUrl.pathname = `/${detectedLocale}${pathname}`;
        // Use NextResponse.rewrite for a smoother user experience (URL in browser stays the same)
        return NextResponse.rewrite(request.nextUrl);
    }

    // If a locale is present and is supported, or if it was rewritten, continue
    return NextResponse.next();
}

// Configuration for middleware to run only on specific paths
export const config = {
    // Apply middleware to all paths except:
    // - API routes (handled by app/api)
    // - Next.js internal paths (_next/static, _next/image)
    // - Static assets with a file extension (e.g., favicon.ico, images in public/)
    // - Your /locales folder (where your translation JSONs are, to prevent infinite loops)
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|locales).*)',
    ],
};