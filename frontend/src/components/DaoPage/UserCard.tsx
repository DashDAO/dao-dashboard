import { useWeb3 } from "@/components/Web3/Web3Provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONTRACT_ADDRESS } from "@/constants/address";
import { chains } from "@/constants/chains";
import {
  useDelegateFellowFollow,
  usePrepareDelegateFellowFollow,
} from "@/lib/generated";
import { percentageFormatter } from "@/lib/percentageFormatter";
import { write } from "fs";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Address, mainnet, useAccount, useEnsAddress } from "wagmi";
import { goerli } from "wagmi/chains";

interface Props {
  voter: string;
  id: string;
  space: any;
  voters: any;
  proposals: any;
}

export function UserCard({ voter, id, space, voters, proposals }: Props) {
  const { isLoggedIn } = useWeb3();
  const { address } = useAccount();
  const { data: ensAddress } = useEnsAddress({
    name: id,
    chainId: process.env.NODE_ENV === "production" ? mainnet.id : goerli.id,
    enabled: Boolean(id),
  });
  const { config } = usePrepareDelegateFellowFollow({
    address: CONTRACT_ADDRESS[+space?.network || 5],
    args: [voter as Address, ensAddress! as Address],
    enabled:
      Boolean(space?.network) &&
      !isNaN(space.network) &&
      Object.keys(CONTRACT_ADDRESS).includes(space.network) &&
      Boolean(ensAddress),
  });
  const { writeAsync } = useDelegateFellowFollow(config);

  return (
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
                  <Button
                    variant={"ghost"}
                    disabled={!isLoggedIn}
                    onClick={() => {
                      if (
                        isLoggedIn &&
                        chains.find((chain) => chain.id === +space?.network) !==
                          undefined
                      ) {
                        writeAsync?.();
                      }
                    }}
                  >
                    {!isLoggedIn ? (
                      "Please Login"
                    ) : (
                      <>
                        Follow <PlusIcon className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {!isLoggedIn
                    ? "Please Login"
                    : chains.find((chain) => chain.id === +space?.network) !==
                      undefined
                    ? "Check if you are on the right track!"
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
            <div className="text-muted-foreground">Participation Rate</div>
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
  );
}
