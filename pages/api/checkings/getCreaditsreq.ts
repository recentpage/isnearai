import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getCredits(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  //@ts-ignore
  const userId = session.user?.id;

  if (session && userId) {
    const user: any = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const totalCredits = user.credits + user.bonuscredits;

    res.status(200).json({
      plancredits: user.credits,
      bonuscredits: user.bonuscredits,
      totalcredits: totalCredits,
    });
  }
}
