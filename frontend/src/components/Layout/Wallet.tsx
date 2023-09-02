import { SupportedChainId } from "@azns/resolver-core";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { ChevronDownIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { useWeb3 } from "../Web3/Web3Provider";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function Wallet() {
  const { alephZeroAddress, chainId, setChainId, login, logout } = useWeb3();
  const { address } = useAccount();

  if (!alephZeroAddress && !address) {
    return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Connect</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login to Aleph Zero / EVM chains</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={login} className="rounded-lg">
                Aleph Zero Login
              </Button>
              <Web3Button label="EVM Login" />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (alephZeroAddress) {
    return (
      <>
        <Select
          value={chainId}
          onValueChange={(e) => setChainId(e as SupportedChainId)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SupportedChainId.AlephZeroTestnet}>
              Aleph Zero Testnet
            </SelectItem>
            <SelectItem value={SupportedChainId.AlephZero}>
              Aleph Zero
            </SelectItem>
            <SelectItem value={SupportedChainId.Development}>
              Local Development
            </SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              {`${(address || alephZeroAddress)!.slice(0, 10)}...`}
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{address || alephZeroAddress}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }

  return (
    <>
      <Web3NetworkSwitch />
      <Web3Button />
    </>
  );
}
