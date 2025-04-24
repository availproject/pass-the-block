'use client';

import { ConnectKitButton as ConnectKitButtonOriginal } from 'connectkit';
import { useAccount } from 'wagmi';
import { Button } from '@nextui-org/react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const ConnectKitButton = () => {
  const { isConnected, isConnecting } = useAccount();
  const [isError, setIsError] = useState(false);

  const handleClick = useCallback((showFn: (() => void) | undefined) => {
    try {
      if (showFn) {
        showFn();
      }
      setIsError(false);
    } catch (error) {
      setIsError(false);
    }
  }, []);

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
            onPress={() => handleClick(show)}
            isLoading={isConnecting || isError}
          >
            {isConnecting
              ? 'Connecting...'
              : isError
              ? 'Connecting...' // Changed from "Retrying..." to be more subtle
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