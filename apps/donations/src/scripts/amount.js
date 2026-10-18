// Shared by the page and the Worker; amounts are Brazilian reais.
export const MIN_AMOUNT = 5;
export const MAX_AMOUNT = 5000;
export const PRESET_AMOUNTS = Object.freeze([10, 25, 50]);

// Rounds a numeric amount to cents, or returns null when it is outside the accepted range.
export function normalizeAmount(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const amount = Math.round(value * 100) / 100;
  return amount >= MIN_AMOUNT && amount <= MAX_AMOUNT ? amount : null;
}

// Reads typed input such as "25", "25,50", "1.000,00" (pt-BR) or "1,000.00" (en).
export function parseAmountInput(text, locale = 'en') {
  const value = String(text).replace(/R\$|\s/g, '');
  const [thousands, decimal] = locale === 'pt-BR' ? ['.', ','] : [',', '.'];
  const [integer, cents = '', ...rest] = value.split(decimal);
  // Thousands separators must group three digits, so "25,50" is never read as 2550 in English.
  const grouped = new RegExp(`^\\d{1,3}(\\${thousands}\\d{3})+$`);
  if (rest.length > 0 || !/^\d{0,2}$/.test(cents)
    || !(/^\d+$/.test(integer) || grouped.test(integer))) return null;
  return normalizeAmount(Number(`${integer.replaceAll(thousands, '')}.${cents || '0'}`));
}

export function formatAmount(amount, locale = 'en') {
  return new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2
  }).format(amount);
}
