import React from 'react';

const Logo = ({ className = "h-10 w-auto" }: { className?: string }) => (
  <svg 
    viewBox="0 0 320 60" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M15 15H40M10 30H35M20 5V40M30 5V40" 
      stroke="#7c3aed" 
      strokeWidth="7" 
      strokeLinecap="round"
    />
    <text 
      x="55" 
      y="38" 
      fill="#7c3aed" 
      style={{ font: '800 32px Inter, sans-serif' }}
    >
      Make-frame.com
    </text>
  </svg>
);

export default Logo;
