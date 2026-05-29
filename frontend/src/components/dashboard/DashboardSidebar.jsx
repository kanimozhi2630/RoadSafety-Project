import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { 
  LayoutDashboard, 
  LineChart, 
  Activity, 
  Flame, 
  AlertTriangle,
  Play,
  RotateCcw,
  User
} from 'lucide-react';

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const { simMode, setSimMode, emergencyCancelled, resetCancellationState } = useTelemetry();

  const navItems = [
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'risk', label: 'Risk Prediction', icon: LineChart },
    { id: 'accident', label: 'Accident Detection', icon: Activity },
    { id: 'emergency', label: 'Emergency Response', icon: Flame },
    { id: 'profile', label: 'Profile / Settings', icon: User },
  ];

  const simModes = [
    { id: 'cruising', label: 'Highway Cruise', desc: 'Standard Safe Drive', color: 'bg-green-500', text: 'text-green-700', activeBg: 'bg-green-50 border-green-200' },
    { id: 'fatigue', label: 'Driver Fatigue', desc: 'Drowsy / Micro-sleeps', color: 'bg-amber-500', text: 'text-amber-700', activeBg: 'bg-amber-50 border-amber-200' },
    { id: 'harsh_braking', label: 'Harsh Braking', desc: 'Emergency deceleration', color: 'bg-orange-500', text: 'text-orange-700', activeBg: 'bg-orange-50 border-orange-200' },
    { id: 'accident', label: 'Severe Crash', desc: 'Trigger roll & impact', color: 'bg-red-500 animate-ping', text: 'text-red-700', activeBg: 'bg-red-50 border-red-200' }
  ];

  const handleModeChange = (modeId) => {
    if (modeId !== 'accident' && emergencyCancelled) {
      resetCancellationState();
    }
    setSimMode(modeId);
    
    // Automatically redirect to relevant tab for testing efficiency
    if (modeId === 'fatigue' || modeId === 'harsh_braking') {
      setActiveTab('risk');
    } else if (modeId === 'accident') {
      setActiveTab('emergency');
    }
  };

  return (
    <aside className="w-64 border-r border-gray-100 bg-white flex flex-col h-screen lg:h-[calc(100vh-64px)] justify-between lg:sticky lg:top-16 select-none z-30 overflow-y-auto">
      {/* Upper Section: Navigation Links */}
      <div className="p-4 space-y-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 block mb-3">Emergency Platform</span>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-lifelink-greenLight text-lifelink-green border-green-100'
                    : 'text-gray-600 hover:text-gray-900 bg-transparent border-transparent hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-lifelink-green' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Lower Section: Real-time Telemetry Simulator Control panel */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-1.5">
            <Play className="w-3.5 h-3.5 text-lifelink-green fill-current" />
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">IOT TELEMETRY HUB</span>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lifelink-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lifelink-green"></span>
          </span>
        </div>

        <div className="space-y-2">
          {simModes.map((mode) => {
            const isActive = simMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start space-x-2.5 ${
                  isActive
                    ? `${mode.activeBg} ring-1 ring-offset-1 ring-gray-100 shadow-sm`
                    : 'bg-white hover:bg-gray-50 border-gray-100'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${mode.color}`} />
                <div>
                  <p className={`font-bold leading-tight ${isActive ? mode.text : 'text-gray-800'}`}>
                    {mode.label}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-1">
                    {mode.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {emergencyCancelled && (
          <div className="mt-3 bg-green-50 border border-green-200/50 rounded-lg p-2 flex items-center space-x-1.5 justify-center">
            <span className="text-[9px] font-semibold text-green-700">SOS Silenced — Safe State Active</span>
            <button 
              onClick={resetCancellationState}
              className="hover:bg-green-100 p-0.5 rounded transition-colors"
              title="Reset Cancellation System"
            >
              <RotateCcw className="w-3 h-3 text-green-700" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
