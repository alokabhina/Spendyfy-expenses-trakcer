import { clerkClient } from '@clerk/clerk-sdk-node';

// Middleware to verify Clerk authentication
export const verifyAuth = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No user ID found',
      });
    }

    // Attach userId to request
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Invalid token',
    });
  }
};

// Optional: Get full user details from Clerk
export const getUserDetails = async (userId) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    return {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};