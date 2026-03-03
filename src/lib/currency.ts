/**
 * USD Currency Formatter — all amounts are stored and displayed in USD.
 *
 * Conversion rate used for historical KES data: 1 KES ≈ $0.0077 (130 KES/USD)
 */

const USD_FORMAT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const USD_COMPACT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Format a number as $1,234.56 */
export function formatUSD(amount: number | string): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return "$0.00";
  return USD_FORMAT.format(n);
}

/** Compact format: $1.2M, $45.3k, $892 */
export function formatUSDCompact(amount: number): string {
  if (isNaN(amount)) return "$0";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}k`;
  return USD_FORMAT.format(amount);
}

/** Short format for charts: $1.2M / $45k / $892 */
export function formatUSDShort(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}k`;
  return `$${amount.toFixed(0)}`;
}
