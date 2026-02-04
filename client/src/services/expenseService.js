import api from './api';

// Expense Service
const expenseService = {
  // Create new expense
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  // Get all expenses with filters
  getExpenses: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/expenses?${params.toString()}`);
    return response.data;
  },

  // Get recent expenses
  getRecentExpenses: async (limit = 5) => {
    const response = await api.get(`/expenses/recent?limit=${limit}`);
    return response.data;
  },

  // Get single expense by ID
  getExpenseById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Delete all expenses
  deleteAllExpenses: async () => {
    const response = await api.delete('/expenses');
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await api.get(`/analytics/dashboard?${params.toString()}`);
    return response.data;
  },

  // Get category analytics
  getCategoryAnalytics: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await api.get(`/analytics/category?${params.toString()}`);
    return response.data;
  },

  // Get monthly trends
  getMonthlyTrends: async (months = 12) => {
    const response = await api.get(`/analytics/trends?months=${months}`);
    return response.data;
  },

  // Get expense comparison
  getExpenseComparison: async () => {
    const response = await api.get('/analytics/comparison');
    return response.data;
  },

  // Get user profile
  getUserProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Delete user account
  deleteUserAccount: async () => {
    const response = await api.delete('/auth/account');
    return response.data;
  },
};

export default expenseService;