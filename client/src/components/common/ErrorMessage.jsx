import React from 'react';
import '../../styles/components.css';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger">
      <p style={{ marginBottom: onRetry ? 'var(--spacing-md)' : '0' }}>
        <strong>Error:</strong> {message}
      </p>
      {onRetry && (
        <button className="btn btn-sm btn-danger" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;