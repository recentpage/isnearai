//
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
    res.status(401).json({ error: "Not signed in" });
    return;
  }

  const { id } = req.body;

  // if isSaved is true, then set it to false
  // if isSaved is false, then set it to true

  let status = "";

  const copycheck = await prisma.copygen.findUnique({
    where: {
      id: id as string,
    },
  });

  if (copycheck?.isSaved === "true") {
    const copy = await prisma.copygen.update({
      where: {
        id: id as string,
      },
      data: {
        isSaved: "false",
      },
    });
    status = "2";
  } else if (copycheck?.isSaved === "false") {
    const copy = await prisma.copygen.update({
      where: {
        id: id as string,
      },
      data: {
        isSaved: "true",
      },
    });
    status = "1";
  }

  res.status(200).json({ status: status });
}
