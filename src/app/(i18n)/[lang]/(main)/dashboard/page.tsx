import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import DashboardContent from './dashboard-content';
import { Baby, Feeding, Sleep, Diaper, Routine, Tip } from '@prisma/client';

export interface DashboardData {
    session: Awaited<ReturnType<typeof getServerSession>>;
    lang: string;
    primaryBaby: Baby | null;
    latestFeedings: (Feeding & { baby: Baby })[];
    latestSleeps: (Sleep & { baby: Baby })[];
    latestDiapers: (Diaper & { baby: Baby })[];
    dailyTip: Tip | null;
    upcomingRoutines: (Routine & { baby: Baby })[];
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

    // --- Data Fetching ---
    const [primaryBaby, latestFeedings, latestSleeps, latestDiapers, dailyTip, upcomingRoutines] = await Promise.all([
        prisma.baby.findFirst({
            where: { userId: userId, isDeleted: false },
            orderBy: { createdAt: 'asc' },
            include: {
                memberships: {
                    select: { role: true, userId: true }
                }
            }
        }),

        // 2. Fetch Latest Activities for the primary baby
        prisma.feeding.findMany({
            where: { baby: { userId: userId, isDeleted: false } },
            orderBy: { startTime: 'desc' },
            take: 1,
            include: { baby: true }
        }),

        prisma.sleep.findMany({
            where: { baby: { userId: userId, isDeleted: false } },
            orderBy: { startTime: 'desc' },
            take: 1,
            include: { baby: true }
        }),

        prisma.diaper.findMany({
            where: { baby: { userId: userId, isDeleted: false } },
            orderBy: { time: 'desc' },
            take: 1,
            include: { baby: true }
        }),

        // 3. Fetch a Daily Tip
        prisma.tip.findFirst({
            where: {
                language: lang === 'no' ? 'NO' : 'EN',
            },
            orderBy: { priority: 'desc' },
        }),

        // 4. Fetch Upcoming Routines for today
        prisma.routine.findMany({
            where: {
                baby: { userId: userId, isDeleted: false },
                isActive: true,
                OR: [
                    { daysOfWeek: { has: new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase() } },
                    { daysOfWeek: { isEmpty: true } }
                ]
            },
            orderBy: { startTimeStr: 'asc' },
            take: 3,
            include: { baby: true }
        })
    ]);
    // --- End Data Fetching ---


    // Baby count check to determine if user needs onboarding (based on primaryBaby result)
    if (!primaryBaby) {
        throw redirect(`/${lang}/onboarding/baby`);
    }

    const dashboardData: DashboardData = {
        session,
        lang,
        primaryBaby,
        latestFeedings,
        latestSleeps,
        latestDiapers,
        dailyTip,
        upcomingRoutines,
    };

    return <DashboardContent {...dashboardData} />;
}