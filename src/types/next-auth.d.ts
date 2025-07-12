import NextAuth, { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

import { UserRole } from '@prisma/client';

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            role: UserRole;
        } & DefaultSession['user'];
    }

    /**
     * The shape of the user object that is returned by the providers.
     * This is what is passed to the `jwt` callback `user` argument.
     */
    interface User {
        id: string;
        role: UserRole;
    }
}

declare module 'next-auth/jwt' {
    /**
     * Returned by the `jwt` callback and `getToken`, when using JWT sessions
     */
    interface JWT {
        id: string;
        role: UserRole;
    }
}