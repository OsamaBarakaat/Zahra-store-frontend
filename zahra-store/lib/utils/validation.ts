/**
 * Egyptian mobile number validation
 * Valid prefixes: 010, 011, 012, 015
 */
export function isValidEgyptianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s|-/g, '');
  return /^(010|011|012|015)\d{8}$/.test(cleaned);
}

export function getPhoneError(phone: string): string | null {
  if (!phone.trim()) return 'من فضلك أدخل رقم الهاتف';
  if (!isValidEgyptianPhone(phone))
    return 'من فضلك أدخل رقم هاتف مصري صحيح (مثل: 01012345678)';
  return null;
}

export function isRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `من فضلك أدخل ${fieldName}`;
  return null;
}

export function validateCheckoutForm(data: {
  firstName: string;
  lastName: string;
  phone: string;
  governorate: string;
  city: string;
  street: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.firstName.trim()) errors.firstName = 'من فضلك أدخل الاسم الأول';
  if (!data.lastName.trim()) errors.lastName = 'من فضلك أدخل الاسم الأخير';
  const phoneErr = getPhoneError(data.phone);
  if (phoneErr) errors.phone = phoneErr;
  if (!data.governorate) errors.governorate = 'من فضلك اختار المحافظة';
  if (!data.city.trim()) errors.city = 'من فضلك أدخل المدينة أو المنطقة';
  if (!data.street.trim()) errors.street = 'من فضلك أدخل العنوان بالتفصيل';
  return errors;
}
