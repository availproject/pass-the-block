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
    followers: number;
    following: number;
    posts: number;
    score: number;
  };
};

export default function SocialCardModal({
  isOpen,
  onClose,
  lensHandle,
  graphImageUrl,
  profileData,
}: SocialCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { lensAccount } = useWeb3();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
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
        {/* Social Card Container */}
        <div className="bg-[#1E2129] rounded-xl overflow-hidden border border-[#3A3E48] shadow-xl relative">
          {/* Close Button - Now inside the card */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-[#2A2E38]/80 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-[#3A3E48]/80"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <div ref={cardRef} className="flex flex-col md:flex-row">
            {/* Profile Section */}
            <div className="w-full md:w-[300px] p-6 bg-gradient-to-b from-[#2A2E38] to-[#1E2129]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3CA3FC] to-[#EB7BF4] flex items-center justify-center text-white font-bold text-xl">
                  {profileData.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-[#44D5DE] font-medium">lens/{lensHandle}</p>
                  <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
                  <p className="text-[#8A8F9D]">@{lensHandle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <StatCard label="Followers" value={profileData.followers} color="from-[#3CA3FC] to-[#3CA3FC]" />
                <StatCard label="Following" value={profileData.following} color="from-[#58CF86] to-[#58CF86]" />
                <StatCard label="Posts" value={profileData.posts} color="from-[#FBC75D] to-[#FBC75D]" />
                <StatCard label="Score" value={`${profileData.score}/100`} color="from-[#EB7BF4] to-[#EB7BF4]" />
              </div>

              <div className="bg-[#2A2E38]/60 rounded-lg p-4 border border-[#3A3E48]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[#8A8F9D] uppercase tracking-wider">Network Score</span>
                  <span className="text-[#5FD39C] font-bold">{profileData.score}</span>
                </div>
                <div className="h-1.5 bg-[#3A3E48] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3CA3FC] to-[#EB7BF4] rounded-full" 
                    style={{ width: `${profileData.score}%` }}
                  />
                </div>
              </div>
              
              {/* View on Lens link - now always shows the logged-in user's profile */}
              <div className="text-center mt-4">
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
            <div className="flex-1 bg-[#1E2129] flex items-center justify-center">
              {graphImageUrl ? (
                <img 
                  src={graphImageUrl.startsWith('data:') ? graphImageUrl : `/images/${graphImageUrl}`} 
                  alt="Social Graph" 
                  className="max-w-full h-auto max-h-[300px] md:max-h-full rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/fallback-graph.png';
                  }}
                />
              ) : (
                <div className="text-[#8A8F9D]">Loading graph...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-[#2A2E38]/60 rounded-lg p-3 border border-[#3A3E48] hover:translate-y-[-2px] transition-transform">
      <p className="text-xs text-[#8A8F9D] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {value}
      </p>
    </div>
  );
}