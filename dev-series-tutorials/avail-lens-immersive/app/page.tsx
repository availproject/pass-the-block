'use client';

import { useState, useEffect } from 'react';
import NetworkGraph from './components/NetworkGraph';
import Dashboard from './components/Dashboard';
import { Card, CardBody, Button, Input } from '@nextui-org/react';
import { mockData } from './data/mockData';

// Official Avail color palette
const colors = {
  primary: '#3CA3FC',    // Primary Blue
  secondary: '#58C8F6',  // Light Blue
  tertiary: '#44D5DE',   // Mint
  accent1: '#EDC7FC',    // Purple
  accent2: '#FEC7C7',    // Pink
  edges: '#BCE3FE',      // Light edge color for better visibility
};

export default function Home() {
  const [profileHandle, setProfileHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<{
    label: string;
    followers: number;
    following: number;
    posts: number;
  } | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    // Find if handle exists in our mock data
    const handleExists = mockData.nodes.find(
      node => node.label.toLowerCase() === profileHandle.toLowerCase()
    );

    if (handleExists) {
      setTargetHandle(null); // Reset first
      setTimeout(() => {
        setTargetHandle(profileHandle.toLowerCase());
        // Update selected node with mock stats
        setSelectedNode({
          label: handleExists.label,
          followers: Math.floor(Math.random() * 1000) + 100,
          following: Math.floor(Math.random() * 500) + 50,
          posts: Math.floor(Math.random() * 200) + 10
        });
      }, 0);
    }
    
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => {
    // Listen for target handle updates from double-clicks
    const handleTargetUpdate = (event: CustomEvent<{ handle: string | null }>) => {
      const newHandle = event.detail.handle;
      setTargetHandle(newHandle);
      
      if (newHandle) {
        const node = mockData.nodes.find(
          n => n.label.toLowerCase() === newHandle.toLowerCase()
        );
        if (node) {
          setSelectedNode({
            label: node.label,
            followers: Math.floor(Math.random() * 1000) + 100,
            following: Math.floor(Math.random() * 500) + 50,
            posts: Math.floor(Math.random() * 200) + 10
          });
        }
      }
    };

    window.addEventListener('updateTargetHandle', handleTargetUpdate as EventListener);
    return () => {
      window.removeEventListener('updateTargetHandle', handleTargetUpdate as EventListener);
    };
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Dashboard */}
      <Dashboard selectedNode={selectedNode} />

      {/* Floating search bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-1 border-gray-800">
          <CardBody>
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter Lens handle (e.g. avail.lens)"
                value={profileHandle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileHandle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="flex-1"
                variant="bordered"
                size="lg"
                radius="lg"
                classNames={{
                  input: "text-white",
                  inputWrapper: "bg-gray-800/50 border-gray-700",
                }}
              />
              <Button
                color="primary"
                onClick={handleSearch}
                isLoading={isLoading}
                size="lg"
                radius="lg"
                className="text-black bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC] font-semibold"
              >
                Visualize Network
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Full screen visualization */}
      <div className="w-full h-full">
        <NetworkGraph
          nodes={mockData.nodes}
          edges={mockData.edges}
          targetHandle={targetHandle}
        />
      </div>
    </main>
  );
}