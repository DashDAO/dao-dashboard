import { FollowNotifications } from "@/components/FollowPage/FollowNotifications";
import { Placeholder } from "@/components/Layout/Placeholder";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Log } from "viem";
import { useAccount } from "wagmi";
import { FollowCard } from "../../components/FollowPage/FollowCard";
import { useLogs } from "../../hooks/useLogs";

export function transformData(data: Record<number, Log[]>) {
  return Object.entries(data).flatMap(([chainId, logs]) => {
    return logs.map((log) => ({ ...log, chainId: +chainId }));
  });
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
      <h1 className="text-4xl font-bold pb-6">Follows</h1>
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
      <h2 className="text-4xl font-bold pb-6 pt-12">Notifications</h2>
      <FollowNotifications />
    </div>
  );
}
