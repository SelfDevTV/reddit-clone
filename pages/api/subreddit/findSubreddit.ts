import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sub = await prisma.subreddit.findUnique({
      where: { name: String(req.query.name) },
      include: {
        posts: {
          include: { subreddit: true, user: true, votes: true },
        },
        joinedUsers: true,
      },
    });

    if (!sub) {
      return res.status(500).json({ error: "No sub was found with this name" });
    }

    res.json(sub);
  } catch (e) {
    res.json(e);
  }
};

export default handler;
