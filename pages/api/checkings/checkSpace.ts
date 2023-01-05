// make function to check space and return space id if it exists or create a new space and return the id
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function checkSpace(userId: any) {
  if (!userId) {
    return null;
  }
  const space: any = await prisma.space.findMany({
    where: {
      userId: userId,
      selected: "true",
    },
    select: {
      id: true,
    },
  });
  if (space.length > 0) {
    return space[0].id;
  } else {
    const newSpace = await prisma.space.create({
      data: {
        name: "My first space",
        userId: userId,
        selected: "true",
      },
    });
    return newSpace.id;
  }
}
