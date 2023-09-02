import { Placeholder } from "@/components/Layout/Placeholder";
import {
  ProposalData,
  ProposalTable,
} from "@/components/VoterPage/ProposalTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CacheKey } from "@/constants/cache";
import { percentageFormatter } from "@/lib/percentageFormatter";
import { PlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useQuery } from "wagmi";

const VoteChart = dynamic(
  () => import("@/components/VoterPage/VoteChart").then((mod) => mod.VoteChart),
  {
    ssr: false,
  }
);

function transformData(proposals: any, votes: any): ProposalData[] {
  const votesMapping: Record<string, any> = {};
  votes.forEach((vote: any) => {
    votesMapping[vote.proposal.id] = vote;
  });
  return proposals
    .map((proposal: any) => {
      const vote = votesMapping[proposal.id];
      const maxChoice = proposal.scores.indexOf(Math.max(...proposal.scores));
      return {
        proposal: proposal.title,
        state: proposal.scores_state === "final" ? "Closed" : "Open",
        date: vote?.created,
        vp: vote?.vp,
        voted: vote?.choice,
        result:
          proposal.scores_state === "final"
            ? maxChoice === vote?.choice - 1
              ? "✅"
              : "❌"
            : "-",
      };
    })
    .filter((proposal: any) => proposal.vp !== undefined);
}

export default function DaoPage() {
  const { query } = useRouter();
  const { voterId, id } = query;
  const { data: votersData, isLoading: votersDataIsLoading } = useQuery(
    [CacheKey.VOTERS, id],
    () => fetch(`/api/voters?space=${id}`).then((res) => res.json()),
    { enabled: id !== undefined }
  );
  const { data: userData, isLoading: userDataIsLoading } = useQuery(
    [CacheKey.VOTER, voterId],
    () => fetch(`/api/voter?delegate=${voterId}`).then((res) => res.json()),
    { enabled: voterId !== undefined }
  );

  if (userDataIsLoading || votersDataIsLoading) {
    return (
      <Placeholder>
        <h1>Loading...</h1>
      </Placeholder>
    );
  }

  if (!votersData || !voterId) {
    return (
      <Placeholder>
        <h1>No data found</h1>
      </Placeholder>
    );
  }

  const { voters, proposals, votes } = votersData;
  const voterData = voters[voterId.toString()];

  const voteAmounts = (
    votes as { voter: string; vp: number; created: number }[]
  )
    ?.filter((vote) => vote.voter === voterId)
    .map((vote) => ({ vp: vote.vp, created: vote.created }));

  const tableData = transformData(proposals, votes);

  return (
    <div className="w-full">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">{userData?.name || voterId}</h1>
        <Button>
          Follow <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-12 pb-10">
        <Card>
          <CardContent className="grid grid-cols-2 gap-4 gap-y-6 py-6">
            <div>
              <div className="text-muted-foreground">Participation Rate</div>
              <p className="text-lg">
                {percentageFormatter.format(
                  voterData.participated / (proposals?.length || 1)
                )}
              </p>
            </div>
            <div>
              <div className="text-muted-foreground">Votes</div>
              <p className="text-lg">{voterData.participated}</p>
            </div>
            <div>
              <div className="text-muted-foreground">Contrarian Rate</div>
              <p className="text-lg">
                {percentageFormatter.format(
                  voterData.losses /
                    Math.max(1, voterData.wins + voterData.losses)
                )}
              </p>
            </div>
            <div>
              <div className="text-muted-foreground">Wins/Losses</div>
              <p className="text-lg">
                {voterData.wins} / {voterData.losses}
              </p>
            </div>
          </CardContent>
        </Card>
        <div>{voteAmounts && <VoteChart votes={voteAmounts} />}</div>
      </div>
      <h2 className="text-2xl font-bold pb-10">Votes</h2>
      <ProposalTable data={tableData} />
    </div>
  );
}
