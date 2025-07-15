'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, ExternalLink, History, Send } from 'lucide-react';

interface TransferTransaction {
  id: string;
  type: 'transfer';
  token: string;
  amount: string;
  toChain: number;
  recipient: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  hash?: string;
}

export function TransferHistory() {
  const [transactions, setTransactions] = useState<TransferTransaction[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const chains = {
    11155111: 'Sepolia',
    84532: 'Base Sepolia',
    80002: 'Polygon Amoy',
    421614: 'Arbitrum Sepolia',
    11155420: 'Optimism Sepolia'
  };

  useEffect(() => {
    loadTransactionHistory();
  }, []);

  const loadTransactionHistory = () => {
    try {
      const savedTransactions = localStorage.getItem('nexus-transfer-transactions');
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(parsed.map((tx: any) => ({
          ...tx,
          timestamp: new Date(tx.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading transfer history:', error);
    }
  };

  const getStatusIcon = (status: TransferTransaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getChainName = (chainId: number) => {
    return chains[chainId as keyof typeof chains] || `Chain ${chainId}`;
  };

  const getExplorerUrl = (hash: string, chainId: number) => {
    const explorers = {
      11155111: 'https://sepolia.etherscan.io',
      84532: 'https://sepolia.basescan.org',
      80002: 'https://amoy.polygonscan.com',
      421614: 'https://sepolia.arbiscan.io',
      11155420: 'https://sepolia-optimism.etherscan.io'
    };
    
    const explorer = explorers[chainId as keyof typeof explorers];
    return explorer ? `${explorer}/tx/${hash}` : `https://etherscan.io/tx/${hash}`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Transfer History</h3>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          {showHistory ? 'Hide' : 'Show'} History ({transactions.length})
        </button>
      </div>

      {showHistory && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="space-y-3">
            {transactions.slice(0, 10).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(tx.status)}
                  <div>
                    <p className="font-medium text-slate-900">
                      {tx.amount} {tx.token}
                    </p>
                    <p className="text-sm text-slate-500">
                      To: {truncateAddress(tx.recipient)} on {getChainName(tx.toChain)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {tx.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                    ${tx.status === 'failed' ? 'bg-red-100 text-red-700' : ''}
                    ${tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                  `}>
                    {tx.status}
                  </span>
                  {tx.hash && (
                    <a
                      href={getExplorerUrl(tx.hash, tx.toChain)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="View on Explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}