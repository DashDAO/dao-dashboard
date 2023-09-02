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
      network
    }
  }
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { skip, search } = req.query;
    const cacheKey = CacheKey.DAOS + skip + search;

    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      console.log("cache hit", cacheKey);
      return res.status(200).json(cachedResponse);
    }
    console.log("cachie miss", cacheKey);
    const response = await fetch(SNAPSHOT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationName: "Ranking",
        query,
        variables: {
          first: 12,
          skip: +skip! === 0 ? undefined : +skip!,
          search,
        },
      }),
    });
    if (!response.ok) {
      console.error(await response.text());
      return res.status(500).send("Error");
    }
    const data = await response.json();
    if (Object.values(data).length) {
      cache.put(cacheKey, data, 2 * 60 * 60 * 1000); // 2 hours
    }
    return res.status(200).json(data);
  }

  return res.status(404).send("Not found");
}
