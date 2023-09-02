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
    const { skip, search, network } = req.query;
    const variables = {
      first: 12,
      skip: isNaN(skip as unknown as number) ? undefined : +skip!,
      search,
      network,
    };
    for (const key in variables) {
      if (!variables[key as keyof typeof variables]) {
        delete variables[key as keyof typeof variables];
      }
    }
    const cacheKey = JSON.stringify(variables);

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
        variables,
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
