import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token || !token.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = token.id as string;

        const babyCount = await prisma.baby.count({
            where: { userId: userId },
        });

        return NextResponse.json({ count: babyCount }, { status: 200 });

    } catch (error) {
        console.error('API /api/baby/count: An unexpected error occurred:', error);
        return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
    }
}