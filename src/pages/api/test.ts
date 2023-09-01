// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ZCOOL_KuaiLe } from "next/font/google";

type Data = {
  name: string;
};

const query = `query Spaces {
  spaces(
    first: 20,
    skip: 0,
    orderBy: "created",
    orderDirection: desc
  ) {
    id
    name
    about
    network
    symbol
    strategies {
      name
      network
      params
    }
    admins
    moderators
    members
    filters {
      minScore
      onlyMembers
    }
    plugins
  }
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = await fetch("https://hub.snapshot.org/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw new Error("fail");
  }

  res.status(200).json(await response.json());
}
