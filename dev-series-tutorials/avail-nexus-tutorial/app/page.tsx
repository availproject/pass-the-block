'use client';

import { WalletConnection } from '@/components/WalletConnection';
import { UnifiedBalances } from '@/components/UnifiedBalances';
import { TransferForm } from '@/components/TransferForm';
import { TransferHistory } from '@/components/TransferHistory';
import { useAccount } from 'wagmi';
import { useNexus } from '@/components/NexusProvider';
import { Globe, Zap, Shield, ArrowRight, Send } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { isConnected } = useAccount();
  const { isInitialized, isLoading } = useNexus();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'transfer'>('portfolio');

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
          <div className="mb-4 flex justify-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              Part 1: Portfolio View
            </span>
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
              Part 2: Cross-Chain Transfers
            </span>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Experience unified Web3 interactions with portfolio management and
            seamless cross-chain transfers in one interface
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Zap className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Lightning Fast</h3>
            <p className="text-slate-600 text-sm">
              Instant balance updates and transfer simulations across all supported chains
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Shield className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Secure by Design</h3>
            <p className="text-slate-600 text-sm">
              Built-in security with smart allowance management and transaction previews
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Globe className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Testnet Ready</h3>
            <p className="text-slate-600 text-sm">
              Safe development environment using Sepolia, Base Sepolia, and more
            </p>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="flex justify-center mb-8">
          <WalletConnection />
        </div>

        {/* Main Content */}
        {isConnected && isInitialized ? (
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'portfolio'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Portfolio View</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'transfer'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Cross-Chain Transfer</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content Based on Active Tab */}
            {activeTab === 'portfolio' ? (
              <div className="space-y-8">
                {/* Unified Balances */}
                <UnifiedBalances />
                
                {/* Quick Transfer CTA */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        Ready to Send Tokens?
                      </h3>
                      <p className="text-sm text-slate-600">
                        Send your assets directly to any address on any chain with one click
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('transfer')}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Tokens</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Transfer History */}
                <TransferHistory />
                
                {/* Transfer Form */}
                <TransferForm />
                
                {/* Current Balances Reference */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        Need to Check Your Balances?
                      </h3>
                      <p className="text-sm text-slate-600">
                        View your complete portfolio across all chains
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>View Portfolio</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : isConnected ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Setting Up Your Multi-Chain Experience
              </h2>
              <p className="text-slate-600 mb-8">
                <strong>Testnet Tutorial:</strong> This demo safely uses testnet tokens
              </p>
              <ul className="text-sm text-slate-500 list-disc list-inside space-y-1">
                <li>Sepolia (Ethereum testnet)</li>
                <li>Base Sepolia (Base testnet)</li>
                <li>Polygon Amoy, Arbitrum Sepolia, Optimism Sepolia</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to Experience Chain Abstraction?
              </h2>
              <p className="text-slate-600 mb-8">
                Connect your wallet to see how the Nexus SDK unifies your Web3 experience
              </p>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="text-sm text-slate-500 mb-2">
                  <strong>Testnet Tutorial:</strong> This demo safely uses testnet tokens
                </p>
                <ul className="text-sm text-slate-500 list-disc list-inside space-y-1">
                  <li>Sepolia (Ethereum testnet)</li>
                  <li>Base Sepolia (Base testnet)</li>
                  <li>Polygon Amoy, Arbitrum Sepolia, Optimism Sepolia</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isConnected && isLoading && !isInitialized && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
                <span className="text-slate-700">Initializing Nexus SDK...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}