import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, proid, copy } = req.body;
  const status = "success";
  const act = "update";
  const facebookadsgen = await prisma.copygen.update({
    where: { id: id },
    data: {
      text: copy,
    },
  });
  if (facebookadsgen) {
    res.json({ status, act });
  }
}
