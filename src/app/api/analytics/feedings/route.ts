
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import  prisma  from '@/lib/prisma';
import { analyticsQueryParamsSchema } from '@/lib/validations';
import { getAnalyticsStartDate } from '@/lib/server/analytics';
import {startOfDay, subDays} from 'date-fns';
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
                OR: [
                    { userId: userId },
                    { memberships: { some: { userId: userId } } },
                ],
            },
            select: { id: true },
        });

        if (!baby) {
            return NextResponse.json({ message: 'Baby not found or unauthorized.' }, { status: 404 });
        }

        // --- Aggregation Logic ---
        const endDate = new Date();
        const startDate = getAnalyticsStartDate(days);

        const rawFeedings = await prisma.feeding.groupBy({
            by: ['startTime'],
            where: {
                babyId: babyId,
                startTime: { gte: startDate, lte: endDate },
            },
            _count: { id: true },
            orderBy: { startTime: 'asc' },
        });

        // --- Data Formatting for Charts ---
        const dailyDataMap = new Map<string, number>();
        for (let i = 0; i < days; i++) {
            const date = startOfDay(subDays(new Date(), i));
            dailyDataMap.set(date.toISOString().split('T')[0], 0);
        }

        // Fill in the actual counts from the database
        rawFeedings.forEach((entry) => {
            const day = startOfDay(entry.startTime).toISOString().split('T')[0];
            dailyDataMap.set(day, (dailyDataMap.get(day) || 0) + entry._count.id);
        });

        // Convert map to sorted array
        const formattedData = Array.from(dailyDataMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return NextResponse.json(formattedData, { status: 200 });

    } catch (error) {
        console.error('Error fetching feeding analytics:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}