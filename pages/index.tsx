import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/client";

export default function Page() {
  const [session, loading] = useSession();

  console.log("hi session", session);

  return (
    <>
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
    </>
  );
}
