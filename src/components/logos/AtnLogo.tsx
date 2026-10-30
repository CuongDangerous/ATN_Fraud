/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AtnLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
  height?: number;
  showTagline?: boolean;
}

export const AtnLogo: React.FC<AtnLogoProps> = ({
  className = '',
  theme = 'dark',
  height = 30,
  showTagline = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        height={height}
        viewBox="0 0 320 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="ATN Technology Logo"
      >
        <defs>
          {/* Gradient for the stylized fluid 'A' mark */}
          <linearGradient id="atn-mark-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="75%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>

          {/* Gradient for the middle overlap shine */}
          <linearGradient id="atn-shade-grad" x1="30%" y1="10%" x2="70%" y2="90%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Gradient for 3 horizontal signal bars (E) */}
          <linearGradient id="atn-bars-grad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          <linearGradient id="atn-letter-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#3B82F6' : '#1E3A8A'} />
            <stop offset="100%" stopColor={isDark ? '#60A5FA' : '#172554'} />
          </linearGradient>
        </defs>

        {/* 1. Organic Stylized 'A' Emblem */}
        <g id="atn-emblem">
          {/* Main fluid pill spanning from top right to bottom */}
          <path
            d="M 64 24 C 74 24 88 36 98 52 C 108 68 116 84 104 96 C 96 104 82 104 70 96 C 58 88 44 74 38 68 C 30 76 24 88 16 88 C 6 88 2 76 6 68 C 12 56 34 38 52 26 C 56 24 60 24 64 24 Z"
            fill="url(#atn-mark-grad)"
          />
          {/* Inner curved fold giving 3D volume matching the artwork */}
          <path
            d="M 38 68 C 48 58 64 42 76 34 C 74 28 66 24 58 26 C 44 32 28 50 16 68 C 10 74 12 84 20 84 C 28 84 32 74 38 68 Z"
            fill="#1E3A8A"
            opacity="0.9"
          />
          <path
            d="M 52 32 C 68 44 86 64 96 82 C 100 90 94 98 86 98 C 76 98 64 88 56 76 C 46 62 42 46 52 32 Z"
            fill="url(#atn-shade-grad)"
          />
          {/* Left node sphere */}
          <circle cx="20" cy="74" r="14" fill="#1E3A8A" />
          {/* Smooth blend */}
          <path
            d="M 18 64 C 24 64 36 68 44 76 C 36 84 24 88 16 86 C 8 84 10 72 18 64 Z"
            fill="#1E40AF"
          />
        </g>

        {/* 2. Letter 'T' with rounded organic terminals */}
        <g id="atn-letter-t">
          {/* Horizontal crossbar */}
          <rect
            x="118"
            y="42"
            width="38"
            height="15"
            rx="7.5"
            fill={isDark ? '#E2E8F0' : '#1D358F'}
          />
          {/* Vertical stem */}
          <rect
            x="129.5"
            y="42"
            width="15"
            height="46"
            rx="7.5"
            fill={isDark ? '#E2E8F0' : '#1D358F'}
          />
        </g>

        {/* 3. Letter 'N' with rounded geometric terminals */}
        <g id="atn-letter-n">
          {/* Left vertical */}
          <rect
            x="166"
            y="42"
            width="15"
            height="46"
            rx="7.5"
            fill={isDark ? '#E2E8F0' : '#1D358F'}
          />
          {/* Right vertical */}
          <rect
            x="198"
            y="42"
            width="15"
            height="46"
            rx="7.5"
            fill={isDark ? '#E2E8F0' : '#1D358F'}
          />
          {/* Diagonal */}
          <path
            d="M 166 48 C 166 44 172 42 176 46 L 206 82 C 210 86 206 90 200 90 C 196 90 190 84 186 80 L 168 56 C 166 52 166 50 166 48 Z"
            fill={isDark ? '#CBD5E1' : '#1E3A8A'}
          />
        </g>

        {/* 4. Three horizontal rounded pill bars (forming 'E' / tech bars) */}
        <g id="atn-three-bars">
          {/* Top Bar */}
          <rect
            x="226"
            y="42"
            width="34"
            height="12"
            rx="6"
            fill="url(#atn-bars-grad)"
          />
          {/* Middle Bar */}
          <rect
            x="226"
            y="59"
            width="34"
            height="12"
            rx="6"
            fill="url(#atn-bars-grad)"
          />
          {/* Bottom Bar */}
          <rect
            x="226"
            y="76"
            width="34"
            height="12"
            rx="6"
            fill="url(#atn-bars-grad)"
          />
        </g>
      </svg>

      {showTagline && (
        <div className="flex flex-col justify-center leading-none pl-1 border-l border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-300 tracking-wider">
            ATN TECH
          </span>
          <span className="text-[8px] text-cyan-400 font-medium tracking-tight mt-0.5">
            Technology Partner
          </span>
        </div>
      )}
    </div>
  );
};
