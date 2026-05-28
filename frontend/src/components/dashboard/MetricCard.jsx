import React from 'react';

const MetricCard = ({ title, value, unit, icon: Icon, statusColor = 'green', description }) => {
  const borderColors = {
    green: 'border-green-100 hover:border-green-200',
    amber: 'border-amber-100 hover:border-amber-200',
    red: 'border-red-100 hover:border-red-200',
    blue: 'border-blue-100 hover:border-blue-200',
    gray: 'border-gray-100 hover:border-gray-200'
  };

  const statusDots = {
    green: 'bg-lifelink-green animate-pulse-safe',
    amber: 'bg-lifelink-amber animate-pulse-warning',
    red: 'bg-lifelink-red animate-pulse-critical',
    blue: 'bg-blue-500 animate-pulse',
    gray: 'bg-gray-400'
  };

  const bgGradients = {
    green: 'from-green-50/20 to-transparent',
    amber: 'from-amber-50/20 to-transparent',
    red: 'from-red-50/20 to-transparent',
    blue: 'from-blue-50/20 to-transparent',
    gray: 'from-gray-50/20 to-transparent'
  };

  return (
    <div className={`bg-white border rounded-xl p-4 shadow-premium transition-all duration-300 hover:shadow-premiumHover bg-gradient-to-br ${bgGradients[statusColor]} ${borderColors[statusColor]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{title}</span>
        <div className="flex items-center space-x-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${statusDots[statusColor]}`} />
          <Icon className={`w-4 h-4 ${
            statusColor === 'green' ? 'text-lifelink-green' : 
            statusColor === 'amber' ? 'text-lifelink-amber' : 
            statusColor === 'red' ? 'text-lifelink-red' : 
            statusColor === 'blue' ? 'text-blue-500' : 'text-gray-400'
          }`} />
        </div>
      </div>

      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</span>
        {unit && <span className="text-xs font-semibold text-gray-400">{unit}</span>}
      </div>

      {description && (
        <p className="text-[10px] text-gray-400 font-medium mt-1 leading-snug truncate">
          {description}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
