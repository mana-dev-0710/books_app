import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/Prisma";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { FavoriteBook, MyBook } from "@/types/bookTypes";

export interface CustomSession extends Session {
  user: {
    id: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    bookshelfSearchResults?: MyBook[];
    favoriteSearchResults?: FavoriteBook[];
  };
}

interface CustomToken extends JWT {
  id?: string;
  bookshelfSearchResults?: MyBook[];
  favoriteSearchResults?: FavoriteBook[];
}

export const authOptions: NextAuthOptions = {
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
        if (!credentials?.email) return null;
        return await prisma.user.findUnique({
          where: { email: credentials.email },
        });
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: CustomToken }): Promise<CustomSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id ?? null, 
          bookshelfSearchResults: token.bookshelfSearchResults ?? [],
          favoriteSearchResults: token.favoriteSearchResults ?? [],
        },
      };
    },
  },
};
