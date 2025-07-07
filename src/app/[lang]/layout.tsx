'use client';

import React from 'react';
// import { SessionProvider } from 'next-auth/react'; // From your Week 1 Global Layout Story
// import { I18nProvider } from '@/components/layout/I18nProvider'; // This component needs to be created in a separate step (Task: Integrate i18n Context)

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: { lang: string };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
    return (
        // <SessionProvider>
        //     <I18nProvider lang={params.lang}>
                {children}
            //</I18nProvider>
        // </SessionProvider>
    );
}