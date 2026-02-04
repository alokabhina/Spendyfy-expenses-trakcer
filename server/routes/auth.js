import express from 'express';
import { requireAuth } from '../config/clerk.js';
import { verifyAuth } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from '../controllers/authController.js';
import { userProfileValidationRules, validate } from '../utils/validators.js';

const router = express.Router();

// Apply Clerk authentication middleware to all routes
router.use(requireAuth);
router.use(verifyAuth);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', getUserProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', userProfileValidationRules(), validate, updateUserProfile);

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', deleteUserAccount);

export default router;