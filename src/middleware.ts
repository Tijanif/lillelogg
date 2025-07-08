// src/middleware.ts (or wherever it is located)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/en', request.url));
    }

    return NextResponse.next();
}

export const config = {

    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
    ],
};