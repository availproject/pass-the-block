// components/SocialCardModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

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

  if (!isOpen || !isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Social Card Container */}
        <div className="bg-[#1E2129] rounded-xl overflow-hidden border border-[#3A3E48] shadow-xl">
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
            </div>

            {/* Graph Section */}
            <div className="flex-1 bg-[#1E2129] p-4 flex items-center justify-center">
              {graphImageUrl ? (
                <img 
                  src={graphImageUrl} 
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

          {/* Download Button */}
          <div className="border-t border-[#3A3E48] p-4 bg-[#2A2E38]">
            <button
              onClick={handleDownload}
              className="w-full py-2 bg-gradient-to-r from-[#3CA3FC] to-[#EB7BF4] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Download Card
            </button>
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