import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/layout";

const SubReddit = () => {
  const router = useRouter();
  const { sub } = router.query;

  return (
    <Layout>
      <h1>Welcome to subreddit {sub}</h1>
      <Link href="/">
        <a>Go Back</a>
      </Link>
    </Layout>
  );
};

export default SubReddit;
