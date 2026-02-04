import React from 'react';
import { formatCurrency, getCategoryIcon, getCategoryColorClass } from '../../utils/formatters';
import { formatDate } from '../../utils/dateHelpers';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="expense-card">
      <div className="expense-card-header">
        <span className={`expense-card-category ${getCategoryColorClass(expense.category)}`}>
          {getCategoryIcon(expense.category)} {expense.category}
        </span>
        <div className="expense-card-actions">
          <button className="icon-btn" onClick={() => onEdit(expense)} title="Edit">
            ✏️
          </button>
          <button className="icon-btn danger" onClick={() => onDelete(expense)} title="Delete">
            🗑️
          </button>
        </div>
      </div>

      <h3 className="expense-card-title">{expense.title}</h3>
      
      {expense.description && (
        <p className="expense-card-description">{expense.description}</p>
      )}

      <div className="expense-card-footer">
        <div className="expense-card-amount">
          {formatCurrency(expense.amount)}
        </div>
        <div className="expense-card-meta">
          <div className="expense-card-date">
            {formatDate(expense.date, 'MMM dd, yyyy')}
          </div>
          {expense.paymentMethod && (
            <div className="text-sm text-muted">
              via {expense.paymentMethod}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;