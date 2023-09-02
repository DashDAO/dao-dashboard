import { SNAPSHOT_API_URL } from "@/constants/links";
import type { NextApiRequest, NextApiResponse } from "next";
import cache from "memory-cache";
import { CacheKey } from "@/constants/cache";

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
  }
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { space } = req.query;
    if (!space) {
      console.error("No space found");
      return res.status(400).send("Error");
    }
    const cachedResponse = cache.get(CacheKey.VOTERS + space);
    if (cachedResponse) {
      console.log("cache hit", CacheKey.VOTERS + space);
      return res.status(200).json(cachedResponse);
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
      return res.status(500).send("Error");
    }
    const data = await response.json();

    const {
      votes,
      proposals,
      space: spaceData,
    } = data?.data as {
      proposals: { id: string; scores_state: string; scores: number[] }[];
      votes: {
        vp: number;
        voter: string;
        proposal: { id: string };
        choice: number;
      }[];
      space: { id: string; network: string; name: string };
    };

    const users: Set<string> = new Set();

    votes?.forEach((vote) => {
      users.add(vote.voter);
    });

    const voters: Record<
      string,
      { participated: number; wins: number; losses: number }
    > = {};
    Array.from(users).forEach((user) => {
      voters[user] = {
        participated: 0,
        wins: 0,
        losses: 0,
      };
      votes.forEach((vote) => {
        if (vote.voter === user) {
          voters[user].participated += 1;
          const proposal = proposals.find(
            (proposal) => proposal.id === vote.proposal.id
          );
          if (proposal?.scores_state === "final") {
            const maxChoice = proposal.scores.indexOf(
              Math.max(...proposal.scores)
            );
            if (maxChoice === vote.choice - 1) {
              voters[user].wins += 1;
            } else {
              voters[user].losses += 1;
            }
          }
        }
      });
    });

    const finalData = { space: spaceData, voters, proposals };
    if (Object.values(finalData).length) {
      cache.put(CacheKey.VOTERS + space, finalData, 2 * 60 * 60 * 1000); // 2 hours
    }

    return res.status(200).json(finalData);
  }
}
