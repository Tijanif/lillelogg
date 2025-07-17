import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { logFeedingSchema } from '@/lib/validations';
import { getPrimaryBaby } from '@/lib/baby';
import { z } from 'zod';

export async function POST(req: NextRequest) {
    const token = await getToken({ req });
    if (!token || !token.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const primaryBaby = await getPrimaryBaby(token.id as string);
        if (!primaryBaby) {
            return new NextResponse('No baby profile found', { status: 404 });
        }

        const body = await req.json();

        const validatedData = logFeedingSchema.parse({
            ...body,
            babyId: primaryBaby.id,
            userId: token.id,
        });


        await prisma.feeding.create({
            data: validatedData,
        });


        revalidatePath(`/(i18n)/${token.locale}/dashboard`, 'page');

        return new NextResponse('Feeding logged successfully', { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.issues);
            return new NextResponse(JSON.stringify({ errors: error.issues }), { status: 400 });
        }
        console.error('Failed to log feeding:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}