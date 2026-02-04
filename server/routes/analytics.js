import express from 'express';
import { requireAuth } from '../config/clerk.js';
import { verifyAuth } from '../middleware/auth.js';
import {
  getDashboardStats,
  getCategoryAnalytics,
  getMonthlyTrends,
  getExpenseComparison,
} from '../controllers/analyticsController.js';

const router = express.Router();

// Apply Clerk authentication middleware to all routes
router.use(requireAuth);
router.use(verifyAuth);

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', getDashboardStats);

// @route   GET /api/analytics/category
// @desc    Get category-wise analytics
// @access  Private
router.get('/category', getCategoryAnalytics);

// @route   GET /api/analytics/trends
// @desc    Get monthly trends
// @access  Private
router.get('/trends', getMonthlyTrends);

// @route   GET /api/analytics/comparison
// @desc    Get expense comparison (current vs previous period)
// @access  Private
router.get('/comparison', getExpenseComparison);

export default router;