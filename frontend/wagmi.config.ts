import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { Abi } from "viem";
import DelegateFellowAbi from "./src/abi/DelegateFollow.json";

export default defineConfig({
  out: "src/lib/generated.ts",
  contracts: [
    {
      name: "DelegateFellow",
      abi: DelegateFellowAbi.abi as Abi,
    },
  ],
  plugins: [react()],
});
