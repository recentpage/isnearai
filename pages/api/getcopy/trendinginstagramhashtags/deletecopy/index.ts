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
  //make deleted true in db for the copy
  const deleteCopy = await prisma.copygen.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: "true",
    },
  });
  if (deleteCopy) {
    res.json({ status, act });
  }
}
