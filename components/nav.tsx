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
    <nav className="flex items-center justify-between py-4 bg-gray-600">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-red-300 mx-4" />
        <Link href="/">
          <a className="text-white text-2xl font-bold">reddit</a>
        </Link>
      </div>
      <div className="w-4/12">
        <Select
          options={subToOptions()}
          onChange={(option) => {
            router.push(`/subReddits/${option.label}`);
          }}
        />
      </div>

      <h3 className="text-white font-bold text-xl">
        Welcome {loading ? "" : session?.user?.name}
      </h3>
      <div className="text-white font-bold mr-4 text-xl">
        {!session && <button onClick={signIn}>Login</button>}
        {session && <button onClick={signOut}>Logout</button>}
      </div>
    </nav>
  );
}
