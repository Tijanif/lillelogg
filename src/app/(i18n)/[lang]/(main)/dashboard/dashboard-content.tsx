// src/app/(i18n)/[lang]/(main)/dashboard/dashboard-content.tsx
'use client';

import { useTranslation } from 'react-i18next';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { FaBaby, FaMoon, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { MdBabyChangingStation } from "react-icons/md";
import { GiBabyBottle } from "react-icons/gi";
import { DashboardData } from './page';
import Link from "next/link";
import { Feeding, Sleep, Diaper } from '@prisma/client';


export default function DashboardContent({ session, lang, primaryBaby, latestFeedings, latestSleeps, latestDiapers, totalSleepCount, dailyTip, upcomingRoutines }: DashboardData) {
    const { t } = useTranslation('common');

    // Helper to format last activity time
    const formatLastActivityTime = (date: Date | null | undefined): string => {
        if (!date) return t('dashboard.notLoggedYet');

        const nowMs = new Date().getTime();
        const dateMs = date.getTime();

        const diffMs = nowMs - dateMs;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes < 0) {
            return t('dashboard.justNow');
        }
        if (diffMinutes === 0) return t('dashboard.justNow');
        if (diffMinutes < 60) return t('dashboard.minutesAgo', { count: diffMinutes });
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return t('dashboard.hoursAgo', { count: diffHours });
        const diffDays = Math.floor(diffHours / 24);
        return t('dashboard.daysAgo', { count: diffDays });
    };

    const formatSleepDuration = (sleep: Sleep | null | undefined): string => {
        if (!sleep || !sleep.startTime || !sleep.endTime) {
            return t('dashboard.notLoggedYet'); // Or a specific 'no duration' message
        }

        const durationMinutes = Math.floor((sleep.endTime.getTime() - sleep.startTime.getTime()) / (1000 * 60));

        if (durationMinutes < 0) {
            return t('dashboard.invalidDuration'); // If end time is before start time, it's invalid
        }
        if (durationMinutes === 0) {
            return t('dashboard.lessThanOneMinute'); // For durations less than a minute
        }

        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        if (hours > 0 && minutes > 0) {
            return t('dashboard.hoursAndMinutes', { hours, minutes });
        } else if (hours > 0) {
            return t('dashboard.hours', { hours });
        } else {
            return t('dashboard.minutes', { minutes });
        }
    };

    const latestSleepEntry = latestSleeps[0]; // This will be the single latest sleep

    return (
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {/* Top Section: "Home" and Baby Selector (Future) */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-dark-text">{t('nav.dashboard')}</h1>
                {/* Future: Baby Selector Component */}
                {primaryBaby && (
                    <div className="flex items-center space-x-2">
                        <span className="text-muted-text text-sm">Baby:</span>
                        <span className="text-dark-text font-medium">{primaryBaby.name}</span>
                    </div>
                )}
            </div>

            {/* Welcome Message */}
            <div className="bg-card-background p-6 rounded-2xl shadow-sm mb-6 border border-border-light">
                <div className="flex items-center mb-4">
                    <FaBaby className="text-4xl text-primary-blue mr-4" /> {/* Baby icon for profile */}
                    <h2 className="text-3xl font-bold text-dark-text">
                        {t('dashboard.hiParent', { name: session?.user?.name || t('dashboard.parent') })}
                    </h2>
                </div>
                {primaryBaby && (
                    <p className="text-muted-text">
                        {t('dashboard.babyInfo', { name: primaryBaby.name, age: '5 months, 2 days' /* Future: Calculate age dynamically */ })}
                    </p>
                )}
            </div>

            {/* Activity Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Feedings Summary */}
                <div className="bg-card-background p-4 rounded-2xl shadow-sm border border-border-light flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary-pink flex items-center justify-center mr-3">
                            <GiBabyBottle className="text-xl text-dark-text" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-dark-text">{t('dashboard.feedings')}</h3>
                            <p className="text-muted-text text-sm">{formatLastActivityTime(latestFeedings[0]?.startTime)}</p>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-dark-text">
                        {/* Display count of latestFeedings if available, otherwise just amount for latest */}
                        {latestFeedings.length > 0 ? (latestFeedings[0].amount !== null && latestFeedings[0].amount !== undefined ? `${latestFeedings[0].amount} oz` : '-') : '0'}
                    </span>
                </div>

                {/* Sleep/Naps Summary */}
                <div className="bg-card-background p-4 rounded-2xl shadow-sm border border-border-light flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary-blue-accent flex items-center justify-center mr-3">
                            <FaMoon className="text-xl text-dark-text" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-dark-text">{t('dashboard.naps')}</h3>
                            <p className="text-muted-text text-sm">{formatLastActivityTime(latestSleepEntry?.startTime)}</p>
                        </div>
                    </div>
                    {/* FIX: Use totalSleepCount and format duration of latest entry */}
                    <span className="text-xl font-bold text-dark-text">
                        {totalSleepCount} {t('dashboard.napsCountLabel')} ({formatSleepDuration(latestSleepEntry)})
                    </span>
                </div>

                {/* Diapers Summary */}
                <div className="bg-card-background p-4 rounded-2xl shadow-sm border border-border-light flex items-center justify-between col-span-full md:col-span-1">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary-gray-accent flex items-center justify-center mr-3">
                            <MdBabyChangingStation className="text-xl text-dark-text" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-dark-text">{t('dashboard.diapers')}</h3>
                            <p className="text-muted-text text-sm">{formatLastActivityTime(latestDiapers[0]?.startTime)}</p>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-dark-text">{latestDiapers.length > 0 ? latestDiapers[0].type || '-' : '0'}</span>
                </div>
            </div>

            {/* Add Activity Buttons (consolidated and linked) */}
            <div className="bg-card-background p-4 rounded-2xl shadow-sm mb-6 border border-border-light">
                <h3 className="font-bold text-dark-text mb-4">{t('dashboard.addNew')}</h3>
                <div className="space-y-3">
                    <Button asChild fullWidth>
                        <Link href={`/${lang}/activity/feeding`}>
                            <GiBabyBottle className="mr-2 text-xl text-primary-blue" />
                            {t('activityLogging.addFeeding')}
                        </Link>
                    </Button>
                    <Button asChild fullWidth>
                        <Link href={`/${lang}/activity/sleep`}>
                            <FaMoon className="mr-2 text-xl text-primary-blue" />
                            {t('activityLogging.addSleep')}
                        </Link>
                    </Button>
                    <Button asChild fullWidth>
                        <Link href={`/${lang}/activity/diaper`}>
                            <MdBabyChangingStation className="mr-2 text-xl text-primary-blue" />
                            {t('activityLogging.addDiaper')}
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Daily Tip Card */}
            <div className="bg-card-background p-6 rounded-2xl shadow-sm mb-6 border border-border-light">
                <h3 className="text-lg font-medium text-dark-text mb-2">{t('dashboard.dailyTip')}</h3>
                {dailyTip ? (
                    <div>
                        <p className="text-primary-blue font-semibold mb-2">{dailyTip.title}</p>
                        <p className="text-muted-text text-sm">{dailyTip.content}</p>
                    </div>
                ) : (
                    <p className="text-muted-text">{t('dashboard.noTipToday')}</p>
                )}
            </div>

            {/* Upcoming Routines Card */}
            <div className="bg-card-background p-6 rounded-2xl shadow-sm mb-6 border border-border-light">
                <h3 className="text-lg font-medium text-dark-text mb-2">{t('dashboard.upcomingRoutines')}</h3>
                {upcomingRoutines.length > 0 ? (
                    <ul className="space-y-2">
                        {upcomingRoutines.map(routine => (
                            <li key={routine.id} className="flex items-center text-dark-text">
                                <FaCalendarAlt className="mr-3 text-primary-blue" />
                                <span>{routine.name} ({routine.startTimeStr})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-text">{t('dashboard.noRoutines')}</p>
                )}
            </div>

            {/* Placeholder for other dashboard sections / Logout */}
            <div className="mt-8 text-center">
                <Button onClick={() => signOut({ callbackUrl: `/${lang}/` })} variant="ghost" size="md">
                    {t('buttons.logout')}
                </Button>
            </div>
        </main>
    );
}