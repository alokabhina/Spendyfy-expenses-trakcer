import React from 'react';
import { formatCurrency, getCategoryIcon } from '../../utils/formatters';
import { formatDate } from '../../utils/dateHelpers';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3 className="empty-state-title">No expenses found</h3>
        <p className="empty-state-description">
          Try adjusting your filters or add a new expense
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{formatDate(expense.date, 'MMM dd, yyyy')}</td>
              <td>
                <strong>{expense.title}</strong>
                {expense.description && (
                  <div className="text-sm text-muted">{expense.description}</div>
                )}
              </td>
              <td>
                <span className={`badge badge-${expense.category.toLowerCase()}`}>
                  {getCategoryIcon(expense.category)} {expense.category}
                </span>
              </td>
              <td>
                <strong style={{ color: 'var(--danger-color)' }}>
                  {formatCurrency(expense.amount)}
                </strong>
              </td>
              <td className="text-muted">{expense.paymentMethod || 'N/A'}</td>
              <td>
                <div className="actions-cell">
                  <button 
                    className="icon-btn" 
                    onClick={() => onEdit(expense)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="icon-btn danger" 
                    onClick={() => onDelete(expense)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;