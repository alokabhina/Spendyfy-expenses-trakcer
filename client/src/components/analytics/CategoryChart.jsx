import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No data available</p>
      </div>
    );
  }

  const categoryColors = {
    Food: '#ef4444',
    Transport: '#3b82f6',
    Shopping: '#a855f7',
    Bills: '#f59e0b',
    Entertainment: '#ec4899',
    Health: '#10b981',
    Others: '#6b7280',
  };

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: 'Amount Spent',
        data: data.map(item => item.amount),
        backgroundColor: data.map(item => categoryColors[item.category] || '#6b7280'),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Category Breakdown</h3>
      </div>
      <div className="chart-container">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryChart;