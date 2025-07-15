'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount } from 'wagmi';

// Global window extension for wallet provider
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface TransferParams {
  token: string;
  amount: string;
  chainId: number;
  recipient: string;
}

interface NexusContextType {
  sdk: any; // Replace with actual SDK type when available
  isInitialized: boolean;
  balances: any[];
  isLoading: boolean;
  error: string | null;
  refreshBalances: () => Promise<void>;
  transfer: (params: TransferParams) => Promise<any>;
  simulateTransfer: (params: TransferParams) => Promise<any>;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

interface NexusProviderProps {
  children: ReactNode;
}

export function NexusProvider({ children }: NexusProviderProps) {
  const { isConnected, address } = useAccount();
  const [sdk, setSdk] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [balances, setBalances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize SDK when wallet connects
  useEffect(() => {
    if (isConnected && window.ethereum && !isInitialized && !isLoading) {
      initializeSDK();
    }
  }, [isConnected, isInitialized, isLoading]);

  const initializeSDK = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Dynamic import with updated package name
      const { NexusSDK } = await import('@avail-project/nexus');
      const nexusSDK = new NexusSDK({ network: 'testnet' });
      
      // Initialize with the wallet provider
      await nexusSDK.initialize(window.ethereum);
      
      // Set up allowance hook for token approvals
      nexusSDK.setOnAllowanceHook(async ({ allow, deny, sources }) => {
        console.log('Allowance required for sources:', sources);
        
        // For tutorial, we'll auto-approve with minimum allowances
        // In production, show proper approval modals
        const allowances = sources.map(() => 'min');
        allow(allowances);
      });
      
      // Set up intent hook for transaction previews
      nexusSDK.setOnIntentHook(({ intent, allow, deny, refresh }) => {
        console.log('Transaction intent:', intent);
        
        // For tutorial, we'll auto-approve
        // In production, show transaction preview modals
        allow();
      });
      
      setSdk(nexusSDK);
      setIsInitialized(true);
      
      // Fetch initial balances
      await fetchBalances(nexusSDK);
      
    } catch (error) {
      console.error('Failed to initialize Nexus SDK:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize SDK');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalances = async (sdkInstance = sdk) => {
    if (!sdkInstance || !isInitialized) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const unifiedBalances = await sdkInstance.getUnifiedBalances();
      setBalances(unifiedBalances);
      console.log('Unified balances fetched:', unifiedBalances);
      
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch balances');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalances = async () => {
    await fetchBalances();
  };

  // Transfer function for Part 2
  const transfer = async (params: TransferParams) => {
    if (!sdk) {
      throw new Error('SDK not initialized');
    }
    
    try {
      console.log('Starting transfer transaction:', params);
      
      const result = await sdk.transfer(params);
      console.log('Transfer transaction result:', result);
      
      // Save transaction to history
      const transaction = {
        id: Date.now().toString(),
        type: 'transfer' as const,
        token: params.token,
        amount: params.amount,
        toChain: params.chainId,
        recipient: params.recipient,
        status: 'pending' as const,
        timestamp: new Date(),
        hash: result.hash || result.transactionHash || undefined
      };
      
      // Store in localStorage
      const existingHistory = localStorage.getItem('nexus-transfer-transactions');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(transaction);
      
      // Keep only last 50 transactions
      const trimmedHistory = history.slice(0, 50);
      localStorage.setItem('nexus-transfer-transactions', JSON.stringify(trimmedHistory));
      
      // Refresh balances after successful transfer
      setTimeout(() => {
        refreshBalances();
      }, 5000);
      
      return result;
    } catch (error) {
      console.error('Transfer transaction failed:', error);
      throw error;
    }
  };

  // Simulate transfer transaction for Part 2
  const simulateTransfer = async (params: TransferParams) => {
    if (!sdk) {
      throw new Error('SDK not initialized');
    }
    
    try {
      console.log('Simulating transfer transaction:', params);
      
      const simulation = await sdk.simulateTransfer(params);
      console.log('Transfer simulation result:', simulation);
      
      return simulation;
    } catch (error) {
      console.error('Transfer simulation failed:', error);
      throw error;
    }
  };

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setSdk(null);
      setIsInitialized(false);
      setBalances([]);
      setError(null);
    }
  }, [isConnected]);

  return (
    <NexusContext.Provider 
      value={{ 
        sdk, 
        isInitialized, 
        balances, 
        isLoading, 
        error,
        refreshBalances,
        transfer,
        simulateTransfer
      }}
    >
      {children}
    </NexusContext.Provider>
  );
}

export function useNexus() {
  const context = useContext(NexusContext);
  if (context === undefined) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
}