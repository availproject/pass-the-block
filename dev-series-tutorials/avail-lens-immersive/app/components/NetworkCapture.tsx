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
  followers?: number;
  following?: number;
  lensScore?: number;
  posts?: number;
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
  testMode?: boolean;
}

export default function NetworkCapture({
  profileHandle,
  lensAccountId,
  onCapture,
  existingNodes,
  existingLinks,
  testMode = false
}: NetworkCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [networkData, setNetworkData] = useState<{ nodes: NetworkNode[]; links: NetworkLink[] }>({ nodes: [], links: [] });
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  const [captureReady, setCaptureReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNetworkData = async () => {
      setIsLoading(true);
      try {
        if (existingNodes?.length && existingLinks?.length) {
          setNetworkData({ nodes: existingNodes, links: existingLinks });
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

        const cleanHandle = profileHandle.trim().replace('lens/', '').replace('.lens', '').toLowerCase();
        const response = await fetch(`/api/network/${cleanHandle}`);
        if (!response.ok) throw new Error('Failed to fetch network data');

        const data = await response.json();
        const processedData = processNetworkData(data);

        setNetworkData({
          nodes: processedData.nodes,
          links: processedData.edges
        });

        if (processedData.nodes.length > 0) {
          setTargetHandle(processedData.nodes[0].label);
        }
      } catch (error: any) {
        console.error('Error fetching network data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkData();
  }, [profileHandle, existingNodes, existingLinks]);

  useEffect(() => {
    if (!isLoading && networkData.nodes.length > 0) {
      const timer = setTimeout(() => {
        setCaptureReady(true);
      }, 8000); // allow time for graph to render

      return () => clearTimeout(timer);
    }
  }, [isLoading, networkData]);

  useEffect(() => {
    if (captureReady && !isCapturing && !hasCaptured && networkData.nodes.length > 0) {
      const timer = setTimeout(() => {
        captureNetworkGraph();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [captureReady, isCapturing, hasCaptured, networkData]);

  const captureNetworkGraph = async () => {
    if (isCapturing || !containerRef.current) return;

    try {
      setIsCapturing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const canvas = containerRef.current.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');

      const captureWidth = 1280;
      const captureHeight = 1280;

      const originalWidth = canvas.width;
      const originalHeight = canvas.height;
      const originalStyle = canvas.style.cssText;

      canvas.width = captureWidth;
      canvas.height = captureHeight;
      canvas.style.width = `${captureWidth}px`;
      canvas.style.height = `${captureHeight}px`;

      await new Promise(requestAnimationFrame);
      const dataUrl = canvas.toDataURL('image/png', 1.0);

      canvas.width = originalWidth;
      canvas.height = originalHeight;
      canvas.style.cssText = originalStyle;

      if (onCapture) onCapture(dataUrl);
      setHasCaptured(true);
    } catch (error: any) {
      console.error('Error capturing graph:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    if (captureReady && targetHandle) {
      const captureId = `capture-${Date.now()}`;

      const timer2 = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('screenshotRequest', {
          detail: {
            handle: targetHandle.toLowerCase(),
            isCaptureMode: true,
            captureId
          }
        }));
      }, 5000);

      return () => {
        clearTimeout(timer2);
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
