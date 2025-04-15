'use client';

import React, { useRef, useEffect, useState } from 'react';
import NetworkGraph from './NetworkGraph';
import { uploadImageToGrove } from '../utils/grove-storage';
import { processNetworkData } from '../data/initialData';

interface NetworkNode {
  id: string;
  position: [number, number, number];
  label: string;
  color?: string;
  picture?: string;
}

interface NetworkLink {
  source: string;
  target: string;
}

interface NetworkCaptureProps {
  profileHandle: string;
  lensAccountId?: string;
  onCapture?: (imageUrl: string) => void;
  existingNodes?: NetworkNode[];
  existingLinks?: NetworkLink[];
  nodes?: NetworkNode[];
  links?: NetworkLink[];
  testMode?: boolean; // Added for temporary testing
}

export default function NetworkCapture({ 
  profileHandle, 
  lensAccountId, 
  onCapture,
  existingNodes,
  existingLinks,
  testMode = false // Default to false
}: NetworkCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [networkData, setNetworkData] = useState<{
    nodes: NetworkNode[];
    links: NetworkLink[];
  }>({ nodes: [], links: [] });
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  const [captureReady, setCaptureReady] = useState(false);
  
  // Set up a ref for the canvas
  const containerRef = useRef<HTMLDivElement>(null);

  // Load network data specific to this profile
  useEffect(() => {
    console.log('NetworkCapture useEffect triggered', {
      profileHandle,
      hasExistingNodes: !!existingNodes?.length,
      hasExistingLinks: !!existingLinks?.length
    });

    const fetchNetworkData = async () => {
      setIsLoading(true);
      console.log('Starting network data fetch...');
      
      try {
        // If we have existing data, use it
        if (existingNodes?.length && existingLinks?.length) {
          console.log('Using existing network data');
          setNetworkData({
            nodes: existingNodes,
            links: existingLinks
          });
          
          // Find the target node (usually it's the profileHandle)
          const targetNode = existingNodes.find(node => 
            node.label?.toLowerCase() === profileHandle.toLowerCase() ||
            node.label?.toLowerCase() === profileHandle.toLowerCase().replace('lens/', '') ||
            node.id?.toLowerCase() === profileHandle.toLowerCase()
          );
          
          console.log('Target node found:', !!targetNode, {
            nodeLabel: targetNode?.label,
            searchedHandle: profileHandle
          });
          
          if (targetNode) {
            setTargetHandle(targetNode.label);
          }
          
          setIsLoading(false);
          return;
        }
        
        // Clean up the handle for the API request
        let cleanHandle = profileHandle.trim()
          .replace('lens/', '')
          .replace('.lens', '')
          .toLowerCase();
        
        console.log('Fetching network data for handle:', cleanHandle);
        const response = await fetch(`/api/network/${cleanHandle}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch network data');
        }
        
        const data = await response.json();
        console.log('Network data received:', {
          nodesCount: data.nodes?.length,
          linksCount: data.links?.length
        });

        const processedData = processNetworkData(data);
        console.log('Processed network data:', {
          processedNodesCount: processedData.nodes.length,
          processedEdgesCount: processedData.edges.length
        });
        
        setNetworkData({
          nodes: processedData.nodes,
          links: processedData.edges
        });
        
        // Find the target node - this is typically the first node in the result
        if (processedData.nodes.length > 0) {
          console.log('Setting target handle to first node:', processedData.nodes[0].label);
          setTargetHandle(processedData.nodes[0].label);
        }
      } catch (error: any) {
        console.error('Error fetching network data:', error);
        console.log('Error details:', {
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack
        });
      } finally {
        setIsLoading(false);
        console.log('Network data fetch completed');
      }
    };
    
    fetchNetworkData();
  }, [profileHandle, existingNodes, existingLinks]);

  // Set up a timeout to mark the capture as ready after network data is loaded
  useEffect(() => {
    if (!isLoading && networkData.nodes.length > 0) {
      console.log('Setting up capture ready timeout...');
      // Increased delay to ensure graph is fully rendered and positioned
      const timer = setTimeout(() => {
        console.log('Capture ready timeout triggered');
        setCaptureReady(true);
      }, 3000); // Increased to 3 seconds to ensure render is complete
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, networkData]);

  // Trigger the capture process once the capture is marked as ready
  useEffect(() => {
    console.log('Capture trigger effect:', {
      captureReady,
      isCapturing,
      hasNodes: networkData.nodes.length > 0
    });

    if (captureReady && !isCapturing && networkData.nodes.length > 0) {
      console.log('Setting up capture timeout...');
      const timer = setTimeout(() => {
        console.log('Capture timeout triggered, calling captureNetworkGraph');
        captureNetworkGraph();
      }, 1000); // Additional delay after ready state
      
      return () => clearTimeout(timer);
    }
  }, [captureReady, isCapturing, networkData]);

  // Function to capture the network graph as an image
  const captureNetworkGraph = async () => {
    console.log('Starting network graph capture...');
    if (isCapturing || !containerRef.current) {
      console.log('Capture blocked:', {
        isCapturing,
        hasContainer: !!containerRef.current
      });
      return;
    }
    
    try {
      setIsCapturing(true);
      console.log('Finding canvas element...');
      
      // Wait for the graph to render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find the canvas element inside the container
      const canvas = containerRef.current.querySelector('canvas');
      console.log('Canvas element found:', !!canvas);
      
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      // Set fixed dimensions for capture
      const captureWidth = 1280;
      const captureHeight = 1280;
      
      // Store original dimensions
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;
      const originalStyle = canvas.style.cssText;

      // Set capture dimensions
      canvas.width = captureWidth;
      canvas.height = captureHeight;
      canvas.style.width = `${captureWidth}px`;
      canvas.style.height = `${captureHeight}px`;

      // Log canvas dimensions and state
      console.log('Canvas state:', {
        width: canvas.width,
        height: canvas.height,
        style: canvas.style.cssText,
        hasContext: !!canvas.getContext('webgl') || !!canvas.getContext('webgl2')
      });
      
      // Force a render frame
      await new Promise(requestAnimationFrame);
      
      // Get the data URL from the canvas
      console.log('Attempting to capture canvas...');
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      console.log('Canvas captured, data URL length:', dataUrl.length);
      console.log('Data URL preview:', dataUrl.substring(0, 100) + '...');
      
      // Restore original dimensions
      canvas.width = originalWidth;
      canvas.height = originalHeight;
      canvas.style.cssText = originalStyle;
      
      // Handle the capture result
      if (onCapture) {
        console.log('Calling onCapture callback...');
        onCapture(dataUrl);
      } else {
        console.log('No onCapture callback provided');
      }
    } catch (error: any) {
      console.error('Error capturing network graph:', error);
      console.log('Error details:', {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      });
    } finally {
      setIsCapturing(false);
      console.log('Capture process completed');
    }
  };

  // Update the effect for enforcing camera position by adding a unique scope to the events
  useEffect(() => {
    if (captureReady && targetHandle) {
      console.log('Enforcing camera focus for capture');
      
      // Use a unique ID to scope events to this capture component
      const captureId = `capture-${Date.now()}`;
      
      // First reset camera to default position - use scoped event
      const timer1 = setTimeout(() => {
        // Use detail to specify this is for a capture component
        window.dispatchEvent(new CustomEvent('resetCamera', { 
          detail: { isCaptureMode: true, captureId }
        }));
      }, 800);
      
      // Then focus on target node - use scoped event
      const timer2 = setTimeout(() => {
        console.log('Focusing camera on target node for capture:', targetHandle);
        window.dispatchEvent(new CustomEvent('screenshotRequest', { 
          detail: { 
            handle: targetHandle.toLowerCase(),
            isCaptureMode: true,
            captureId
          } 
        }));
      }, 1500);
      
      // Add a final camera adjustment to ensure full network visibility - use scoped event
      const timer3 = setTimeout(() => {
        console.log('Final camera adjustment for better network view');
        window.dispatchEvent(new CustomEvent('zoomOut', {
          detail: { isCaptureMode: true, captureId }
        }));
      }, 2200);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [captureReady, targetHandle]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full bg-black flex items-center justify-center ${testMode ? 'border-2 border-blue-500' : ''}`}
      style={{ 
        width: testMode ? '100%' : '720px', 
        height: testMode ? '100%' : '720px', 
        position: 'relative', 
        overflow: 'hidden',
        borderRadius: '8px'
      }}
    >
      {!isLoading && networkData.nodes.length > 0 && (
        <NetworkGraph 
          nodes={networkData.nodes}
          links={networkData.links}
          targetHandle={targetHandle}
          initialHandle={targetHandle}
          screenshotMode={true}
          hideUI={true}
          isScreenshot={true}
          captureZoom={100}
          isCaptureComponent={true}
        />
      )}
      {testMode && isCapturing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
          <div className="text-white font-bold text-xl">Capturing...</div>
        </div>
      )}
    </div>
  );
} 