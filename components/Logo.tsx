import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Mamabora ladybug mascot"
  >
    {/* Base Outer Glow/Shadow effect for depth */}
    <circle cx="50" cy="50" r="48" fill="rgba(229, 62, 62, 0.05)" />
    
    {/* Ladybug Shell (Wings) */}
    <path 
      d="M 50 25 C 25 25, 15 50, 15 75 C 15 88, 35 95, 50 95 C 65 95, 85 88, 85 75 C 85 50, 75 25, 50 25 Z" 
      fill="#E53E3E" 
      stroke="#1A1A1A" 
      strokeWidth="1.5"
    />
    
    {/* Center line of wings */}
    <path d="M 50 25 L 50 95" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />

    {/* Spots (Simplified and symmetrical for iconic look) */}
    <circle cx="32" cy="45" r="4.5" fill="#1A1A1A" />
    <circle cx="68" cy="45" r="4.5" fill="#1A1A1A" />
    <circle cx="28" cy="68" r="5.5" fill="#1A1A1A" />
    <circle cx="72" cy="68" r="5.5" fill="#1A1A1A" />
    <circle cx="42" cy="82" r="3.5" fill="#1A1A1A" />
    <circle cx="58" cy="82" r="3.5" fill="#1A1A1A" />

    {/* Head/Body */}
    <path d="M 35 35 Q 50 30 65 35 L 65 65 Q 50 75 35 65 Z" fill="#1A1A1A" />
    
    {/* Face */}
    <circle cx="50" cy="38" r="20" fill="#8D5524" stroke="#1A1A1A" strokeWidth="0.5" />
    
    {/* Hair Detail */}
    <path d="M 30 38 A 20 20 0 0 1 70 38 L 70 42 C 50 35 30 42 Z" fill="#1A1A1A" />
    
    {/* Eyes */}
    <circle cx="44" cy="38" r="2.5" fill="#1A1A1A" />
    <circle cx="56" cy="38" r="2.5" fill="#1A1A1A" />
    
    {/* Friendly Smile */}
    <path d="M 46 48 Q 50 52 54 48" stroke="#1A1A1A" fill="none" strokeWidth="1.5" strokeLinecap="round" />

    {/* Antennae */}
    <path d="M 42 22 Q 38 12 34 12" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="34" cy="12" r="3.5" fill="#1A1A1A" />
    <path d="M 58 22 Q 62 12 66 12" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="66" cy="12" r="3.5" fill="#1A1A1A" />

    {/* Cheeks */}
    <circle cx="40" cy="44" r="2" fill="#E53E3E" opacity="0.2" />
    <circle cx="60" cy="44" r="2" fill="#E53E3E" opacity="0.2" />
  </svg>
);
