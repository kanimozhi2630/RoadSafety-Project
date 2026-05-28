import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'green', fullPage = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    green: 'border-t-lifelink-green border-r-transparent border-b-transparent border-l-transparent',
    amber: 'border-t-lifelink-amber border-r-transparent border-b-transparent border-l-transparent',
    red: 'border-t-lifelink-red border-r-transparent border-b-transparent border-l-transparent',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={`animate-spin rounded-full border-gray-200 ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
