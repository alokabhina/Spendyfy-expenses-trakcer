import User from '../models/User.js';
import { getUserDetails } from '../middleware/auth.js';

// Get or create user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Check if user exists in database
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Get user details from Clerk
      const clerkUser = await getUserDetails(userId);

      if (!clerkUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Create new user in database
      user = await User.create({
        clerkId: clerkUser.clerkId,
        email: clerkUser.email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message,
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { monthlyBudget, categories } = req.body;

    const updateData = {};
    if (monthlyBudget !== undefined) updateData.monthlyBudget = monthlyBudget;
    if (categories !== undefined) updateData.categories = categories;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update User Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message,
    });
  }
};

// Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete user from database
    await User.findOneAndDelete({ clerkId: userId });

    // Note: You may also want to delete all user's expenses
    // This is handled in the expense controller

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete User Account Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user account',
      error: error.message,
    });
  }
};