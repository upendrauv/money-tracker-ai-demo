import { format, parseISO } from 'date-fns';

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '-';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (e) {
    return dateString;
  }
};

export const formatPaymentMethod = (method) => {
  switch (method) {
    case 'CREDIT_CARD':
      return 'Credit Card';
    case 'DEBIT_CARD':
      return 'Debit Card';
    case 'BANK_TRANSFER':
      return 'Bank Transfer';
    case 'UPI':
      return 'UPI';
    case 'CASH':
      return 'Cash';
    case 'OTHER':
    default:
      return 'Other';
  }
};

