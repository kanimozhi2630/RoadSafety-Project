import React from 'react';

const RiskGauge = ({ score = 0, label = 'OVERALL RISK' }) => {
  // Circular indicator variables
  const radius = 80;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColorClasses = (val) => {
    if (val >= 70) return { text: 'text-lifelink-red', stroke: 'stroke-lifelink-red', bg: 'bg-red-50', border: 'border-red-100', glow: 'shadow-[0_0_20px_rgba(220,38,38,0.15)]' };
    if (val >= 40) return { text: 'text-lifelink-amber', stroke: 'stroke-lifelink-amber', bg: 'bg-amber-50', border: 'border-amber-100', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' };
    return { text: 'text-lifelink-green', stroke: 'stroke-lifelink-green', bg: 'bg-green-50', border: 'border-green-100', glow: 'shadow-[0_0_20px_rgba(22,163,74,0.1)]' };
  };

  const style = getColorClasses(score);

  return (
    <div className={`bg-white border rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-premium transition-all duration-300 hover:shadow-premiumHover h-80 ${style.border}`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{label}</span>
      
      {/* Circular SVG Gauge Canvas */}
      <div className="relative flex items-center justify-center w-48 h-48 select-none">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Base track circle */}
          <circle
            cx="80"
            cy="80"
            r={normalizedRadius}
            fill="transparent"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />
          {/* Active progress circle */}
          <circle
            cx="80"
            cy="80"
            r={normalizedRadius}
            fill="transparent"
            className={`transition-all duration-1000 ease-out stroke-linecap-round ${style.stroke}`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text displaying overall percentage score */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-gray-900 tracking-tight leading-none">
            {score}%
          </span>
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border mt-2 leading-none uppercase tracking-wide ${
            score >= 70 ? 'bg-red-50 text-red-700 border-red-100' :
            score >= 40 ? 'bg-amber-50 text-amber-700 border-amber-100' :
            'bg-green-50 text-green-700 border-green-100'
          }`}>
            {score >= 70 ? 'DANGER STATE' : score >= 40 ? 'WARNING STATE' : 'SAFE STATE'}
          </span>
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-500 max-w-[200px] leading-snug mt-2">
        {score >= 70 ? 'AI warns of highly volatile vehicle steering and critical collision risk.' : 
         score >= 40 ? 'Moderate safety anomalies detected. Driver haptics alert active.' : 
         'Automated flight conditions normal. Safety margin operates above 98%.'}
      </p>
    </div>
  );
};

export default RiskGauge;
