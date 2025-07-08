'use client';

import { WalletConnection } from '@/components/WalletConnection';
import { UnifiedBalances } from '@/components/UnifiedBalances';
import { useAccount } from 'wagmi';
import { useNexus } from '@/components/NexusProvider';
import { Globe, Zap, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const { isInitialized, isLoading } = useNexus();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Nexus SDK Tutorial
            </h1>
          </div>
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              Part 1: Getting Started
            </span>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Experience unified Web3 interactions by viewing your balances across 
            multiple blockchains in one place
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="flex justify-center mb-8">
          <WalletConnection />
        </div>

        {/* Main Content */}
        {isConnected ? (
          <div className="max-w-4xl mx-auto">
            <UnifiedBalances />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to Experience Chain Abstraction?
              </h2>
              <p className="text-slate-600 mb-8">
                Connect your wallet to see how the Nexus SDK unifies your multi-chain portfolio
              </p>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-slate-200">
                <p className="text-sm text-slate-500">
                  This demo will show you how the Nexus SDK aggregates balances 
                  across multiple chains in real-time
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isConnected && isLoading && !isInitialized && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-slate-700">Initializing Nexus SDK...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
