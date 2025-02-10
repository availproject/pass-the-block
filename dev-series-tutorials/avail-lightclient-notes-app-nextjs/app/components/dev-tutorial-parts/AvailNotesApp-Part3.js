'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCcw, Send, Clock, CheckCircle2 } from 'lucide-react';

const AvailNotesApp = () => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [clientInfo, setClientInfo] = useState({
    mode: '',
    appId: null,
    blockHeight: 0
  });

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

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Submit note
  const submitNote = async () => {
    if (!note) return;

    // Add pending message immediately
    const pendingMessage = {
      id: Date.now(),
      data: note,
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending',
    };

    setMessages(prev => [pendingMessage, ...prev]);
    setNote(''); // Clear input immediately

    try {
      const response = await fetch('http://localhost:7007/v2/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: btoa(note)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit note');
      }

      const result = await response.json();
      
      // Update the message with submission details
      setMessages(prev => prev.map(msg => 
        msg.id === pendingMessage.id 
          ? {
              ...msg,
              status: 'submitted',
              blockNumber: result.block_number
            }
          : msg
      ));
    } catch (error) {
      console.error('Error submitting note:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === pendingMessage.id 
          ? {
              ...msg,
              status: 'failed'
            }
          : msg
      ));
    }
  };

  // Get status display info
  const getStatusDisplay = (messageStatus) => {
    switch (messageStatus) {
      case 'pending':
        return {
          color: 'text-yellow-500',
          icon: <Clock className="w-3 h-3" />,
          text: 'Pending'
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
          icon: null,
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
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-gray-800">{msg.data}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{msg.timestamp}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs flex items-center gap-1 ${statusDisplay.color}`}>
                        {statusDisplay.icon}
                        {statusDisplay.text}
                      </span>
                      {msg.blockNumber && (
                        <span className="text-xs text-gray-400">Block #{msg.blockNumber}</span>
                      )}
                    </div>
                  </div>
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