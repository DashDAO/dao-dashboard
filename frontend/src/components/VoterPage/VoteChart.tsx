import { useMemo } from "react";
import { Chart } from "react-charts";

interface VoteDatum {
  vp: number;
  created: number;
}
export function VoteChart({ votes }: { votes: VoteDatum[] }) {
  const primaryAxis = useMemo(
    () => ({
      getValue: (datum: any) => new Date(datum.created * 1000).toDateString(),
    }),
    []
  );

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum: any) => datum.vp,
      },
    ],
    []
  );

  return (
    <Chart
      options={{
        data: [{ label: "Votes used over time", data: votes }],
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
}
