import React from 'react';
import '../../styles/index.css';

const Loader = ({ size = 'md', message = '' }) => {
  const sizeClass = {
    sm: { width: '24px', height: '24px', border: '3px solid' },
    md: { width: '40px', height: '40px', border: '4px solid' },
    lg: { width: '60px', height: '60px', border: '5px solid' },
  };

  return (
    <div className="loading-container">
      <div className="flex flex-col items-center gap-2">
        <div 
          className="spinner" 
          style={sizeClass[size]}
        />
        {message && <p className="text-secondary">{message}</p>}
      </div>
    </div>
  );
};

export default Loader;