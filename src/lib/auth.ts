import { AuthOptions, getServerSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './prisma';
import { compare } from 'bcryptjs';
import { UserRole } from '@prisma/client';


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {

                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.username,
                    },
                });


                if (!user) {
                    return null;
                }

                if (!user.hashedPassword) {
                    console.log('Authentication failed: User has no password set (e.g., OAuth user trying credentials).');
                    return null;
                }
                const isPasswordValid = await compare(credentials.password, user.hashedPassword);

                if (!isPasswordValid) {
                    console.log('Authentication failed: Invalid password.');
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role as UserRole,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role as UserRole;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
            }
            return session;
        },
    },
    pages: {
        signIn: '/en/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development', // Keep this for dev environment
};

export async function getServerAuthSession() {
    return getServerSession(authOptions);
}