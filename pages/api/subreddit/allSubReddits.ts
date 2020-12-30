import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const allSubs = await prisma.subreddit.findMany();
    res.json(allSubs);
  } catch (e) {
    res.json(e);
  }
};

export default handler;
