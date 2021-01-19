import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { User } from "@prisma/client";
import { useSession } from "next-auth/client";
import Moment from "react-moment";
import "moment-timezone";
import SubredditPost from "../../../components/subredditPost";
import useSWR from "swr";
import { fetchData } from "../../../utils/utils";
import Link from "next/link";

const SubReddit = (props) => {
  const router = useRouter();
  const { sub } = router.query;
  const [session] = useSession();

  const subUrl = `/api/subreddit/findSubreddit?name=${sub}`;

  const { data: fullSub, error } = useSWR(subUrl, fetchData, {
    initialData: props.fullSub,
  });

  console.log("the new votes state", fullSub.posts[0].votes);

  // has the user joined the subreddit?
  const joined =
    fullSub.joinedUsers.filter((user: User) => user.name === session?.user.name)
      .length > 0;

  if (error) {
    return (
      <Layout>
        <h1>{error.message}</h1>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="h-16  bg-green-400" />
      <div className="h-18 bg-white">
        <div className="mx-auto container px-12 py-2 flex relative flex-col">
          <div className="w-16 absolute h-16 bottom-6 rounded-full bg-green-400 border-white border-2" />
          <div className="flex items-center">
            <h4 className="ml-20 text-2xl font-bold text-gray-700">
              {fullSub.displayName}
            </h4>
            <button className="ml-4 text-sm text-green-400 font-semibold border border-green-400 py-1 px-3 rounded-md focus:outline-none">
              {joined ? "JOINED" : "JOIN"}
            </button>
          </div>
          <p className="ml-20 text-sm text-gray-600">r/{fullSub.name}</p>
        </div>
      </div>
      <div className="bg-gray-300">
        <div className="flex container mx-auto py-4 px-4 items-start">
          {/* Left Column (Posts) */}
          <div className="w-2/3">
            <Link href={`/r/${sub}/submit`}>
              <a className="w-full block text-center py-3 text-xl font-bold bg-white rounded-md shadow-sm hover:shadow-lg outline-none focus:outline-none">
                Create Post
              </a>
            </Link>
            {fullSub?.posts?.map((post) => (
              <SubredditPost
                post={post}
                subUrl={subUrl}
                fullSub={fullSub}
                key={post.id}
              />
            ))}
          </div>

          {/* >Right Column (sidebar) */}
          <div className="w-1/3 ml-4 bg-white rounded-md">
            <div className="bg-green-400 py-4 px-2 rounded-t-md">
              <p className="text-sm text-gray-900 font-bold">About Community</p>
            </div>
            <div className="p-2">
              <p>{fullSub.infoBoxText}</p>
              <div className="flex w-full mt-2 font-semibold">
                <div className="w-full">
                  <p>{fullSub.joinedUsers.length}</p>
                  <p className="text-sm">Members</p>
                </div>
                <div className="w-full">
                  <p>{fullSub?.posts?.length}</p>
                  <p className="text-sm">total Posts</p>
                </div>
              </div>
              <div className="w-full h-px bg-gray-300 my-4" />
              <p className="text-md mb-4">
                <b>Created - </b>{" "}
                <Moment format="YYYY/MM/DD">{fullSub?.createdAt}</Moment>
              </p>
              <button className="focus:outline-none rounded-md w-full py-3 text-gray-900 font-semibold bg-green-400">
                CREATE POST
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const url = `${process.env.NEXTAUTH_URL}/api/subreddit/findSubreddit?name=${ctx.query.sub}`;
  const fullSub = await fetchData(url);

  return {
    props: {
      fullSub,
    },
  };
}

export default SubReddit;
