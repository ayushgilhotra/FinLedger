import { format } from 'date-fns';

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0.00';
  
  const absAmount = Math.abs(amount);
  let formatted = '';

  if (absAmount >= 10000000) { // 1 Crore
    formatted = `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (absAmount >= 100000) { // 1 Lakh
    formatted = `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return formatted;
};

export const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'dd MMM yyyy');
};

export const formatMonth = (monthStr) => {
  // monthStr is "YYYY-MM"
  const [year, month] = monthStr.split('-');
  const date = new Date(year, month - 1);
  return format(date, 'MMM yy');
};

export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const truncate = (str, n) => {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '...' : str;
};
