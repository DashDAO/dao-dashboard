import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CacheKey } from "@/constants/cache";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useInfiniteQuery } from "wagmi";

export default function Home() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [CacheKey.DAOS, searchInput],
    queryFn: ({ pageParam }) =>
      fetch(`/api/daos?skip=${pageParam ?? 0}&search=${searchInput}`).then(
        (res) => res.json()
      ),
    getNextPageParam: (lastPage, pages) =>
      Math.min(
        pages
          .map((page) => page.data.ranking.items.length)
          .reduce((a, b) => a + b, 0),
        lastPage.data.ranking.metrics.total
      ),
  });

  const daos = data?.pages?.[page]?.data?.ranking?.items?.filter(
    (item: any) =>
      searchInput === "" ||
      item.name.toUpperCase().includes(searchInput.toUpperCase()) ||
      item.id.toUpperCase().includes(item.id.toUpperCase())
  );

  return (
    <>
      <Input
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          setPage(0);
        }}
        placeholder="Search for DAOs"
        className="w-[400px] mr-auto mb-8"
      />
      <div className="grid grid-cols-3 gap-4 w-full">
        {daos?.map((item: any) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/dao/${item.id}`} className="hover:underline">
                  {item.name}
                </Link>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"transparent"}
                        className="ml-2 px-3"
                        asChild
                      >
                        <Link
                          href={"https://snapshot.org/#/" + item.id}
                          target="_blank"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on Snapshot</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription>
                {item.website?.length && (
                  <Link
                    href={item.website}
                    target="_blank"
                    className="hover:underline"
                  >
                    {item.website}
                  </Link>
                )}
                {item.network && <p>Chain Id: {item.network}</p>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>No. of Proposals: {item.proposalsCount.toLocaleString()}</p>
              <p>Voting Power: {item.votesCount.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between pt-6 w-full">
        <Button
          onClick={() => setPage((page) => Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          disabled={!hasNextPage}
          onClick={() => {
            setPage((page) => {
              if (page + 1 >= (data?.pageParams?.length || 0)) {
                fetchNextPage();
              }
              return page + 1;
            });
          }}
        >
          Next
        </Button>
      </div>
    </>
  );
}
