export type CurrencyDefinition = {
  code: string;
  name: string;
  symbol: string;
  decimals?: number;
};

export const SUPPORTED_CURRENCIES: CurrencyDefinition[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', decimals: 2 },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', decimals: 2 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', decimals: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', decimals: 2 },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', decimals: 0 },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', decimals: 0 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', decimals: 0 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', decimals: 0 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', decimals: 0 },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', decimals: 2 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', decimals: 2 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2 },
];

export const CURRENCY_SYMBOLS = Object.fromEntries(SUPPORTED_CURRENCIES.map((item) => [item.code, item.symbol])) as Record<string, string>;

export function formatMoney(value: number, currency = 'NGN', options: { compact?: boolean; showCode?: boolean } = {}) {
  const code = currency.toUpperCase();
  const definition = SUPPORTED_CURRENCIES.find((item) => item.code === code);
  const decimals = definition?.decimals ?? 2;
  const formatted = Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: options.compact ? 0 : decimals,
    maximumFractionDigits: options.compact ? Math.min(decimals, 1) : decimals,
  });
  const prefix = definition?.symbol ?? `${code} `;
  return `${prefix}${formatted}${options.showCode ? ` ${code}` : ''}`;
}

export function currencyLabel(code: string) {
  const item = SUPPORTED_CURRENCIES.find((currency) => currency.code === code);
  return item ? `${item.symbol} ${item.code} — ${item.name}` : code;
}
