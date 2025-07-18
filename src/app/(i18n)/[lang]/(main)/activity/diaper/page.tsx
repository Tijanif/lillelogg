import { Header } from '@/components/layout/Header';
import { DiaperForm } from '@/components/features/activity/DiaperForm';
import { createTranslation } from '@/lib/i18n_server_utils';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await createTranslation(lang, 'common');
    return {
        title: t('activityLogging.addDiaper'),
    };
}

export default async function AddDiaperPage({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await createTranslation(lang, 'common');

    return (
        <div className="flex flex-col h-full bg-light-background">
            <Header title={t('activityLogging.diaperTitle')} />
            <main className="flex-grow p-6 overflow-y-auto">
                <DiaperForm/>
            </main>
        </div>
    );
}