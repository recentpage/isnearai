import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import customerhandler from "../customer";

// Create a new interface for the user
interface User {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  id?: string | null | undefined;
}

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      // The client ID and secret for your GitHub app authentication
      //@ts-ignore
      clientId: process.env.GITHUB_CLIENT_ID,
      //@ts-ignore
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn(message) {
      if (message.isNewUser === true) {
        const userid = message.user?.id;
        if (!userid) return;
        if (userid) {
          const customers = customerhandler(userid);
        }
      }
    },
  },
  callbacks: {
    async session({ session, token }) {
      // get stripe customer id issubscribed and interval from db
      const userget = await prisma.user.findUnique({
        where: {
          id: token?.sub,
        },
      });
      session = {
        ...session,
        user: {
          ...session.user,
          id: token?.sub,
          stripeId: userget?.stripeId,
          isSubscribed: userget?.isSubscribed,
          interval: userget?.interval,
        } as User,
      };
      return session;
    },
  },
  session: {
    strategy: "jwt",
    //@ts-ignore
    jwt: true,
  },
  debug: false,
});
