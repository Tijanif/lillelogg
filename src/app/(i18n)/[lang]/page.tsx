'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LandingPage() {
    const { t } = useTranslation('common');

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-light-background text-dark-text">
            <h1 className="text-primary-blue text-5xl font-sans font-bold mb-4 text-center">
                {t('appTitle')}
            </h1>

            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-dark-text">{t('landingPage.heroHeadline')}</h2>
                <p className="text-muted-text text-lg mb-8 max-w-lg mx-auto">
                    {t('landingPage.heroSubHeadline')}
                </p>

                <div className="flex flex-col space-y-4 max-w-sm mx-auto">
                    <Button size="xl" fullWidth>
                        {t('landingPage.getStartedButton')}
                    </Button>
                    <Button variant="secondary-outline" size="xl" fullWidth>
                        {t('buttons.login')}
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-md mt-12 space-y-4">
                <Input label={t('inputs.emailPlaceholder')} placeholder={t('inputs.emailPlaceholder')} type="email" />
                <Input label={t('inputs.passwordPlaceholder')} placeholder={t('inputs.passwordPlaceholder')} type="password" error="This is a test error message" />
            </div>
        </main>
    );
}
