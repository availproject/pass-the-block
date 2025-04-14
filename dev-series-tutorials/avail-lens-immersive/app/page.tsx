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
import toast, { Toaster } from 'react-hot-toast';


export default function Home() {
  const { connected, lensAccount, signMessage, address, walletClient } = useWeb3();
  const [profileHandle, setProfileHandle] = useState('');
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);
  const [isVisualizeLoading, setIsVisualizeLoading] = useState(false);
  const [isScreenshotLoading, setIsScreenshotLoading] = useState(false);
  const [initialHandle] = useState<string>('lens/avail_project');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [graphImageUrl, setGraphImageUrl] = useState('');
  const [socialCardImageUrl, setSocialCardImageUrl] = useState('');
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastPostId, setLastPostId] = useState<string | null>(null);
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

  // Function to handle the social card image capture
  const handleSocialCardCapture = async (imageUrl: string) => {
    console.log("Social card captured");
    
    // Don't proceed if we already have a social card image URL that's not a data URL
    // This prevents multiple captures
    if (socialCardImageUrl && !socialCardImageUrl.startsWith('data:')) {
      console.log("Social card already captured and saved, skipping duplicate capture");
      return;
    }
    
    // Set the data URL immediately to prevent duplicate captures during processing
    setSocialCardImageUrl(imageUrl);
    
    try {
      // Save the image to the server
      const cleanHandle = profileHandle.trim()
        .replace('lens/', '')
        .replace('.lens', '')
        .toLowerCase();
        
      const fileName = `${cleanHandle}_social_card.png`;
      
      const response = await fetch('/api/saveImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageDataUrl: imageUrl,
          fileName: fileName
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log("Social card image saved:", data.imageUrl);
        // Update the state with the server path to the saved image
        setSocialCardImageUrl(data.imageUrl);
      } else {
        console.error("Failed to save social card image:", data.error);
      }
    } catch (error) {
      console.error("Error saving social card image:", error);
    }
  };

  // Function to handle posting to Lens
  const handlePostToLens = async () => {
    if (!connected || !lensAccount || !address) {
      toast.error('Please connect your wallet and ensure you have a Lens account', {
        icon: '🔒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    setIsModalLoading(true);
    setError('');

    try {
      // First generate the card - this was previously in handleGenerateCard
      console.log("Generating social card...");
      
      // If we don't already have an image URL, generate one
      if (!graphImageUrl) {
        // Clean up the handle
        let cleanHandle = profileHandle.trim()
          .replace('lens/', '')
          .replace('.lens', '')
          .toLowerCase();
        
        const response = await fetch(`/api/action?handle=${cleanHandle}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate image');
        }
        
        setGraphImageUrl(data.imageUrl);
      }
      
      // Show the modal with the generated image - it will trigger the screenshot
      setIsModalOpen(true);
      
      // Wait for social card to be captured and saved - maximum 5 seconds
      let timeout = 0;
      while (!socialCardImageUrl && timeout < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        timeout++;
      }
      
      if (!socialCardImageUrl) {
        console.log("Timed out waiting for social card capture, falling back to graph image");
      }
      
      // Now proceed with the Lens authentication and posting
      console.log("Authenticating with Lens...");
      
      // Create a wrapper for signMessage that ensures string return (no null)
      const signMessageWrapper = async (message: string): Promise<string> => {
        const signature = await signMessage(message);
        if (!signature) {
          throw new Error('Failed to sign message');
        }
        return signature;
      };

      // Authenticate for posting using the wallet address, not the Lens handle
      console.log("Using wallet address for authentication:", address);
      console.log("Lens account ID:", lensAccount?.id);
      const authResult = await authenticateForPosting(address, signMessageWrapper, lensAccount?.id);
      
      if (!authResult.success) {
        throw new Error('Failed to authenticate with Lens');
      }

      // Create post content
      const content = `Check out this network visualization for ${profileHandle}! Made with Lens Visualization Tool by Avail Project.`;
      
      // Use the social card image if available, otherwise fall back to the graph image
      const imageToPost = socialCardImageUrl || graphImageUrl;
      
      // Get the full URL for the image
      let fullImageUrl = imageToPost;
      if (!imageToPost.startsWith('data:') && !imageToPost.startsWith('http')) {
        // If it's a relative path, convert to an absolute URL
        const origin = window.location.origin;
        fullImageUrl = `${origin}/${imageToPost}`;
      }
      
      // Post to Lens
      console.log("Posting to Lens with image:", fullImageUrl);
      const postResult = await postToLens(
        authResult.sessionClient,
        content,
        fullImageUrl,
        profileHandle
      );

      if (!postResult.success) {
        throw new Error('Failed to post to Lens');
      }

      // Close the modal
      setIsModalOpen(false);

      // Construct lens.xyz URL to view the post
      const lensUrl = lensAccount?.handle?.localName ? `https://hey.xyz/u/${lensAccount?.handle?.localName}` : 'https://hey.xyz';

      // Show success toast with view link
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p>Successfully posted to Lens!</p>
          <a 
            href={lensUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#44D5DE] hover:bg-[#3bc0c9] text-black px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
            onClick={() => toast.dismiss(t.id)}
          >
            View on Lens
          </a>
        </div>
      ), {
        icon: '🎉',
        duration: 8000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          minWidth: '250px',
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error posting to Lens:', err);
      
      // Show error toast instead of alert
      toast.error(`Error posting to Lens: ${err instanceof Error ? err.message : 'Unknown error'}`, {
        icon: '❌',
        duration: 5000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
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

  // Add View on Lens button to the UI
  const renderViewLensButton = () => {
    if (!lastPostId && (!lensAccount || !lensAccount.handle || !lensAccount.handle.localName)) return null;
    
    const lensUrl = lastPostId 
      ? `https://hey.xyz/posts/${lastPostId}` 
      : `https://hey.xyz/${lensAccount?.handle?.localName}`;
    
    return (
      <a 
        href={lensUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-gray-900/70 backdrop-blur-sm rounded-full border border-gray-800 hover:bg-gray-800/70 transition-colors"
      >
        <span className="text-sm font-medium bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC] text-transparent bg-clip-text">
          View on Lens
        </span>
      </a>
    );
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Toast container */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      {/* Wallet button for desktop */}
      <div className="absolute top-4 right-4 z-20 hidden md:block">
        <WalletButton />
      </div>
      
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
            <div className="flex flex-col gap-3 md:gap-0 md:gap-x-3">
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
                    className={`flex-1 md:flex-none ${profileHandle.trim() && !isVisualizeLoading ? 'text-black bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC]' : 'bg-gray-800 text-white'} font-semibold`}
                  >
                    <>
                      {isVisualizeLoading ? (
                        <>
                          <span className="hidden md:inline">Visualizing...</span>
                          <span className="md:hidden">Visualizing...</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden md:inline">Visualize</span>
                          <span className="md:hidden">Visualize</span>
                        </>
                      )}
                    </>
                  </Button>
                  
                  {/* Post to Lens button for desktop */}
                  <Button
                    color="secondary"
                    onClick={handlePostToLens}
                    isLoading={isModalLoading}
                    isDisabled={!connected || !selectedNode}
                    size="lg"
                    radius="lg"
                    className={`hidden md:flex ${connected && selectedNode && !isModalLoading ? 'text-black bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC]' : 'bg-gray-800 text-white border-gray-700'}`}
                  >
                    {isModalLoading ? (
                      <span>Processing...</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>Post to</span>
                        <svg width="60" height="30" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                          <path fillRule="evenodd" clipRule="evenodd" d="M21.1625 5.66312C22.1496 4.74966 23.4447 4.18348 24.8881 4.18298C28.0955 4.18405 30.6939 6.78463 30.6939 9.9942C30.6939 12.7709 27.9461 15.1454 27.2592 15.6922C24.0469 18.2502 19.8628 19.746 15.3469 19.746C10.8311 19.746 6.64696 18.2502 3.43472 15.6922C2.75168 15.1454 0 12.767 0 9.9942C0 6.78397 2.59946 4.18298 5.80389 4.18298C7.24803 4.18298 8.54386 4.74926 9.53134 5.66312L9.63282 5.61235C9.8592 2.61691 12.2947 0.25415 15.3469 0.25415C18.3992 0.25415 20.8347 2.61691 21.0611 5.61235L21.1625 5.66312ZM22.3218 11.4404C22.7628 11.8817 23.079 12.4128 23.2546 12.9947H23.2585C23.3405 13.2603 23.157 13.5376 22.8838 13.5844C22.6535 13.6235 22.4311 13.479 22.3608 13.2525C22.2281 12.8229 21.9939 12.4284 21.666 12.1004C21.1352 11.5693 20.4288 11.2763 19.6755 11.2763C19.6462 11.2763 19.6179 11.2783 19.5896 11.2803C19.5613 11.2822 19.533 11.2842 19.5037 11.2842C19.9253 11.4794 20.2219 11.9051 20.2219 12.4011C20.2219 13.0845 19.6716 13.6352 18.9885 13.6352C18.3055 13.6352 17.7552 13.0806 17.7552 12.4011C17.7552 12.2449 17.7864 12.0926 17.841 11.9559C17.7864 12.0028 17.7317 12.0496 17.681 12.1004C17.3531 12.4284 17.119 12.8229 16.9862 13.2525C16.9199 13.479 16.6974 13.6235 16.4632 13.5844C16.19 13.5376 16.0066 13.2603 16.0885 12.9947C16.2642 12.4128 16.5803 11.8817 17.0214 11.4404C17.7278 10.7335 18.6724 10.343 19.6716 10.343C20.6708 10.343 21.6153 10.7335 22.3218 11.4404ZM10.9405 11.2803L10.9405 11.2803L10.9405 11.2803C10.9688 11.2784 10.9971 11.2764 11.0264 11.2764C11.7797 11.2764 12.4861 11.5693 13.0169 12.1005C13.3448 12.4285 13.579 12.823 13.7117 13.2526C13.7819 13.4791 14.0044 13.6236 14.2347 13.5845C14.5079 13.5377 14.6914 13.2604 14.6094 12.9948C14.4338 12.4129 14.1176 11.8818 13.6766 11.4405C12.9701 10.7336 12.0256 10.3431 11.0264 10.3431C10.0272 10.3431 9.08263 10.7336 8.37617 11.4405C7.93512 11.8818 7.61897 12.4129 7.44333 12.9948C7.36136 13.2604 7.54481 13.5377 7.81803 13.5845C8.05221 13.6236 8.27469 13.4791 8.34104 13.2526C8.47374 12.823 8.70793 12.4285 9.03579 12.1005C9.08653 12.0497 9.14117 12.0028 9.19582 11.956C9.14117 12.0927 9.10995 12.245 9.10995 12.4012C9.10995 13.0807 9.66028 13.6353 10.3433 13.6353C11.0264 13.6353 11.5767 13.0846 11.5767 12.4012C11.5767 11.9052 11.2801 11.4795 10.8585 11.2843H10.8546C10.8839 11.2843 10.9122 11.2823 10.9405 11.2803ZM15.3512 15.7909C16.0694 15.7909 16.7251 15.5176 17.2247 15.0723C17.4082 14.9122 17.6775 14.9044 17.857 15.0645C18.06 15.2442 18.0717 15.5683 17.8687 15.7519C17.2052 16.3572 16.3192 16.7282 15.3512 16.7282C14.3833 16.7282 13.5012 16.3572 12.8337 15.7519C12.6308 15.5683 12.6425 15.2481 12.8454 15.0645C13.0289 14.9005 13.2982 14.9122 13.4777 15.0723C13.9734 15.5176 14.6331 15.7909 15.3512 15.7909Z" fill="#000000" />
                          <g clipPath="url(#clip0_lens)">
                            <path d="M74.5344 16.914C77.716 16.914 80.0002 15.6087 80.0002 12.9982C80.0002 11.1219 78.8157 9.80032 76.2476 8.83769L75.5949 8.59295C74.5703 8.20872 73.9633 7.85874 73.9633 7.20611C73.9633 5.73769 77.2265 6.30874 78.9397 6.71664L79.837 3.94295C78.7765 3.61664 77.6344 3.3719 76.0028 3.3719C72.7397 3.3719 70.6186 5.00348 70.6186 7.28769C70.6186 9.00085 71.8292 10.0907 73.4739 10.7956L74.616 11.2851C76.0934 11.9181 76.8186 12.1824 76.8186 12.8351C76.8186 13.4061 76.0028 13.8956 74.616 13.8956C73.5555 13.8956 72.4133 13.7324 71.1897 13.4877L70.7818 16.4245C71.6791 16.6693 72.9028 16.914 74.5344 16.914ZM58.7081 16.7509H61.9712V8.91927C61.9712 7.20611 62.8686 6.22716 64.337 6.22716C65.8054 6.22716 66.6212 7.28769 66.6212 9.00085V16.7509H69.8844V8.75611C69.8844 5.49295 68.0897 3.20874 64.337 3.20874C60.9923 3.20874 58.7081 5.49295 58.7081 8.75611V16.7509ZM44.3502 16.914C45.4923 16.914 46.3897 16.7509 47.2054 16.4245L46.8791 13.4061C44.5949 13.8956 41.9028 13.9772 41.9028 11.2851V3.77979H38.6396V11.6114C38.6396 15.1193 40.6791 16.914 44.3502 16.914ZM46.716 9.9798C46.716 15.2604 50.4621 16.9817 53.8182 16.9817C55.1488 16.9817 56.5258 16.7109 57.548 16.2842L57.1475 13.4012C56.069 13.7104 54.9457 13.8156 53.9218 13.8156C51.8318 13.8156 49.9065 13.1222 49.9065 10.2825V9.73506C49.9065 7.49572 51.0135 6.31037 52.6541 6.31037C53.7309 6.31037 54.6299 6.93037 54.6299 8.10348C54.6299 9.52866 52.7365 10.1748 49.3273 10.0614L49.4905 11.9377C53.7758 13.1565 57.8115 11.8422 57.8115 8.0219C57.8115 5.32816 55.7525 3.45021 52.7773 3.45021C49.1976 3.45021 46.7168 6.00364 46.7168 9.9798H46.716Z" fill="#000000" />
                          </g>
                          <defs>
                            <clipPath id="clip0_lens">
                              <rect width="41.3605" height="13.773" fill="white" transform="translate(38.6392 3.20874)" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
                <div className="flex flex-row justify-between items-center">
                  {/* Wallet button for mobile */}
                  <div className="md:hidden">
                    <WalletButton />
                  </div>
                  
                  {/* Post to Lens button for mobile only - always visible but disabled when needed */}
                  <Button
                    color="secondary"
                    onClick={handlePostToLens}
                    isLoading={isModalLoading}
                    isDisabled={!connected || !selectedNode}
                    size="md"
                    radius="full"
                    className={`md:hidden ${connected && selectedNode && !isModalLoading ? 'text-black bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC]' : 'bg-gray-800 text-white border-gray-700'}`}
                  >
                    {isModalLoading ? (
                      <span>Processing...</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>Post to</span>
                        <svg width="60" height="30" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                          <path fillRule="evenodd" clipRule="evenodd" d="M21.1625 5.66312C22.1496 4.74966 23.4447 4.18348 24.8881 4.18298C28.0955 4.18405 30.6939 6.78463 30.6939 9.9942C30.6939 12.7709 27.9461 15.1454 27.2592 15.6922C24.0469 18.2502 19.8628 19.746 15.3469 19.746C10.8311 19.746 6.64696 18.2502 3.43472 15.6922C2.75168 15.1454 0 12.767 0 9.9942C0 6.78397 2.59946 4.18298 5.80389 4.18298C7.24803 4.18298 8.54386 4.74926 9.53134 5.66312L9.63282 5.61235C9.8592 2.61691 12.2947 0.25415 15.3469 0.25415C18.3992 0.25415 20.8347 2.61691 21.0611 5.61235L21.1625 5.66312ZM22.3218 11.4404C22.7628 11.8817 23.079 12.4128 23.2546 12.9947H23.2585C23.3405 13.2603 23.157 13.5376 22.8838 13.5844C22.6535 13.6235 22.4311 13.479 22.3608 13.2525C22.2281 12.8229 21.9939 12.4284 21.666 12.1004C21.1352 11.5693 20.4288 11.2763 19.6755 11.2763C19.6462 11.2763 19.6179 11.2783 19.5896 11.2803C19.5613 11.2822 19.533 11.2842 19.5037 11.2842C19.9253 11.4794 20.2219 11.9051 20.2219 12.4011C20.2219 13.0845 19.6716 13.6352 18.9885 13.6352C18.3055 13.6352 17.7552 13.0806 17.7552 12.4011C17.7552 12.2449 17.7864 12.0926 17.841 11.9559C17.7864 12.0028 17.7317 12.0496 17.681 12.1004C17.3531 12.4284 17.119 12.8229 16.9862 13.2525C16.9199 13.479 16.6974 13.6235 16.4632 13.5844C16.19 13.5376 16.0066 13.2603 16.0885 12.9947C16.2642 12.4128 16.5803 11.8817 17.0214 11.4404C17.7278 10.7335 18.6724 10.343 19.6716 10.343C20.6708 10.343 21.6153 10.7335 22.3218 11.4404ZM10.9405 11.2803L10.9405 11.2803L10.9405 11.2803C10.9688 11.2784 10.9971 11.2764 11.0264 11.2764C11.7797 11.2764 12.4861 11.5693 13.0169 12.1005C13.3448 12.4285 13.579 12.823 13.7117 13.2526C13.7819 13.4791 14.0044 13.6236 14.2347 13.5845C14.5079 13.5377 14.6914 13.2604 14.6094 12.9948C14.4338 12.4129 14.1176 11.8818 13.6766 11.4405C12.9701 10.7336 12.0256 10.3431 11.0264 10.3431C10.0272 10.3431 9.08263 10.7336 8.37617 11.4405C7.93512 11.8818 7.61897 12.4129 7.44333 12.9948C7.36136 13.2604 7.54481 13.5377 7.81803 13.5845C8.05221 13.6236 8.27469 13.4791 8.34104 13.2526C8.47374 12.823 8.70793 12.4285 9.03579 12.1005C9.08653 12.0497 9.14117 12.0028 9.19582 11.956C9.14117 12.0927 9.10995 12.245 9.10995 12.4012C9.10995 13.0807 9.66028 13.6353 10.3433 13.6353C11.0264 13.6353 11.5767 13.0846 11.5767 12.4012C11.5767 11.9052 11.2801 11.4795 10.8585 11.2843H10.8546C10.8839 11.2843 10.9122 11.2823 10.9405 11.2803ZM15.3512 15.7909C16.0694 15.7909 16.7251 15.5176 17.2247 15.0723C17.4082 14.9122 17.6775 14.9044 17.857 15.0645C18.06 15.2442 18.0717 15.5683 17.8687 15.7519C17.2052 16.3572 16.3192 16.7282 15.3512 16.7282C14.3833 16.7282 13.5012 16.3572 12.8337 15.7519C12.6308 15.5683 12.6425 15.2481 12.8454 15.0645C13.0289 14.9005 13.2982 14.9122 13.4777 15.0723C13.9734 15.5176 14.6331 15.7909 15.3512 15.7909Z" fill="#000000" />
                          <g clipPath="url(#clip0_lens)">
                            <path d="M74.5344 16.914C77.716 16.914 80.0002 15.6087 80.0002 12.9982C80.0002 11.1219 78.8157 9.80032 76.2476 8.83769L75.5949 8.59295C74.5703 8.20872 73.9633 7.85874 73.9633 7.20611C73.9633 5.73769 77.2265 6.30874 78.9397 6.71664L79.837 3.94295C78.7765 3.61664 77.6344 3.3719 76.0028 3.3719C72.7397 3.3719 70.6186 5.00348 70.6186 7.28769C70.6186 9.00085 71.8292 10.0907 73.4739 10.7956L74.616 11.2851C76.0934 11.9181 76.8186 12.1824 76.8186 12.8351C76.8186 13.4061 76.0028 13.8956 74.616 13.8956C73.5555 13.8956 72.4133 13.7324 71.1897 13.4877L70.7818 16.4245C71.6791 16.6693 72.9028 16.914 74.5344 16.914ZM58.7081 16.7509H61.9712V8.91927C61.9712 7.20611 62.8686 6.22716 64.337 6.22716C65.8054 6.22716 66.6212 7.28769 66.6212 9.00085V16.7509H69.8844V8.75611C69.8844 5.49295 68.0897 3.20874 64.337 3.20874C60.9923 3.20874 58.7081 5.49295 58.7081 8.75611V16.7509ZM44.3502 16.914C45.4923 16.914 46.3897 16.7509 47.2054 16.4245L46.8791 13.4061C44.5949 13.8956 41.9028 13.9772 41.9028 11.2851V3.77979H38.6396V11.6114C38.6396 15.1193 40.6791 16.914 44.3502 16.914ZM46.716 9.9798C46.716 15.2604 50.4621 16.9817 53.8182 16.9817C55.1488 16.9817 56.5258 16.7109 57.548 16.2842L57.1475 13.4012C56.069 13.7104 54.9457 13.8156 53.9218 13.8156C51.8318 13.8156 49.9065 13.1222 49.9065 10.2825V9.73506C49.9065 7.49572 51.0135 6.31037 52.6541 6.31037C53.7309 6.31037 54.6299 6.93037 54.6299 8.10348C54.6299 9.52866 52.7365 10.1748 49.3273 10.0614L49.4905 11.9377C53.7758 13.1565 57.8115 11.8422 57.8115 8.0219C57.8115 5.32816 55.7525 3.45021 52.7773 3.45021C49.1976 3.45021 46.7168 6.00364 46.7168 9.9798H46.716Z" fill="#000000" />
                          </g>
                          <defs>
                            <clipPath id="clip0_lens">
                              <rect width="41.3605" height="13.773" fill="white" transform="translate(38.6392 3.20874)" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </Button>
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
          onCardCapture={handleSocialCardCapture}
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