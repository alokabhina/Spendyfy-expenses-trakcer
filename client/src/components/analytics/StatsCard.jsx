import React from 'react';

const StatsCard = ({ 
  icon, 
  label, 
  value, 
  change, 
  changeType = 'neutral', 
  variant = 'default' 
}) => {
  const variantClass = variant !== 'default' ? variant : '';

  return (
    <div className={`stat-card ${variantClass}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {change && (
        <div className={`stat-change ${changeType}`}>
          {changeType === 'positive' && '↑ '}
          {changeType === 'negative' && '↓ '}
          {change}
        </div>
      )}
    </div>
  );
};

export default StatsCard;