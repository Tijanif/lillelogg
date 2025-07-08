import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (credentials?.username === "user" && credentials?.password === "pass") {
                    return { id: "1", name: "J Smith", email: "jsmith@example.com" };
                }
                return null;
            }
        })
    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };