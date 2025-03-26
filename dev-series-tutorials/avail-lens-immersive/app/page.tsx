'use client';

import { useState, useEffect } from 'react';
import NetworkGraph from './components/NetworkGraph';
import Dashboard from './components/Dashboard';
import { Card, CardBody, Button, Input } from '@nextui-org/react';
import { initialData, processNetworkData } from './data/initialData';
import { FollowerNode, FollowerNetwork } from './types/network';

export default function Home() {
  const [profileHandle, setProfileHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialHandle] = useState<string>('lens/avail_project');
  // Start with null initially so no animation occurs
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  const [networkData, setNetworkData] = useState({
    nodes: processNetworkData(initialData).nodes,
    links: processNetworkData(initialData).edges
  });
  const [networkClusters, setNetworkClusters] = useState<number>(0); // Track number of clusters
  const [createdNetworks, setCreatedNetworks] = useState<Set<string>>(new Set(['lens/avail_project']));
  const [selectedNode, setSelectedNode] = useState<{
    label: string;
    followers: number;
    following: number;
    posts: number;
  } | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>(['lens/avail_project']);
  
  // Initialize dashboard info on first load without triggering camera animation
  useEffect(() => {
    // Find the initial avail_project node
    const initialNode = networkData.nodes.find(
      (node: any) => 
        (node.label && node.label.toLowerCase() === initialHandle.toLowerCase()) || 
        (node.name && node.name.toLowerCase() === initialHandle.toLowerCase())
    );
    
    if (initialNode) {
      // Only update dashboard info without setting targetHandle
      setSelectedNode({
        label: initialNode.label || initialHandle,
        followers: initialNode.followers || 555,
        following: initialNode.following || 6,
        posts: 42
      });
    }
  }, []);

  useEffect(() => {
    // Listen for target handle updates from double-clicks
    const handleTargetUpdate = (event: CustomEvent<{ handle: string | null, isDoubleClick?: boolean }>) => {
      const newHandle = event.detail.handle;
      const isDoubleClick = event.detail.isDoubleClick || false;
      
      if (newHandle === targetHandle) {
        // Skip if same handle clicked again
        return;
      }
      
      // Add to search history if it's a valid handle
      if (newHandle) {
        // Format handle with lens/ prefix if needed
        const formattedHandle = newHandle.startsWith('lens/') ? newHandle : `lens/${newHandle}`;
        
        setSearchHistory(prev => {
          // Remove the handle if it already exists to avoid duplicates
          const filtered = prev.filter(h => h.toLowerCase() !== formattedHandle.toLowerCase());
          // Add to the beginning of the array (most recent first)
          return [formattedHandle, ...filtered].slice(0, 10); // Keep only last 10
        });
      }
      
      // Reset first
      setTargetHandle(null);
      
      // Then set after a delay for animation
      setTimeout(() => {
        setTargetHandle(newHandle);
        
        if (newHandle) {
          const node = networkData.nodes.find(
            (n: any) => {
              const nLabel = n.label?.toLowerCase();
              const nName = n.name?.toLowerCase();
              return nLabel === newHandle.toLowerCase() || nName === newHandle.toLowerCase();
            }
          );
          
          if (node) {
            setSelectedNode({
              label: node.label,
              followers: node.followers || 0,
              following: node.following || 0,
              posts: Math.floor(Math.random() * 200) + 10 // Placeholder for posts data
            });
          }
        }
      }, 100);
    };

    window.addEventListener('updateTargetHandle', handleTargetUpdate as EventListener);
    return () => {
      window.removeEventListener('updateTargetHandle', handleTargetUpdate as EventListener);
    };
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Clean up the handle: remove 'lens/' prefix if present and .lens suffix if present
      let cleanHandle = profileHandle
        .replace('lens/', '')
        .replace('.lens', '')
        .toLowerCase(); // Normalize to lowercase
      
      const fullHandle = `lens/${cleanHandle}`;
      
      // Add to search history
      setSearchHistory(prev => {
        // Remove the handle if it already exists to avoid duplicates
        const filtered = prev.filter(h => h.toLowerCase() !== fullHandle.toLowerCase());
        // Add to the beginning of the array (most recent first)
        return [fullHandle, ...filtered].slice(0, 10); // Keep only last 10
      });
      
      // Check if the handle is the current target
      if (targetHandle === fullHandle) {
        // We're already focused on this node
        setIsLoading(false);
        return;
      }
      
      // Check if we've already created this network
      if (createdNetworks.has(fullHandle)) {
        console.log("Network already exists, focusing on it:", fullHandle);
        
        // Just find the node and focus on it - search with different patterns
        const existingNode = networkData.nodes.find(
          (node: any) => {
            // Check for matches with different formats
            return (node.name && node.name.toLowerCase() === fullHandle) ||
                   (node.label && node.label.toLowerCase() === fullHandle) ||
                   // Also check without the lens/ prefix
                   (node.name && node.name.toLowerCase() === cleanHandle) ||
                   (node.label && node.label.toLowerCase() === cleanHandle);
          }
        );
        
        console.log("Found existing node:", existingNode);
        
        if (existingNode) {
          // Update selected node info
          setSelectedNode({
            label: existingNode.label,
            followers: existingNode.followers || 0,
            following: existingNode.following || 0,
            posts: Math.floor(Math.random() * 200) + 10
          });
          
          // Set target handle with animation
          setTargetHandle(null); // Reset first
          setTimeout(() => {
            setTargetHandle(existingNode.label);
          }, 50);
        }
        
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(`/api/network/${cleanHandle}`);
      if (!response.ok) throw new Error('Network request failed');
      
      const data = await response.json();
      const processedData = processNetworkData(data);
      
      // Generate offset for this network cluster
      const clusterIndex = networkClusters + 1;
      const offset = [
        clusterIndex * 60, // More reasonable X offset
        clusterIndex * 30 * (Math.random() > 0.5 ? 1 : -1), // Moderate Y offset
        clusterIndex * 40 * (Math.random() > 0.5 ? 1 : -1)  // Moderate Z offset
      ];
      
      const processedWithOffset = {
        nodes: processedData.nodes.map((node: any) => {
          // The processNetworkData already adds position
          const nodeCopy = {...node};
          // position should already exist from processing
          if (nodeCopy.position) {
            nodeCopy.position = [
              nodeCopy.position[0] + offset[0],
              nodeCopy.position[1] + offset[1],
              nodeCopy.position[2] + offset[2]
            ] as [number, number, number];
          }
          return nodeCopy;
        }),
        edges: processedData.edges
      };
      
      // Create completely new network data
      setNetworkData({
        nodes: [...networkData.nodes, ...processedWithOffset.nodes],
        links: [...networkData.links, ...processedWithOffset.edges]
      });
      
      // Increment cluster count
      setNetworkClusters(clusterIndex);
      
      // Add to created networks
      setCreatedNetworks(prev => {
        const newSet = new Set(prev);
        newSet.add(fullHandle);
        return newSet;
      });
      
      // Find the target node - search with lens/ prefix since that's how it's stored
      const targetNode = processedWithOffset.nodes.find(
        (node: any) => {
          // Try multiple patterns to find the node
          return (node.name && 
                (node.name.toLowerCase() === fullHandle || 
                 node.name.toLowerCase() === cleanHandle)) ||
                (node.label && 
                (node.label.toLowerCase() === fullHandle || 
                 node.label.toLowerCase() === cleanHandle));
        }
      );
      
      console.log("New network targetNode:", targetNode);

      if (targetNode) {
        // Update selected node info for the dashboard
        setSelectedNode({
          label: targetNode.label,
          followers: targetNode.followers || 0,
          following: targetNode.following || 0,
          posts: Math.floor(Math.random() * 200) + 10 // Placeholder for posts data
        });
        
        // Set target handle with animation - same pattern as above
        setTargetHandle(null); // Reset first  
        setTimeout(() => {
          setTargetHandle(targetNode.label);
        }, 50);
      }
    } catch (error) {
      console.error('Error fetching network data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Dashboard */}
      <Dashboard selectedNode={selectedNode} searchHistory={searchHistory} />

      {/* Floating search bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-1 border-gray-800">
          <CardBody>
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter Lens handle (e.g. avail_project)"
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
          nodes={networkData.nodes}
          links={networkData.links}
          targetHandle={targetHandle}
          initialHandle={initialHandle}
        />
      </div>
    </main>
  );
}