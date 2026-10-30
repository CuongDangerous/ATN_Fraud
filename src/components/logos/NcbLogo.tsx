/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NcbLogoProps {
  className?: string;
  variant?: 'standard' | 'badge' | 'mark-only';
  theme?: 'light' | 'dark';
  height?: number;
}

export const NcbLogo: React.FC<NcbLogoProps> = ({
  className = '',
  variant = 'standard',
  height = 36,
}) => {
  // Exact original file provided by user: logo-ncb-inkythuatso-1.jpg
  const logoImage = (
    <img
      src="/assets/logo-ncb-inkythuatso-1.jpg"
      alt="Ngân hàng TMCP Quốc Dân - NCB Logo"
      style={{ height: `${height}px` }}
      className="object-contain select-none max-w-none"
      referrerPolicy="no-referrer"
    />
  );

  // When used in dark headers/cards, badge wrap provides a clean white card for contrast
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200/50 shrink-0 ${className}`}
      >
        {logoImage}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      {logoImage}
    </div>
  );
};

