export const MARKET_OPTIONS = [
  { country_code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { country_code: 'GH', name: 'Ghana', currency: 'GHS' },
  { country_code: 'KE', name: 'Kenya', currency: 'KES' },
  { country_code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { country_code: 'CI', name: 'Côte d’Ivoire', currency: 'XOF' },
  { country_code: 'SN', name: 'Senegal', currency: 'XOF' },
  { country_code: 'CM', name: 'Cameroon', currency: 'XAF' },
  { country_code: 'UG', name: 'Uganda', currency: 'UGX' },
  { country_code: 'TZ', name: 'Tanzania', currency: 'TZS' },
  { country_code: 'RW', name: 'Rwanda', currency: 'RWF' },
  { country_code: 'ZM', name: 'Zambia', currency: 'ZMW' },
  { country_code: 'EG', name: 'Egypt', currency: 'EGP' },
  { country_code: 'PH', name: 'Philippines', currency: 'PHP' },
  { country_code: 'US', name: 'United States / International', currency: 'USD' },
  { country_code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { country_code: 'EU', name: 'Europe', currency: 'EUR' },
] as const;

const EU_COUNTRIES = new Set(['AT','BE','BG','HR','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HU','IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK']);

export function normalizeMarketCountry(country?: string | null) {
  const code = String(country || '').trim().toUpperCase();
  if (!code) return 'NG';
  if (MARKET_OPTIONS.some((market) => market.country_code === code)) return code;
  if (EU_COUNTRIES.has(code)) return 'EU';
  return 'US';
}

export function defaultCurrencyForCountry(country?: string | null) {
  const code = normalizeMarketCountry(country);
  return MARKET_OPTIONS.find((market) => market.country_code === code)?.currency || 'NGN';
}
