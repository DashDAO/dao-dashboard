import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Log } from "viem";
import { useAccount, useEnsAddress, mainnet } from "wagmi";
import { goerli } from "wagmi/chains";

export function FollowCard(delegate: Log) {
  const { address } = useAccount();
  const { data: ensAddress } = useEnsAddress({
    name: delegate.args?.delegate,
    chainId: process.env.NODE_ENV === "production" ? mainnet.id : goerli.id,
    enabled: Boolean(delegate.args?.delegate),
  });
  return (
    <Card key={delegate.transactionHash} className="p-2">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between space-x-4">
            <Link
              href={`/dao/${delegate.blockHash}/voter/${delegate}`}
              className="hover:underline"
            >
              {`${delegate.args?.delegate.slice(0, 10)}...`}
            </Link>
            <Button variant={"ghost"}>
              Follow <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 w-full gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Participation Rate</div>
            {/* <p className="text-lg">
          {percentageFormatter.format(
            voters[delegate].participated / (proposals?.length || 1)
          )}
        </p> */}
          </div>
          {/* <div>
            <div className="text-muted-foreground">Wins/Losses</div>
            <p className="text-lg">
              {voters[delegate].wins} / {voters[delegate].losses}
            </p>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
