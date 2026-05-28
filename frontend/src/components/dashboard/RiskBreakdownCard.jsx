import React from 'react';
import { CloudRain, Compass, Activity, Zap, ShieldAlert } from 'lucide-react';

const RiskBreakdownCard = ({ title = 'Risk Factor Breakdown', breakdown = {} }) => {
  const factors = [
    { key: 'fatigue', label: 'Driver Fatigue Index', icon: ShieldAlert, baseColor: 'bg-red-500', trackColor: 'bg-red-50', textColor: 'text-red-700', border: 'border-red-100' },
    { key: 'overspeed', label: 'Velocity Risk Gradient', icon: Zap, baseColor: 'bg-orange-500', trackColor: 'bg-orange-50', textColor: 'text-orange-700', border: 'border-orange-100' },
    { key: 'rain', label: 'Hydroplaning Weather Coefficient', icon: CloudRain, baseColor: 'bg-blue-500', trackColor: 'bg-blue-50', textColor: 'text-blue-700', border: 'border-blue-100' },
    { key: 'roadStability', label: 'Chassis Stability Risk', icon: Activity, baseColor: 'bg-amber-500', trackColor: 'bg-amber-50', textColor: 'text-amber-700', border: 'border-amber-100' },
    { key: 'steeringInstability', label: 'Steering Drift Volatility', icon: Compass, baseColor: 'bg-lifelink-green', trackColor: 'bg-green-50', textColor: 'text-green-700', border: 'border-green-100' },
  ];

  const getIntensityLabel = (val) => {
    if (val >= 70) return 'CRITICAL';
    if (val >= 40) return 'MODERATE';
    return 'NOMINAL';
  };

  const getIntensityBadge = (val) => {
    if (val >= 70) return 'bg-red-50 text-red-700 border-red-100';
    if (val >= 40) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-green-50 text-green-700 border-green-100';
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-premium transition-all duration-300 hover:shadow-premiumHover h-80 flex flex-col justify-between">
      <div className="mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">AI ANALYSIS</span>
        <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 mt-0.5">
          {title}
        </h3>
      </div>

      <div className="space-y-3.5 flex-1 mt-3 overflow-y-auto pr-1 scrollbar-none">
        {factors.map((factor) => {
          const score = breakdown[factor.key] || 0;
          const Icon = factor.icon;
          return (
            <div key={factor.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-gray-700">{factor.label}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${getIntensityBadge(score)}`}>
                    {getIntensityLabel(score)}
                  </span>
                  <span className="font-black text-gray-900 w-8 text-right">{score}%</span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 rounded-full bg-gray-50 border overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ease-out ${factor.baseColor}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskBreakdownCard;
