'use client';

import { useState, useEffect } from 'react';
import { useNexus } from './NexusProvider';
import { Send, RefreshCw, ArrowRight, AlertCircle, Info, ChevronDown } from 'lucide-react';

export function TransferForm() {
  const { sdk, isInitialized, balances, refreshBalances } = useNexus();
  const [selectedToken, setSelectedToken] = useState('');
  const [targetChain, setTargetChain] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);

  // Chain mapping for testnet
  const chains = {
    11155111: { name: 'Sepolia', shortName: 'SEP', icon: '🔷' },
    84532: { name: 'Base Sepolia', shortName: 'BASE-SEP', icon: '🔵' },
    80002: { name: 'Polygon Amoy', shortName: 'AMOY', icon: '🟣' },
    421614: { name: 'Arbitrum Sepolia', shortName: 'ARB-SEP', icon: '🔵' },
    11155420: { name: 'Optimism Sepolia', shortName: 'OP-SEP', icon: '🔴' }
  };

  // Get available tokens with non-zero balances
  const availableTokens = balances.filter(token => 
    token.breakdown && token.breakdown.some((item: any) => parseFloat(item.balance) > 0)
  );

  const selectedTokenData = availableTokens.find(token => token.symbol === selectedToken);

  // Get total balance for selected token
  const totalBalance = selectedTokenData ? parseFloat(selectedTokenData.balance) : 0;

  // Get all possible target chains
  const availableTargetChains = Object.entries(chains);

  const canSubmit = selectedToken && 
    targetChain && 
    transferAmount && 
    recipient && 
    parseFloat(transferAmount) > 0 && 
    parseFloat(transferAmount) <= totalBalance &&
    /^0x[a-fA-F0-9]{40}$/.test(recipient);

  // Reset dependent fields when selections change
  useEffect(() => {
    if (selectedToken) {
      setTransferAmount('');
    }
  }, [selectedToken]);

  useEffect(() => {
    if (targetChain) {
      setTransferAmount('');
    }
  }, [targetChain]);

  // Simulate transfer transaction
  useEffect(() => {
    if (canSubmit && sdk) {
      simulateTransfer();
    } else {
      setSimulation(null);
    }
  }, [selectedToken, targetChain, transferAmount, recipient, canSubmit]);

  const simulateTransfer = async () => {
    if (!sdk || !canSubmit) return;
    
    try {
      setIsSimulating(true);
      
      const simulationResult = await sdk.simulateTransfer({
        token: selectedToken,
        amount: transferAmount,
        chainId: parseInt(targetChain),
        recipient: recipient
      });
      
      setSimulation(simulationResult);
    } catch (error) {
      console.error('Simulation failed:', error);
      setSimulation(null);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTransfer = async () => {
    if (!canSubmit || !sdk) return;
    
    try {
      setIsTransferring(true);
      setError(null);
      
      const result = await sdk.transfer({
        token: selectedToken,
        amount: transferAmount,
        chainId: parseInt(targetChain),
        recipient: recipient
      });
      
      console.log('Transfer transaction result:', result);
      
      // Reset form on success
      setSelectedToken('');
      setTargetChain('');
      setTransferAmount('');
      setRecipient('');
      setSimulation(null);
      
      // Refresh balances after a delay
      setTimeout(() => {
        refreshBalances();
      }, 3000);
      
    } catch (error) {
      console.error('Transfer failed:', error);
      setError(error instanceof Error ? error.message : 'Transfer transaction failed');
    } finally {
      setIsTransferring(false);
    }
  };

  const setMaxAmount = () => {
    if (selectedTokenData) {
      setTransferAmount(selectedTokenData.balance);
    }
  };

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  if (!isInitialized) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Connect your wallet to start transferring</p>
      </div>
    );
  }

  if (availableTokens.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
        <p className="text-slate-600 mb-2">No tokens available for transfer</p>
        <p className="text-sm text-slate-500">Make sure you have tokens on supported networks</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Transfer Assets</h2>
          <p className="text-slate-600">Send tokens to any address across chains</p>
        </div>
        <button
          onClick={refreshBalances}
          className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        {/* Token Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Token to Transfer
          </label>
          <div className="relative">
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choose a token...</option>
              {availableTokens.map((token, index) => (
                <option key={index} value={token.symbol}>
                  {token.symbol} - {token.balance} total across chains
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Target Chain Selection */}
        {selectedToken && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Transfer To (Destination Chain)
            </label>
            <div className="relative">
              <select
                value={targetChain}
                onChange={(e) => setTargetChain(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose destination chain...</option>
                {availableTargetChains.map(([chainId, chain]) => (
                  <option key={chainId} value={chainId}>
                    {chain.icon} {chain.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Recipient Address */}
        {selectedToken && targetChain && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                recipient && !isValidAddress(recipient) ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {recipient && !isValidAddress(recipient) && (
              <p className="text-red-500 text-sm mt-1">Invalid Ethereum address</p>
            )}
          </div>
        )}

        {/* Amount Input */}
        {selectedToken && targetChain && recipient && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">
                Amount to Transfer
              </label>
              {selectedTokenData && (
                <button
                  onClick={setMaxAmount}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Max: {parseFloat(selectedTokenData.balance).toFixed(4)} {selectedToken}
                </button>
              )}
            </div>
            <input
              type="number"
              step="any"
              placeholder="0.0"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Transfer Preview */}
        {selectedToken && targetChain && recipient && transferAmount && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-900">Transfer Summary</h4>
              <ArrowRight className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Amount:</span>
                <span className="font-medium">{transferAmount} {selectedToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">To:</span>
                <span className="font-medium">
                  {chains[parseInt(targetChain) as keyof typeof chains]?.icon} {chains[parseInt(targetChain) as keyof typeof chains]?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Recipient:</span>
                <span className="font-mono text-xs">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Simulation Results */}
        {isSimulating && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-yellow-800">Simulating transaction...</span>
            </div>
          </div>
        )}

        {simulation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">Transfer Ready</p>
                <p className="text-green-700 text-sm">
                  Transaction simulated successfully. Ready to send your tokens!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Transfer Failed</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleTransfer}
          disabled={!canSubmit || isTransferring || isSimulating}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
            ${canSubmit && !isTransferring && !isSimulating
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {isTransferring ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Transfer...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send Transfer</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}