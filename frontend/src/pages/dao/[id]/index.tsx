import { useRouter } from "next/router";

export default function DaoPage() {
  const { query } = useRouter();
  const { id } = query;

  return <div>DAO {id}</div>;
}
