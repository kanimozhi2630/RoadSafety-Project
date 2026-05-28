import React from 'react';

const StatusBadge = ({ status = 'SAFE', text = null }) => {
  const normalizedStatus = status.toString().toUpperCase();
  const label = text || status;

  const styleClasses = {
    // Standard safety levels
    SAFE: 'bg-green-50 text-green-700 border-green-200/60',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-200/60',
    DANGER: 'bg-red-50 text-red-700 border-red-200/60',
    CRITICAL: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
    NORMAL: 'bg-green-50 text-green-700 border-green-200/60',
    ABNORMAL: 'bg-red-50 text-red-700 border-red-200/60',

    // Movement states
    MOVING: 'bg-blue-50 text-blue-700 border-blue-200/60',
    STATIONARY: 'bg-gray-100 text-gray-700 border-gray-300',
    DECELERATING: 'bg-orange-50 text-orange-700 border-orange-200/60',

    // Onboarding / setup states
    ACTIVE: 'bg-green-50 text-green-700 border-green-200/60',
    INACTIVE: 'bg-gray-50 text-gray-500 border-gray-200',
    MAINTENANCE: 'bg-yellow-50 text-yellow-700 border-yellow-200/60'
  };

  const dotClasses = {
    SAFE: 'bg-lifelink-green animate-pulse-safe',
    WARNING: 'bg-lifelink-amber animate-pulse-warning',
    DANGER: 'bg-lifelink-red animate-pulse-critical',
    CRITICAL: 'bg-lifelink-red animate-pulse-critical',
    NORMAL: 'bg-lifelink-green',
    ABNORMAL: 'bg-lifelink-red animate-pulse',
    MOVING: 'bg-blue-500 animate-ping',
    STATIONARY: 'bg-gray-400',
    DECELERATING: 'bg-orange-500 animate-pulse',
    ACTIVE: 'bg-lifelink-green',
    INACTIVE: 'bg-gray-400',
    MAINTENANCE: 'bg-yellow-500'
  };

  const badgeStyle = styleClasses[normalizedStatus] || styleClasses.SAFE;
  const dotStyle = dotClasses[normalizedStatus] || dotClasses.SAFE;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
      {label}
    </span>
  );
};

export default StatusBadge;
