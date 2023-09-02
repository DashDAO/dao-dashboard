import { Placeholder } from "@/components/Layout/Placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CacheKey } from "@/constants/cache";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "wagmi";

const users = [
  {
    name: "asdasd.eth",
    tokens: 123123123123123,
    weight: 0.49,
    participationRate: 0.23,
    wins: 20,
    losses: 3,
  },
  {
    name: "sasad",
    tokens: 123123123123123,
    weight: 0.49,
    participationRate: 0.23,
    wins: 20,
    losses: 3,
  },
  {
    name: "asd",
    tokens: 123123123123123,
    weight: 0.49,
    participationRate: 0.23,
    wins: 20,
    losses: 3,
  },
  {
    name: "asdasdsdadasd.eth",
    tokens: 123123123123123,
    weight: 0.49,
    participationRate: 0.23,
    wins: 20,
    losses: 3,
  },
  {
    name: "sdadasdsad.eth",
    tokens: 123123123123123,
    weight: 0.49,
    participationRate: 0.23,
    wins: 20,
    losses: 3,
  },
];

const formatter = Intl.NumberFormat("en-US", {
  notation: "compact",
  // minimumIntegerDigits: 3,
  minimumFractionDigits: 2,
});
const percentageFormatter = Intl.NumberFormat("en-US", {
  style: "percent",
});

const ENTRIES_PER_PAGE = 12;

export default function DaoPage() {
  const { query } = useRouter();
  const { id } = query;
  const { data, isLoading } = useQuery(
    [CacheKey.VOTERS, id],
    () => {
      return fetch(`/api/voters?space=${id}`).then((res) => res.json());
    },
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

  if (!data) {
    return (
      <Placeholder>
        <h1>No data found</h1>
      </Placeholder>
    );
  }

  const { space, voters, proposals } = data;

  console.log({ page });
  return (
    <div>
      <div className="pb-6">
        <h1 className="text-3xl font-bold">{space?.name}</h1>
        <p className="text-muted-foreground">{space?.id}</p>
      </div>
      <div className="grid grid-cols-3 w-full gap-4">
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
                    <Button variant={"ghost"}>
                      Follow <PlusIcon className="w-4 h-4" />
                    </Button>
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
