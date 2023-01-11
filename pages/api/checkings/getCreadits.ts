// make async function to get data from database from user table get credits bonuscredits and calculate the total credits this function will be called from the client side can get user id only work like simple function that can calculate the total credits
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getCredits(userId: string) {
  if (userId === null) return null;
  const user: any = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      credits: true,
      bonuscredits: true,
    },
  });
  // calculate the total credits
  const totalCredits = user.credits + user.bonuscredits;
  //make new array to return the credits and bonuscredits and total credits make with keys like plancredits, bonuscredits, totalcredits
  const credits = {
    plancredits: user.credits,
    bonuscredits: user.bonuscredits,
    totalcredits: totalCredits,
  };
  return credits;
}
