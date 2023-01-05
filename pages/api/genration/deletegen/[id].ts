// delete tool from copytool

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (session) {
    const tool = await prisma.toolgen.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({ status: "success" });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
