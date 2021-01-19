import Link from "next/link";
import Select from "react-select";
import { useSession, signIn, signOut } from "next-auth/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchData } from "../utils/utils";

export default function Nav() {
  const [session, loading] = useSession();
  const { data } = useSWR("/api/subreddit/allSubReddits", fetchData);

  const router = useRouter();

  const subToOptions = () => {
    if (!data) return;

    const options = data.map((sub) => ({
      value: sub.id,
      label: sub.name,
    }));
    return options;
  };

  return (
    <nav className="flex items-center justify-between py-4 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <div className="w-12 h-12 rounded-full bg-red-300 mx-4 cursor-pointer" />
        </Link>
        <Link href="/">
          <a className="text-gray-700 text-2xl font-bold hidden md:block hover:text-indigo-200">
            reddit
          </a>
        </Link>
      </div>
      <div className="md:w-1/3 w-full mr-4 md:mr-0">
        <Select
          options={subToOptions()}
          onChange={(option) => {
            router.push(`/r/${option.label}`);
          }}
        />
      </div>

      <h3 className="text-gray-700 font-bold text-xl hidden md:block">
        Welcome {loading ? "" : session?.user?.name}
      </h3>
      <div className="text-gray-700 font-bold mr-4 text-xl hover:text-indigo-200">
        {!session && <button onClick={signIn}>Login</button>}
        {session && (
          <button
            onClick={() => {
              router.push("/");
              signOut();
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
