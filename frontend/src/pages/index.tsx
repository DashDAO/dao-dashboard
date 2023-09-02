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
import { useRef, useState } from "react";
import { useQuery } from "wagmi";

const ENTRIES_PER_PAGE = 12;

export default function Home() {
  const { data } = useQuery([CacheKey.DAOS], () =>
    fetch("/api/daos").then((res) => res.json())
  );
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const daos = data?.data?.ranking?.items;
  return (
    <>
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for DAOs"
        className="w-[400px] mr-auto mb-8"
      />
      <div className="grid grid-cols-3 gap-4 w-full">
        {daos
          ?.filter(
            (item: any) =>
              searchInput === "" ||
              item.name.toUpperCase().includes(searchInput.toUpperCase()) ||
              item.id.toUpperCase().includes(searchInput.toUpperCase())
          )
          .slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE)
          .map((item: any) => (
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
          disabled={page === Math.floor(daos?.length / ENTRIES_PER_PAGE)}
          onClick={() =>
            setPage((page) =>
              Math.min(page + 1, Math.floor(daos?.length / ENTRIES_PER_PAGE))
            )
          }
        >
          Next
        </Button>
      </div>
    </>
  );
}
