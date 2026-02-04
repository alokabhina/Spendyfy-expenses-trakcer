import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, backgroundColor: 'var(--bg-color)' }}>
        <div className="container">
          {children}
        </div>
      </main>
      <footer style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: 'var(--spacing-lg) 0',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: 'var(--font-size-sm)',
      }}>
        <p style={{ margin: 0 }}>© 2024 Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;