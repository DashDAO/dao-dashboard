import { CONTRACT_ADDRESS } from "@/constants/address";
import { CacheKey } from "@/constants/cache";
import { chains } from "@/constants/chains";
import { Log, PublicClient } from "viem";
import { Address, usePublicClient, useQuery } from "wagmi";

export function useLogs(address?: Address) {
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
          fromBlock: BigInt(9600000),
          toBlock: BigInt(9650000),
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
