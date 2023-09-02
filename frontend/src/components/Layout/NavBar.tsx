import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
import { Wallet } from "./Wallet";

const lookupDomain = "domains.tzero";

export function NavBar() {
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

  return (
    <div className="justify-between flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                DAOs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/delegates" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Delegates
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex space-x-3">
        <div className="flex flex-col gap-4">
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
        </div>

        <Wallet
          address={addressResolver?.primaryDomain || publicKey}
          login={login}
          logout={logout}
        />
      </div>
    </div>
  );
}
