import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import  prisma  from '@/lib/prisma';
import { analyticsQueryParamsSchema } from '@/lib/validations';
import { getAnalyticsStartDate } from '@/lib/server/analytics';
import { differenceInMinutes, startOfDay, subDays } from 'date-fns';
import { z } from 'zod';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const queryParams = analyticsQueryParamsSchema.safeParse(Object.fromEntries(searchParams));

        if (!queryParams.success) {
            return NextResponse.json(
                { message: 'Invalid query parameters', errors: queryParams.error.issues },
                { status: 400 }
            );
        }

        const { babyId, days } = queryParams.data;
        const userId = session.user.id;

        const baby = await prisma.baby.findFirst({
            where: {
                id: babyId,
                OR: [{ userId: userId }, { memberships: { some: { userId: userId } } }],
            },
            select: { id: true },
        });

        if (!baby) {
            return NextResponse.json({ message: 'Baby not found or unauthorized.' }, { status: 404 });
        }

        // --- Aggregation Logic for Sleep Duration ---
        const endDate = new Date();
        const startDate = getAnalyticsStartDate(days);

        const sleepRecords = await prisma.sleep.findMany({
            where: {
                babyId: babyId,
                startTime: { gte: startDate, lte: endDate },
                endTime: { not: null },
            },
            select: {
                startTime: true,
                endTime: true,
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        // --- Data Formatting for Charts ---
        const dailySleepMap = new Map<string, number>();

        for (let i = 0; i < days; i++) {
            const date = startOfDay(subDays(new Date(), i));
            dailySleepMap.set(date.toISOString().split('T')[0], 0);
        }

        sleepRecords.forEach((sleep) => {
            const duration = differenceInMinutes(sleep.endTime!, sleep.startTime);

            // Assign the sleep duration to the day it started on
            const day = startOfDay(sleep.startTime).toISOString().split('T')[0];

            if (dailySleepMap.has(day)) {
                dailySleepMap.set(day, dailySleepMap.get(day)! + duration);
            }
        });

        const formattedData = Array.from(dailySleepMap.entries())
            .map(([date, totalMinutes]) => ({ date, totalMinutes }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return NextResponse.json(formattedData, { status: 200 });

    } catch (error) {
        console.error('Error fetching sleep analytics:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}