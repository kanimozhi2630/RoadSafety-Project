import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import EmergencyCountdown from '../../components/dashboard/EmergencyCountdown';
import EmergencyWorkflow from '../../components/dashboard/EmergencyWorkflow';
import VideoRecorder from '../../components/dashboard/VideoRecorder';
import VoicebotAssistant from '../../components/dashboard/VoicebotAssistant';

import { ShieldCheck, ShieldAlert, Sparkles, AlertOctagon, Siren, Send } from 'lucide-react';

const EmergencyResponse = () => {
  const { 
    emergencyActive, 
    emergencySent, 
    telemetry, 
    activateEmergencySystem,
    emergencyCancelled
  } = useTelemetry();

  const handleManualSos = () => {
    if (telemetry) {
      activateEmergencySystem('CRITICAL', telemetry);
    } else {
      // Fallback telemetry if none loaded yet
      activateEmergencySystem('CRITICAL', {
        speed: 0,
        steeringAngle: 45,
        brakeIntensity: 100,
        tiltAngle: 40,
        vibration: 5.2,
        eyeBlinkState: 'inactive',
        gpsLat: 11.0168,
        gpsLng: 76.9558,
        vehicleMovement: 'stationary',
        description: 'Manual driver distress trigger active'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Countdown Overlay System */}
      {emergencyActive && !emergencySent && <EmergencyCountdown />}

      {/* 2. Main Page Grid */}
      {emergencySent ? (
        <div className="space-y-6">
          {/* Active siren notification bar */}
          <div className="p-4 rounded-xl border bg-red-50 border-red-200/50 text-red-800 flex items-center space-x-3 shadow-sm select-none animate-pulse-critical">
            <Siren className="w-6 h-6 text-lifelink-red animate-spin shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider leading-none mb-1">
                INTELSOS CRITICAL ALERT ACTIVE — EMERGENCY RESCUE DEPLOYED
              </h4>
              <p className="text-[10px] font-semibold text-red-600 mt-1">
                SMS payloads dispatched. Ambulance units mapped to GPS coordinates. Interactive cockpit vitals recorder compiled.
              </p>
            </div>
          </div>

          {/* Grid row: Workflow Checkpoint Matrix + Video Recorder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmergencyWorkflow />
            <VideoRecorder />
          </div>

          {/* Bottom row: Voicebot Assistant Card */}
          <VoicebotAssistant />
        </div>
      ) : (
        // STANDBY / OFFLINE VIEW (No active crash)
        <div className="bg-white border border-gray-100 rounded-3xl p-12 shadow-premium hover:shadow-premiumHover text-center flex flex-col items-center justify-center space-y-6 select-none max-w-xl mx-auto mt-8">
          <div className="p-4 bg-green-50 border border-green-100 rounded-full text-lifelink-green animate-pulse-safe">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-black text-gray-900 leading-none">
              IntelSOS Emergency System Standby
            </h2>
            <p className="text-xs text-gray-400 font-semibold max-w-sm mx-auto leading-relaxed">
              Continuous monitoring active. Machine learning Isolation and Decision Trees are observing vehicle channels. No collision verified.
            </p>
          </div>

          {/* Diagnostic Stats List */}
          <div className="bg-gray-50 border rounded-2xl p-4 w-full grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <div>
              <p className="text-gray-400">SMS Core</p>
              <p className="text-lifelink-green mt-1">Ready</p>
            </div>
            <div className="border-x">
              <p className="text-gray-400">Webcam Vitals</p>
              <p className="text-lifelink-green mt-1">Ready</p>
            </div>
            <div>
              <p className="text-gray-400">Triage Operator</p>
              <p className="text-lifelink-green mt-1">Ready</p>
            </div>
          </div>

          {/* Manual SOS Trigger button */}
          <div className="space-y-2 w-full max-w-sm pt-2">
            <button
              onClick={handleManualSos}
              className="w-full bg-lifelink-red hover:bg-red-700 text-white border border-red-700 py-3.5 px-4 rounded-2xl text-xs font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-1.5 text-white"
            >
              <Send className="w-4 h-4 text-white" />
              <span>TEST MANUAL SOS TRIGGER</span>
            </button>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              Will launch the full 30s countdown, real/simulated SMS, and camera vitals.
            </p>
          </div>

          {emergencyCancelled && (
            <div className="bg-green-50 border border-green-200/50 p-2.5 rounded-lg text-[10px] font-bold text-green-700">
              ✓ Active SOS beacon has been successfully deactivated and cleared.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmergencyResponse;
