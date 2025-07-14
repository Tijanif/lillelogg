import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validatedData = registerSchema.safeParse(body);

        if (!validatedData.success) {
            console.error('Register API: Validation error:', validatedData.error.issues);
            return NextResponse.json({ errors: validatedData.error.issues }, { status: 400 });
        }

        const { email, password, name } = validatedData.data;

        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUserByEmail) {
            return NextResponse.json({ user: null, message: 'User with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
                role: 'USER',
            },
        });

        const { hashedPassword: newUserHashedPassword, ...rest } = newUser;

        return NextResponse.json({ user: rest, message: 'User created successfully' }, { status: 201 });

    } catch (error) {
        console.error('Register API: An unexpected error occurred:', error);
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Something went wrong.', error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
    }
}