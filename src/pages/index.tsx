import { CacheKey } from "@/constants/cache";
import { useQuery } from "wagmi";

export default function Home() {
  const { data } = useQuery([CacheKey.DAOS], () =>
    fetch("/api/dao").then((res) => res.json())
  );

  return <pre className="whitespace-pre-wrap">{JSON.stringify({ data })}</pre>;
}
