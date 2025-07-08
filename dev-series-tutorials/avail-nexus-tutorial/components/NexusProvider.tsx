'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount } from 'wagmi';

// Global window extension for wallet provider
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface NexusContextType {
  sdk: any; // Replace with actual SDK type when available
  isInitialized: boolean;
  balances: any[];
  isLoading: boolean;
  error: string | null;
  refreshBalances: () => Promise<void>;
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

  // Fetch balances after SDK is initialized
  useEffect(() => {
    if (isInitialized && sdk) {
      fetchBalances(sdk);
    }
  }, [isInitialized, sdk]);

  const initializeSDK = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Dynamic import to ensure client-side only loading
      const { NexusSDK } = await import('avail-nexus-sdk');
      const nexusSDK = new NexusSDK({ network: 'testnet' });
      
      // Initialize with the wallet provider
      await nexusSDK.initialize(window.ethereum);
      
      // Set up allowance hook for token approvals
      nexusSDK.setOnAllowanceHook(async ({ allow, sources }: { allow: (allowances: string[]) => void; sources: any[] }) => {
        console.log('Allowance required for sources:', sources);
        
        // For Part 1, we'll auto-approve with minimum allowances
        // In Part 2, we'll build proper approval modals
        const allowances = sources.map(() => 'min');
        allow(allowances);
      });
      
      // Set up intent hook for transaction previews
      nexusSDK.setOnIntentHook(({ intent, allow }: { intent: any; allow: () => void }) => {
        console.log('Transaction intent:', intent);
        
        // For Part 1, we'll auto-approve
        // In Part 3, we'll build transaction preview modals
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
        refreshBalances 
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