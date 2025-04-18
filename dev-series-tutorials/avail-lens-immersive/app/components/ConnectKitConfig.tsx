'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { chains } from '@lens-chain/sdk/viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

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

// Global WalletConnect error suppression
// This needs to run before any WalletConnect code is executed
if (typeof window !== 'undefined') {
  // Override the console.error to filter out WalletConnect errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Filter out WalletConnect errors
    const errorString = args.join(' ');
    if (
      errorString.includes('WalletConnect') ||
      errorString.includes('Connection interrupted') ||
      errorString.includes('@walletconnect') ||
      errorString.includes('jsonrpc-provider') ||
      errorString.includes('jsonrpc-ws-connection')
    ) {
      // Just return without logging the error
      return;
    }
    
    // Pass other errors to the original console.error
    originalConsoleError.apply(console, args);
  };
  
  // Handle global unhandled errors
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || '';
    const errorStack = event.error?.stack || '';
    
    if (
      errorMessage.includes('WalletConnect') ||
      errorMessage.includes('Connection interrupted') ||
      errorStack.includes('@walletconnect') ||
      errorStack.includes('jsonrpc-provider') ||
      errorStack.includes('jsonrpc-ws-connection')
    ) {
      // Prevent the error from showing in the UI
      event.preventDefault();
    }
  }, true);

  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = event.reason?.message || '';
    const errorStack = event.reason?.stack || '';
    
    if (
      errorMessage.includes('WalletConnect') ||
      errorMessage.includes('Connection interrupted') ||
      errorStack.includes('@walletconnect') ||
      errorStack.includes('jsonrpc-provider') ||
      errorStack.includes('jsonrpc-ws-connection')
    ) {
      // Prevent the error from showing in the UI
      event.preventDefault();
    }
  }, true);
}

// Error handling wrapper for wallet connection errors
function ErrorHandler({ children }: { children: ReactNode }) {
  useEffect(() => {
    // This will catch errors specifically in the React components
    const handleError = (event: ErrorEvent) => {
      // Check if the error is from WalletConnect
      if (
        event.error?.message?.includes('WalletConnect') ||
        event.error?.message?.includes('Connection interrupted') ||
        event.error?.stack?.includes('@walletconnect') ||
        event.error?.stack?.includes('jsonrpc-provider') ||
        event.error?.stack?.includes('jsonrpc-ws-connection')
      ) {
        // Prevent the error from showing in the console
        event.preventDefault();
        
        // If you want to show a toast sometimes, but for now we'll keep it silent
        // toast.error("Wallet connection error. Please try again.", { id: "wallet-connect-error" });
      }
    };

    window.addEventListener('error', handleError, true);
    
    return () => {
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return <>{children}</>;
}

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
          <ErrorHandler>
            {children}
          </ErrorHandler>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 