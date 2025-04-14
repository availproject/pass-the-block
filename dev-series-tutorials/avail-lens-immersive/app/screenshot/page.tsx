'use client';

import { useState, useEffect } from 'react';
import NetworkGraph from '../components/NetworkGraph';
import { processNetworkData } from '../data/initialData';

export default function ScreenshotPage() {
  const [networkData, setNetworkData] = useState({ nodes: [], links: [] });
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Signal when the component is mounted (for puppeteer to detect)
    const element = document.createElement('div');
    element.id = 'screenshot-ready-indicator';
    element.style.display = 'none';
    document.body.appendChild(element);

    const loadNetwork = async () => {
      // Get the handle from the URL search params
      const params = new URLSearchParams(window.location.search);
      const handle = params.get('handle');
      
      if (!handle) return;

      try {
        console.log('Screenshot page loading network for:', handle);
        const cleanHandle = handle.replace('lens/', '').replace('.lens', '').toLowerCase();
        const response = await fetch(`/api/network/${cleanHandle}`, {
          // Use cache: no-store to avoid stale data
          cache: 'no-store'
        });
        
        if (!response.ok) throw new Error('Network request failed');
        
        const data = await response.json();
        console.log('Screenshot page received network data with', 
          data.nodes?.length || 0, 'nodes and', 
          data.links?.length || 0, 'links');
        
        const processedData = processNetworkData(data);
        
        setNetworkData({
          nodes: processedData.nodes,
          links: processedData.edges
        });

        // Set the target handle for focusing the camera
        const targetLabel = processedData.nodes[0]?.label || null;
        console.log('Setting target handle to:', targetLabel);
        setTargetHandle(targetLabel);
      } catch (error) {
        console.error('Error loading network:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNetwork();
    
    // Clean up the indicator element on unmount
    return () => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
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