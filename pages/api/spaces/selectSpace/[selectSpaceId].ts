// make space selected true and all other spaces selected false when space is selected from dropdown

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    // find spaces that is selected and set selected to false
    const spaces = await prisma.space.updateMany({
      where: {
        selected: "true",
      },
      data: {
        selected: "false",
      },
    });

    //get space id
    const spaceId = req.query.selectSpaceId;

    const space = await prisma.space.update({
      where: {
        // @ts-ignore
        id: spaceId,
      },
      data: {
        selected: "true",
      },
    });
    if (!space) {
      res.status(404);
      res.end();
      return;
    }
    res.json(space);
  } else {
    res.status(401);
  }
}
