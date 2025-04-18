'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Check if it's a WalletConnect error
    if (
      error.message?.includes('WalletConnect') ||
      error.message?.includes('Connection interrupted') ||
      error.stack?.includes('@walletconnect') ||
      error.stack?.includes('jsonrpc-provider') ||
      error.stack?.includes('jsonrpc-ws-connection')
    ) {
      // Suppress WalletConnect errors by immediately resetting
      reset();
    } else {
      // Log other errors to console
      console.error('Application error:', error);
    }
  }, [error, reset]);

  // If it's a WalletConnect error, don't show anything, the reset should hide it
  if (
    error.message?.includes('WalletConnect') ||
    error.message?.includes('Connection interrupted') ||
    error.stack?.includes('@walletconnect') ||
    error.stack?.includes('jsonrpc-provider') ||
    error.stack?.includes('jsonrpc-ws-connection')
  ) {
    return null;
  }

  // For other errors, show a minimal error UI
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6 text-white">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900/70 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-bold">Something went wrong</h2>
        <p className="mb-6 text-gray-300">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="w-full rounded-lg bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC] px-4 py-2 font-medium text-black transition-all hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 