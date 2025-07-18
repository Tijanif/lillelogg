import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'no'],
};

const PUBLIC_PATHS = [
    '',
    'signin',
    'signup',
];

const AUTH_REDIRECT_IF_LOGGED_IN_PATHS = [
    '',
    'signin',
    'signup',
];

function getPreferredLocale(request: NextRequest) {
    const acceptLanguageHeader = request.headers.get('accept-language');
    const browserLocales = acceptLanguageHeader
        ? acceptLanguageHeader.split(',').map(lang => lang.split(';')[0]) : [];

    for(const lang of browserLocales){
        if (i18n.locales.includes(lang)) {
            return lang;
        }
    }
}



export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (pathname === '/') {
        const locale = getPreferredLocale(request);
        return NextResponse.redirect(new URL(`/${locale}`, request.url));

    }

    const pathnameParts = pathname.split('/');
    const currentLocale = pathnameParts[1];
    const isLocaleSupported = i18n.locales.includes(currentLocale);

    if(currentLocale && !isLocaleSupported) {
        const preferredLocale = getPreferredLocale(request);

        return NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url));
    }

    const pathWithoutLocalePrefix = isLocaleSupported ? pathnameParts.slice(2).join('/') : '';

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;

    const isAuthPage = AUTH_REDIRECT_IF_LOGGED_IN_PATHS.includes(pathWithoutLocalePrefix);
    if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url));
    }

    const isProtectedRoute = !PUBLIC_PATHS.includes(pathWithoutLocalePrefix);

    if (!isAuthenticated && isProtectedRoute) {
        return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
    }

    return NextResponse.next();
}

export const config = {

    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};