import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Layout from "../components/layout";

export default function Page() {
  const [session, loading] = useSession();

  return (
    <Layout>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={signIn}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.name} <br />
          <button onClick={signOut}>Sign out</button>
        </>
      )}
    </Layout>
  );
}
