import Link from "next/link";
import Select from "react-select";
import { useSession, signIn, signOut } from "next-auth/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Nav() {
  const [session, loading] = useSession();
  const [subReddits, setSubReddits] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const subToOptions = () => {
    if (subReddits.length < 1) return;

    const options = subReddits.map((sub) => ({
      value: sub.id,
      label: sub.name,
    }));
    return options;
  };

  const fetchData = async () => {
    const res = await fetch("/api/subreddit/allSubReddits");
    const subReddits = await res.json();
    setSubReddits(subReddits);
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
            router.push(`/subReddits/${option.label}`);
          }}
        />
      </div>

      <h3 className="text-gray-700 font-bold text-xl hidden md:block">
        Welcome {loading ? "" : session?.user?.name}
      </h3>
      <div className="text-gray-700 font-bold mr-4 text-xl hover:text-indigo-200">
        {!session && <button onClick={signIn}>Login</button>}
        {session && <button onClick={signOut}>Logout</button>}
      </div>
    </nav>
  );
}
