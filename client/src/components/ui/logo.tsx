import React from 'react';

const Logo = ({ className = "h-10 w-auto" }: { className?: string }) => (
  <svg 
    viewBox="0 0 280 50" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <g transform="translate(5, 5) rotate(-12, 20, 20)">
      <rect x="6" y="12" width="28" height="8" rx="4" fill="#7c3aed" />
      <rect x="6" y="24" width="28" height="8" rx="4" fill="#7c3aed" />
      <rect x="12" y="6" width="8" height="28" rx="4" fill="#7c3aed" />
      <rect x="24" y="6" width="8" height="28" rx="4" fill="#7c3aed" />
    </g>
    <text 
      x="58" 
      y="33" 
      fill="#7c3aed" 
      style={{ font: '700 24px Inter, sans-serif' }}
    >
      Make-frame.com
    </text>
  </svg>
);

export default Logo;
