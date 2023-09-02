import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { ChevronDownIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SupportedChainId } from "@azns/resolver-core";
import { useResolveAddressToDomain } from "@azns/resolver-react";
import {
  NightlyConnectAdapter,
  getPolkadotWallets,
  // @ts-ignore
} from "@nightlylabs/wallet-selector-polkadot";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAccount } from "wagmi";

export function Wallet() {
  const [adapter, setAdapter] = useState<NightlyConnectAdapter>();
  const [eager, setEager] = useState(false);
  const [chainId, setChainId] = useState<SupportedChainId>(
    SupportedChainId.AlephZeroTestnet
  );
  const [publicKey, setPublicKey] = useState<string>();
  const [api, setApi] = useState<ApiPromise>();
  const provider = new WsProvider("wss://ws.test.azero.dev/");
  const addressResolver = useResolveAddressToDomain(publicKey, {
    debug: process.env.NODE_ENV !== "production",
    chainId,
  });
  const { address } = useAccount();

  useEffect(() => {
    const adapter = NightlyConnectAdapter.buildLazy(
      {
        appMetadata: {
          name: "Dash DAO",
          description: "Next generation DAO analytics",
          icon: "https://docs.nightly.app/img/logo.png",
          additionalInfo: "Courtesy of Nightly Connect team",
        },
        network: "AlephZero",
      },
      true // should session be persisted
    );
    adapter.canEagerConnect().then((canEagerConnect: boolean) => {
      setEager(canEagerConnect);
    });
    setAdapter(adapter);

    ApiPromise.create({
      provider,
    }).then((api) => {
      setApi(api);
    });
  }, []);

  useEffect(() => {
    if (eager) {
      adapter?.connect().then(
        async () => {
          const accounts = await adapter?.accounts.get();
          console.log(accounts);
          setPublicKey(accounts[0].address);
          console.log("connect resolved successfully");
        },
        () => {
          console.log("connect rejected");
        }
      );
    }
  }, [eager]);

  async function login() {
    if (!publicKey) {
      console.log(getPolkadotWallets());
      await adapter?.connect();
      const accounts = await adapter?.accounts.get();
      console.log(accounts);
      setPublicKey(accounts[0].address);
      console.log("adapter", adapter);
    }
  }

  async function logout() {
    if (publicKey) {
      adapter?.disconnect();
      setPublicKey(undefined);
    }
  }

  const alephZeroAddress = addressResolver?.primaryDomain || publicKey;

  if (!alephZeroAddress && !address) {
    return (
      <>
        <Dialog>
          <DialogTrigger>
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
