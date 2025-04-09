'use client';

import { useState, useEffect } from 'react';
import NetworkGraph from '../components/NetworkGraph';
import { processNetworkData } from '../data/initialData';

export default function ScreenshotPage() {
  const [networkData, setNetworkData] = useState({ nodes: [], links: [] });
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNetwork = async () => {
      // Get the handle from the URL search params
      const params = new URLSearchParams(window.location.search);
      const handle = params.get('handle');
      
      if (!handle) return;

      try {
        const cleanHandle = handle.replace('lens/', '').replace('.lens', '').toLowerCase();
        const response = await fetch(`/api/network/${cleanHandle}`);
        if (!response.ok) throw new Error('Network request failed');
        
        const data = await response.json();
        const processedData = processNetworkData(data);
        
        setNetworkData({
          nodes: processedData.nodes,
          links: processedData.edges
        });

        // Set the target handle for focusing the camera
        setTargetHandle(processedData.nodes[0]?.label || null);
      } catch (error) {
        console.error('Error loading network:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNetwork();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading network...</div>
      </div>
    );
  }

  return (
    <main className="w-full h-screen overflow-hidden bg-black">
      <div className="w-full h-full" id="network-graph">
        <NetworkGraph
          nodes={networkData.nodes}
          links={networkData.links}
          targetHandle={targetHandle}
          initialHandle={targetHandle}
          networks={[]}
          currentNetwork=""
          onNetworkSwitch={() => {}}
          isScreenshot={true}
        />
      </div>
    </main>
  );
} 