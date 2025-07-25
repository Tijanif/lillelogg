'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/SegmentedControl';
import { LineChartComponent } from './LineChartComponent';

// Define a simple fetcher for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DailyCountData {
    date: string;
    count: number;
}

interface DailyDurationData {
    date: string;
    totalMinutes: number;
}

export function AnalyticsContent() {
    const { t } = useTranslation('analytics');
    const [days, setDays] = useState<'7' | '30'>('7');

    // IMPORTANT: Placeholder for baby ID.
    // In a real application, this babyId should come from:
    // 1. A global context (e.g., React Context for the active baby).
    // 2. A URL parameter if the baby is selected via route.
    // For now, hardcode a valid baby ID from your Supabase DB for testing purposes.
    // Make sure this baby ID actually exists and has activity data.
    const babyId = 'cmdd81qvm0004v340etzde0zj'; // <--- REPLACE THIS WITH A REAL BABY ID FOR TESTING!

    // SWR hooks for fetching data
    const { data: feedingData, error: feedingError } = useSWR<DailyCountData[]>(
        babyId ? `/api/analytics/feedings?babyId=${babyId}&days=${days}` : null,
        fetcher
    );

    const { data: sleepData, error: sleepError } = useSWR<DailyDurationData[]>(
        babyId ? `/api/analytics/sleep?babyId=${babyId}&days=${days}` : null,
        fetcher
    );

    const { data: diaperData, error: diaperError } = useSWR<DailyCountData[]>(
        babyId ? `/api/analytics/diapers?babyId=${babyId}&days=${days}` : null,
        fetcher
    );

    // Determine overall loading state
    const isLoading = (!feedingData && !feedingError) || (!sleepData && !sleepError) || (!diaperData && !diaperError);

    if (!babyId) {
        return (
            <Card className="p-4 text-center text-muted-text">
                {t('pleaseSelectBaby')}
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-center mb-6">
                {/*
          Your SegmentedControl takes children for items, so we structure it like this.
        */}
                <SegmentedControl
                    type="single"
                    value={days}
                    onValueChange={(value) => setDays(value as '7' | '30')}
                    // Adjust the className in SegmentedControl.tsx if it doesn't match the screenshot.
                >
                    <SegmentedControlItem value="7" className="px-6 py-2">
                        {t('last7Days')}
                    </SegmentedControlItem>
                    <SegmentedControlItem value="30" className="px-6 py-2">
                        {t('last30Days')}
                    </SegmentedControlItem>
                </SegmentedControl>
            </div>

            {isLoading ? (
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Feedings Chart Card */}
                    <Card className="p-4">
                        <h3 className="text-dark-text text-lg font-semibold mb-2">{t('feedingsTitle')}</h3>
                        {feedingError ? (
                            <p className="text-error">{t('errorLoadingFeedings')}</p>
                        ) : (
                            <>
                                <p className="text-muted-text text-sm mb-4">
                                    {t('avgPerDay', { count: Math.round((feedingData?.reduce((sum, d) => sum + d.count, 0) || 0) / (feedingData?.length || 1)) })}
                                </p>
                                <LineChartComponent data={feedingData} dataKey="count" />
                            </>
                        )}
                    </Card>

                    {/* Sleep Chart Card */}
                    <Card className="p-4">
                        <h3 className="text-dark-text text-lg font-semibold mb-2">{t('sleepTitle')}</h3>
                        {sleepError ? (
                            <p className="text-error">{t('errorLoadingSleep')}</p>
                        ) : (
                            <>
                                <p className="text-muted-text text-sm mb-4">
                                    {t('avgSleepDuration', { hours: ((sleepData?.reduce((sum, d) => sum + d.totalMinutes, 0) || 0) / (sleepData?.length || 1) / 60).toFixed(1) })}
                                </p>
                                <LineChartComponent data={sleepData} dataKey="totalMinutes" />
                            </>
                        )}
                    </Card>

                    {/* Diapers Chart Card */}
                    <Card className="p-4">
                        <h3 className="text-dark-text text-lg font-semibold mb-2">{t('diapersTitle')}</h3>
                        {diaperError ? (
                            <p className="text-error">{t('errorLoadingDiapers')}</p>
                        ) : (
                            <>
                                <p className="text-muted-text text-sm mb-4">
                                    {t('avgPerDay', { count: Math.round((diaperData?.reduce((sum, d) => sum + d.count, 0) || 0) / (diaperData?.length || 1)) })}
                                </p>
                                <LineChartComponent data={diaperData} dataKey="count" />
                            </>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}