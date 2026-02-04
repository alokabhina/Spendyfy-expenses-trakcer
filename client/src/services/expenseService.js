import api from "./api";

/**
 * ✅ FIXED Helper: Properly unwrap API responses
 * Backend returns: { success: true, data: { expenses: [...], pagination: {...} } }
 * OR: { success: true, data: [...] }
 */
const unwrap = (res) => {
  // If response has data.data, use that (nested structure)
  if (res?.data?.data) {
    return res.data.data;
  }
  // Otherwise use data directly
  if (res?.data) {
    return res.data;
  }
  // Fallback to the response itself
  return res;
};

// Expense Service
const expenseService = {
  // Create new expense
  createExpense: async (expenseData) => {
    const response = await api.post("/expenses", expenseData);
    return unwrap(response);
  },

  // Get all expenses with filters
  getExpenses: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ""
      ) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/expenses?${params.toString()}`);
    const unwrapped = unwrap(response);
    
    console.log("🔍 getExpenses - Raw Response:", response);
    console.log("🔍 getExpenses - Unwrapped:", unwrapped);
    
    return unwrapped;
  },

  // Get recent expenses
  getRecentExpenses: async (limit = 5) => {
    const response = await api.get(`/expenses/recent?limit=${limit}`);
    return unwrap(response);
  },

  // Get single expense by ID
  getExpenseById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return unwrap(response);
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return unwrap(response);
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return unwrap(response);
  },

  // Delete all expenses
  deleteAllExpenses: async () => {
    const response = await api.delete("/expenses");
    return unwrap(response);
  },

  // Get dashboard statistics
  getDashboardStats: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await api.get(
      `/analytics/dashboard?${params.toString()}`
    );
    return unwrap(response);
  },

  // Get category analytics
  getCategoryAnalytics: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await api.get(
      `/analytics/category?${params.toString()}`
    );
    return unwrap(response);
  },

  // Get monthly trends
  getMonthlyTrends: async (months = 12) => {
    const response = await api.get(`/analytics/trends?months=${months}`);
    return unwrap(response);
  },

  // Get expense comparison
  getExpenseComparison: async () => {
    const response = await api.get("/analytics/comparison");
    return unwrap(response);
  },

  // Get user profile
  getUserProfile: async () => {
    const response = await api.get("/auth/profile");
    return unwrap(response);
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    const response = await api.put("/auth/profile", profileData);
    return unwrap(response);
  },

  // Delete user account
  deleteUserAccount: async () => {
    const response = await api.delete("/auth/account");
    return unwrap(response);
  },
};

export default expenseService;