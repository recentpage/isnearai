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
    const tool = await prisma.copygen.update({
      where: {
        id: id as string,
      },
      data: {
        isDeleted: "false",
      },
    });

    res.json({ status: "success" });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
