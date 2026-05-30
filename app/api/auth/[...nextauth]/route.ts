import NextAuth, { NextAuthOptions } from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password!
            );
            if (isPasswordCorrect) {
              return {
                id: user.id,
                email: user.email,
                role: user.role,
                image: user.image, // 🚀 1. Crucial: Pull the image from the database here
              };
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findFirst({
            where: {
              email: user.email!,
            },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                id: nanoid(),
                email: user.email!,
                role: "user",
                password: null,
                image: user.image || null,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      
      return true;
    },
    
    // 🛠️ FIXES APPLIED TO THE JWT CALLBACK:
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.picture = user.image; // 🚀 2. Store the initial database image into the JWT session cookie
        token.iat = Math.floor(Date.now() / 1000);
      }
      
      // 🚀 3. Handle the dynamic client-side `update()` event when the user drops in a new DP
      if (trigger === "update" && session?.user?.image) {
        token.picture = session.user.image;
      }
      
      const now = Math.floor(Date.now() / 1000);
      const tokenAge = now - (token.iat as number);
      const maxAge = 15 * 60; // 15 minutes
      
      if (tokenAge > maxAge) {
        return {};
      }
      
      return token;
    },

    // 🛠️ FIXES APPLIED TO THE SESSION CALLBACK:
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.image = token.picture as string; // 🚀 4. Pass the image cookie value cleanly to the frontend layout elements
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
    updateAge: 5 * 60,
  },
  jwt: {
    maxAge: 15 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
