/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '₹0.00';
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(number);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Abbreviate large numbers (1000 -> 1K, 1000000 -> 1M)
 */
export const abbreviateNumber = (number) => {
  if (number === null || number === undefined) return '0';
  
  const absNum = Math.abs(number);
  
  if (absNum >= 10000000) {
    return (number / 10000000).toFixed(1) + 'Cr';
  } else if (absNum >= 100000) {
    return (number / 100000).toFixed(1) + 'L';
  } else if (absNum >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  
  return number.toString();
};

/**
 * Get category icon emoji
 */
export const getCategoryIcon = (category) => {
  const icons = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '💡',
    Entertainment: '🎬',
    Health: '💊',
    Others: '📦',
  };
  
  return icons[category] || '📦';
};

/**
 * Get category color class
 */
export const getCategoryColorClass = (category) => {
  const colorMap = {
    Food: 'category-food',
    Transport: 'category-transport',
    Shopping: 'category-shopping',
    Bills: 'category-bills',
    Entertainment: 'category-entertainment',
    Health: 'category-health',
    Others: 'category-others',
  };
  
  return colorMap[category] || 'category-others';
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get payment method icon
 */
export const getPaymentMethodIcon = (method) => {
  const icons = {
    Cash: '💵',
    Card: '💳',
    UPI: '📱',
    'Net Banking': '🏦',
    Others: '💰',
  };
  
  return icons[method] || '💰';
};

/**
 * Calculate percentage of total
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Group expenses by category
 */
export const groupByCategory = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {});
};

/**
 * Group expenses by month
 */
export const groupByMonth = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(expense);
    return acc;
  }, {});
};

/**
 * Calculate total from expenses array
 */
export const calculateTotal = (expenses) => {
  if (!expenses || expenses.length === 0) return 0;
  return expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
};

/**
 * Get average from expenses array
 */
export const calculateAverage = (expenses) => {
  if (!expenses || expenses.length === 0) return 0;
  const total = calculateTotal(expenses);
  return total / expenses.length;
};

/**
 * Sort expenses by date (newest first)
 */
export const sortByDateDesc = (expenses) => {
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Sort expenses by amount (highest first)
 */
export const sortByAmountDesc = (expenses) => {
  return [...expenses].sort((a, b) => b.amount - a.amount);
};