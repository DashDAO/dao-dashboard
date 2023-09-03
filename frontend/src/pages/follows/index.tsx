import { Placeholder } from "@/components/Layout/Placeholder";
import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESS } from "@/constants/address";
import { CacheKey } from "@/constants/cache";
import { chains } from "@/constants/chains";
import { percentageFormatter } from "@/lib/percentageFormatter";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Log, PublicClient } from "viem";
import {
  Address,
  useAccount,
  useContractReads,
  useEnsAddress,
  usePublicClient,
  useQuery,
} from "wagmi";
import { FollowCard } from "../../components/FollowPage/FollowCard";

function useLogs(address?: Address) {
  const publicClients: { publicClient: PublicClient; chainId: number }[] =
    chains
      .filter((chain) => CONTRACT_ADDRESS[chain.id] !== undefined)
      .map((chain) => ({
        // eslint-disable-next-line react-hooks/rules-of-hooks
        publicClient: usePublicClient({
          chainId: chain.id,
        }),
        chainId: chain.id,
      }));

  return useQuery(
    [CacheKey.FOLLOWS, address],
    async () => {
      const logs: Record<number, Log[]> = {};
      for await (const client of publicClients) {
        logs[client.chainId] = await client.publicClient.getLogs({
          address: CONTRACT_ADDRESS[client.chainId],
          fromBlock: BigInt(900000),
          toBlock: BigInt(9999999),
          event: {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "follower",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "delegate",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "daoAddress",
                type: "address",
              },
            ],
            name: "Followed",
            type: "event",
          },
          // @ts-ignore
          args: {
            follower: address!,
          },
        });
      }
      return logs;
    },
    { enabled: address !== undefined }
  );
}

function transformData(data: Record<number, Log[]>): Log[] {
  const logArrays = Object.values(data);

  const logs: Log[] = logArrays.reduce((accumulator, currentArray) => {
    return accumulator.concat(currentArray);
  }, []);

  return logs;
}

const ENTRIES_PER_PAGE = 12;

export default function FollowsPage() {
  const { address } = useAccount();
  const { isLoading, data } = useLogs(address);
  const [page, setPage] = useState(0);

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

  const delegates = transformData(data);

  return (
    <div>
      <div className="grid grid-cols-3 w-full gap-4">
        {delegates
          .slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE)
          .map((delegate) => (
            <FollowCard key={delegate.transactionHash} delegate={delegate} />
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
            page ===
            Math.floor(Object.keys(delegates).length / ENTRIES_PER_PAGE)
          }
          onClick={() =>
            setPage((page) =>
              Math.min(
                page + 1,
                Math.floor(Object.keys(delegates).length / ENTRIES_PER_PAGE)
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
