import React from "react";

export default function Genrations({ spaceid }: { spaceid: string }) {
  return <div>{spaceid}</div>;
}

export async function getServerSideProps(context: any) {
  const spaceid = context.query["SpaceId"];
  //get all genrations

  return {
    props: {
      spaceid,
    },
  };
}
