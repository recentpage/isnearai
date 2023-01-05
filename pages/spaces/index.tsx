import { getSession } from "next-auth/react";
import React from "react";

export default function Spaces({ checkuser }: any) {
  return (
    <div>
      <h1>Spaces</h1>
      <p>{checkuser.user.email}</p>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      checkuser: session,
    },
  };
}
