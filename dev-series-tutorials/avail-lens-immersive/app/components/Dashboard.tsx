import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Divider } from '@nextui-org/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

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

  // Auto-open dashboard when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setIsOpen(true);
    }
  }, [selectedNode]);

  return (
    <>
      {/* Dashboard Panel with Visible Edge */}
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
                  <Card className="bg-gray-800/50 border border-gray-700">
                    <CardBody className="p-4">
                      <p className="text-sm text-gray-400">Total Posts</p>
                      <p className="text-2xl font-semibold text-white">
                        {selectedNode.posts.toLocaleString()}
                      </p>
                    </CardBody>
                  </Card>
                </div>

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
    </>
  );
} 