import "@/styles/globals.css";

import { Layout } from "@/components/Layout/Layout";
import { ThemeProvider } from "@/components/Layout/ThemeProvider";
import { Web3Provider } from "@/components/Web3/Web3Provider";
import { chains } from "@/constants/chains";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { Toaster } from "@/components/ui/toaster";

const projectId = process.env.WALLET_CONNECT_PROJECT_ID!;

if (!projectId) {
  throw new Error(
    "No wallet connect project ID found, please check your environment variables"
  );
}

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Web3Provider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </Web3Provider>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <Toaster />
    </>
  );
}
