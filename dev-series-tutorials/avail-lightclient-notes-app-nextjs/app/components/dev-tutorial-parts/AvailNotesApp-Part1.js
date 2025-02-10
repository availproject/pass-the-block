'use client';

import React, { useState } from 'react';
import { Terminal } from 'lucide-react';

const AvailNotesApp = () => {
  const [note, setNote] = useState('');

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6" />
            <h1 className="text-lg font-bold text-gray-900">Avail Notes</h1>
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
              disabled={!note}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>

          {/* Messages */}
          <div className="text-center text-gray-500 p-4">
            No notes yet. Start by sending one!
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailNotesApp;