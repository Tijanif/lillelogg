import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import DashboardContent from './dashboard-content';
import { Baby, Feeding, Sleep, Diaper, Routine, Tip, Session } from '@prisma/client'; // Import Session type

export interface DashboardData {
    session: Awaited<ReturnType<typeof getServerSession>>;
    lang: string;
    primaryBaby: Baby | null;
    latestFeedings: Feeding[];
    latestSleeps: Sleep[];
    latestDiapers: Diaper[];
    totalSleepCount: number;
    dailyTip: Tip | null;
    upcomingRoutines: Routine[];
}

interface DashboardPageProps {
    params: { lang: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
    const { lang } = params;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        throw redirect(`/${lang}/signin?callbackUrl=/${lang}/dashboard`);
    }
    const primaryBaby = await prisma.baby.findFirst({
        where: { userId: userId, isDeleted: false },
        orderBy: { createdAt: 'asc' },
        include: {
            memberships: {
                select: { role: true, userId: true }
            }
        }
    });

    if (!primaryBaby) {
        throw redirect(`/${lang}/onboarding/baby`);
    }

    // --- Data Fetching ---
    const [
        latestFeedings,
        latestSleeps,
        latestDiapers,
        totalSleepCount,
        dailyTip,
        upcomingRoutines
    ] = await Promise.all([

        prisma.feeding.findMany({
            where: { babyId: primaryBaby.id, userId: userId },
            orderBy: { startTime: 'desc' },
            take: 1,
        }),

        prisma.sleep.findMany({
            where: { babyId: primaryBaby.id, userId: userId },
            orderBy: { startTime: 'desc' },
            take: 1,
        }),

        prisma.diaper.findMany({
            where: { babyId: primaryBaby.id, userId: userId },
            orderBy: { startTime: 'desc' },
            take: 1,
        }),

        // FIX: New count query
        prisma.sleep.count({
            where: { babyId: primaryBaby.id, userId: userId },
        }),

        prisma.tip.findFirst({
            where: {
                language: lang === 'no' ? 'NO' : 'EN',
            },
            orderBy: { priority: 'desc' },
        }),

        prisma.routine.findMany({
            where: {
                babyId: primaryBaby.id,
                userId: userId,
                isActive: true,
                OR: [
                    { daysOfWeek: { has: new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase() } },
                    { daysOfWeek: { isEmpty: true } }
                ]
            },
            orderBy: { startTimeStr: 'asc' },
            take: 3,
        })
    ]);
    // --- End Data Fetching ---



    const dashboardData: DashboardData = {
        session,
        lang,
        primaryBaby,
        latestFeedings,
        latestSleeps,
        latestDiapers,
        totalSleepCount,
        dailyTip,
        upcomingRoutines,
    };

    return <DashboardContent {...dashboardData} />;
}