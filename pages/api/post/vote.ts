import { getSession } from "next-auth/client";
import prisma from "../../../db";

const handler = async (req, res) => {
  // get post id and type from the req body
  const { postId } = req.body;
  const { type } = req.body;
  const session = await getSession({ req });

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

    console.log("the users votes", votes);

    // now we check if the user has voted on this requested post and save it in variable - true or false

    const hasVoted = votes.find((vote) => vote.postId === postId);

    console.log("has the user voted: ", hasVoted);
    // if the user has voted - remove the vote and return the removed vote

    if (hasVoted) {
      // if user hasVoted and the vote type is not the same - we change the type

      if (hasVoted.voteType !== type) {
        const updatedVote = await prisma.vote.update({
          where: {
            id: Number(hasVoted.id),
          },
          data: {
            voteType: type,
          },
        });

        console.log("updated vote", updatedVote);

        return res.json(updatedVote);
      }

      const deletedVote = await prisma.vote.delete({
        where: {
          id: Number(hasVoted.id),
        },
      });

      console.log("deleted vote", deletedVote);
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
