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
}

export default function NetworkCapture({ 
  profileHandle, 
  lensAccountId, 
  onCapture,
  existingNodes,
  existingLinks
}: NetworkCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [networkData, setNetworkData] = useState<{
    nodes: NetworkNode[];
    links: NetworkLink[];
  }>({ nodes: [], links: [] });
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  
  // Set up a ref for the canvas
  const containerRef = useRef<HTMLDivElement>(null);

  // Load network data specific to this profile
  useEffect(() => {
    const fetchNetworkData = async () => {
      setIsLoading(true);
      
      try {
        // If we have existing data, use it
        if (existingNodes?.length && existingLinks?.length) {
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
        
        const response = await fetch(`/api/network/${cleanHandle}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch network data');
        }
        
        const data = await response.json();
        const processedData = processNetworkData(data);
        
        setNetworkData({
          nodes: processedData.nodes,
          links: processedData.edges
        });
        
        // Find the target node - this is typically the first node in the result
        if (processedData.nodes.length > 0) {
          setTargetHandle(processedData.nodes[0].label);
        }
      } catch (error) {
        console.error('Error fetching network data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNetworkData();
  }, [profileHandle, existingNodes, existingLinks]);

  // Trigger the capture process once the network data is loaded
  useEffect(() => {
    if (!isLoading && !isCapturing && networkData.nodes.length > 0) {
      setTimeout(() => {
        captureNetworkGraph();
      }, 1500); // Give the graph time to render
    }
  }, [isLoading, networkData]);

  // Function to capture the network graph as an image
  const captureNetworkGraph = async () => {
    if (isCapturing || !containerRef.current) return;
    
    try {
      setIsCapturing(true);
      
      // Find the canvas element inside the container
      const canvas = containerRef.current.querySelector('canvas');
      
      if (!canvas) {
        throw new Error('Canvas element not found');
      }
      
      // Get the data URL from the canvas
      const dataUrl = canvas.toDataURL('image/png');
      
      // Handle the capture result
      if (onCapture) {
        onCapture(dataUrl);
      }
    } catch (error) {
      console.error('Error capturing network graph:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-black">
      {!isLoading && networkData.nodes.length > 0 && (
        <NetworkGraph 
          nodes={networkData.nodes}
          links={networkData.links}
          targetHandle={targetHandle}
          initialHandle={targetHandle}
          screenshotMode={true}
          hideUI={true}
        />
      )}
    </div>
  );
} 