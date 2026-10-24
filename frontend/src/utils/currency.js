export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
];

export const getCurrencySymbol = (currencyCode = 'USD') => {
  const match = CURRENCIES.find((c) => c.code === currencyCode);
  return match ? match.symbol : currencyCode;
};

export const formatCurrency = (amount = 0, currencyCode = 'USD') => {
  const symbol = getCurrencySymbol(currencyCode);
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `${symbol}${numeric.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

