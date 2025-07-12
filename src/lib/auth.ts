import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './prisma';
import { compare } from 'bcryptjs';


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
                    console.log('Authentication failed: User not found in database.');
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, user.hashedPassword || '');
                if (!isPasswordValid) {
                  console.log('Authentication failed: Invalid password.');
                  return null;
                }

                console.log('Authentication successful for user:', user.email);


                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
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
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/en/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};