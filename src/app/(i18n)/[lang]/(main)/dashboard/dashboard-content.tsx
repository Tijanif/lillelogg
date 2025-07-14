'use client';

import { useTranslation } from 'react-i18next';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Session } from 'next-auth';

interface DashboardContentProps {
    session: Session | null;
    lang: string;
}

export default function DashboardContent({ session, lang }: DashboardContentProps) {
    const { t } = useTranslation('common');


    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-light-background text-dark-text">
            <h1 className="text-3xl font-bold mb-4 text-dark-text">
                {t('dashboard.welcome', { name: session?.user?.name || 'User' })}
            </h1>
            <p className="text-muted-text mb-8">
                {t('dashboard.status', { email: session?.user?.email || 'N/A', role: session?.user?.role || 'N/A' })}
            </p>

            <Button onClick={() => signOut({ callbackUrl: `/${lang}/signin` })} variant="primary" size="md">
                {t('buttons.logout')}
            </Button>
        </main>
    );
}