import express from 'express';
import { clerkAuth } from "../middleware/clerkAuth.js";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
  getRecentExpenses,
} from '../controllers/expenseController.js';
import {
  expenseValidationRules,
  filterValidationRules,
  validate,
} from '../utils/validators.js';

const router = express.Router();
router.use(clerkAuth);

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Private
router.post('/', expenseValidationRules(), validate, createExpense);

// @route   GET /api/expenses
// @desc    Get all expenses with filters and pagination
// @access  Private
router.get('/', filterValidationRules(), validate, getExpenses);

// @route   GET /api/expenses/recent
// @desc    Get recent expenses
// @access  Private
router.get('/recent', getRecentExpenses);

// @route   GET /api/expenses/:id
// @desc    Get single expense by ID
// @access  Private
router.get('/:id', getExpenseById);

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', expenseValidationRules(), validate, updateExpense);

// @route   DELETE /api/expenses/:id
// @desc    Delete single expense
// @access  Private
router.delete('/:id', deleteExpense);

// @route   DELETE /api/expenses
// @desc    Delete all expenses (for account deletion)
// @access  Private
router.delete('/', deleteAllExpenses);

export default router;