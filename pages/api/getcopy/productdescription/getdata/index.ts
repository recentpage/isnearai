// use prisma to get data from database copy table
// return data to client
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  try {
    if (req.method === "POST" && id) {
      const copy = await prisma.copygen.findMany({
        where: {
          toolgenId: parseInt(id),
        },
      });
      console.log("copy", copy);
      if (copy) {
        console.log("copy", copy);
        res.status(200).json("data found");
      }
    }
  } catch (error) {
    //@ts-ignore
    res.status(500).json({ error: error.message });
  }
}
