import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import logoImage from '../../assets/logo.jpeg';

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    padding: 'var(--spacing-md) 0',
    position: 'sticky',
    top: 0,
    zIndex: 'var(--z-sticky)',
    boxShadow: 'var(--shadow-sm)',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 var(--spacing-md)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    textDecoration: 'none',
  };

  const logoImageStyle = {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
  };

  const logoTextStyle = {
    fontSize: 'var(--font-size-xl)',
    fontWeight: '700',
    color: 'var(--primary-color)',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: 'var(--spacing-lg)',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const linkStyle = (active) => ({
    textDecoration: 'none',
    color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
    fontWeight: active ? '600' : '500',
    transition: 'color var(--transition-fast)',
    borderBottom: active ? '2px solid var(--primary-color)' : 'none',
    paddingBottom: 'var(--spacing-xs)',
  });

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/dashboard" style={logoContainerStyle}>
          <img 
            src={logoImage} 
            alt="ExpenseTracker Logo" 
            style={logoImageStyle}
          />
          <span style={logoTextStyle}>Spendyfy</span>
        </Link>

        <ul style={navLinksStyle}>
          <li>
            <Link to="/dashboard" style={linkStyle(isActive('/dashboard'))}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/expenses" style={linkStyle(isActive('/expenses'))}>
              Expenses
            </Link>
          </li>
          <li>
            <Link to="/analytics" style={linkStyle(isActive('/analytics'))}>
              Analytics
            </Link>
          </li>
          <li>
            <Link to="/profile" style={linkStyle(isActive('/profile'))}>
              Profile
            </Link>
          </li>
          <li>
            <UserButton afterSignOutUrl="/sign-in" />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;