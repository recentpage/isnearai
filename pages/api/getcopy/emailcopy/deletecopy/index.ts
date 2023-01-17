// write api call to delete the copy
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  const status = "success";
  const act = "delete";
  const productDescription = await prisma.copygen.delete({
    where: { id: id },
  });
  if (productDescription) {
    res.json({ status, act });
  }
}
