import Layout from "../components/layout";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/client";

const Login = () => {
  const router = useRouter();
  const [session] = useSession();

  const handleLogin = () => {
    router.back();
    signIn();
  };

  if (session) {
    router.push("/");
  }

  return (
    <Layout>
      <div>You have to be logged in to use this feature</div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => router.back()}>Go Back</button>
    </Layout>
  );
};

export default Login;
