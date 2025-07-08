'use client';

import { SessionProvider } from 'next-auth/react';
import { I18nextProvider } from 'react-i18next';
import i18nClient from '@/lib/i18n';
import { useEffect, useState } from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
    locale: string;
}

export function AppLayout({ children, locale }: AppLayoutProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (i18nClient.language !== locale) {
            i18nClient.changeLanguage(locale)
                .then(() => setIsLoaded(true))
                .catch(err => console.error("Error changing i18n language:", err));
        } else {
            setIsLoaded(true);
        }
    }, [locale]);

    if (!isLoaded) {
        return null;
    }

    return (
        <SessionProvider>
            <I18nextProvider i18n={i18nClient}>
                {children}
            </I18nextProvider>
        </SessionProvider>
    );
}