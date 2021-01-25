import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { mutate } from "swr";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

const modules = {
  toolbar: [
    ["bold", "italic"],
    ["link", "blockquote", "code", "image"],
    [
      {
        list: "ordered",
      },
      {
        list: "bullet",
      },
    ],
  ],
};

const Submit = () => {
  const [reactQuillText, setReactQuillText] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { sub } = router.query;
  const [session, loading] = useSession();
  const subUrl = `/api/subreddit/findSubreddit?name=${sub}`;

  const handleNewPost = async (e) => {
    e.preventDefault();

    // create a new post localy

    const newPost = {
      title,
      body: reactQuillText,
      subReddit: sub,
      votes: [
        {
          voteType: "UPVOTE",
          userId: session.userId,
        },
      ],
      user: session.user,
    };

    // mutate (updating local cache)

    mutate(
      subUrl,
      async (state) => {
        return {
          ...state,
          posts: [...state.posts, newPost],
        };
      },
      true
    );

    // api request
    NProgress.start();
    await fetch("/api/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: newPost }),
    });
    NProgress.done();

    // revalidate and route back to our posts

    mutate(subUrl);

    router.push(`/r/${sub}`);
  };

  return (
    <div className="w-2/3 m-auto container">
      <form onSubmit={handleNewPost}>
        <input
          className="w-full border-2 mb-2 p-2 mt-8"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          value={reactQuillText}
          onChange={(value) => setReactQuillText(value)}
          theme="snow"
          className="w-full m-auto shadow-xl"
          modules={modules}
        />
        <button className="mt-4 border-2 text-white bg-gray-500 text-lg font-bold border-gray-500 rounded-xl px-4 py-1">
          Post
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
          className="mt-4 ml-4 border-2 text-white bg-gray-500 text-lg font-bold border-gray-500 rounded-xl px-4 py-1"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Submit;
