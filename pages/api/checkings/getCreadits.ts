// make async function to get data from database from user table get credits bonuscredits and calculate the total credits this function will be called from the client side can get user id only work like simple function that can calculate the total credits
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getCredits(userId: string, tool: string) {
  // calculate the minimum credits based on the tool name
  if (userId === null) return null;
  // get the user data from database
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

  const usedCredits = await prisma.creadit.findMany({
    where: {
      userId: userId,
    },
    select: {
      amount: true,
    },
  });

  const usedcredits = usedCredits.reduce((a: any, b: any) => a + b.amount, 0);

  const unusedCredits = totalCredits - usedcredits;

  let minimumCredits = 0;
  if (tool === "productdescription") {
    minimumCredits = 300;
  } else if (tool === "facebookadsgen") {
    minimumCredits = 400;
  } else if (tool === "emailcopy") {
    minimumCredits = 700;
  } else if (tool === "trendinginstagramhashtags") {
    minimumCredits = 200;
  } else {
    minimumCredits = 200;
  }
  if (unusedCredits > minimumCredits) {
    return true;
  }
  return false;
}
