import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTRACT_ADDRESS } from "@/constants/address";
import {
  useDelegateFellowUnfollow,
  usePrepareDelegateFellowUnfollow,
} from "@/lib/generated";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Address, Log } from "viem";
import { mainnet, useAccount, useEnsName } from "wagmi";
import { goerli } from "wagmi/chains";

export function FollowCard({
  delegate,
}: {
  delegate: Log & { chainId: number };
}) {
  const { address } = useAccount();
  const { daoAddress, delegate: delegateAddress } = (
    delegate as unknown as {
      args: { daoAddress: Address; delegate: Address };
    }
  ).args;
  const { data: mainnetEnsAddress, isLoading } = useEnsName({
    address: daoAddress,
    chainId: mainnet.id,
    enabled: Boolean(daoAddress),
  });
  const { data: testnetEnsAddress } = useEnsName({
    address: daoAddress,
    chainId: goerli.id,
    enabled:
      Boolean(daoAddress) && mainnetEnsAddress === undefined && !isLoading,
  });
  const { config } = usePrepareDelegateFellowUnfollow({
    address: CONTRACT_ADDRESS[delegate.chainId],
    account: address,
    args: [delegateAddress, daoAddress],
    enabled: address !== undefined && Boolean(delegateAddress),
  });
  const { writeAsync } = useDelegateFellowUnfollow(config);

  const daoEnsName = mainnetEnsAddress ?? testnetEnsAddress;

  return (
    <Card key={delegate.transactionHash} className="p-2">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between space-x-4">
            <Link
              href={`/dao/${daoEnsName}/voter/${delegateAddress}`}
              className="hover:underline"
            >
              {`${delegateAddress.slice(0, 10)}...`}
            </Link>
            <Button
              variant={"ghost"}
              onClick={() => {
                writeAsync?.();
              }}
            >
              Unfollow <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
          <Link
            href={`/dao/${daoEnsName}`}
            className="hover:underline text-lg font-normal"
          >
            {daoEnsName}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
