'use client';

import { useState, useEffect, useMemo } from 'react';
import NetworkGraph from './components/NetworkGraph';
import Dashboard from './components/Dashboard';
import SocialCardModal from './components/SocialCardModal';
import { Card, CardBody, Button, Input, Image } from '@nextui-org/react';
import { initialData, processNetworkData } from './data/initialData';
import WalletButton from './components/WalletButton';
import MultiSelectInput from './components/MultiSelectInput';
import { useWeb3 } from './components/Providers';
import { authenticateForPosting, postToLens } from './utils/lens-auth';


export default function Home() {
  const { connected, lensAccount } = useWeb3();
  const [profileHandle, setProfileHandle] = useState('');
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);
  const [isVisualizeLoading, setIsVisualizeLoading] = useState(false);
  const [isScreenshotLoading, setIsScreenshotLoading] = useState(false);
  const [initialHandle] = useState<string>('lens/avail_project');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [graphImageUrl, setGraphImageUrl] = useState('');
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [error, setError] = useState('');
  // Start with null initially so no animation occurs
  const [targetHandle, setTargetHandle] = useState<string | null>(null);
  const [networkData, setNetworkData] = useState({
    nodes: processNetworkData(initialData).nodes,
    links: processNetworkData(initialData).edges
  });
  const [networkClusters, setNetworkClusters] = useState<number>(0); // Track number of clusters
  const [createdNetworks, setCreatedNetworks] = useState<Set<string>>(new Set(['lens/avail_project']));
  const [currentNetwork, setCurrentNetwork] = useState<string>('lens/avail_project');
  const [selectedNode, setSelectedNode] = useState<{
    label: string;
    followers: number;
    following: number;
    posts: number;
    lensScore: number;
  } | null>(null);
  
  // Get the ordered list of networks
  const orderedNetworks = useMemo(() => {
    return Array.from(createdNetworks);
  }, [createdNetworks]);
  
  // Handle network switching
  const handleNetworkSwitch = (network: string) => {
    if (network === currentNetwork) return;
    
    setCurrentNetwork(network);
    
    // Find the node corresponding to this network
    const node = networkData.nodes.find(
      (n: any) => {
        const nLabel = n.label?.toLowerCase();
        const nName = n.name?.toLowerCase();
        return nLabel === network.toLowerCase() || nName === network.toLowerCase();
      }
    );
    
    if (node) {
      // Just directly update to the new network node without toggling null state
      // This preserves auto-rotate state since we're not changing null/non-null state
      // We're depending on NetworkGraph component to not toggle auto-rotate on targetHandle changes
      setTargetHandle(node.label);
      
      // Update selected node info
      setSelectedNode({
        label: node.label,
        followers: node.followers || 0,
        following: node.following || 0,
        posts: Math.floor(Math.random() * 200) + 10, // Placeholder for posts data
        lensScore: node.lensScore
      });
    }
  };

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
        posts: 42,
        lensScore: initialNode.lensScore
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
              posts: Math.floor(Math.random() * 200) + 10, // Placeholder for posts data
              lensScore: node.lensScore
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

  // Initialize with lens handle when connected and handle is available
  useEffect(() => {
    if (connected && lensAccount?.handle?.fullHandle) {
      const handle = lensAccount.handle.fullHandle;
      setSelectedOption({ value: handle, label: handle });
      setProfileHandle(handle);
    }
  }, [connected, lensAccount]);

  const handleSearch = async () => {
    setIsVisualizeLoading(true);
    try {
      // Clean up the handle: remove 'lens/' prefix if present and .lens suffix if present
      let cleanHandle = profileHandle.trim()
        .replace('lens/', '')
        .replace('.lens', '')
        .toLowerCase(); // Normalize to lowercase
      
      const fullHandle = `lens/${cleanHandle}`;
      
      // Check if the handle is the current target
      if (targetHandle === fullHandle) {
        // We're already focused on this node
        setIsVisualizeLoading(false);
        return;
      }
      
      // Check if we've already created this network
      if (createdNetworks.has(fullHandle)) {
        console.log("Network already exists, focusing on it:", fullHandle);
        
        // Update current network
        setCurrentNetwork(fullHandle);
        
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
            posts: Math.floor(Math.random() * 200) + 10,
            lensScore: existingNode.lensScore
          });
          
          // Set target handle with animation
          setTargetHandle(null); // Reset first
          setTimeout(() => {
            setTargetHandle(existingNode.label);
          }, 50);
        }
        
        setIsVisualizeLoading(false);
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
      
      // Find overlapping nodes between networks
      interface NetworkNode {
        id: string;
        label: string;
        position: [number, number, number];
        name?: string;
      }
      
      // Ensure nodes are properly typed before mapping
      const typedExistingNodes = networkData.nodes as NetworkNode[];
      const typedNewNodes = processedWithOffset.nodes as NetworkNode[];
      
      const existingNodeMap = new Map(typedExistingNodes.map(node => [node.label.toLowerCase(), node]));
      const newNodeMap = new Map(typedNewNodes.map(node => [node.label.toLowerCase(), node]));
      
      // Create inter-cluster connections
      const interClusterLinks: { source: string; target: string }[] = [];
      
      // Find the main node of the new network (first node)
      const newMainNode = typedNewNodes[0];
      if (!newMainNode) {
        throw new Error('No main node found in new network');
      }
      
      // For each node in the new network
      for (const newNode of typedNewNodes) {
        // If this node exists in the old network
        const existingNode = existingNodeMap.get(newNode.label.toLowerCase());
        if (existingNode && newNode.id !== newMainNode.id) {
          // Create a connection between the main node and the existing node
          interClusterLinks.push({
            source: newMainNode.id,
            target: existingNode.id
          });
        }
      }
      
      // Create completely new network data with inter-cluster connections
      setNetworkData({
        nodes: [...networkData.nodes, ...processedWithOffset.nodes],
        links: [...networkData.links, ...processedWithOffset.edges, ...interClusterLinks]
      });
      
      // Increment cluster count
      setNetworkClusters(clusterIndex);
      
      // Add to created networks
      setCreatedNetworks(prev => {
        const newSet = new Set(prev);
        newSet.add(fullHandle);
        return newSet;
      });
      
      // Set current network to the newly searched network
      setCurrentNetwork(fullHandle);
      
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
          posts: Math.floor(Math.random() * 200) + 10, // Placeholder for posts data
          lensScore: targetNode.lensScore 
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
      setIsVisualizeLoading(false);
    }
  };

  const handleTakeScreenshot = async () => {
    setIsScreenshotLoading(true);
    try {
      // Clean up the handle: remove 'lens/' prefix if present and .lens suffix if present
      let cleanHandle = profileHandle.trim()
        .replace('lens/', '')
        .replace('.lens', '')
        .toLowerCase(); // Normalize to lowercase
      
      const response = await fetch(`/api/action?handle=${cleanHandle}`);
      if (!response.ok) throw new Error('Failed to capture screenshot');
    } catch (error) {
      console.error('Error taking screenshot:', error);
      alert('Something went wrong!');
    } finally {
      setIsScreenshotLoading(false);
    }
  };

  const handleGenerateCard = async () => {
    setIsModalLoading(true);
    setError('');

    try {
      // Clean up the handle: remove 'lens/' prefix if present and .lens suffix if present
      let cleanHandle = profileHandle.trim()
        .replace('lens/', '')
        .replace('.lens', '')
        .toLowerCase(); // Normalize to lowercase

        
      
      const response = await fetch(`/api/action?handle=${cleanHandle}`);

      const data = await response.json();
      console.log(`Data received: ${data.imageUrl}`)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setGraphImageUrl(data.imageUrl);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error:', err);
    } finally {
      setIsModalLoading(false);
    }
  };

  // Update the profileHandle when a selection is made in the MultiSelectInput
  const handleSelectChange = (selected: { value: string; label: string } | null) => {
    setSelectedOption(selected);
    if (selected) {
      setProfileHandle(selected.value);
    } else {
      setProfileHandle('');
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Dashboard */}
      <Dashboard 
        selectedNode={selectedNode} 
        networks={orderedNetworks}
        currentNetwork={currentNetwork}
        onNetworkSwitch={handleNetworkSwitch}
      />

      {/* Floating search bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-1 border-gray-800">
          <CardBody>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2 md:gap-4">
                <div className="flex flex-row w-full items-center gap-2">
                  <div className="flex-1">
                    <MultiSelectInput
                      optionType="lens"
                      selectedValue={selectedOption}
                      onChange={handleSelectChange}
                      placeholder="Enter a Lens handle..."
                      extra="w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2 w-32 md:w-auto">
                  <Button
                    color="primary"
                    onClick={handleSearch}
                    isDisabled={!profileHandle.trim() || isVisualizeLoading}
                    size="lg"
                    radius="lg"
                    className="flex-1 md:flex-none text-black bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC] font-semibold"
                  >
                    <>
                      {isVisualizeLoading ? (
                        <>
                          <span className="hidden md:inline">Visualizing Network</span>
                          <span className="md:hidden">Visualizing...</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden md:inline">Visualize Network</span>
                          <span className="md:hidden">Visualize</span>
                        </>
                      )}
                    </>
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      

      {/* Full screen visualization */}
      <div className="w-full h-full">
        <SocialCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          lensHandle={selectedNode?.label || 'availproject'}
          graphImageUrl={graphImageUrl}
          profileData={(
            {
              name: selectedNode?.label || 'availproject',
              followers: selectedNode?.followers || 0,
              following: selectedNode?.following || 0,
              posts: selectedNode?.posts || 0,
              score: selectedNode?.lensScore || 0
            })
          }
        />
        <NetworkGraph
          nodes={networkData.nodes}
          links={networkData.links}
          targetHandle={targetHandle}
          initialHandle={initialHandle}
          networks={orderedNetworks}
          currentNetwork={currentNetwork}
          onNetworkSwitch={handleNetworkSwitch}
        />
      </div>

      {/* Powered by Avail tag - Desktop */}
      <a 
        href="https://www.availproject.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 z-50 hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-900/70 backdrop-blur-sm rounded-full border border-gray-800 hover:bg-gray-800/70 transition-colors"
      >
        <span className="text-sm font-medium bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC] text-transparent bg-clip-text">
          Built by Avail
        </span>
      </a>
    </main>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}