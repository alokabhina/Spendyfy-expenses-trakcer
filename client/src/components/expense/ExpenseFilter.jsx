import React, { useState } from 'react';
import Button from '../common/Button';
import { formatDateForInput } from '../../utils/dateHelpers';

const categories = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'];

const ExpenseFilter = ({ onFilter, onReset }) => {
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Remove empty filters
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value !== 'All') {
        acc[key] = value;
      }
      return acc;
    }, {});

    onFilter(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
    onReset();
  };

  return (
    <div className="filter-bar">
      <form onSubmit={handleSubmit}>
        <div className="filter-grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={filters.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-input"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-input"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Min Amount (₹)</label>
            <input
              type="number"
              name="minAmount"
              className="form-input"
              value={filters.minAmount}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Amount (₹)</label>
            <input
              type="number"
              name="maxAmount"
              className="form-input"
              value={filters.maxAmount}
              onChange={handleChange}
              placeholder="10000"
              min="0"
            />
          </div>
        </div>

        <div className="filter-actions">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit">
            Apply Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseFilter;