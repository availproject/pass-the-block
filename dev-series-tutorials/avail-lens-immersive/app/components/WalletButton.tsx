'use client';
import { Button, Tooltip } from '@nextui-org/react';
import { useWeb3 } from './Providers';
import { useState } from 'react';

const WalletButton = () => {
  const { address, connecting, connected, connectWallet, disconnectWallet, lensAccount } = useWeb3();
  const [showTooltip, setShowTooltip] = useState(false);

  // Format address for display (e.g., 0x1234...5678)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleClick = async () => {
    if (connected) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  return (
    <Button
    className={`text-sm font-medium px-4 h-10 min-w-[120px] ${
        connected 
        ? 'bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC] text-black' 
        : 'bg-gray-800 text-white border-gray-700'
    }`}
    radius="full"
    variant={connected ? "flat" : "bordered"}
    onClick={handleClick}
    isLoading={connecting}
    onMouseEnter={() => connected && setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
    >
    {connecting 
        ? 'Connecting...' 
        : connected 
        ? formatAddress(address!) 
        : 'Connect Wallet'}
    </Button>
  );
};

export default WalletButton; 