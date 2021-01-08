import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { performance } from "perf_hooks";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    var t0 = performance.now();
    const sub = await prisma.subreddit.findUnique({
      where: { name: String(req.query.name) },
      include: {
        posts: {
          include: { subreddit: true, user: true, votes: true },
        },
        joinedUsers: true,
      },
    });
    var t1 = performance.now();

    const timeItTook = t1 - t0;
    console.log("Fetching full Sub took " + timeItTook + " milliseconds.");

    if (!sub) {
      return res
        .status(500)
        .json({ error: "No sub was found with this name", timeItTook });
    }

    return res.json({ timeItTook });
  } catch (e) {
    res.json(e);
  }
};

export default handler;
