import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Button, Divider } from '@nextui-org/react';
import { ChevronRightIcon, ChevronLeftIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface DashboardProps {
  selectedNode: {
    label: string;
    followers: number;
    following: number;
    posts: number;
    lensScore: number;
  } | null;
  searchHistory: string[];
}

export default function Dashboard({ selectedNode, searchHistory = [] }: DashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileIsOpen, setMobileIsOpen] = useState(false);
  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);

  // Auto-open dashboard when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setIsOpen(true);
      setMobileIsOpen(true);
    }
  }, [selectedNode]);

  // Add event listener to collapse dashboard when clicking on canvas
  useEffect(() => {
    const handleCanvasClick = (e: MouseEvent) => {
      // Check if click is outside the dashboard
      if (mobileSheetRef.current && !mobileSheetRef.current.contains(e.target as Node)) {
        setMobileIsOpen(false);
      }
    };

    // Add the event listener
    document.addEventListener('click', handleCanvasClick);

    // Clean up
    return () => {
      document.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    currentY.current = e.touches[0].clientY;
    
    // Calculate the difference
    const diff = currentY.current - startY.current;
    
    // If swiping down and dashboard is open, or swiping up and dashboard is closed
    if ((diff > 0 && mobileIsOpen) || (diff < 0 && !mobileIsOpen)) {
      // Prevent default to stop page scrolling
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (startY.current === null || currentY.current === null) return;
    
    // Calculate the difference
    const diff = currentY.current - startY.current;
    
    // Threshold for swipe (in pixels)
    const threshold = 50;
    
    // If swiped up significantly, open the dashboard
    if (diff < -threshold && !mobileIsOpen) {
      setMobileIsOpen(true);
    }
    
    // If swiped down significantly, close the dashboard
    if (diff > threshold && mobileIsOpen) {
      setMobileIsOpen(false);
    }
    
    // Reset
    startY.current = null;
    currentY.current = null;
  };

  return (
    <>
      {/* Desktop Dashboard Panel */}
      <div 
        className={`hidden md:block fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-[-280px]'
        }`}
      >
        {/* Visible Edge When Collapsed */}
        <div className="absolute right-0 top-0 h-full w-[20px] bg-gray-900/90 backdrop-blur-md border-r border-gray-800" />
        
        <Card className="h-full w-[320px] bg-gray-900/90 backdrop-blur-md border-r border-gray-800">
          <CardBody className="p-0 overflow-y-auto">
            {/* Dashboard Header */}
            <div className={`flex items-center justify-between ${isOpen ? 'p-6' : 'p-0'}`}>
              <div className="flex-1 mr-4">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {selectedNode ? selectedNode.label : 'Network Explorer'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {selectedNode 
                    ? 'Profile Statistics' 
                    : 'Select a node to view details'}
                </p>
              </div>
              <Button
                isIconOnly
                className={`bg-gray-900/90 backdrop-blur-md hover:bg-gray-800/90 ${isOpen ? 'border border-gray-800' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <ChevronLeftIcon className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="h-6 w-6 text-gray-400" />
                )}
              </Button>
            </div>

            <Divider className="bg-gray-800" />

            {/* Stats Section */}
            {selectedNode && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-800/50 border border-gray-700">
                    <CardBody className="p-4">
                      <p className="text-sm text-gray-400">Followers</p>
                      <p className="text-2xl font-semibold text-white">
                        {selectedNode.followers.toLocaleString()}
                      </p>
                    </CardBody>
                  </Card>
                  <Card className="bg-gray-800/50 border border-gray-700">
                    <CardBody className="p-4">
                      <p className="text-sm text-gray-400">Following</p>
                      <p className="text-2xl font-semibold text-white">
                        {selectedNode.following.toLocaleString()}
                      </p>
                    </CardBody>
                  </Card>
                </div>
                <Card className="bg-gray-800/50 border border-gray-700">
                  <CardBody className="p-4">
                    <p className="text-sm text-gray-400">Total Posts</p>
                    <p className="text-2xl font-semibold text-white">
                      {selectedNode.posts.toLocaleString()}
                    </p>
                  </CardBody>
                </Card>
                <Card className="bg-gray-800/50 border border-gray-700">
                  <CardBody className="p-4">
                    <p className="text-lg font-bold text-gray-400">Lens Score</p>
                    <p className="text-2xl font-semibold text-white">
                      {(selectedNode.lensScore / 100).toLocaleString()} / 100
                    </p>
                  </CardBody>
                </Card>

                {/* Network Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Network</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400">Connection Strength</p>
                      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#44D5DE] to-[#3CA3FC]" 
                          style={{ width: '75%' }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400">Engagement Rate</p>
                      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#EDC7FC] to-[#FEC7C7]" 
                          style={{ width: '60%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search History Section */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Recent Searches</h3>
              {searchHistory.length > 0 ? (
                <div className="space-y-2 w-full">
                  {searchHistory.slice(0, 5).map((handle, index) => (
                    <Card 
                      key={index} 
                      className="w-full bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors"
                      isPressable
                      onPress={() => {
                        window.dispatchEvent(new CustomEvent('updateTargetHandle', { 
                          detail: { handle: handle.toLowerCase() } 
                        }));
                      }}
                    >
                      <CardBody className="p-3 flex items-center justify-between">
                        <div className="flex items-center overflow-hidden">
                          <div className="w-2 h-2 flex-shrink-0 rounded-full bg-[#BCE3FE] mr-3"></div>
                          <p className="text-white font-medium truncate">{handle}</p>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No recent searches</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Mobile Bottom Sheet Dashboard */}
      <div 
        ref={mobileSheetRef}
        className={`md:hidden fixed bottom-0 left-0 right-0 z-20 transition-transform duration-300 ease-in-out touch-none ${
          mobileIsOpen ? 'translate-y-0' : 'translate-y-[calc(100%-55px)]'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Card className="rounded-t-xl bg-gray-900/90 backdrop-blur-md border-t border-x border-gray-800 max-h-[80vh] overflow-hidden">
          {/* Drag Handle */}
          <div 
            className="h-8 flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling to document
              setMobileIsOpen(!mobileIsOpen);
            }}
          >
            <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
          </div>
          
          {/* Mobile Dashboard Header */}
          <div className="px-4 pb-2 text-center">
            <div>
              <p className="text-gray-400 text-xs mb-1">
                {selectedNode ? 'Profile Statistics' : 'Network Explorer'}
              </p>
              <h2 className="text-lg font-semibold text-white">
                {selectedNode ? selectedNode.label : 'Select a node'}
              </h2>
            </div>
          </div>

          <Divider className="bg-gray-800" />
          
          {/* Mobile Dashboard Content */}
          <CardBody className="overflow-y-auto p-0">
            {selectedNode && (
              <div className="px-4 py-3 space-y-3 bg-gray-800/20">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Followers</p>
                    <p className="text-base font-semibold text-white">
                      {selectedNode.followers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Following</p>
                    <p className="text-base font-semibold text-white">
                      {selectedNode.following.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Posts</p>
                    <p className="text-base font-semibold text-white">
                      {selectedNode.posts.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lens Score</p>
                    <p className="text-base font-semibold text-white">
                      {(selectedNode.lensScore / 100).toLocaleString()} / 100
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
} 