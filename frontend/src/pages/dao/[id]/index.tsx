import { Placeholder } from "@/components/Layout/Placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CacheKey } from "@/constants/cache";
import { percentageFormatter } from "@/lib/percentageFormatter";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount, useNetwork, useQuery } from "wagmi";
import { useWeb3 } from "@/components/Web3/Web3Provider";
import { chains } from "@/constants/chains";

const ENTRIES_PER_PAGE = 12;

export default function DaoPage() {
  const { query, push } = useRouter();
  const { id } = query;
  const { data, isLoading } = useQuery(
    [CacheKey.VOTERS, id],
    () => fetch(`/api/voters?space=${id}`).then((res) => res.json()),
    { enabled: id !== undefined }
  );
  const [page, setPage] = useState(0);
  const { isLoggedIn } = useWeb3();
  const { chain } = useNetwork();
  const { address } = useAccount();

  if (isLoading) {
    return (
      <Placeholder>
        <h1>Loading...</h1>
      </Placeholder>
    );
  }

  if (!data) {
    return (
      <Placeholder>
        <h1>No data found</h1>
      </Placeholder>
    );
  }

  const { space, voters, proposals } = data;

  return (
    <div>
      <div className="pb-6">
        <h1 className="text-4xl font-bold">{space?.name}</h1>
        <p className="text-muted-foreground">{space?.id}</p>
        <p className="text-muted-foreground">Chain ID: {space?.network}</p>
      </div>
      <Button className="mb-4" onClick={() => push("/")}>
        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Go Back
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
        {Object.keys(voters)
          .sort((a, b) => voters[b].participated - voters[a].participated)
          .slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE)
          .map((voter) => (
            <Card key={voter} className="p-2">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between space-x-4">
                    <Link
                      href={`/dao/${id}/voter/${voter}`}
                      className="hover:underline"
                    >
                      {`${voter.slice(0, 10)}...`}
                    </Link>

                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button variant={"ghost"} disabled={!isLoggedIn}>
                            Follow <PlusIcon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isLoggedIn
                            ? "Please Login"
                            : chains.find(
                                (chain) => chain.id === +space?.network
                              ) !== undefined
                            ? "Make sure you're on the same chain!"
                            : "Chain not supported"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 w-full gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">
                      Participation Rate
                    </div>
                    <p className="text-lg">
                      {percentageFormatter.format(
                        voters[voter].participated / (proposals?.length || 1)
                      )}
                    </p>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Wins/Losses</div>
                    <p className="text-lg">
                      {voters[voter].wins} / {voters[voter].losses}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      <div className="flex justify-between pt-6">
        <Button
          onClick={() => setPage((page) => Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          disabled={
            page === Math.floor(Object.keys(voters).length / ENTRIES_PER_PAGE)
          }
          onClick={() =>
            setPage((page) =>
              Math.min(
                page + 1,
                Math.floor(Object.keys(voters).length / ENTRIES_PER_PAGE)
              )
            )
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
