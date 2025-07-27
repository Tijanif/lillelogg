import { Header } from '@/components/layout/Header';
import { createTranslation } from '@/lib/i18n_server_utils';
import { GrowthForm } from '@/components/features/growth/GrowthForm';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await createTranslation( lang, 'common');
    return {
        title: t('addGrowth'),
    };
}

export default async function AddGrowthPage({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await createTranslation( lang, 'common');

    return (
        <div className="flex flex-col h-full bg-light-background">
            <Header title={t('growthTitle')} />
            <main className="flex-grow p-6 overflow-y-auto">
                <GrowthForm />
            </main>
        </div>
    );
}