'use client';

import { useTranslation } from 'react-i18next';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
    const { t } = useTranslation('common');
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-light-background text-dark-text">
                <p>{t('common:loading')}</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-light-background text-dark-text">
            <h1 className="text-3xl font-bold mb-4 text-dark-text">
                {t('dashboard.welcome', { name: session?.user?.name || 'User' })}
            </h1>
            <p className="text-muted-text mb-8">
                {t('dashboard.status', { email: session?.user?.email || 'N/A', role: session?.user?.role || 'N/A' })}
            </p>

            <Button onClick={() => signOut({ callbackUrl: `/${t('common:locale')}/signin` })} variant="primary" size="md">
                {t('buttons.logout')}
            </Button>
        </main>
    );
}