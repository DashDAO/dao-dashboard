export const SNAPSHOT_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://hub.snapshot.org/graphql"
    : "https://testnet.snapshot.org/graphql";
