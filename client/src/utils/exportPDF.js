import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Export expenses data to PDF format
 * @param {Array} expenses - Array of expense objects
 * @param {String} filename - Name of the file to download
 */
export const exportToPDF = (expenses, filename = 'expenses.pdf') => {
  if (!expenses || expenses.length === 0) {
    alert('No data to export');
    return;
  }

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Expense Report', 14, 20);

  // Add date range or current date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 28);

  // Calculate total
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Add summary
  doc.setFontSize(11);
  doc.text(`Total Expenses: ₹${total.toFixed(2)}`, 14, 36);
  doc.text(`Number of Transactions: ${expenses.length}`, 14, 42);

  // Prepare table data
  const tableData = expenses.map((expense) => [
    format(new Date(expense.date), 'dd/MM/yyyy'),
    expense.title,
    expense.category,
    `₹${expense.amount.toFixed(2)}`,
    expense.paymentMethod || 'N/A',
  ]);

  // Add table
  doc.autoTable({
    startY: 50,
    head: [['Date', 'Title', 'Category', 'Amount', 'Payment']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { top: 50 },
  });

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  doc.save(filename);
};

/**
 * Export detailed report with analytics to PDF
 * @param {Object} data - Analytics data including expenses and stats
 * @param {String} filename - Name of the file to download
 */
export const exportDetailedPDF = (data, filename = 'expense-report-detailed.pdf') => {
  const { expenses, stats } = data;

  if (!expenses || expenses.length === 0) {
    alert('No data to export');
    return;
  }

  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Expense Report', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 28);

  // Summary Statistics
  let yPosition = 40;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, yPosition);

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Amount: ₹${stats.totalAmount.toFixed(2)}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Total Transactions: ${stats.totalCount}`, 14, yPosition);

  // Category Breakdown
  yPosition += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Category Breakdown', 14, yPosition);

  yPosition += 8;
  const categoryData = stats.categoryStats.map((cat) => [
    cat.category,
    `₹${cat.amount.toFixed(2)}`,
    cat.count.toString(),
    `${((cat.amount / stats.totalAmount) * 100).toFixed(1)}%`,
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['Category', 'Amount', 'Count', 'Percentage']],
    body: categoryData,
    theme: 'striped',
    headStyles: {
      fillColor: [79, 70, 229],
    },
  });

  // Expenses List
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('All Expenses', 14, 20);

  const expenseData = expenses.map((expense) => [
    format(new Date(expense.date), 'dd/MM/yyyy'),
    expense.title,
    expense.category,
    `₹${expense.amount.toFixed(2)}`,
    expense.paymentMethod || 'N/A',
  ]);

  doc.autoTable({
    startY: 28,
    head: [['Date', 'Title', 'Category', 'Amount', 'Payment']],
    body: expenseData,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
    },
    styles: {
      fontSize: 8,
    },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(filename);
};