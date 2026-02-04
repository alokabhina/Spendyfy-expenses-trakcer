import { 
  format, 
  parseISO, 
  isToday, 
  isYesterday, 
  startOfMonth, 
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  subDays
} from 'date-fns';

/**
 * Format date for display
 */
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format date for input fields
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

/**
 * Get relative date string (Today, Yesterday, or formatted date)
 */
export const getRelativeDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) return 'Today';
  if (isYesterday(dateObj)) return 'Yesterday';
  
  return format(dateObj, 'MMM dd, yyyy');
};

/**
 * Get current month date range
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    startDate: startOfMonth(now),
    endDate: endOfMonth(now),
  };
};

/**
 * Get current year date range
 */
export const getCurrentYearRange = () => {
  const now = new Date();
  return {
    startDate: startOfYear(now),
    endDate: endOfYear(now),
  };
};

/**
 * Get last N months date range
 */
export const getLastNMonthsRange = (n = 6) => {
  const now = new Date();
  return {
    startDate: subMonths(now, n),
    endDate: now,
  };
};

/**
 * Get last N days date range
 */
export const getLastNDaysRange = (n = 30) => {
  const now = new Date();
  return {
    startDate: subDays(now, n),
    endDate: now,
  };
};

/**
 * Get month name from number
 */
export const getMonthName = (monthNumber, short = false) => {
  const date = new Date(2000, monthNumber - 1, 1);
  return format(date, short ? 'MMM' : 'MMMM');
};

/**
 * Parse date string to Date object
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  try {
    return parseISO(dateString);
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Check if date is valid
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Get date range label
 */
export const getDateRangeLabel = (startDate, endDate) => {
  if (!startDate || !endDate) return 'All Time';
  
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  return `${format(start, 'MMM dd, yyyy')} - ${format(end, 'MMM dd, yyyy')}`;
};