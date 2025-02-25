import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/Prisma";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface CustomToken extends JWT {
  id?: string; // `undefined` も許可
}

const handler = NextAuth({
  
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        let user = null;
        try {
          // メールアドレス存在チェック
          user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });
        } catch (error) {
          return null;
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : "/bookshelf";
    },
    async jwt({ token, user, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub || user?.id || token.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: CustomToken }): Promise<CustomSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id ?? "",
        },
      };
    },
  },
});

export { handler as GET, handler as POST };

