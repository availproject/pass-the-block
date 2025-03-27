'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Button, Switch, Slider } from '@nextui-org/react';
import { 
  ArrowPathIcon, 
  CubeTransparentIcon, 
  ChevronUpIcon, 
  ChevronDownIcon, 
  PauseIcon, 
  PlayIcon, 
  MinusIcon, 
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface GraphControlsProps {
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  rotateSpeed: number;
  setRotateSpeed: (value: number) => void;
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  networks?: string[];
  currentNetwork?: string;
  switchNetwork?: (network: string) => void;
}

const GraphControls: React.FC<GraphControlsProps> = ({
  autoRotate,
  setAutoRotate,
  rotateSpeed,
  setRotateSpeed,
  resetCamera,
  zoomIn,
  zoomOut,
  networks = [],
  currentNetwork = '',
  switchNetwork
}) => {
  return (
    <div className="w-full">
      <Card className="bg-gray-900/70 backdrop-blur-sm border-1 border-gray-800">
        <CardBody className="p-3">
          {/* Control Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <CubeTransparentIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-white">Graph Controls</span>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-gray-800/60"
              onClick={resetCamera}
            >
              <ArrowPathIcon className="h-4 w-4 text-gray-300" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Row 1: Auto-rotation controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Switch
                  size="sm"
                  isSelected={autoRotate}
                  onChange={() => setAutoRotate(!autoRotate)}
                  classNames={{
                    wrapper: "group-data-[selected=true]:bg-gradient-to-r from-[#44D5DE] to-[#EDC7FC]",
                  }}
                />
                <span className="text-sm text-gray-300">Auto-Rotate</span>
              </div>
            </div>
            {/* Network Switching Controls */}
            {networks.length > 1 && (
              <div className="mb-3">
                <h3 className="text-xs text-gray-400 mb-2 text-center">Switch Network</h3>
                
                {/* Inline navigation with network name in center */}
                <div className="flex items-center justify-between w-full">
                  {/* Left arrow */}
                  <div className="w-8">
                    {networks.indexOf(currentNetwork) > 0 ? (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-gray-800/60"
                        onClick={() => {
                          if (switchNetwork) {
                            const currentIndex = networks.indexOf(currentNetwork);
                            switchNetwork(networks[currentIndex - 1]);
                          }
                        }}
                      >
                        <ArrowLeftIcon className="h-4 w-4 text-gray-300" />
                      </Button>
                    ) : null}
                  </div>
                  
                  {/* Current network name */}
                  <span className="text-sm font-medium text-white px-4 py-1 bg-gray-800/80 rounded-full">
                    {(currentNetwork || networks[0] || 'lens/avail_project').replace('lens/', '')}
                  </span>
                  
                  {/* Right arrow */}
                  <div className="w-8 text-right">
                    {networks.indexOf(currentNetwork) < networks.length - 1 ? (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-gray-800/60"
                        onClick={() => {
                          if (switchNetwork) {
                            const currentIndex = networks.indexOf(currentNetwork);
                            switchNetwork(networks[currentIndex + 1]);
                          }
                        }}
                      >
                        <ArrowRightIcon className="h-4 w-4 text-gray-300" />
                      </Button>
                    ) : null}
                  </div>
                </div>
                
                {/* Next/Previous network hints */}
                <div className="flex justify-between items-center w-full mt-1 px-1">
                  <div className="text-left w-1/3">
                    {networks.indexOf(currentNetwork) > 0 && (
                      <span className="text-xs text-gray-400">
                        {networks[networks.indexOf(currentNetwork) - 1].replace('lens/', '')}
                      </span>
                    )}
                  </div>
                  <div className="w-1/3"></div>
                  <div className="text-right w-1/3">
                    {networks.indexOf(currentNetwork) < networks.length - 1 && (
                      <span className="text-xs text-gray-400">
                        {networks[networks.indexOf(currentNetwork) + 1].replace('lens/', '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Row 3: Zoom controls */}
            <div className="flex justify-center gap-4">
              <Button
                size="sm"
                variant="flat"
                className="bg-gray-800/60"
                onClick={zoomOut}
              >
                <MinusIcon className="h-4 w-4 text-gray-300 mr-1" />
                Zoom Out
              </Button>
              <Button
                size="sm"
                variant="flat"
                className="bg-gray-800/60"
                onClick={zoomIn}
              >
                <PlusIcon className="h-4 w-4 text-gray-300 mr-1" />
                Zoom In
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default GraphControls; 