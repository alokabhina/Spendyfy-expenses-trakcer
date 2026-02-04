import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import ExpenseForm from '../components/expense/ExpenseForm';
import ExpenseCard from '../components/expense/ExpenseCard';
import ExpenseList from '../components/expense/ExpenseList';
import ExpenseFilter from '../components/expense/ExpenseFilter';
import { exportToCSV } from '../utils/exportCSV';
import { exportToPDF } from '../utils/exportPDF';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  
  // Filters
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchExpenses();
  }, [pagination.page, filters]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await expenseService.getExpenses({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      setExpenses(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowModal(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleDeleteExpense = async (expense) => {
    if (!window.confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      return;
    }

    try {
      await expenseService.deleteExpense(expense._id);
      fetchExpenses();
    } catch (err) {
      alert('Error deleting expense: ' + err.message);
    }
  };

  const handleSubmitExpense = async (formData) => {
    try {
      setSubmitting(true);

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense._id, formData);
      } else {
        await expenseService.createExpense(formData);
      }

      setShowModal(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      alert('Error saving expense: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleResetFilter = () => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleExportCSV = () => {
    exportToCSV(expenses, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportPDF = () => {
    exportToPDF(expenses, `expenses-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && expenses.length === 0) {
    return <Loader message="Loading expenses..." />;
  }

  return (
    <div className="expenses-container">
      {/* Header */}
      <div className="expenses-header">
        <div>
          <h1>Expenses</h1>
          <p className="text-secondary">
            Manage and track all your expenses
          </p>
        </div>
        <div className="expenses-actions">
          <Button onClick={handleAddExpense}>
            ➕ Add Expense
          </Button>
          <div className="export-buttons">
            <Button variant="outline" onClick={handleExportCSV} disabled={expenses.length === 0}>
              📊 Export CSV
            </Button>
            <Button variant="outline" onClick={handleExportPDF} disabled={expenses.length === 0}>
              📄 Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} onRetry={fetchExpenses} />}

      {/* Filter */}
      <ExpenseFilter onFilter={handleFilter} onReset={handleResetFilter} />

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-secondary">
          Showing {expenses.length} of {pagination.total} expenses
        </p>
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            📱 Grid
          </button>
        </div>
      </div>

      {/* Expenses Display */}
      {loading ? (
        <Loader />
      ) : viewMode === 'grid' ? (
        <div className="expenses-grid">
          {expenses.map(expense => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          ))}
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          
          {[...Array(pagination.pages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagination-btn ${pagination.page === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmitExpense}
          onCancel={() => {
            setShowModal(false);
            setEditingExpense(null);
          }}
          loading={submitting}
        />
      </Modal>
    </div>
  );
};

export default Expenses;