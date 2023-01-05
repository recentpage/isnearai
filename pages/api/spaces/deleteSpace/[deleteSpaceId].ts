import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

export default async function deleteSpace(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const deleteid: any = req.query.deleteSpaceId;
  if (!deleteid) {
    return res.status(400).json({ error: "No id provided" });
  }

  const prisma = new PrismaClient();
  // check if space selected is true if true set massage to select another space and return
  const space = await prisma.space.findUnique({
    where: {
      id: deleteid,
    },
  });
  if (space?.selected === "true") {
    return res.status(400).json({ error: "Select another space" });
  } else {
    try {
      const spacedelete = await prisma.space.delete({
        where: {
          id: deleteid,
        },
      });
      res.status(200).json({ status: "1", message: "Space deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  }
}
