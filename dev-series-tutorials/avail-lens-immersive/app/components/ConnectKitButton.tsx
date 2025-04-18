'use client';

import { ConnectKitButton as ConnectKitButtonOriginal } from 'connectkit';
import { useAccount } from 'wagmi';
import { Button } from '@nextui-org/react';

const ConnectKitButton = () => {
  const { isConnected, isConnecting } = useAccount();

  return (
    <ConnectKitButtonOriginal.Custom>
      {({ isConnected, isConnecting, show, ensName, truncatedAddress }) => {
        return (
          <Button
            className={`text-sm font-medium px-4 h-10 min-w-[120px] ${
              isConnected
                ? 'bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC] text-black'
                : 'bg-gray-800 text-white border-gray-700'
            }`}
            radius="full"
            variant={isConnected ? "flat" : "bordered"}
            onClick={show}
            isLoading={isConnecting}
          >
            {isConnecting
              ? 'Connecting...'
              : isConnected
              ? ensName || truncatedAddress
              : 'Connect Wallet'}
          </Button>
        );
      }}
    </ConnectKitButtonOriginal.Custom>
  );
};

export default ConnectKitButton; 