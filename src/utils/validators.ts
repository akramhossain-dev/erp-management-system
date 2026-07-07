/**
 * Shared validation helpers used across Zod schemas.
 */

/**
 * Validates that a SKU is alphanumeric with dashes/underscores.
 * @example "PROD-001", "SKU_123"
 */
export function isValidSku(sku: string): boolean {
  return /^[A-Z0-9][A-Z0-9-_]{1,29}$/.test(sku.toUpperCase());
}

/**
 * Validates an email address.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates a phone number (flexible international format).
 */
export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{7,20}$/.test(phone);
}

/**
 * Validates that a price is a positive number with at most 2 decimal places.
 */
export function isValidPrice(price: number): boolean {
  return price > 0 && Number(price.toFixed(2)) === price;
}

/**
 * Validates that a quantity is a positive integer.
 */
export function isValidQuantity(qty: number): boolean {
  return Number.isInteger(qty) && qty > 0;
}
