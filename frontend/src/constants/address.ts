import { Address } from "viem";
import { celoAlfajores, goerli, mantleTestnet } from "wagmi/chains";

export const CONTRACT_ADDRESS: Record<number, Address> = {
  [celoAlfajores.id]: "0x31933694Ee18C19E69434134642A18C0644905fd",
  [mantleTestnet.id]: "0x31933694Ee18C19E69434134642A18C0644905fd",
  [goerli.id]: "0xa406d3552F2D5a97e8995c645B1Be251eAdBd4FF",
};
