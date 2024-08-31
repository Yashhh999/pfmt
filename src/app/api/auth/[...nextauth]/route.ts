import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                token.id = user.id;
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.accessToken = token.accessToken;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
