import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { formatDateForInput } from '../../utils/dateHelpers';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'];
const paymentMethods = ['Cash', 'Card', 'UPI', 'Net Banking', 'Others'];

const ExpenseForm = ({ expense, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: formatDateForInput(new Date()),
    description: '',
    paymentMethod: 'Cash',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || 'Food',
        date: formatDateForInput(expense.date),
        description: expense.description || '',
        paymentMethod: expense.paymentMethod || 'Cash',
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          type="text"
          name="title"
          className="form-input"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Grocery Shopping"
          disabled={loading}
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Amount (₹) *</label>
        <input
          type="number"
          name="amount"
          className="form-input"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          disabled={loading}
        />
        {errors.amount && <div className="form-error">{errors.amount}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Category *</label>
        <select
          name="category"
          className="form-select"
          value={formData.category}
          onChange={handleChange}
          disabled={loading}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Date *</label>
        <input
          type="date"
          name="date"
          className="form-input"
          value={formData.date}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.date && <div className="form-error">{errors.date}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Payment Method</label>
        <select
          name="paymentMethod"
          className="form-select"
          value={formData.paymentMethod}
          onChange={handleChange}
          disabled={loading}
        >
          {paymentMethods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional notes..."
          rows="3"
          disabled={loading}
        />
      </div>

      <div className="modal-footer">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : expense ? 'Update' : 'Add'} Expense
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;