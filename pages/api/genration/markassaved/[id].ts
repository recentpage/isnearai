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

  const { id } = req.query;

  // if isSaved is true, then set it to false
  // if isSaved is false, then set it to true

  let status = "";

  const toolgencheck = await prisma.toolgen.findUnique({
    where: {
      id: id as string,
    },
  });

  if (toolgencheck?.isSaved === "true") {
    const toolgen = await prisma.toolgen.update({
      where: {
        id: id as string,
      },
      data: {
        isSaved: "false",
      },
    });
    status = "2";
  } else if (toolgencheck?.isSaved === "false") {
    const toolgen = await prisma.toolgen.update({
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
