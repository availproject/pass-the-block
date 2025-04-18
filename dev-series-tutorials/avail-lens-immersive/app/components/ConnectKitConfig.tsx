'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { chains } from '@lens-chain/sdk/viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { ReactNode } from 'react';

// Create a client for React Query
const queryClient = new QueryClient();

// Define the wagmi config with ConnectKit
const config = createConfig(
  getDefaultConfig({
    appName: 'Avail Lens Visualizer',
    chains: [chains.mainnet, chains.testnet],
    transports: {
      [chains.mainnet.id]: http(chains.mainnet.rpcUrls.default.http[0]!),
      [chains.testnet.id]: http(chains.testnet.rpcUrls.default.http[0]!),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appDescription: "Lens Visualization Tool by Avail Project",
    appUrl: "https://lenscollective.me",
    appIcon: "https://lenscollective.me/favicon.ico",
  })
);

// ConnectKit Provider wrapper component
export function ConnectKitConfig({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            // Theme to match the site's aesthetic
            "--ck-font-family": "inherit",
            "--ck-border-radius": "12px",
            "--ck-overlay-background": "rgba(0, 0, 0, 0.6)",
            "--ck-body-background": "#121212",
            "--ck-body-color": "#ffffff",
            "--ck-primary-button-background": "linear-gradient(to right, #44D5DE, #EDC7FC)",
            "--ck-primary-button-color": "#000000",
            "--ck-secondary-button-background": "#1F1F1F",
            "--ck-secondary-button-color": "#ffffff",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 