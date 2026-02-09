import React from 'react';

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Background Squircle */}
        <rect width="100" height="100" rx="22" fill="url(#logo-gradient)" />
        
        {/* Subtle Long Shadow from center */}
        <path d="M50 50 L100 100 L100 70 Z" fill="#000" fillOpacity="0.1" />

        {/* Main Bubble (Top Left) */}
        <g transform="translate(40, 40)">
           {/* Tail pointing bottom-left */}
           <path d="M-12 14 L-20 24 L-2 16 Z" fill="white" />
           <circle cx="0" cy="0" r="22" fill="white" />
        </g>
        
        {/* Secondary Bubble (Bottom Right) */}
        <g transform="translate(70, 70)">
             {/* Tail pointing bottom-right */}
             <path d="M6 8 L14 16 L2 10 Z" fill="white" />
             <circle cx="0" cy="0" r="15" fill="white" />
        </g>
        
      </svg>
    </div>
  );
};

export default Logo;