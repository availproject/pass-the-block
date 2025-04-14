'use client';

import { useState, useEffect } from 'react';
import NetworkGraph from '../components/NetworkGraph';
import { processNetworkData } from '../data/initialData';

export default function ScreenshotPage() {
  const [networkData, setNetworkData] = useState({ nodes: [], links: [] });
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReadyForCapture, setIsReadyForCapture] = useState(false);

  useEffect(() => {
    // Create a signal element only after everything is ready
    const createReadyIndicator = () => {
      // First remove any existing indicator
      const existingIndicator = document.getElementById('screenshot-ready-indicator');
      if (existingIndicator && existingIndicator.parentNode) {
        existingIndicator.parentNode.removeChild(existingIndicator);
      }
      
      // Create a new indicator
      const element = document.createElement('div');
      element.id = 'screenshot-ready-indicator';
      element.style.display = 'none';
      document.body.appendChild(element);
      console.log('Ready indicator created, screenshot can be taken now');
    };

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
        
        // First set loading to false to trigger component update
        setIsLoading(false);
        
        // Then wait for a moment to allow graph to render and position
        setTimeout(() => {
          setIsReadyForCapture(true);
          // Add the ready indicator after everything is rendered and positioned
          setTimeout(createReadyIndicator, 500);
        }, 2000);
      } catch (error) {
        console.error('Error loading network:', error);
        setIsLoading(false);
      }
    };

    loadNetwork();
    
    // Clean up function
    return () => {
      const element = document.getElementById('screenshot-ready-indicator');
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
          screenshotMode={true}
          hideUI={true}
        />
      </div>
    </main>
  );
} 