import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import {apiLogSleepSchema} from '@/lib/validations';
import { getPrimaryBaby } from '@/lib/baby';
import {z} from "zod";

export async function POST(req: NextRequest) {
    const token = await getToken({ req });
    if (!token) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const primaryBaby = await getPrimaryBaby(token.id as string);
        if (!primaryBaby) {
            return new NextResponse('No baby profile found', { status: 404 });
        }

        const body = await req.json();
        const validatedData = apiLogSleepSchema.parse({
            ...body,
            babyId: primaryBaby.id,
            userId: token.id,
        });

        await prisma.sleep.create({
            data: validatedData,
        });

        revalidatePath('/dashboard', 'layout');

        return new NextResponse('Feeding logged successfully', { status: 201 });
    } catch (error) {
        console.error('Failed to log feeding:', error);
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 400 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}