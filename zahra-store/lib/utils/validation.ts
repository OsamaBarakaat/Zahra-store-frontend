/**
 * Egyptian mobile number validation & normalization
 * Valid prefixes: 010, 011, 012, 015
 */
export function normalizeEgyptianPhone(phone: string): string {
  if (!phone) return '';
  // Convert Arabic-Indic numerals (٠-٩) to standard (0-9)
  let normalized = phone.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  // Remove spaces, hyphens, parentheses, etc.
  normalized = normalized.replace(/[\s\-\(\)\.]/g, '');
  // Replace +20 or 0020 or 20 prefix
  normalized = normalized.replace(/^(\+20|0020|20)/, '0');
  return normalized;
}

export function isValidEgyptianPhone(phone: string): boolean {
  if (!phone || !phone.trim()) return true; // Optional
  const cleaned = normalizeEgyptianPhone(phone);
  return /^(010|011|012|015)\d{8}$/.test(cleaned) || cleaned.length >= 8;
}

export function getPhoneError(phone: string): string | null {
  // Not required
  return null;
}

export function isRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `من فضلك أدخل ${fieldName}`;
  return null;
}

export function validateCheckoutForm(data: {
  firstName: string;
  lastName?: string;
  phone?: string;
  governorate: string;
  city: string;
  street: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.firstName.trim()) errors.firstName = 'من فضلك أدخل الاسم الأول';
  if (!data.governorate) errors.governorate = 'من فضلك اختار المحافظة';
  if (!data.city.trim()) errors.city = 'من فضلك أدخل المدينة أو المنطقة';
  if (!data.street.trim()) errors.street = 'من فضلك أدخل العنوان بالتفصيل';
  return errors;
}
