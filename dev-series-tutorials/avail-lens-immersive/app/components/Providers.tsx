'use client';
import "../globals.css";
import { NextUIProvider } from '@nextui-org/react'
import { ReactNode } from 'react';
import { ConnectKitConfig } from './ConnectKitConfig';
import { Web3Provider, useWeb3 } from './Web3Context';

export { useWeb3 };

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextUIProvider>
      <ConnectKitConfig>
        <Web3Provider>
          {children}
        </Web3Provider>
      </ConnectKitConfig>
    </NextUIProvider>
  );
} 