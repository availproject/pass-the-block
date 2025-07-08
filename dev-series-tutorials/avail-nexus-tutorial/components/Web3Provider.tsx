'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, baseSepolia, polygonAmoy, arbitrumSepolia, optimismSepolia } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

// Configure wagmi with ConnectKit - testnets only for development
const config = createConfig(
  getDefaultConfig({
    // Your dApp info
    appName: 'Nexus SDK Tutorial - Part 1',
    appDescription: 'Learning chain abstraction with unified balance viewing',
    appUrl: 'https://localhost:3000',
    appIcon: '/avail-logo.svg', // Add Avail logo to your public folder

    // WalletConnect Project ID (get from https://cloud.walletconnect.com)
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-wallet-connect-project-id',

    // Supported chains - testnets only for safe development
    chains: [
      sepolia,        // Ethereum testnet
      baseSepolia,    // Base testnet
      polygonAmoy,    // Polygon testnet
      arbitrumSepolia, // Arbitrum testnet
      optimismSepolia  // Optimism testnet
    ],
    transports: {
      [sepolia.id]: http(),
      [baseSepolia.id]: http(),
      [polygonAmoy.id]: http(),
      [arbitrumSepolia.id]: http(),
      [optimismSepolia.id]: http(),
    },
  })
);

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  // Create a client for TanStack Query (required by wagmi)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <ConnectKitProvider
          theme="auto"
          mode="light"
          customTheme={{
            "--ck-border-radius": "8px",
            "--ck-primary-button-background": "#2563eb",
            "--ck-primary-button-hover-background": "#1d4ed8",
          }}
          options={{
            enforceSupportedChains: false,
            walletConnectName: "Nexus Tutorial",
          }}
        >
          {children}
        </ConnectKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}