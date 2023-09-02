import { SNAPSHOT_API_URL } from "@/constants/links";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = `query Proposals($first: Int, $skip: Int, $space: String) {
    proposals(
      first: $first,
      skip: $skip,
      where: {
        space: $space
      }, 
      orderBy: "created", 
      orderDirection: desc
    ) {
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
    const { space, first, skip } = req.query;
    if (!space) {
      throw new Error("No space found");
    }
    const response = await fetch(SNAPSHOT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationName: "Proposals",
        query,
        variables: { first: first || 20, skip: skip || 0, space },
      }),
    });

    if (!response.ok) {
      throw new Error("Error retrieving proposals");
    }
    const data = await response.json();
    return res.status(200).json(data);
  }
}
