'use client';

import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';

export function WalletConnection() {
  const { isConnected } = useAccount();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName, chain }) => {
        return (
          <button
            onClick={show}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${isConnected 
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isConnected ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            <span>
              {isConnected ? (ensName ?? truncatedAddress) : 'Connect Wallet'}
            </span>
            {chain && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded">
                {chain.name}
              </span>
            )}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

// Alternative: Simple default ConnectKit button for minimal setup
export function SimpleWalletConnection() {
  return <ConnectKitButton />;
}