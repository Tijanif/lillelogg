import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { analyticsQueryParamsSchema } from '@/lib/validations';
import { getAnalyticsStartDate } from '@/lib/server/analytics';
import { z } from 'zod';
import { startOfDay } from 'date-fns';

export async function GET(req: Request) {
    try {
        const session = await getServerAuthSession();
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
            return NextResponse.json({ message: 'Baby not found or unauthorized access.' }, { status: 404 });
        }

        const endDate = new Date();
        const startDate = getAnalyticsStartDate(days);

        const growthEntries = await prisma.growthEntry.findMany({
            where: {
                babyId: babyId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                date: true,
                weight: true,
                weightUnit: true,
                height: true,
                heightUnit: true,
                headCircumference: true,
                headCircUnit: true,
            },
            orderBy: {
                date: 'asc',
            },
        });


        const dailyGrowthMap = new Map<string, typeof growthEntries[0]>();

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dayString = startOfDay(d).toISOString().split('T')[0];
            dailyGrowthMap.set(dayString, {
                date: new Date(dayString),
                weight: null,
                weightUnit: null,
                height: null,
                heightUnit: null,
                headCircumference: null,
                headCircUnit: null,
            } as any);
        }

        growthEntries.forEach(entry => {
            const dayString = startOfDay(entry.date).toISOString().split('T')[0];
            dailyGrowthMap.set(dayString, entry);
        });

        const formattedData = Array.from(dailyGrowthMap.entries())
            .map(([dateKey, entry]) => ({
                date: dateKey,
                weight: entry.weight,
                weightUnit: entry.weightUnit,
                height: entry.height,
                heightUnit: entry.heightUnit,
                headCircumference: entry.headCircumference,
                headCircUnit: entry.headCircUnit,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


        return NextResponse.json(formattedData, { status: 200 });

    } catch (error) {
        console.error('Error fetching growth analytics:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}