import Expense from '../models/Expense.js';

// Create new expense
export const createExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, amount, category, date, description, paymentMethod } = req.body;

    const expense = await Expense.create({
      userId,
      title,
      amount,
      category,
      date: date || new Date(),
      description,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Create Expense Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating expense',
      error: error.message,
    });
  }
};

// Get all expenses for user with filters
export const getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
      sortBy = 'date',
      order = 'desc',
    } = req.query;

    // Build filter query
    const filter = { userId };

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Get expenses with pagination
    const expenses = await Expense.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Expense.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get Expenses Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message,
    });
  }
};

// Get single expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const expense = await Expense.findOne({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error('Get Expense Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense',
      error: error.message,
    });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Update Expense Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating expense',
      error: error.message,
    });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message,
    });
  }
};

// Delete all expenses for user (for account deletion)
export const deleteAllExpenses = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await Expense.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} expenses deleted successfully`,
    });
  } catch (error) {
    console.error('Delete All Expenses Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting expenses',
      error: error.message,
    });
  }
};

// Get recent expenses (for dashboard)
export const getRecentExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 5;

    const expenses = await Expense.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error('Get Recent Expenses Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent expenses',
      error: error.message,
    });
  }
};