import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Clerk configuration
export const clerkConfig = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
};

// Middleware to require authentication
export const requireAuth = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
});