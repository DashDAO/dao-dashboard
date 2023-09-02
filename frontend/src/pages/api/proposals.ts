import { SNAPSHOT_API_URL } from "@/constants/links";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = `query Proposals {
    proposals(first: 20, skip: 0, where: {space_in: ["balancer.eth", "yam.eth"], state: "closed"}, orderBy: "created", orderDirection: desc) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      space {
        id
        name
      }
    }
  }`;

  if (req.method === "GET") {
    const response = await fetch(SNAPSHOT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
      }),
    });

    if (!response.ok) {
      throw new Error("Error retrieving proposals");
    }
    const data = await response.json();
    return res.status(200).json(data);
  }

  return res.status(404).send("Not found");
}
