import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import MetricCard from '../../components/dashboard/MetricCard';
import SensorCard from '../../components/dashboard/SensorCard';
import VehicleTelemetry from '../../components/dashboard/VehicleTelemetry';
import AlertTimeline from '../../components/dashboard/AlertTimeline';
import SimulationControlPanel from '../../components/dashboard/SimulationControlPanel';
import EmergencyCountdown from '../../components/dashboard/EmergencyCountdown';

import { 
  Gauge, 
  CloudRain, 
  UserCheck, 
  ShieldAlert, 
  MapPin, 
  Activity, 
  Zap, 
  Heart 
} from 'lucide-react';

const CommandCenter = () => {
  const { telemetry, riskAssessment, resolvedLocation, emergencyActive, emergencySent, emergencySeverity } = useTelemetry();

  if (!telemetry) return null;

  // Prepare colors for core metric cards
  const getRiskColor = (val) => {
    if (val >= 70) return 'red';
    if (val >= 40) return 'amber';
    return 'green';
  };

  const getFatigueColor = (val) => {
    if (val >= 70) return 'red';
    if (val >= 45) return 'amber';
    return 'green';
  };

  const getBrakeColor = (val) => {
    if (val >= 70) return 'red';
    if (val >= 35) return 'amber';
    return 'green';
  };

  // Severity-aware emergency border styling
  const getEmergencyBorderClass = () => {
    if (!emergencyActive) return '';
    if (emergencySeverity === 'CRITICAL') return 'border-4 border-red-500 rounded-xl p-2 animate-pulse bg-red-50/10';
    return 'border-4 border-amber-400 rounded-xl p-2 bg-amber-50/10'; // SEVERE - softer, no aggressive pulse
  };

  return (
    <div className={`space-y-6 transition-colors duration-500 ${getEmergencyBorderClass()}`}>
      
      {/* 0. Emergency Overlays */}
      {emergencyActive && !emergencySent && <EmergencyCountdown />}

      {/* 0.1 Prototype Control Panel */}
      <SimulationControlPanel />

      {/* 1. TOP METRICS ROW (8 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
        {/* Speed */}
        <MetricCard 
          title="Vehicle Speed" 
          value={telemetry.speed} 
          unit="km/h" 
          icon={Gauge} 
          statusColor={telemetry.speed > 110 ? 'red' : telemetry.speed > 90 ? 'amber' : 'green'}
          description={telemetry.speed > 100 ? 'Overspeeding Alert' : 'Velocity stable'}
        />

        {/* Rain level */}
        <MetricCard 
          title="Precipitation" 
          value={telemetry.rainCondition} 
          unit="%" 
          icon={CloudRain} 
          statusColor={telemetry.rainCondition > 60 ? 'red' : telemetry.rainCondition > 20 ? 'amber' : 'green'}
          description={telemetry.rainCondition > 30 ? 'Wet road surface' : 'Clear skies'}
        />

        {/* Driver State */}
        <MetricCard 
          title="Driver State" 
          value={telemetry.eyeBlinkState} 
          unit="" 
          icon={UserCheck} 
          statusColor={telemetry.eyeBlinkState === 'inactive' ? 'red' : telemetry.eyeBlinkState === 'drowsy' ? 'amber' : 'green'}
          description={telemetry.eyeBlinkState === 'inactive' ? 'UnresponsiveOccupant' : telemetry.eyeBlinkState === 'drowsy' ? 'Microsleep Warning' : 'Active and focused'}
        />

        {/* Overall Risk */}
        <MetricCard 
          title="Hazard Risk" 
          value={riskAssessment ? riskAssessment.overallRisk : 0} 
          unit="%" 
          icon={ShieldAlert} 
          statusColor={getRiskColor(riskAssessment ? riskAssessment.overallRisk : 0)}
          description={riskAssessment ? riskAssessment.prediction : 'Calculating safety...'}
        />

        {/* GPS Coordinates */}
        <MetricCard 
          title="GPS Position" 
          value={`${telemetry.gpsLat.toFixed(4)}N`} 
          unit="" 
          icon={MapPin} 
          statusColor="blue"
          description={`Lng: ${telemetry.gpsLng.toFixed(4)}E | ${resolvedLocation}`}
        />

        {/* Vibration Force */}
        <MetricCard 
          title="Chassis Vib" 
          value={telemetry.vibration} 
          unit="g" 
          icon={Activity} 
          statusColor={telemetry.vibration > 3.0 ? 'red' : telemetry.vibration > 1.0 ? 'amber' : 'green'}
          description={telemetry.vibration > 2.0 ? 'Extreme shock force' : 'Smooth ride'}
        />

        {/* Motion State */}
        <MetricCard 
          title="Motion Index" 
          value={telemetry.vehicleMovement} 
          unit="" 
          icon={Zap} 
          statusColor={telemetry.vehicleMovement === 'stationary' ? 'gray' : telemetry.vehicleMovement === 'decelerating' ? 'amber' : 'green'}
          description={`Brake: ${telemetry.brakeIntensity}%`}
        />

        {/* System Health */}
        <MetricCard 
          title="System Health" 
          value="Online" 
          unit="" 
          icon={Heart} 
          statusColor="green"
          description="Ecosystem synchronized"
        />
      </div>

      {/* 2. CENTERPIECE ROW (Autopilot lanes & Alerts timelines) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VehicleTelemetry />
        </div>
        <div>
          <AlertTimeline />
        </div>
      </div>

      {/* 3. SENSOR GAUGES GRID (8 parameters) */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 block mb-1">DETAILED HARDWARE IoT CHANNELS</span>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
          <SensorCard 
            title="Brake Intensity" 
            value={`${telemetry.brakeIntensity}%`} 
            percentage={telemetry.brakeIntensity} 
            statusColor={getBrakeColor(telemetry.brakeIntensity)} 
            desc={telemetry.brakeIntensity > 70 ? 'Extreme Brake Locking' : 'Brakes nominal'}
          />

          <SensorCard 
            title="Steering Angle" 
            value={`${telemetry.steeringAngle}°`} 
            percentage={Math.min(100, Math.max(0, (Math.abs(telemetry.steeringAngle) / 45) * 100))} 
            statusColor={Math.abs(telemetry.steeringAngle) > 20 ? 'red' : Math.abs(telemetry.steeringAngle) > 10 ? 'amber' : 'green'} 
            desc={`Deviation offset: ${Math.abs(telemetry.steeringAngle)}`}
          />

          <SensorCard 
            title="Vibration Force" 
            value={`${telemetry.vibration}g`} 
            percentage={Math.min(100, (telemetry.vibration / 6.0) * 100)} 
            statusColor={telemetry.vibration > 3.0 ? 'red' : telemetry.vibration > 1.0 ? 'amber' : 'green'} 
            desc={telemetry.vibration > 2.5 ? 'Structural impact spike' : 'Road surface stable'}
          />

          <SensorCard 
            title="Rain Slickness" 
            value={`${telemetry.rainCondition}%`} 
            percentage={telemetry.rainCondition} 
            statusColor={telemetry.rainCondition > 60 ? 'red' : telemetry.rainCondition > 20 ? 'amber' : 'blue'} 
            desc={telemetry.rainCondition > 40 ? 'Heavy precipitation' : 'No rain detected'}
          />

          <SensorCard 
            title="Driver Fatigue" 
            value={`${telemetry.fatigueLevel}%`} 
            percentage={telemetry.fatigueLevel} 
            statusColor={getFatigueColor(telemetry.fatigueLevel)} 
            desc={telemetry.fatigueLevel > 60 ? 'Driver Microsleep Event' : 'Driver awake'}
          />

          <SensorCard 
            title="Chassis Tilt" 
            value={`${telemetry.tiltAngle}°`} 
            percentage={Math.min(100, (Math.abs(telemetry.tiltAngle) / 60) * 100)} 
            statusColor={Math.abs(telemetry.tiltAngle) > 25 ? 'red' : Math.abs(telemetry.tiltAngle) > 10 ? 'amber' : 'green'} 
            desc={`Roll factor: ${Math.abs(telemetry.tiltAngle)}`}
          />

          <SensorCard 
            title="G-Force Accel" 
            value={`${telemetry.acceleration} m/s²`} 
            percentage={Math.min(100, (telemetry.acceleration / 30) * 100)} 
            statusColor={telemetry.acceleration > 20 ? 'red' : telemetry.acceleration > 12 ? 'amber' : 'green'} 
            desc="Chassis forward forces"
          />

          <SensorCard 
            title="Blink Frequency" 
            value={telemetry.eyeBlinkState.toUpperCase()} 
            percentage={telemetry.eyeBlinkState === 'inactive' ? 100 : telemetry.eyeBlinkState === 'drowsy' ? 60 : 20} 
            statusColor={telemetry.eyeBlinkState === 'inactive' ? 'red' : telemetry.eyeBlinkState === 'drowsy' ? 'amber' : 'green'} 
            desc={telemetry.eyeBlinkState === 'inactive' ? 'Driver unresponsive' : 'Blink patterns safe'}
          />
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
