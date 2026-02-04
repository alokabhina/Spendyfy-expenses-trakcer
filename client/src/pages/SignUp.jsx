import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 'var(--spacing-md)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        <SignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: {
                margin: '0 auto',
              },
              card: {
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;