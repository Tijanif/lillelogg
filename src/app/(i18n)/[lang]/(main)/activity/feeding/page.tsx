import { FeedingForm } from '@/components/features/activity/FeedingForm';
import { Header } from '@/components/layout/Header';
import { createTranslation } from '@/lib/i18n_server_utils';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await createTranslation( lang, 'common');
    return {
        title: t('activityLogging.addFeeding'),
    };
}

export default async function AddFeedingPage({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await createTranslation( lang, 'common');

    return (
        <div className="flex flex-col h-full bg-light-background">
            <Header title={t('activityLogging.feedingTitle')} />
            <main className="flex-grow p-6 overflow-y-auto">
                <FeedingForm />
            </main>
        </div>
    );
}