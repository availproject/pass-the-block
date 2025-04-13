'use client';
import "../globals.css";
import { NextUIProvider } from '@nextui-org/react'
import { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { generateChallenge, verifySignature } from '../utils/lens';
import { fetchAccountByAddress } from '../utils/lens-client';

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
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signMessage: (message: string) => Promise<string | null>;
  authenticateWithLens: () => Promise<boolean>;
  isLensAuthenticated: boolean;
  lensAccount: LensAccount | null;
  fetchLensAccount: () => Promise<void>;
  fetchingLensAccount: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  connecting: false,
  connected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  signMessage: async () => null,
  authenticateWithLens: async () => false,
  isLensAuthenticated: false,
  lensAccount: null,
  fetchLensAccount: async () => {},
  fetchingLensAccount: false,
});

export function useWeb3() {
  return useContext(Web3Context);
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isLensAuthenticated, setIsLensAuthenticated] = useState(false);
  const [lensAccount, setLensAccount] = useState<LensAccount | null>(null);
  const [fetchingLensAccount, setFetchingLensAccount] = useState(false);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setConnecting(true);
      
      // Check if window.ethereum exists
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setConnected(true);
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('disconnect', handleDisconnect);
          console.log('🔍 Connected to wallet:', accounts[0]);
          // Try to fetch Lens account
          fetchLensAccount(accounts[0]);
        }
      } else {
        console.error("Ethereum object not found, install MetaMask.");
        alert("Please install MetaMask or another Web3 wallet to connect.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setConnecting(false);
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else {
      // User switched accounts
      setAddress(accounts[0]);
      // Try to fetch Lens account for the new address
      fetchLensAccount(accounts[0]);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnectWallet();
  };

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

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Remove event listeners
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    }
    
    setAddress(null);
    setConnected(false);
    setIsLensAuthenticated(false);
    setLensAccount(null);
  }, []);

  // Sign message function
  const signMessage = async (message: string): Promise<string | null> => {
    if (!address || !connected) {
      console.error('Wallet not connected');
      return null;
    }

    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        });
        return signature;
      }
    } catch (error) {
      console.error('Error signing message:', error);
    }
    return null;
  };

  // Authenticate with Lens
  const authenticateWithLens = async (): Promise<boolean> => {
    if (!address || !connected) {
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
      
      // Verify signature with Lens (simplified for demo)
      const isValid = await verifySignature(address, signature, challenge);
      
      setIsLensAuthenticated(isValid);
      return isValid;
    } catch (error) {
      console.error('Error authenticating with Lens:', error);
      return false;
    }
  };

  return (
    <Web3Context.Provider 
      value={{ 
        address, 
        connecting, 
        connected, 
        connectWallet, 
        disconnectWallet,
        signMessage,
        authenticateWithLens,
        isLensAuthenticated,
        lensAccount,
        fetchLensAccount: () => fetchLensAccount(),
        fetchingLensAccount
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <Web3Provider>
        {children}
      </Web3Provider>
    </NextUIProvider>
  );
} 