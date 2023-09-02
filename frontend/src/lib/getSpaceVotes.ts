import { CacheKey } from "@/constants/cache";
import { SNAPSHOT_API_URL } from "@/constants/links";
import cache from "memory-cache";

const query = `query Proposals($space: String) {
  proposals(where: {space: $space}, first: 1000) {
    id
    scores
    scores_state
  }
  space(id: $space) {
    id
    network
    name
  }
  votes(where: {space: $space}, first: 1000) {
    vp
    id
    voter
    proposal {
      id
    }
    choice
    created
  }
}`;

export async function getSpaceVotes(space: string): Promise<
  | {
      data: {
        proposals: { id: string; scores_state: string; scores: number[] }[];
        votes: {
          vp: number;
          voter: string;
          proposal: { id: string };
          choice: number;
        }[];
        space: { id: string; network: string; name: string };
      };
    }
  | undefined
> {
  const cachedResponse = cache.get(CacheKey.VOTERS + space);
  if (cachedResponse) {
    console.log("cache hit", CacheKey.VOTERS + space);
    return cachedResponse;
  }
  const response = await fetch(SNAPSHOT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationName: "Proposals",
      query,
      variables: { space },
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    return undefined;
  }
  const data = await response.json();
  cache.put(CacheKey.VOTERS + space, data, 2 * 60 * 60 * 1000); // 2 hours

  return data;
}
