import React from 'react';

interface TravioLogoProps {
  /** 'full' = icon + wordmark, 'compact' = smaller icon + wordmark for navbars, 'icon' = icon only */
  variant?: 'full' | 'compact' | 'icon';
  className?: string;
}

/**
 * Travio brand logo.
 * Icon: A→B route path (two endpoint dots connected by a dashed arc with a midpoint traveler dot).
 * Wordmark: "Tr" (bold, brand color) + "avio" (lighter weight).
 * Color: Indigo/blue gradient palette instead of the original orange.
 */
export default function TravioLogo({ variant = 'compact', className = '' }: TravioLogoProps) {
  const iconSizes = {
    full: 44,
    compact: 32,
    icon: 48,
  };
  const size = iconSizes[variant];

  const Icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 select-none"
    >
      <defs>
        <linearGradient id="travio-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" /> {/* indigo-500 */}
          <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect width="48" height="48" rx="12" fill="url(#travio-grad)" />

      {/* Dashed arc path connecting A → B */}
      <path
        d="M 13 33 Q 24 10 35 27"
        stroke="white"
        strokeWidth="3"
        strokeDasharray="4 3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Start dot (A) — bottom-left */}
      <circle cx="13" cy="33" r="3.5" fill="white" />

      {/* Midpoint traveler dot — on the peak */}
      <circle cx="24" cy="20" r="3.5" fill="white" />

      {/* End dot (B) — mid-right */}
      <circle cx="35" cy="27" r="3.5" fill="white" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={className}>{Icon}</div>;
  }

  const textSizes = {
    full: 'text-3xl',
    compact: 'text-lg',
  };

  const tagline = variant === 'full';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {Icon}
      <div className="flex flex-col">
        <span className={`${textSizes[variant]} tracking-tight leading-none select-none`}>
          <span className="font-extrabold text-indigo-400">Tr</span>
          <span className="font-light text-white">avio</span>
        </span>
        {tagline && (
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-450 mt-1 select-none">
            AI Travel Planner
          </span>
        )}
      </div>
    </div>
  );
}

