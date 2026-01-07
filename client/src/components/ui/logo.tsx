import React from 'react';

const Logo = ({ className = "h-10 w-auto" }: { className?: string }) => (
  <svg 
    viewBox="0 0 280 50" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <g transform="translate(8, 8) rotate(-12, 17, 17)">
      {/* Horizontal lines */}
      <rect x="0" y="8" width="34" height="6" rx="3" fill="#7c3aed" />
      <rect x="0" y="20" width="34" height="6" rx="3" fill="#7c3aed" />
      {/* Vertical lines */}
      <rect x="8" y="0" width="6" height="34" rx="3" fill="#7c3aed" />
      <rect x="20" y="0" width="6" height="34" rx="3" fill="#7c3aed" />
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
