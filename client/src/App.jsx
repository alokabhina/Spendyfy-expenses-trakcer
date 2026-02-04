import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Layout from './components/layout/Layout';
import { routes } from './routes';
import './styles/index.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/expenses.css';
import './styles/analytics.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>
        <Layout>{children}</Layout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

// Clerk Provider with navigation
function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        {routes.map((route) => {
          // Check if route needs protection
          const isProtected = !['/sign-in', '/sign-up'].some(path => 
            route.path.includes(path)
          );

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                isProtected ? (
                  <ProtectedRoute>{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          );
        })}
      </Routes>
    </ClerkProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
}

export default App;