import { Placeholder } from "@/components/Layout/Placeholder";
import { Button } from "@/components/ui/button";
import { CacheKey } from "@/constants/cache";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "wagmi";
import { UserCard } from "../../../components/DaoPage/UserCard";

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

  if (isLoading) {
    return (
      <Placeholder>
        <h1>Loading...</h1>
      </Placeholder>
    );
  }

  if (!data || !id) {
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
      <div className="grid grid-cols-3 w-full gap-4">
        {Object.keys(voters)
          .sort((a, b) => voters[b].participated - voters[a].participated)
          .slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE)
          .map((voter) => (
            <UserCard
              key={id.toString()}
              voter={voter}
              id={id.toString()}
              space={space}
              voters={voters}
              proposals={proposals}
            />
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
