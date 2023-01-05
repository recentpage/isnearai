// make response and send it back upadte title
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, proid } = req.body;
  if (!title || !proid) {
    res.status(400).json({ message: "title or proid is missing" });
    return;
  }
  if (title) {
    const toolgen = await prisma.toolgen.update({
      where: {
        id: proid,
      },
      data: {
        title: title,
      },
    });
    res.status(200).json({ status: "success", act: "update" });
  }
}
