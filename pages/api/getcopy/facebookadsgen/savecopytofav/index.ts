// make false to true to save copy to fav
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
    const { id, isSaved } = req.body;
    let status = "success";
    let act = "save";
    if (isSaved === "true") {
      status = "success";
      act = "unsave";
      const result1 = await prisma.copygen.update({
        where: {
          id: id,
        },
        data: {
          //set to false to unsave copy to fav
          isSaved: "false",
        },
      });
      if (result1) {
        res.json({ status, act });
      }
    } else {
      const result = await prisma.copygen.update({
        where: {
          id: id,
        },
        data: {
          //set to true to save copy to fav
          isSaved: "true",
        },
      });
      if (result) {
        res.json({ status, act });
      }
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}
