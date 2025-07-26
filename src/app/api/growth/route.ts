import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createGrowthEntrySchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const session = await getServerAuthSession();
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        const body = await req.json();
        const validatedData = createGrowthEntrySchema.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json(
                { message: 'Invalid input data', errors: validatedData.error.issues },
                { status: 400 }
            );
        }

        const { babyId, date, weight, weightUnit, height, heightUnit, headCircumference, headCircUnit } = validatedData.data;

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

        const newGrowthEntry = await prisma.growthEntry.create({
            data: {
                babyId: baby.id,
                userId: userId,
                date: date,
                weight: weight,
                weightUnit: weightUnit,
                height: height,
                heightUnit: heightUnit,
                headCircumference: headCircumference,
                headCircUnit: headCircUnit,
            },
        });

        return NextResponse.json(
            { message: 'Growth entry logged successfully!', entry: newGrowthEntry },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error logging growth entry:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.issues }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

