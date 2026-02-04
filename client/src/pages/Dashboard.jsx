import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import expenseService from '../services/expenseService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatCurrency, getCategoryIcon } from '../utils/formatters';
import { formatDate } from '../utils/dateHelpers';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    // Only fetch when user is loaded
    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add small delay to ensure Clerk session is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      const [statsData, recentData] = await Promise.all([
        expenseService.getDashboardStats(),
        expenseService.getRecentExpenses(5),
      ]);

      setStats(statsData.data);
      setRecentExpenses(recentData.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Wait for Clerk to load
  if (!isLoaded) {
    return <Loader message="Loading..." />;
  }

  if (loading) return <Loader message="Loading dashboard..." />;
  
  if (error) {
    return (
      <div className="dashboard-container">
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
        <div className="alert alert-info" style={{ marginTop: 'var(--spacing-md)' }}>
          <strong>Tip:</strong> If you're seeing authentication errors, try:
          <ul style={{ marginTop: 'var(--spacing-sm)', paddingLeft: 'var(--spacing-lg)' }}>
            <li>Signing out and signing back in</li>
            <li>Checking your Clerk configuration</li>
            <li>Verifying your .env files have the correct keys</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user?.firstName || 'User'}! 👋</h1>
        <p className="dashboard-subtitle">Here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">{formatCurrency(stats?.totalAmount || 0)}</div>
          <div className="stat-change positive">This Month</div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{stats?.totalCount || 0}</div>
          <div className="stat-change">All Time</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">📂</div>
          <div className="stat-label">Categories</div>
          <div className="stat-value">{stats?.categoryStats?.length || 0}</div>
          <div className="stat-change">Active</div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="recent-expenses">
        <div className="recent-expenses-header">
          <h2 className="recent-expenses-title">Recent Expenses</h2>
          <Link to="/expenses" className="btn btn-sm btn-primary">View All</Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">No expenses yet</h3>
            <p className="empty-state-description">Start tracking your expenses to see them here</p>
            <Link to="/expenses" className="btn btn-primary">Add Expense</Link>
          </div>
        ) : (
          <div>
            {recentExpenses.map((expense) => (
              <div key={expense._id} className="expense-item">
                <div className="expense-info">
                  <div className="expense-title">
                    {getCategoryIcon(expense.category)} {expense.title}
                  </div>
                  <div className="expense-meta">
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span>{formatDate(expense.date, 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                <div className="expense-amount">{formatCurrency(expense.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;