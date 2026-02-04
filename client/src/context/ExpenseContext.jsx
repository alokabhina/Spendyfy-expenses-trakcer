import React, { createContext, useContext, useState, useEffect } from 'react';
import expenseService from '../services/expenseService';

const ExpenseContext = createContext();

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  // Fetch expenses with filters
  const fetchExpenses = async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const appliedFilters = { ...filters, ...customFilters };
      const response = await expenseService.getExpenses(appliedFilters);

      setExpenses(response.expenses || []);
setPagination(
  response.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  }
);

    } catch (err) {
      setError(err.message);
      console.error('Fetch Expenses Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create expense
  const createExpense = async (expenseData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await expenseService.createExpense(expenseData);
      
      // Refresh expenses list
      await fetchExpenses();
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update expense
  const updateExpense = async (id, expenseData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await expenseService.updateExpense(id, expenseData);
      
      // Refresh expenses list
      await fetchExpenses();
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await expenseService.deleteExpense(id);
      
      // Refresh expenses list
      await fetchExpenses();
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      page: 1,
      limit: 10,
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchExpenses();
  }, []);

  const value = {
    expenses,
    loading,
    error,
    filters,
    pagination,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    updateFilters,
    clearFilters,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;