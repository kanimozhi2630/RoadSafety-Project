import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Bell, Info, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';

const AlertTimeline = () => {
  const { telemetry, simMode } = useTelemetry();
  const [alerts, setAlerts] = useState([]);

  // Generate real-time timeline logs based on the telemetry events
  useEffect(() => {
    if (!telemetry) return;

    // Filter cruising events sometimes to avoid timeline spamming,
    // but log all warning/danger events instantly!
    const isCruising = telemetry.eventType === 'CRUISING_NORMAL';
    if (isCruising && Math.random() > 0.05) return;

    const newAlert = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: telemetry.eventType,
      level: telemetry.riskLevel,
      description: telemetry.description,
      action: telemetry.actionTaken
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, 15));
  }, [telemetry]);

  const getAlertIcon = (level) => {
    switch (level) {
      case 'DANGER':
        return <ShieldAlert className="w-4 h-4 text-lifelink-red" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-lifelink-amber" />;
      default:
        return <Info className="w-4 h-4 text-lifelink-green" />;
    }
  };

  const getBadgeColor = (level) => {
    switch (level) {
      case 'DANGER':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-green-50 text-green-700 border-green-100';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-premium p-5 flex flex-col justify-between h-[380px] overflow-hidden">
      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">EVENT RECORDER</span>
        <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 mt-0.5">
          <Bell className="w-4 h-4 text-lifelink-green" />
          Live Safety Alert Timeline
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3.5 scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Zap className="w-8 h-8 text-gray-300 mb-2 animate-bounce" />
            <p className="text-xs font-bold text-gray-400">Waiting for sensor data stream...</p>
            <p className="text-[9px] text-gray-300 mt-1 max-w-[170px]">Toggle simulation modes on the sidebar to trigger instant safety alerts.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="relative pl-6 border-l-2 border-gray-100 last:border-0 pb-1">
              {/* Timeline bubble node point */}
              <span className={`absolute -left-[9px] top-1 p-1 rounded-full bg-white border shadow-sm ${
                alert.level === 'DANGER' ? 'border-red-300' : alert.level === 'WARNING' ? 'border-amber-300' : 'border-green-300'
              }`}>
                {getAlertIcon(alert.level)}
              </span>

              {/* Timestamp and label */}
              <div className="flex items-center space-x-2">
                <span className="text-[9px] text-gray-400 font-extrabold">{alert.time}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getBadgeColor(alert.level)}`}>
                  {alert.type.replace('_', ' ')}
                </span>
              </div>

              {/* Event Content */}
              <p className="text-xs font-bold text-gray-800 mt-1 leading-snug">
                {alert.description}
              </p>
              <p className="text-[9px] font-semibold text-gray-400 mt-0.5 flex items-center gap-1">
                <span className="text-lifelink-green">➔ System Action:</span> {alert.action}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertTimeline;
