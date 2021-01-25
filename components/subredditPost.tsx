import { Prisma } from "@prisma/client";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { fetchDedupe } from "fetch-dedupe";
import "react-quill/dist/quill.snow.css";

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

type FullPost = Prisma.PostGetPayload<{
  include: { user: true; subreddit: true; votes: true };
}>;

type SubWithPosts = Prisma.SubredditGetPayload<{
  include: {
    posts: { include: { user: true; subreddit: true; votes: true } };
    joinedUsers: true;
  };
}>;

interface Props {
  post: FullPost;
  subUrl: string;
  fullSub: SubWithPosts;
}

const SubredditPost = ({ post, subUrl, fullSub }: Props) => {
  const [session, loading] = useSession();
  const router = useRouter();

  console.log("current post: ", post);

  // if the user is not logged in - redirect to a login page
  if (!session && !loading) {
    router.push("/login");
    return;
  }

  const hasVoted = post.votes.find((vote) => vote.userId === session?.userId);

  const votePost = async (type) => {
    if (hasVoted) {
      // check if the vote type is the same ase the already existing one
      console.log("in general has voted the has voted object", hasVoted);
      if (hasVoted.voteType !== type) {
        console.log("in has voted type changed - so swap upvote with downvote");
        mutate(
          subUrl,
          async (state = fullSub) => {
            return {
              ...state,
              posts: state.posts.map((currentPost) => {
                if (currentPost.id === post.id) {
                  return {
                    ...currentPost,
                    votes: currentPost.votes.map((vote) => {
                      if (vote.userId === session.userId) {
                        return {
                          ...vote,
                          voteType: type,
                        };
                      } else {
                        return vote;
                      }
                    }),
                  };
                } else {
                  return currentPost;
                }
              }),
            };
          },
          false
        );
      } else {
        console.log("in has voted type is the same - so remove the vote");

        mutate(
          subUrl,
          async (state = fullSub) => {
            return {
              ...state,
              posts: state.posts.map((currentPost) => {
                if (currentPost.id === post.id) {
                  const test = currentPost.votes.filter(
                    (vote) => vote.userId !== session.userId
                  );
                  console.log("filtered out votes: ", test);
                  return {
                    ...currentPost,
                    votes: test,
                  };
                } else {
                  return currentPost;
                }
              }),
            };
          },
          false
        );
      }
    } else {
      console.log("has not vote - create a new vote");
      mutate(
        subUrl,
        async (state = fullSub) => {
          return {
            ...state,
            posts: state.posts.map((currentPost) => {
              if (currentPost.id === post.id) {
                return {
                  ...currentPost,
                  votes: [
                    ...currentPost.votes,
                    {
                      voteType: type,
                      userId: session.userId,
                      postId: currentPost.id,
                    },
                  ],
                };
              } else {
                return currentPost;
              }
            }),
          };
        },
        false
      );
    }

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: post.id, type }),
    };

    await fetchDedupe("/api/post/vote", fetchOptions);
    mutate(subUrl);
  };

  const calculateVoteCount = (votes) => {
    const upVotes = votes.filter((vote) => vote.voteType === "UPVOTE");
    const downVotes = votes.filter((vote) => vote.voteType === "DOWNVOTE");

    const voteCount = upVotes.length - downVotes.length;
    return voteCount;
  };

  return (
    <div className="w-full bg-white  rounded-md p-4 mt-4 ">
      <div className="flex">
        <div className="flex flex-col mr-6 items-center">
          <FontAwesomeIcon
            icon={faThumbsUp}
            className={`${
              hasVoted?.voteType === "UPVOTE" ? "text-red-500" : "text-gray-600"
            } cursor-pointer hover:text-red-500`}
            onClick={() => votePost("UPVOTE")}
          />
          <p>{calculateVoteCount(post.votes)}</p>
          <FontAwesomeIcon
            icon={faThumbsDown}
            className={`${
              hasVoted?.voteType === "DOWNVOTE"
                ? "text-blue-600"
                : "text-gray-600"
            } cursor-pointer  hover:text-blue-600`}
            onClick={() => votePost("DOWNVOTE")}
          />
        </div>
        <div>
          <p className="text-sm text-gray-500">Posted by u/{post.user.name}</p>
          <p className="text-3xl text-gray-900">{post.title}</p>
          <ReactQuill
            value={post.body}
            readOnly={true}
            theme={"snow"}
            modules={{ toolbar: false }}
          />
          <div>
            <p>
              {/*comment icon */} {/*comment count*/} comments
            </p>
            <p>Share</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubredditPost;
