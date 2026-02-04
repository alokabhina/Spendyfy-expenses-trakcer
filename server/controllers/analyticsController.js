import Expense from '../models/Expense.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = { userId };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Category-wise breakdown
    const categoryStats = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Monthly expenses (last 12 months)
    const monthlyExpenses = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    // Payment method breakdown
    const paymentMethodStats = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAmount: totalExpenses[0]?.total || 0,
        totalCount: totalExpenses[0]?.count || 0,
        categoryStats: categoryStats.map((stat) => ({
          category: stat._id,
          amount: stat.total,
          count: stat.count,
        })),
        monthlyExpenses: monthlyExpenses.map((stat) => ({
          year: stat._id.year,
          month: stat._id.month,
          amount: stat.total,
          count: stat.count,
        })),
        paymentMethodStats: paymentMethodStats.map((stat) => ({
          method: stat._id,
          amount: stat.total,
          count: stat.count,
        })),
      },
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message,
    });
  }
};

// Get category-wise analytics
export const getCategoryAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    const dateFilter = { userId };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const analytics = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' },
          highest: { $max: '$amount' },
          lowest: { $min: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: analytics.map((item) => ({
        category: item._id,
        total: item.total,
        count: item.count,
        average: item.average,
        highest: item.highest,
        lowest: item.lowest,
      })),
    });
  } catch (error) {
    console.error('Get Category Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category analytics',
      error: error.message,
    });
  }
};

// Get monthly trends
export const getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.userId;
    const { months = 12 } = req.query;

    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

    const trends = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: monthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            category: '$category',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: trends.map((item) => ({
        year: item._id.year,
        month: item._id.month,
        category: item._id.category,
        amount: item.total,
        count: item.count,
      })),
    });
  } catch (error) {
    console.error('Get Monthly Trends Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly trends',
      error: error.message,
    });
  }
};

// Get expense comparison (current vs previous period)
export const getExpenseComparison = async (req, res) => {
  try {
    const userId = req.userId;

    // Current month
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Previous month
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonth = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const previousMonth = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: prevMonthStart, $lte: prevMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const current = currentMonth[0] || { total: 0, count: 0 };
    const previous = previousMonth[0] || { total: 0, count: 0 };

    const amountChange =
      previous.total > 0
        ? ((current.total - previous.total) / previous.total) * 100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        currentMonth: {
          total: current.total,
          count: current.count,
        },
        previousMonth: {
          total: previous.total,
          count: previous.count,
        },
        change: {
          amount: current.total - previous.total,
          percentage: amountChange.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error('Get Expense Comparison Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense comparison',
      error: error.message,
    });
  }
};