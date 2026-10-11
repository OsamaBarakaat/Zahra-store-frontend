/**
 * Format a price in Egyptian Pound (جنيه)
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ar-EG')} جنيه`;
}

/**
 * Format a discount percentage
 */
export function formatDiscount(discount: number): string {
  return `${discount}% خصم`;
}

/**
 * Calculate discounted price
 */
export function calcDiscountedPrice(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100));
}

/**
 * Format date to Arabic
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  return `ZHR-${Date.now().toString().slice(-6)}`;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
