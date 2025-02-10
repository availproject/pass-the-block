'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCcw } from 'lucide-react';

const AvailNotesApp = () => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('disconnected');
  const [clientInfo, setClientInfo] = useState({
    mode: '',
    appId: null,
    blockHeight: 0
  });

  // Fetch status from Light Client
  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:7007/v2/status');
      const data = await response.json();
      
      const clientMode = data.modes.includes('app') ? 'App Client Mode' : 'Light Client Mode';
      setClientInfo({
        mode: clientMode,
        appId: data.app_id,
        blockHeight: data.blocks.latest
      });
      setStatus('connected');
    } catch (error) {
      console.error('Error fetching status:', error);
      setStatus('error');
    }
  };

  // Poll for status updates
  useEffect(() => {
    fetchStatus(); // Initial fetch
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

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
              placeholder="Enter your note..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              disabled={!note || status !== 'connected'}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>

          <div className="text-center text-gray-500 p-4">
            No notes yet. Start by sending one!
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default AvailNotesApp;