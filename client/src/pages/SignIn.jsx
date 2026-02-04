import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
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
        <SignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
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

export default SignInPage;