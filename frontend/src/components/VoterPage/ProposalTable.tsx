import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "../ui/data-table";

export type ProposalData = {
  proposal: string;
  state: string;
  date: string;
  vp: number;
  voted: string;
  result: string;
};

export const columns: ColumnDef<ProposalData>[] = [
  {
    accessorKey: "proposal",
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Proposal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.getValue<number>("date") * 1000).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "vp",
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Voting Power
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "voted",
    header: "Voted",
  },
  {
    accessorKey: "state",
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          State
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "result",
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Result
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

export function ProposalTable({ data }: { data: ProposalData[] }) {
  return <DataTable columns={columns} data={data} />;
}
