import { apiUrl } from "@/constant";
import NextAuth, { User } from "next-auth";
import { User as UserType } from "@/interfaces";

import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                phone: { label: "Phone", type: "text" },
                role: { label: "Role", type: "text" },
                password: { label: "Password", type: "password" },
                isVerified: { label: "Is Verified", type: "boolean" }
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${apiUrl}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            phone: credentials?.phone,
                            password: credentials?.password,
                            role: credentials?.role,
                            isVerified: credentials?.isVerified,
                        }),
                    });
                    const user = await res.json();
                    console.log(user);
                    if (res.ok && user) {
                        return user.data as UserType;
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
        error: '/error',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const typedUser = user as UserType;
                token.accessToken = typedUser.token;
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as UserType;
            session.accessToken = token.accessToken as string;
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 24 * 60 * 60, // 60 days in seconds
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 