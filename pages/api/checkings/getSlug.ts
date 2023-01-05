// get slug from productdescription
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function getSug(req: any, res: any, toolid: any) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
  }
  const toolsset = "productdescription";

  if (toolid && toolid !== "undefined") {
    if (toolsset === "productdescription") {
      const getSug = await prisma.tools.findMany({
        where: {
          id: toolid,
        },
        select: {
          slug: true,
        },
      });

      return getSug[0].slug;
    }
  }
}
