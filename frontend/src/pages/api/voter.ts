import { CacheKey } from "@/constants/cache";
import { SNAPSHOT_API_URL } from "@/constants/links";
import { getSpaceVotes } from "@/lib/getSpaceVotes";
import type { NextApiRequest, NextApiResponse } from "next";
import cache from "memory-cache";

const query = `query User($id: String) {
  user(id: $id) {
    id
    name
    about
    avatar
  }
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { delegate } = req.query;
    if (!delegate) {
      throw new Error("No delegate found");
    }
    const cachedResponse = cache.get(CacheKey.VOTER);
    if (cachedResponse) {
      console.log("cache hit", CacheKey.VOTER);
      return res.status(200).json(cachedResponse);
    }
    const response = await fetch(SNAPSHOT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationName: "User",
        query,
        variables: { id: delegate },
      }),
    });
    if (!response.ok) {
      console.error(await response.text());
      return res.status(500).send("Error");
    }
    const data = await response.json();
    if (Object.values(data).length) {
      cache.put(CacheKey.VOTER, data, 2 * 60 * 60 * 1000); // 2 hours
    }

    return res.status(200).json(data);
  }
  return res.status(404).json("Not found");
}
