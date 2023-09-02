import { Placeholder } from "@/components/Layout/Placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CacheKey } from "@/constants/cache";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
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

export default function DaoPage() {
  const { query } = useRouter();
  const { id } = query;
  const { data, isLoading } = useQuery(
    [CacheKey.PROPOSALS, id],
    () => {
      return fetch(`/api/proposals?space=${id}`).then((res) => res.json());
    },
    { enabled: id !== undefined }
  );

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

  const { space } = data?.data;

  return (
    <div>
      <div className="pb-6">
        <h1 className="text-3xl font-bold">{space?.name}</h1>
        <p className="text-muted-foreground">{space?.id}</p>
      </div>
      <div className="grid grid-cols-3 w-full gap-4">
        {users.map((user) => (
          <Card key={user.name} className="p-2">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/dao/${id}/voter/${user.name}`}
                    className="hover:underline"
                  >
                    {user.name}
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
                    {percentageFormatter.format(user.participationRate)}
                  </p>
                </div>
                <div>
                  <div className="text-muted-foreground">Wins/Losses</div>
                  <p className="text-lg">
                    {user.wins} / {user.losses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
