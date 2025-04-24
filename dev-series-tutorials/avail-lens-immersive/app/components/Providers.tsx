'use client';
import "../globals.css";
import { NextUIProvider } from '@nextui-org/react'
import { ReactNode } from 'react';
import { ConnectKitConfig } from './ConnectKitConfig';
import { Web3Provider, useWeb3 } from './Web3Context';
import ErrorBoundary from './ErrorBoundary';
import { Toaster } from 'react-hot-toast';

export { useWeb3 };

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <NextUIProvider>
        <ConnectKitConfig>
          <Web3Provider>
            <Toaster position="top-right" />
            {children}
          </Web3Provider>
        </ConnectKitConfig>
      </NextUIProvider>
    </ErrorBoundary>
  );
} 