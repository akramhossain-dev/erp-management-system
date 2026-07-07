/**
 * Currency, date, number, and text formatters.
 * All monetary values use JetBrains Mono font via CSS class `.text-mono`.
 */

/**
 * Format a number as currency (BDT or USD).
 * @example formatCurrency(1234.5) → "৳1,234.50"
 */
export function formatCurrency(
  value: number,
  currency: string = "BDT",
  locale: string = "en-BD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with commas.
 * @example formatNumber(1234567) → "1,234,567"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format a date string to a readable format.
 * @example formatDate("2026-07-07T10:00:00Z") → "Jul 7, 2026"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format a date with time.
 * @example formatDateTime("2026-07-07T10:00:00Z") → "Jul 7, 2026, 10:00 AM"
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

/**
 * Format a relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(date);
}

/**
 * Truncate text to a maximum length.
 * @example truncate("Long text here", 10) → "Long text…"
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

/**
 * Format a stock quantity with low-stock indication.
 */
export function formatStock(qty: number, minQty?: number): string {
  const formatted = formatNumber(qty);
  if (minQty !== undefined && qty <= minQty) return `${formatted} ⚠`;
  return formatted;
}
