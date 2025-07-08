import { useState } from 'react';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { bridgeTokens, initializeNexusSDK } from '../lib/nexus';
import { useWeb3 } from './Providers';
import ConnectKitButton from './ConnectKitButton';

interface BridgeTokensProps {
  onSuccess?: () => void;
}

// Supported types (should match lib/nexus)
type SUPPORTED_TOKENS = 'ETH' | 'USDC' | 'USDT';
type SUPPORTED_CHAINS_IDS = 1 | 10 | 8453 | 42161 | 137 | 43114 | 59144 | 534351 | 11155111 | 84532 | 421614 | 11155420 | 80002 | 43113 | 59141 | 534352;

export default function BridgeTokens({ onSuccess }: BridgeTokensProps) {
  const [token, setToken] = useState<SUPPORTED_TOKENS>('ETH');
  const [amount, setAmount] = useState('');
  const [targetChain, setTargetChain] = useState<SUPPORTED_CHAINS_IDS>(1);
  const [isLoading, setIsLoading] = useState(false);
  const { walletClient, connected } = useWeb3();

  const supportedTokens = [
    { value: 'ETH' as SUPPORTED_TOKENS, label: 'Ethereum' },
    { value: 'USDC' as SUPPORTED_TOKENS, label: 'USD Coin' },
    { value: 'USDT' as SUPPORTED_TOKENS, label: 'Tether USD' },
  ];

  const supportedChains = [
    { value: 1 as SUPPORTED_CHAINS_IDS, label: 'Ethereum Mainnet' },
    { value: 137 as SUPPORTED_CHAINS_IDS, label: 'Polygon' },
    { value: 42161 as SUPPORTED_CHAINS_IDS, label: 'Arbitrum' },
    { value: 10 as SUPPORTED_CHAINS_IDS, label: 'Optimism' },
    { value: 43114 as SUPPORTED_CHAINS_IDS, label: 'Avalanche' },
    { value: 8453 as SUPPORTED_CHAINS_IDS, label: 'Base' },
    { value: 59144 as SUPPORTED_CHAINS_IDS, label: 'Linea' },
    { value: 534351 as SUPPORTED_CHAINS_IDS, label: 'Scroll' },
  ];

  const handleBridge = async () => {
    if (!token || !amount || !targetChain) {
      alert('Please fill in all fields');
      return;
    }
    if (!connected || !walletClient) {
      alert('Please connect your wallet.');
      return;
    }
    try {
      setIsLoading(true);
      await initializeNexusSDK(walletClient);
      await bridgeTokens({
        token,
        amount,
        chainId: targetChain,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Bridge failed:', error);
      alert('Bridge operation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Bridge Tokens</h3>
      {!connected && <ConnectKitButton />}
      <div className="space-y-4">
        <Select
          label="Select Token"
          placeholder="Choose a token"
          selectedKeys={[token]}
          onChange={(e) => setToken(e.target.value as SUPPORTED_TOKENS)}
        >
          {supportedTokens.map((token) => (
            <SelectItem key={token.value} value={token.value} className="text-gray-200">
              {token.label}
            </SelectItem>
          ))}
        </Select>

        <Input
          type="number"
          label="Amount"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Select
          label="Target Chain"
          placeholder="Choose target chain"
          selectedKeys={[targetChain.toString()]}
          onChange={(e) => setTargetChain(Number(e.target.value) as SUPPORTED_CHAINS_IDS)}
        >
          {supportedChains.map((chain) => (
            <SelectItem key={chain.value} value={chain.value} className="text-gray-200">
              {chain.label}
            </SelectItem>
          ))}
        </Select>

        <Button
          color="primary"
          onClick={handleBridge}
          isLoading={isLoading}
          className="w-full"
          isDisabled={!connected}
        >
          Bridge Tokens
        </Button>
      </div>
    </div>
  );
} 