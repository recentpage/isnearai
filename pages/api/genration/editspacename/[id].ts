// get get request from client side and update the space name
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { id } = req.query;
  const { name } = req.body;
  const toolgen = await prisma.toolgen.update({
    where: {
      id: id as string,
    },
    data: {
      title: name,
    },
  });

  res.status(200).json({ status: "1" });
}
