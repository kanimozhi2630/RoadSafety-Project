import React from 'react';
import { Sparkles } from 'lucide-react';

const SensorCard = ({ title, value, percentage = 0, statusColor = 'green', displayValue = null, desc = null }) => {
  const barColors = {
    green: 'bg-lifelink-green',
    amber: 'bg-lifelink-amber',
    red: 'bg-lifelink-red',
    blue: 'bg-blue-500'
  };

  const bgTrackColors = {
    green: 'bg-green-100/50',
    amber: 'bg-amber-100/50',
    red: 'bg-red-100/50',
    blue: 'bg-blue-100/50'
  };

  const borderColors = {
    green: 'border-green-100/80',
    amber: 'border-amber-100/80',
    red: 'border-red-100/80',
    blue: 'border-blue-100/80'
  };

  const shadowGlow = {
    green: 'shadow-[0_0_10px_rgba(22,163,74,0.05)]',
    amber: 'shadow-[0_0_10px_rgba(245,158,11,0.05)]',
    red: 'shadow-[0_0_15px_rgba(220,38,38,0.08)]',
    blue: 'shadow-[0_0_10px_rgba(59,130,246,0.05)]'
  };

  return (
    <div className={`bg-white border rounded-xl p-4 transition-all duration-300 hover:shadow-premiumHover flex flex-col justify-between h-36 ${borderColors[statusColor]} ${shadowGlow[statusColor]}`}>
      {/* Title + Status Dot */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${
          statusColor === 'green' ? 'bg-lifelink-green' : 
          statusColor === 'amber' ? 'bg-lifelink-amber' : 
          statusColor === 'red' ? 'bg-lifelink-red' : 'bg-blue-500'
        }`} />
      </div>

      {/* Main Large Value */}
      <div className="my-1.5">
        <p className="text-xl font-extrabold text-gray-900 leading-none">
          {displayValue || value}
        </p>
        {desc && <p className="text-[9px] text-gray-400 font-medium mt-1 leading-none">{desc}</p>}
      </div>

      {/* Modern Progress Slider Track */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[8px] font-bold text-gray-400 tracking-wider">
          <span>MIN</span>
          <span>{Math.round(percentage)}%</span>
          <span>MAX</span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${bgTrackColors[statusColor]}`}>
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${barColors[statusColor]}`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SensorCard;
