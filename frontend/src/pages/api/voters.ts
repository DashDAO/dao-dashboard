import { getSpaceVotes } from "@/lib/getSpaceVotes";
import type { NextApiRequest, NextApiResponse } from "next";

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
    const data = await getSpaceVotes(space.toString());

    if (data === undefined) {
      return res.status(500).send("Error");
    }

    const { votes, proposals, space: spaceData } = data?.data;

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

    const finalData = { space: spaceData, voters, proposals, votes };

    return res.status(200).json(finalData);
  }
  return res.status(404).json("Not found");
}
