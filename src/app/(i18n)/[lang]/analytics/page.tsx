import { Suspense } from 'react';
import { createTranslation } from '@/lib/i18n_server_utils';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { AnalyticsContent } from '@/components/features/analytics/AnalyticsContent';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }) {
    const { t } = await createTranslation(lang, 'analytics'); // Use 'analytics' namespace here too
    return {
        title: t('analyticsTitle'),
    };
}

interface AnalyticsPageProps {
    params: { lang: string };
}

export default async function AnalyticsPage({ params: { lang } }: AnalyticsPageProps) {
    // Fetch translations for the server component parts using your established method
    const { t } = await createTranslation(lang, 'analytics');

    return (
        <div className="flex flex-col h-full bg-light-background">
            {/* Your Header component handles the back button automatically. */}
            <Header title={t('analyticsTitle')} />

            <main className="flex-grow p-6 overflow-y-auto">
                {/*
          Use Suspense to show a loading state while the client component (AnalyticsContent)
          fetches its data.
        */}
                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="h-48 flex items-center justify-center text-muted-text text-center">
                            {t('loadingFeedings')}
                        </Card>
                        <Card className="h-48 flex items-center justify-center text-muted-text text-center">
                            {t('loadingSleep')}
                        </Card>
                        <Card className="h-48 flex items-center justify-center text-muted-text text-center">
                            {t('loadingDiapers')}
                        </Card>
                    </div>
                }>
                    {/*
            This client component will contain the date range toggle and the charts.
            It will handle its own data fetching using useSWR.
          */}
                    <AnalyticsContent />
                </Suspense>
            </main>
        </div>
    );
}

