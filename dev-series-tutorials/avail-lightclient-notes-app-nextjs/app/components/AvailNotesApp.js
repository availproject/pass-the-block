'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCcw, Send, Clock, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'avail-notes-blocks';

const AvailNotesApp = () => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [clientInfo, setClientInfo] = useState({
    mode: '',
    appId: null,
    blockHeight: 0
  });
  const [error, setError] = useState(null);

  const fetchBlockData = async (blockNumber, attempt = 0) => {
    try {
      const response = await fetch(
        `http://localhost:7007/v2/blocks/${blockNumber}/data?fields=data,extrinsic`
      );
      
      if (!response.ok) {
        // If we get a 404, the block might not be synced yet
        if (response.status === 404) {
          if (attempt < 5) { // Try up to 5 times
            // Exponential backoff: 2s, 4s, 8s, 16s, 32s
            const delay = 2000 * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchBlockData(blockNumber, attempt + 1);
          }
          // After max retries, return null but don't treat as error
          return null;
        }
        // For other errors, throw
        throw new Error('Failed to fetch block data');
      }
      
      const blockData = await response.json();
      return blockData;
    } catch (error) {
      console.error(`Error fetching block ${blockNumber}:`, error);
      if (attempt < 5) {
        // Retry on network errors too
        const delay = 2000 * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchBlockData(blockNumber, attempt + 1);
      }
      return null;
    }
  };

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error loading saved messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Load block data for messages
  useEffect(() => {
    const loadBlockData = async () => {
      const updatedMessages = await Promise.all(
        messages.map(async (msg) => {
          if (msg.status === 'submitted' && msg.blockNumber && !msg.blockData) {
            const blockData = await fetchBlockData(msg.blockNumber);
            return {
              ...msg,
              blockData
            };
          }
          return msg;
        })
      );
      
      if (JSON.stringify(messages) !== JSON.stringify(updatedMessages)) {
        setMessages(updatedMessages);
      }
    };

    loadBlockData();
  }, [messages]);

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:7007/v2/status');
      if (!response.ok) {
        throw new Error('Light Client returned error status');
      }
      const data = await response.json();
      
      const clientMode = data.modes.includes('app') ? 'App Client Mode' : 'Light Client Mode';
      setClientInfo({
        mode: clientMode,
        appId: data.app_id,
        blockHeight: data.blocks.latest
      });
      setStatus('connected');
      setError(null);
    } catch (error) {
      console.error('Error fetching status:', error);
      setStatus('error');
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const submitNote = async () => {
    if (!note) return;

    const pendingMessage = {
      id: Date.now(),
      data: note,
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending',
      retries: 0,
      blockNumber: null,
      blockData: null
    };

    setMessages(prev => [pendingMessage, ...prev]);
    setNote('');

    const submitWithRetry = async (message, attempt = 0) => {
      try {
        const response = await fetch('http://localhost:7007/v2/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: btoa(message.data)
          })
        });

        if (!response.ok) {
          throw new Error('Failed to submit note');
        }

        const result = await response.json();
        
        setMessages(prev => prev.map(msg => 
          msg.id === message.id 
            ? {
                ...msg,
                status: 'submitted',
                blockNumber: result.block_number,
                retries: attempt
              }
            : msg
        ));
      } catch (error) {
        console.error('Error submitting note:', error);
        
        if (attempt < 2) { // Retry up to 2 times
          setTimeout(() => {
            submitWithRetry(message, attempt + 1);
          }, 1000 * (attempt + 1)); // Exponential backoff
          
          setMessages(prev => prev.map(msg => 
            msg.id === message.id 
              ? {
                  ...msg,
                  status: 'retrying',
                  retries: attempt + 1
                }
              : msg
          ));
        } else {
          setMessages(prev => prev.map(msg => 
            msg.id === message.id 
              ? {
                  ...msg,
                  status: 'failed',
                  error: error.message,
                  retries: attempt
                }
              : msg
          ));
        }
      }
    };

    submitWithRetry(pendingMessage);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all message history?')) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const getStatusDisplay = (messageStatus) => {
    switch (messageStatus) {
      case 'pending':
        return {
          color: 'text-yellow-500',
          icon: <Clock className="w-3 h-3" />,
          text: 'Pending'
        };
      case 'retrying':
        return {
          color: 'text-orange-500',
          icon: <RefreshCcw className="w-3 h-3 animate-spin" />,
          text: 'Retrying'
        };
      case 'submitted':
        return {
          color: 'text-green-500',
          icon: <CheckCircle2 className="w-3 h-3" />,
          text: 'Submitted'
        };
      case 'failed':
        return {
          color: 'text-red-500',
          icon: <AlertCircle className="w-3 h-3" />,
          text: 'Failed'
        };
      default:
        return {
          color: 'text-gray-500',
          icon: null,
          text: messageStatus
        };
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Terminal className="w-6 h-6" />
              <h1 className="text-lg font-bold text-gray-900">Avail Notes</h1>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Clear History
              </button>
            )}
          </div>

          {/* Status Cards */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="flex items-center text-green-500">
                {status === 'connected' && <RefreshCcw className="w-4 h-4 mr-1 animate-spin" />}
                {status === 'connected' ? 'Active' : status}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Client Mode</span>
              <span className="text-blue-500">{clientInfo.mode || 'Unknown'}</span>
            </div>

            {clientInfo.appId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">App ID</span>
                <span className="text-orange-500">#{clientInfo.appId}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Block Height</span>
              <span className="text-purple-500">#{clientInfo.blockHeight}</span>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Input area */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && submitNote()}
              placeholder="Enter your note..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={submitNote}
              disabled={!note || status !== 'connected'}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {messages.map((msg) => {
              const statusDisplay = getStatusDisplay(msg.status);
              return (
                <div 
                  key={msg.id} 
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 relative group"
                >
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="text-gray-800 pr-8">{msg.data}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{msg.timestamp}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs flex items-center gap-1 ${statusDisplay.color}`}>
                        {statusDisplay.icon}
                        {statusDisplay.text}
                        {msg.retries > 0 && ` (${msg.retries} ${msg.retries === 1 ? 'retry' : 'retries'})`}
                      </span>
                      {msg.blockNumber && (
                        <span className="text-xs text-gray-400 hover:text-blue-500 cursor-pointer">
                          Block #{msg.blockNumber}
                          {msg.blockData && (
                            <span className="ml-1 text-xs text-green-500">✓</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  {msg.blockData && (
                    <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                      <p className="font-medium text-gray-700">Block Data:</p>
                      <pre className="overflow-x-auto text-gray-600">
                        {JSON.stringify(msg.blockData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {msg.error && (
                    <p className="text-xs text-red-500 mt-1">{msg.error}</p>
                  )}
                </div>
              );
            })}
            {messages.length === 0 && (
              <div className="text-center text-gray-500 p-4">
                No notes yet. Start by sending one!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailNotesApp;