// components/SocialCardModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useWeb3 } from '../components/Providers';

type SocialCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lensHandle: string;
  graphImageUrl: string;
  profileData: {
    name: string;
    picture: string;
    followers: number;
    following: number;
    posts: number;
    score: number;
    lensReputationScore?: number
  };
  onCardCapture?: (imageUrl: string) => void;
};

export default function SocialCardModal({
  isOpen,
  onClose,
  lensHandle,
  graphImageUrl,
  profileData,
  onCardCapture,
}: SocialCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const capturedRef = useRef(false); // Track if we've already captured to prevent duplicates
  const { lensAccount } = useWeb3();

  // Reset capture state when modal closes
  useEffect(() => {
    if (!isOpen) {
      capturedRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Capture card as image when it's visible and mounted
  useEffect(() => {
    if (isOpen && isMounted && cardRef.current && onCardCapture && !capturedRef.current) {
      // Add a larger delay to ensure the modal is fully rendered and images are loaded
      const timer = setTimeout(async () => {
        try {
          if (cardRef.current && !capturedRef.current) {
            capturedRef.current = true; // Mark as captured before the async operation
            console.log("Capturing social card...");
            
            // Only proceed with capture if we have a valid graph image
            if (graphImageUrl && graphImageUrl.length > 0) {
              const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#1E2129',
              });
              const imageUrl = canvas.toDataURL('image/png');
              onCardCapture(imageUrl);
            } else {
              console.log("No graph image available, skipping social card capture");
            }
          }
        } catch (error) {
          console.error('Error capturing social card:', error);
          capturedRef.current = false; // Reset if there was an error
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMounted, onCardCapture, graphImageUrl]);

  const handleDownload = async () => {
  if (!cardRef.current) return;

  // Find the button inside cardRef and hide it
  const button = cardRef.current.querySelector('button');
  if (button) button.style.display = 'none';

  try {
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `${lensHandle}_social_card.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
  } finally {
    // Restore the button after capture
    if (button) button.style.display = '';
  }
};

  // Handle backdrop click - close modal when clicking outside the card
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click was directly on the backdrop element
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Extract username from the lens handle for the URL
  const getLensUsername = () => {
    // Use the logged-in user's handle if available
    const handleToUse = lensAccount?.handle?.localName || '';
    
    if (handleToUse) {
      return handleToUse;
    }
    
    // Fallback to the displayed profile handle
    // Check if it starts with 'lens/'
    if (lensHandle.startsWith('lens/')) {
      return lensHandle.substring(5);
    }
    
    // Remove .lens suffix if it exists
    if (lensHandle.endsWith('.lens')) {
      return lensHandle.substring(0, lensHandle.length - 5);
    }
    
    // Otherwise just return the handle
    return lensHandle;
  };

  if (!isOpen || !isMounted) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl">
        {/* Button to download image */}
        <div className="flex justify-end mb-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#48C9B0] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Download Image
                </button>
              </div>
        {/* Social Card Container */}
        <div className="bg-[#1E2129] rounded-xl overflow-hidden border border-[#3A3E48] shadow-xl relative w-full">
          {/* Close Button - Now inside the card */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-[#2A2E38]/80 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-[#3A3E48]/80"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <div ref={cardRef} className="flex flex-col md:flex-row md:h-[500px]">
            {/* Profile Section */}
            <div className="w-full md:w-[350px] p-8 bg-gradient-to-b from-[#2A2E38] to-[#1E2129] md:h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3CA3FC] to-[#EB7BF4] flex items-center justify-center text-white font-bold text-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#2A2E38] flex items-center justify-center text-white font-bold text-2xl">
                  {profileData.picture ? (
                    <img
                      src={profileData.picture}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profileData.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                </div>
                <div>
                  <p className="text-sm text-[#44D5DE] font-medium">{lensHandle}</p>
                  {/* <h2 className="text-2xl font-bold text-white">{profileData.name}</h2> */}
                  <h2 className="text-2xl font-bold text-white">
                    @{lensHandle.startsWith("lens/") ? lensHandle.slice(5) : lensHandle}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard label="Followers" value={profileData.followers} color="from-[#3CA3FC] to-[#3CA3FC]" />
                <StatCard label="Following" value={profileData.following} color="from-[#58CF86] to-[#58CF86]" />
                <StatCard label="Posts" value={profileData.posts} color="from-[#FBC75D] to-[#FBC75D]" />
                {profileData.lensReputationScore !== undefined && (
                  <StatCard
                    label="Lens Reputation"
                    value={`${(profileData.lensReputationScore).toLocaleString()} `}
                    color="from-[#EB7BF4] to-[#EB7BF4]"
                    legend={
                      <a
                        href="https://lensreputation.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#44D5DE] underline opacity-80 hover:opacity-100"
                      >
                        by LensReputation
                      </a>
                    }
                  />
 
                )}
              </div>

              <div className="bg-[#2A2E38]/60 rounded-lg p-4 border border-[#3A3E48] mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[#8A8F9D] uppercase tracking-wider">Lens Score</span>
                  <span className="text-[#5FD39C] font-bold">{(profileData.score / 100)}</span>
                </div>
                <div className="h-2 bg-[#3A3E48] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3CA3FC] to-[#58CF86] rounded-full" 
                    style={{ width: `${Math.min((profileData.score/100), 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Spacer to push link to bottom */}
              <div className="flex-grow"></div>
              
              {/* View on Lens link */}
              <div className="text-center">
                <a 
                  href={`https://hey.xyz/u/${getLensUsername()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#8A8F9D] hover:text-[#44D5DE] transition-colors"
                >
                  @hey.xyz/u/{getLensUsername()}
                </a>
              </div>
            </div>

           {/* Graph Section */}
              <div className="flex-1 bg-[#1E2129] flex items-center justify-center p-4 md:h-full overflow-hidden">
                {graphImageUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center rounded-xl bg-black">
                    <div className="flex items-center justify-center w-full h-full">
                      <img 
                        src={graphImageUrl.startsWith('data:') ? graphImageUrl : `/images/${graphImageUrl}`} 
                        alt="Social Graph" 
                        className="max-w-full max-h-full object-contain"
                        style={{ 
                          background: 'transparent',
                          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default_image.png';
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-[#8A8F9D] text-xl animate-pulse">Loading visualization...</div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, legend }: { label: string; value: string | number; color: string, legend?: React.ReactNode }) {
  return (
    <div className="bg-[#2A2E38]/60 rounded-lg p-3 border border-[#3A3E48] hover:translate-y-[-2px] transition-transform">
      <p className="text-xs text-[#8A8F9D] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold text-white`} style={{ 
        color: color.includes('from-[#3CA3FC]') ? '#3CA3FC' : 
               color.includes('from-[#58CF86]') ? '#58CF86' : 
               color.includes('from-[#FBC75D]') ? '#FBC75D' : 
               color.includes('from-[#EB7BF4]') ? '#EB7BF4' : 'white' 
      }}>
        {value}
      </p>
      {legend && (
        <div className="mt-1">{legend}</div>
      )}
    </div>
  );
}