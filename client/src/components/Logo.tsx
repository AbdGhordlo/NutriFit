import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="#4d7051"
        opacity="0.2"
      />
      <path
        d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14.5c-3.59 0-6.5-2.91-6.5-6.5S8.41 5.5 12 5.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"
        fill="#4d7051"
        opacity="0.3"
      />
      <path
        d="M12 6.5c3.04 0 5.5 2.46 5.5 5.5s-2.46 5.5-5.5 5.5S6.5 15.04 6.5 12 8.96 6.5 12 6.5zm2.5 4.5c0-2.21-1.79-4-4-4-1.62 0-3 .96-3.63 2.34C7.77 8.24 9.77 7.5 12 7.5c2.76 0 5 2.24 5 5 0 2.23-.74 4.23-1.84 5.13C16.54 17 17.5 15.62 17.5 14c0-1.66-1.34-3-3-3z"
        fill="#7ec987"
      />
    </svg>
  );
}