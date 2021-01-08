import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient({ log: ["error"] });

const handler = async (req, res) => {
  // get post id and type from the req body
  const { postId } = req.body;
  const { type } = req.body;
  const session = await getSession({ req });

  console.log("post id and type", postId, type);
  console.log("the session, ", session);

  // if we dont have a session we return an error
  if (!session) {
    return res.status(500).json({ error: "You have to be logged in." });
  }

  // first get all the votes from the user

  try {
    const votes = await prisma.vote.findMany({
      where: {
        userId: session.userId,
      },
    });

    // now we check if the user has voted on this requested post and save it in variable - true or false

    console.log("all votes from user", votes);

    const hasVoted = votes.find((vote) => vote.postId === postId);

    console.log("has voted?", hasVoted);

    // if the user has voted - remove the vote and return the removed vote

    if (hasVoted) {
      console.log("i cant be in here");
      const deletedVote = await prisma.vote.delete({
        where: {
          id: Number(hasVoted.id),
        },
      });
      return res.json(deletedVote);
    }

    // otherwise just create a new vote and return it

    const newVote = await prisma.vote.create({
      data: {
        voteType: type,
        user: {
          connect: { id: Number(session.userId) },
        },
        post: {
          connect: { id: Number(postId) },
        },
      },
    });
    console.log("new vote: ", newVote);
    return res.json(newVote);
  } catch (e) {
    console.log("the error is", e);
    res.json(e);
  }
};

export default handler;
