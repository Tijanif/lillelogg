import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Register API: Received body:', body);

        // 1. Validate input using Zod schema
        const validatedData = registerSchema.safeParse(body);

        if (!validatedData.success) {
            console.error('Register API: Validation error:', validatedData.error.issues);
            return NextResponse.json({ errors: validatedData.error.issues }, { status: 400 });
        }

        const { email, password, name } = validatedData.data;

        // 2. Check if user already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUserByEmail) {
            console.log('Register API: User already exists with email:', email);
            return NextResponse.json({ user: null, message: 'User with this email already exists' }, { status: 409 });
        }

        // 3. Hash the password
        const hashedPassword = await hash(password, 10);

        // 4. Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
                role: 'USER',
            },
        });

        const { hashedPassword: newUserHashedPassword, ...rest } = newUser;

        console.log('Register API: User created successfully:', rest.email);
        return NextResponse.json({ user: rest, message: 'User created successfully' }, { status: 201 });

    } catch (error) {
        console.error('Register API: An unexpected error occurred:', error);
        return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
    }
}