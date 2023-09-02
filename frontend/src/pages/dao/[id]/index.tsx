import { useRouter } from "next/router";
import { CacheKey } from "@/constants/cache";
import Link from "next/link";
import { useQuery } from "wagmi";

export default function DaoPage() {
  const { query } = useRouter();
  const { id } = query;
  const { data } = useQuery([CacheKey.PROPOSALS], () =>
    fetch("/api/proposals").then((res) => res.json())
  );

  if (!data) {
    return <p>Loading...</p>;
  }

  const proposals = data?.data?.proposals;

  return (
    <div>
      <p>DAOs ID {id}</p>
      <h1>Proposals</h1>
      <div>

      {proposals?.slice(0, 3).map((proposal:any) => {
        console.log({proposal})
        return (
          <div key={proposal.id}>
            <h2>{proposal.title}</h2>
            <p>{proposal.body}</p>
            <p>Author: {proposal.author}</p>
          </div>
        );
      })}
      </div>
    </div>
  );
}
