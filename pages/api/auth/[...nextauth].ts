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
          const now = new Date();
          const currentTimeInSeconds = Math.floor(now.getTime() / 1000);
          //add add this current time to db planstartdate field and planenddate field is 30 days from now
          const planstartdate = currentTimeInSeconds;
          const planenddate = currentTimeInSeconds + 2592000;
          const user = await prisma.user.update({
            where: {
              id: userid,
            },
            data: {
              planstartdate: planstartdate.toString(),
              planenddate: planenddate.toString(),
            },
          });
          //create stripe customer and get stripe customer id and add to db
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
      //get count of amount field all values of credits from db and get total used credits
      const credits = await prisma.creadit.findMany({
        where: {
          userId: token?.sub,
        },
      });
      const usedcredits = credits.reduce((a: any, b: any) => a + b.amount, 0);
      session = {
        ...session,
        user: {
          ...session.user,
          id: token?.sub,
          stripeId: userget?.stripeId,
          isSubscribed: userget?.isSubscribed,
          interval: userget?.interval,
          credits: userget?.credits,
          bonuscredits: userget?.bonuscredits,
          usedcredits: usedcredits,
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
