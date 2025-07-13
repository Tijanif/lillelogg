import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { createBabySchema } from '@/lib/validations';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token || !token.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = token.id as string;
        const body = await request.json();
        console.log('Create Baby API: Received body:', body);

        const validatedData = createBabySchema.safeParse(body);

        if (!validatedData.success) {
            console.error('Create Baby API: Validation error:', validatedData.error.issues);
            return NextResponse.json({ errors: validatedData.error.issues }, { status: 400 });
        }

        const { name, dateOfBirth, gender, avatarUrl, bio, timezone } = validatedData.data;

        const dobDate = new Date(dateOfBirth);

        const newBaby = await prisma.baby.create({
            data: {
                userId: userId,
                name,
                dateOfBirth: dobDate,
                gender: gender || 'UNDISCLOSED',
                avatarUrl,
                bio,
                timezone,

                memberships: {
                    create: {
                        userId: userId,
                        role: UserRole.OWNER,
                    },
                },
            },

            select: {
                id: true,
                name: true,
                dateOfBirth: true,
                gender: true,
                avatarUrl: true,
                createdAt: true,
                memberships: {
                    select: {
                        userId: true,
                        role: true
                    }
                }
            }
        });

        console.log('Create Baby API: Baby profile created successfully:', newBaby.name);
        return NextResponse.json({ baby: newBaby, message: 'Baby profile created successfully' }, { status: 201 });

    } catch (error) {
        console.error('Create Baby API: An unexpected error occurred:', error);

        if (error instanceof Error) {
            return NextResponse.json({ message: 'Something went wrong.', error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
    }
}