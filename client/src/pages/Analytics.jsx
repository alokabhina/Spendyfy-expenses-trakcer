import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import CategoryChart from '../components/analytics/CategoryChart';
import MonthlyChart from '../components/analytics/MonthlyChart';
import { formatCurrency, getCategoryIcon, calculatePercentage } from '../utils/formatters';
import { formatDateForInput, getCurrentMonthRange } from '../utils/dateHelpers';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Default safe objects
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalCount: 0,
    categoryStats: [],
  });

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [comparison, setComparison] = useState(null);

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (dateRange.startDate) filters.startDate = dateRange.startDate;
      if (dateRange.endDate) filters.endDate = dateRange.endDate;

      const [dashboardStats, categoryStats, trends, compareData] =
        await Promise.all([
          expenseService.getDashboardStats(filters),
          expenseService.getCategoryAnalytics(filters),
          expenseService.getMonthlyTrends(12),
          expenseService.getExpenseComparison(),
        ]);

      // ✅ ONLY FIXED HERE (No UI Change)
      setStats(dashboardStats || {});
      setCategoryData(categoryStats || []);
      setMonthlyData(trends || []);
      setComparison(compareData || null);

    } catch (err) {
      console.error("Analytics Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleResetDates = () => {
    setDateRange({ startDate: '', endDate: '' });
  };

  const handleSetCurrentMonth = () => {
    const { startDate, endDate } = getCurrentMonthRange();
    setDateRange({
      startDate: formatDateForInput(startDate),
      endDate: formatDateForInput(endDate),
    });
  };

  if (loading) return <Loader message="Loading analytics..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAnalytics} />;

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <h1>Analytics & Insights</h1>
        <p className="text-secondary">
          Detailed breakdown of your spending patterns
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="analytics-controls">
        <div className="date-range-picker">
          <div className="date-input-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-input"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="date-input-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-input"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-end' }}>
            <button className="btn btn-outline" onClick={handleSetCurrentMonth}>
              Current Month
            </button>
            <button className="btn btn-outline" onClick={handleResetDates}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="summary-stat">
          <div className="summary-stat-value">
            {formatCurrency(stats?.totalAmount || 0)}
          </div>
          <div className="summary-stat-label">Total Spent</div>
        </div>

        <div className="summary-stat">
          <div className="summary-stat-value">
            {stats?.totalCount || 0}
          </div>
          <div className="summary-stat-label">Transactions</div>
        </div>

        <div className="summary-stat">
          <div className="summary-stat-value">
            {stats?.totalCount > 0
              ? formatCurrency(stats.totalAmount / stats.totalCount)
              : formatCurrency(0)}
          </div>
          <div className="summary-stat-label">Avg per Transaction</div>
        </div>

        <div className="summary-stat">
          <div className="summary-stat-value">
            {categoryData?.length || 0}
          </div>
          <div className="summary-stat-label">Active Categories</div>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-row">
        <CategoryChart data={categoryData || []} />
        <MonthlyChart data={monthlyData || []} />
      </div>

      {/* Category Breakdown Table */}
      <div className="category-breakdown">
        <div className="category-breakdown-header">
          <h2>Category Details</h2>
        </div>

        <div className="category-list">
          {categoryData.map((item) => (
            <div key={item.category} className="category-item">
              <div className="category-item-info">
                <div className="category-item-icon">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="category-item-details">
                  <div className="category-item-name">{item.category}</div>
                  <div className="category-item-count">
                    {item.count} transactions
                  </div>
                </div>
              </div>

              <div className="category-item-amount">
                <div className="category-amount-value">
                  {formatCurrency(item.total)}
                </div>
                <div className="category-amount-percentage">
                  {calculatePercentage(item.total, stats?.totalAmount || 0).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month Comparison */}
      {comparison && (
        <div className="comparison-section">
          <div className="comparison-header">
            <h2>Monthly Comparison</h2>
          </div>

          <div className="comparison-cards">
            <div className="comparison-card">
              <div className="comparison-period">Current Month</div>
              <div className="comparison-amount">
                {formatCurrency(comparison.currentMonth.total)}
              </div>
              <div className="text-sm text-muted">
                {comparison.currentMonth.count} transactions
              </div>
            </div>

            <div className="comparison-card">
              <div className="comparison-period">Previous Month</div>
              <div className="comparison-amount">
                {formatCurrency(comparison.previousMonth.total)}
              </div>
              <div className="text-sm text-muted">
                {comparison.previousMonth.count} transactions
              </div>
            </div>

            <div className="comparison-card">
              <div className="comparison-period">Change</div>
              <div className="comparison-amount">
                {formatCurrency(Math.abs(comparison.change.amount))}
              </div>
              <div
                className={`comparison-change ${
                  comparison.change.amount > 0 ? 'increase' : 'decrease'
                }`}
              >
                <span className="comparison-arrow">
                  {comparison.change.amount > 0 ? '↑' : '↓'}
                </span>
                {Math.abs(comparison.change.percentage)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
