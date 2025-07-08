import { NexusSDK } from 'avail-nexus-sdk';

// Define supported types
type SUPPORTED_TOKENS = 'ETH' | 'USDC' | 'USDT';
type SUPPORTED_CHAINS_IDS = 1 | 10 | 8453 | 42161 | 137 | 43114 | 59144 | 534351 | 11155111 | 84532 | 421614 | 11155420 | 80002 | 43113 | 59141 | 534352;

// Initialize SDK instance
let nexusSDK: NexusSDK | null = null;

// Initialize the SDK with a provider
export const initializeNexusSDK = async (provider: any) => {
  try {
    if (!nexusSDK) {
      nexusSDK = new NexusSDK({
        network: 'testnet', // Using testnet for development
      });
      await nexusSDK.initialize(provider);
    }
    return nexusSDK;
  } catch (error) {
    console.error('Failed to initialize Nexus SDK:', error);
    throw error;
  }
};

// Get the SDK instance
export const getNexusSDK = () => {
  if (!nexusSDK) {
    throw new Error('Nexus SDK not initialized');
  }
  return nexusSDK;
};

// Clean up SDK instance
export const cleanupNexusSDK = async () => {
  if (nexusSDK) {
    nexusSDK.removeAllListeners();
    await nexusSDK.deinit();
    nexusSDK = null;
  }
};

// Helper function to get unified balances
export const getUnifiedBalances = async () => {
  const sdk = getNexusSDK();
  return await sdk.getUnifiedBalances();
};

// Helper function to bridge tokens
export const bridgeTokens = async (params: {
  token: SUPPORTED_TOKENS;
  amount: number | string;
  chainId: SUPPORTED_CHAINS_IDS;
}) => {
  const sdk = getNexusSDK();
  return await sdk.bridge(params);
};

// Helper function to transfer tokens
export const transferTokens = async (params: {
  token: SUPPORTED_TOKENS;
  amount: number | string;
  chainId: SUPPORTED_CHAINS_IDS;
  recipient: `0x${string}`;
}) => {
  const sdk = getNexusSDK();
  return await sdk.transfer(params);
};

// Helper function to check if chain is supported
export const isChainSupported = (chainId: SUPPORTED_CHAINS_IDS) => {
  const sdk = getNexusSDK();
  return sdk.isSupportedChain(chainId);
};

// Helper function to check if token is supported
export const isTokenSupported = (token: SUPPORTED_TOKENS) => {
  const sdk = getNexusSDK();
  return sdk.isSupportedToken(token);
};

// Helper function to get chain metadata
export const getChainMetadata = (chainId: SUPPORTED_CHAINS_IDS) => {
  const sdk = getNexusSDK();
  return sdk.getChainMetadata(chainId);
};

// Helper function to get token metadata
export const getTokenMetadata = (token: SUPPORTED_TOKENS) => {
  const sdk = getNexusSDK();
  return sdk.getTokenMetadata(token);
}; 