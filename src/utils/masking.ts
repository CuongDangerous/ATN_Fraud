/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Mask 6 middle digits of a card number or bank account:
 * e.g., 9704 2212 3456 7890 -> 9704 22** **** 7890
 * e.g., 0101000123456 -> 0101******456
 */
export function maskSensitiveNumber(val: string | undefined): string {
  if (!val) return '***';
  const clean = val.replace(/\s+/g, '');
  if (clean.length <= 8) {
    return clean.slice(0, 2) + '****' + clean.slice(-2);
  }
  if (clean.length === 16) {
    // Typical 16-digit card
    return `${clean.slice(0, 4)} ${clean.slice(4, 6)}** **** ${clean.slice(12)}`;
  }
  // Generic account (e.g. 10-14 digits): mask 6 middle characters
  const startLen = Math.max(3, Math.floor((clean.length - 6) / 2));
  const endLen = clean.length - startLen - 6;
  const start = clean.slice(0, startLen);
  const end = clean.slice(clean.length - endLen);
  return `${start}******${end}`;
}

export function formatVND(amount: number | undefined): string {
  if (amount === undefined || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace('.0', '')} Tỷ ₫`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)} Triệu ₫`;
  }
  return formatVND(amount);
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const mins = pad(d.getMinutes());
    const secs = pad(d.getSeconds());
    return `${day}/${month}/${year} ${hours}:${mins}:${secs}`;
  } catch {
    return isoString;
  }
}
