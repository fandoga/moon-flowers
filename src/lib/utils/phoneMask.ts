/**
 * Formats a phone input value into +7 (***) ***-**-** mask.
 * Works as the onChange handler for phone fields.
 */
export function applyPhoneMask(raw: string): string {
  // Strip everything non-digit
  let digits = raw.replace(/\D/g, '');

  // Drop leading country code (7 or 8)
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }

  // Keep max 10 local digits
  const local = digits.slice(0, 10);

  if (!local) return '+7 ';

  let result = '+7 (';
  result += local.slice(0, Math.min(3, local.length));
  if (local.length <= 3) return result;

  result += ') ';
  result += local.slice(3, Math.min(6, local.length));
  if (local.length <= 6) return result;

  result += '-';
  result += local.slice(6, Math.min(8, local.length));
  if (local.length <= 8) return result;

  result += '-';
  result += local.slice(8, 10);

  return result;
}