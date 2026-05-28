import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { 
  PlaySquare, 
  CloudRain, 
  Zap, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  AlertOctagon 
} from 'lucide-react';

const SimulationControlPanel = () => {
  const { simMode, setSimMode, activateEmergencySystem, telemetry } = useTelemetry();
  const [activeTab, setActiveTab] = useState('prediction'); // 'prediction' | 'detection'

  const handleModeChange = (mode) => {
    if (mode === 'accident') {
      // Direct trigger of full CRITICAL emergency workflow
      setSimMode('accident');
      activateEmergencySystem('CRITICAL', telemetry);
    } else if (mode === 'severe_incident') {
      // Direct trigger of SEVERE emergency workflow
      setSimMode('severe_incident');
      activateEmergencySystem('SEVERE', telemetry);
    } else {
      setSimMode(mode);
    }
  };

  const getButtonClass = (mode, isDanger = false) => {
    const isActive = simMode === mode;
    if (isActive) {
      if (isDanger) return 'bg-red-500 text-white border-red-600 shadow-md transform scale-95';
      return 'bg-blue-600 text-white border-blue-700 shadow-md transform scale-95';
    }
    if (isDanger) return 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300';
    return 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-premium overflow-hidden w-full mb-6">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PlaySquare className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-extrabold text-gray-800">PROTOTYPE SIMULATOR</h3>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => setActiveTab('prediction')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'prediction' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Prediction
          </button>
          <button 
            onClick={() => setActiveTab('detection')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'detection' ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Detection
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'prediction' ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button 
              onClick={() => handleModeChange('cruising')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${getButtonClass('cruising')}`}
            >
              <CheckCircle className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">SAFE</span>
            </button>
            <button 
              onClick={() => handleModeChange('rain_risk')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${getButtonClass('rain_risk')}`}
            >
              <CloudRain className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">RAIN RISK</span>
            </button>
            <button 
              onClick={() => handleModeChange('overspeed')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${getButtonClass('overspeed')}`}
            >
              <Zap className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">OVERSPEED</span>
            </button>
            <button 
              onClick={() => handleModeChange('fatigue')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${getButtonClass('fatigue')}`}
            >
              <EyeOff className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">FATIGUE</span>
            </button>
            <button 
              onClick={() => handleModeChange('high_risk')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${getButtonClass('high_risk', true)}`}
            >
              <AlertTriangle className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">HIGH RISK</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button 
              onClick={() => handleModeChange('cruising')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${getButtonClass('cruising')}`}
            >
              <CheckCircle className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">NORMAL</span>
            </button>
            <button 
              onClick={() => handleModeChange('minor_incident')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${getButtonClass('minor_incident')}`}
            >
              <Activity className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">MINOR INCIDENT</span>
            </button>
            <button 
              onClick={() => handleModeChange('severe_incident')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${getButtonClass('severe_incident', true)}`}
            >
              <AlertTriangle className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">SEVERE INCIDENT</span>
            </button>
            <button 
              onClick={() => handleModeChange('accident')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all animate-pulse ${getButtonClass('accident', true)}`}
            >
              <AlertOctagon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">CRITICAL ACCIDENT</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationControlPanel;
