import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { CheckCircle2, XCircle, Loader2, Sparkles, Siren } from 'lucide-react';

const EmergencyWorkflow = () => {
  const { smsDeliveryProgress, emergencySent } = useTelemetry();

  if (!emergencySent) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-premium hover:shadow-premiumHover h-80 flex flex-col justify-between">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">DISPATCH MONITOR</span>
        <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 mt-0.5">
          <Siren className="w-4 h-4 text-lifelink-red animate-pulse" />
          Live SOS Delivery Checkpoint Matrix
        </h3>
      </div>

      {/* Progress logs list */}
      <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3 scrollbar-thin">
        {smsDeliveryProgress.map((item, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              item.status === 'success' ? 'bg-green-50 border-green-200/50 text-green-800' :
              item.status === 'failed' ? 'bg-red-50 border-red-200/50 text-red-800' :
              'bg-gray-50 border-gray-100 text-gray-500'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {item.status === 'success' && <CheckCircle2 className="w-4 h-4 text-lifelink-green" />}
              {item.status === 'failed' && <XCircle className="w-4 h-4 text-lifelink-red" />}
              {item.status === 'loading' && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
              <span>{item.name}</span>
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wider">
              {item.status === 'success' && 'CONFIRMED'}
              {item.status === 'failed' && 'FAILED'}
              {item.status === 'loading' && 'PENDING'}
            </span>
          </div>
        ))}
      </div>

      {/* Status footer banner */}
      <div className="border-t border-gray-50 pt-3 flex items-center justify-between text-[9px] font-medium text-gray-400">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-lifelink-amber" />
          <span>Continuous failover SMS routing active</span>
        </div>
        <span>100% encryption</span>
      </div>
    </div>
  );
};

export default EmergencyWorkflow;
