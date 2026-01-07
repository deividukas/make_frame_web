import React from 'react';

const Logo = ({ className = "h-8 w-auto" }: { className?: string }) => (
  <svg 
    viewBox="0 0 300 60" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M15 15H40M10 30H35M20 5V40M30 5V40" 
      stroke="#7c3aed" 
      strokeWidth="6" 
      strokeLinecap="round"
    />
    <text 
      x="55" 
      y="35" 
      fill="#7c3aed" 
      style={{ font: 'bold 28px Inter, sans-serif' }}
    >
      Make-frame.com
    </text>
  </svg>
);

export default Logo;
