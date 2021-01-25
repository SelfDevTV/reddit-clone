import { getSession } from "next-auth/client";
import prisma from "../../../db";

const handler = async (req, res) => {
  // get post  from the req body
  const { post } = req.body;
  const session = await getSession({ req });

  // if we dont have a session we return an error
  if (!session) {
    return res.status(500).json({ error: "You have to be logged in." });
  }

  // first get all the votes from the user

  try {
    // create the post with also an upvote as default

    const newPost = await prisma.post.create({
      data: {
        body: post.body,
        title: post.title,
        subreddit: {
          connect: {
            name: post.subReddit,
          },
        },
        user: {
          connect: {
            id: session.userId,
          },
        },
        votes: {
          create: {
            user: { connect: { id: session.userId } },
            voteType: "UPVOTE",
          },
        },
      },
    });

    // return the post

    return res.json(newPost);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default handler;
