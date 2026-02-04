import { format } from 'date-fns';

/**
 * Export expenses data to CSV format
 * @param {Array} expenses - Array of expense objects
 * @param {String} filename - Name of the file to download
 */
export const exportToCSV = (expenses, filename = 'expenses.csv') => {
  if (!expenses || expenses.length === 0) {
    alert('No data to export');
    return;
  }

  // Define CSV headers
  const headers = ['Date', 'Title', 'Category', 'Amount', 'Payment Method', 'Description'];

  // Convert expenses to CSV rows
  const rows = expenses.map((expense) => [
    format(new Date(expense.date), 'yyyy-MM-dd'),
    expense.title,
    expense.category,
    expense.amount,
    expense.paymentMethod || 'N/A',
    expense.description || 'N/A',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        // Handle cells with commas or quotes
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export summary statistics to CSV
 * @param {Object} stats - Statistics object
 * @param {String} filename - Name of the file to download
 */
export const exportStatsToCSV = (stats, filename = 'expense-summary.csv') => {
  const csvContent = [
    'Category,Amount,Count',
    ...stats.categoryStats.map((stat) =>
      [stat.category, stat.amount, stat.count].join(',')
    ),
    '',
    'Total Amount,' + stats.totalAmount,
    'Total Transactions,' + stats.totalCount,
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};