import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
} from "react";
import { SupportedChainId } from "@azns/resolver-core";
import { useResolveAddressToDomain } from "@azns/resolver-react";
import {
  NightlyConnectAdapter,
  getPolkadotWallets,
  // @ts-ignore
} from "@nightlylabs/wallet-selector-polkadot";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface Web3ContextType {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  alephZeroAddress?: string;
  isLoggedIn: boolean;
  chainId: SupportedChainId;
  setChainId: Dispatch<SetStateAction<SupportedChainId>>;
}

const Web3Context = createContext<Web3ContextType>({
  login: async () => {},
  logout: async () => {},
  isLoggedIn: false,
  chainId: SupportedChainId.AlephZeroTestnet,
  setChainId: () => {},
});

export function Web3Provider({ children }: { children?: ReactNode }) {
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
  const { isConnected } = useAccount();

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

  return (
    <Web3Context.Provider
      value={{
        login,
        logout,
        alephZeroAddress,
        isLoggedIn: Boolean(alephZeroAddress) || isConnected,
        chainId,
        setChainId,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
