import { Header } from '@/components/layout/Header';
import { SleepForm } from '@/components/features/activity/SleepForm';
import { createTranslation } from '@/lib/i18n_server_utils';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await createTranslation(lang, 'common');
    return {
        title: t('activityLogging.addSleep'),
    };
}

export default async function AddSleepPage({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await createTranslation(lang, 'common');

    return (
        <div className="flex flex-col h-full bg-light-background">
            <Header title={t('activityLogging.sleepTitle')} />
            <main className="flex-grow p-6 overflow-y-auto">
                <SleepForm />
            </main>
        </div>
    );
}