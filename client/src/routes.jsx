import React from 'react';
import { Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

// Auth layout for sign-in/sign-up pages
export const AuthLayout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 'var(--spacing-md)',
    }}>
      {children}
    </div>
  );
};

export const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/sign-in/*',
    element: (
      <AuthLayout>
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </AuthLayout>
    ),
  },
  {
    path: '/sign-up/*',
    element: (
      <AuthLayout>
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </AuthLayout>
    ),
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/expenses',
    element: <Expenses />,
  },
  {
    path: '/analytics',
    element: <Analytics />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
];