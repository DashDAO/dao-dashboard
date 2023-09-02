import { CacheKey } from "@/constants/cache";
import { SNAPSHOT_API_URL } from "@/constants/links";
import cache from "memory-cache";
import type { NextApiRequest, NextApiResponse } from "next";

const query = `query Ranking($first: Int, $skip: Int, $search: String, $network: String, $category: String) {
  ranking(
    first: $first
    skip: $skip
    where: {search: $search, network: $network, category: $category}
  ) {
    metrics {
      total
    }
    items {
      id
      name
      rank
      activeProposals
      proposalsCount
      votesCount
      website
    }
  }
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { skip } = req.query;
    const cachedResponse = cache.get(CacheKey.DAOS + skip);
    if (cachedResponse) {
      console.log("cache hit", CacheKey.DAOS + skip);
      return res.status(200).json(cachedResponse);
    }
    console.log("cachie miss", CacheKey.DAOS + skip);
    const response = await fetch(SNAPSHOT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationName: "Ranking",
        query,
        variables: { first: 12, skip: +skip! === 0 ? undefined : +skip! },
      }),
    });
    if (!response.ok) {
      console.error(await response.text());
      return res.status(500).send("Error");
    }
    const data = await response.json();
    if (Object.values(data).length) {
      cache.put(CacheKey.DAOS + skip, data, 2 * 60 * 60 * 1000); // 2 hours
    }
    return res.status(200).json(data);
  }

  return res.status(404).send("Not found");
}
