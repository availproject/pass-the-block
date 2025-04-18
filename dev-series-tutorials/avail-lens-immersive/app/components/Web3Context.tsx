'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { fetchAccountByAddress } from '../utils/lens-client';
import { generateChallenge, verifySignature } from '../utils/lens';

// Define the Lens account type
interface LensAccount {
  id: string;
  handle?: {
    fullHandle: string;
    localName: string;
  } | null;
  profile?: {
    id: string;
    handle?: {
      fullHandle: string;
      localName: string;
    } | null;
  } | null;
}

// Create Web3 context
interface Web3ContextType {
  address: string | null;
  connecting: boolean;
  connected: boolean;
  disconnectWallet: () => void;
  signMessage: (message: string) => Promise<string | null>;
  authenticateWithLens: () => Promise<boolean>;
  isLensAuthenticated: boolean;
  lensAccount: LensAccount | null;
  fetchLensAccount: () => Promise<void>;
  fetchingLensAccount: boolean;
  walletClient: any;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  connecting: false,
  connected: false,
  disconnectWallet: () => {},
  signMessage: async () => null,
  authenticateWithLens: async () => false,
  isLensAuthenticated: false,
  lensAccount: null,
  fetchLensAccount: async () => {},
  fetchingLensAccount: false,
  walletClient: null,
});

export function useWeb3() {
  return useContext(Web3Context);
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const { address, isConnected, isConnecting, status } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  
  const [isLensAuthenticated, setIsLensAuthenticated] = useState(false);
  const [lensAccount, setLensAccount] = useState<LensAccount | null>(null);
  const [fetchingLensAccount, setFetchingLensAccount] = useState(false);
  const [walletClient, setWalletClient] = useState<any>(null);

  // Fetch Lens account for the connected wallet
  const fetchLensAccount = async (walletAddress?: string) => {
    const addressToUse = walletAddress || address;
    if (!addressToUse) return;
    
    try {
      setFetchingLensAccount(true);
      console.log(`Fetching Lens account for address: ${addressToUse}`);
      
      const account = await fetchAccountByAddress(addressToUse);
      
      if (account) {
        console.log("Found Lens account:", account);
        setLensAccount(account);
      } else {
        console.log("No Lens account found for this address");
        setLensAccount(null);
      }
    } catch (error) {
      console.error("Error fetching Lens account:", error);
      setLensAccount(null);
    } finally {
      setFetchingLensAccount(false);
    }
  };

  // Sign message function
  const signMessage = async (message: string): Promise<string | null> => {
    if (!address || !isConnected) {
      console.error('Wallet not connected');
      return null;
    }

    try {
      const signature = await signMessageAsync({ message });
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  };

  // Authenticate with Lens
  const authenticateWithLens = async (): Promise<boolean> => {
    if (!address || !isConnected) {
      return false;
    }

    try {
      // Generate authentication challenge
      const challenge = await generateChallenge(address);
      
      // Request signature from user
      const signature = await signMessage(challenge);
      
      if (!signature) {
        return false;
      }
      
      // Verify signature with Lens
      const isValid = await verifySignature(address, signature, challenge);
      
      setIsLensAuthenticated(isValid);
      return isValid;
    } catch (error) {
      console.error('Error authenticating with Lens:', error);
      return false;
    }
  };

  // Watch for account changes
  useEffect(() => {
    if (isConnected && address) {
      fetchLensAccount(address);
    } else if (!isConnected) {
      setLensAccount(null);
      setIsLensAuthenticated(false);
    }
  }, [isConnected, address]);

  return (
    <Web3Context.Provider 
      value={{ 
        address: address || null, 
        connecting: isConnecting, 
        connected: isConnected, 
        disconnectWallet: disconnect,
        signMessage,
        authenticateWithLens,
        isLensAuthenticated,
        lensAccount,
        fetchLensAccount: () => fetchLensAccount(),
        fetchingLensAccount,
        walletClient,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
} 