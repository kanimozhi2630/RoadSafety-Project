import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon,
  MapPin
} from 'lucide-react';

const VehicleTelemetry = () => {
  const { simMode, telemetry, resolvedLocation } = useTelemetry();
  const { user } = useAuth();
  
  // Visual states for 60FPS fluid movements
  const [targetOffset, setTargetOffset] = useState(0); // Target position in pixels
  const [visualOffset, setVisualOffset] = useState(0); // Easing interpolated position
  const [visualJitter, setVisualJitter] = useState(0); // Shaking offset
  const [pulseScale, setPulseScale] = useState(false);

  // 1. Fetch Registered Vehicle Onboarding Details (Task 4)
  const vehicleModel = user?.vehicleModel || '';
  const vehicleType = user?.vehicleType || '';
  const plateNumber = user?.plateNumber || '';

  let primaryVehicleLabel = 'REGISTERED VEHICLE';
  let secondaryVehicleLabel = '';

  if (vehicleModel) {
    primaryVehicleLabel = vehicleModel.toUpperCase();
    if (plateNumber) {
      secondaryVehicleLabel = plateNumber.toUpperCase();
    }
  } else if (vehicleType) {
    if (plateNumber) {
      primaryVehicleLabel = `${vehicleType.toUpperCase()} — ${plateNumber.toUpperCase()}`;
    } else {
      primaryVehicleLabel = `${vehicleType.toUpperCase()}`;
    }
  } else if (plateNumber) {
    primaryVehicleLabel = plateNumber.toUpperCase();
  }

  // Custom Top-Down Vehicle SVGs (Tesla autopilot style - NEVER rotated)
  const TopDownCar = ({ className }) => (
    <svg viewBox="0 0 24 48" className={className} fill="currentColor">
      <rect x="4" y="2" width="16" height="44" rx="5" fillOpacity="0.95" />
      <path d="M5,12 L19,12 L17,20 L7,20 Z" fill="#000" fillOpacity="0.5" />
      <path d="M6,36 L18,36 L17,44 L7,44 Z" fill="#000" fillOpacity="0.3" />
      <rect x="5" y="10" width="14" height="2" fill="#000" fillOpacity="0.2" />
    </svg>
  );

  const TopDownBike = ({ className }) => (
    <svg viewBox="0 0 12 40" className={className} fill="currentColor">
      <rect x="3" y="6" width="6" height="28" rx="2" fillOpacity="0.95" />
      <rect x="2" y="10" width="8" height="2" rx="1" fill="#000" />
      <circle cx="6" cy="18" r="3" fill="#000" fillOpacity="0.5" />
      <rect x="4" y="2" width="4" height="6" rx="1" fill="#222" />
      <rect x="4" y="32" width="4" height="6" rx="1" fill="#222" />
    </svg>
  );

  const TopDownTruck = ({ className }) => (
    <svg viewBox="0 0 30 60" className={className} fill="currentColor">
      <rect x="3" y="14" width="24" height="44" rx="2" fillOpacity="0.85" />
      <rect x="5" y="2" width="20" height="10" rx="2" fillOpacity="0.95" />
      <path d="M6,4 L24,4 L23,8 L7,8 Z" fill="#000" fillOpacity="0.5" />
    </svg>
  );

  // Get dynamic custom top-down icon based on vehicle type (Task 4)
  const getVehicleIcon = () => {
    const type = (vehicleType || '').toLowerCase();
    if (type.includes('motorcycle') || type.includes('bike') || type.includes('scooter') || type.includes('two')) {
      return TopDownBike;
    }
    if (type.includes('truck') || type.includes('commercial') || type.includes('bus') || type.includes('heavy')) {
      return TopDownTruck;
    }
    return TopDownCar; // Default to Car
  };

  const VehicleIcon = getVehicleIcon();

  // 2. High-Frequency Visual Loop (30ms / 60FPS) (Task 1 & Task 5)
  // Interpolates visual position towards target and injects micro-vibrations dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setVisualOffset(prev => {
        const diff = targetOffset - prev;
        if (Math.abs(diff) < 0.05) return targetOffset;
        return prev + diff * 0.12; 
      });

      // Dynamically calculate vibration force jitter (Task 1 & Task 5)
      const vibration = telemetry ? telemetry.vibration : 0;
      if (vibration > 1.2 || ['harsh_braking', 'accident', 'severe_incident'].includes(simMode)) {
        setVisualJitter((Math.random() - 0.5) * Math.min(8, vibration * 2.5));
      } else if (vibration > 0.5) {
        setVisualJitter((Math.random() - 0.5) * 1.5); // Minor jitter
      } else {
        setVisualJitter(0);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [targetOffset, telemetry, simMode]);

  // 3. Autopilot Lane Tracking Target Offsets (Task 1 & Task 5)
  useEffect(() => {
    if (!telemetry) return;

    if (['accident', 'severe_incident'].includes(simMode)) {
      setTargetOffset(simMode === 'accident' ? 48 : 35); // crashed/severe lock position
    } else if (['fatigue', 'cruising', 'rain_risk', 'overspeed', 'minor_incident', 'high_risk'].includes(simMode)) {
      // Oscillators handled below
    } else if (simMode === 'harsh_braking') {
      setTargetOffset(telemetry.steeringAngle * 2.4);
    }
  }, [telemetry, simMode]);

  // 4. Natural Steering & Weaving Oscillators (Task 2: Realistic Tilt + Turning)
  useEffect(() => {
    if (['harsh_braking', 'accident', 'severe_incident'].includes(simMode)) return;

    let angle = 0;
    const interval = setInterval(() => {
      // Different modes get different weave patterns
      let wave = 0;
      if (simMode === 'fatigue' || simMode === 'high_risk') {
        angle += 0.06;
        wave = Math.sin(angle) * 35; // aggressive lane drifting
      } else if (simMode === 'minor_incident') {
        angle += 0.15;
        wave = Math.sin(angle) * 15; // erratic weaving
      } else if (simMode === 'overspeed') {
        angle += 0.12;
        wave = Math.sin(angle) * 8; // fast minor drift
      } else {
        // SAFE / Cruising / Rain: very subtle micro steering movement
        angle += 0.04;
        wave = Math.sin(angle) * 3.5; // natural motion 3.5px
      }

      const steer = telemetry ? telemetry.steeringAngle * 2 : 0;
      setTargetOffset(wave + steer);
    }, 40);

    return () => clearInterval(interval);
  }, [simMode, telemetry]);

  // Pulse scanner line
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 5. Dynamic Lane Speed Animation (Task 2)
  const currentSpeed = telemetry ? telemetry.speed : 0;
  // Calculate duration for a 230px translation (smooth forward scrolling illusion)
  const laneAnimDuration = currentSpeed > 5 ? Math.max(0.2, Math.min(4.0, 150 / currentSpeed)) + 's' : '0s';

  const getLaneLineColor = () => {
    if (['cruising', 'safe'].includes(simMode)) return 'stroke-green-300';
    if (['fatigue', 'rain_risk', 'minor_incident', 'overspeed'].includes(simMode)) return 'stroke-amber-300';
    return 'stroke-red-300';
  };

  // 6. Automotive Intelligence Status Engine (Task 4)
  const getSystemStatus = () => {
    if (!telemetry) return 'SYSTEM STANDBY';
    
    const speed = telemetry.speed;
    const fatigue = telemetry.fatigueLevel;
    const rain = telemetry.rainCondition;
    const brake = telemetry.brakeIntensity;
    const vibration = telemetry.vibration;
    const steering = Math.abs(telemetry.steeringAngle);
    const motionAnomaly = telemetry.motionAnomaly;

    if (simMode === 'accident' || simMode === 'severe_incident') {
      return simMode === 'accident' ? 'Loss Of Control Detected' : 'Severe Impact Force Detected';
    }
    if (simMode === 'high_risk') return 'Compound Hazard State';
    if (simMode === 'rain_risk') return 'Wet Road / Traction Reduced';
    if (simMode === 'overspeed') return 'High Velocity Risk';
    if (simMode === 'minor_incident') return 'Minor Vehicle Instability';
    
    if (speed > 90 && fatigue > 40) return 'Driver Attention Risk';
    if (rain > 50 && brake > 60) return 'Road Surface Risk';
    if (motionAnomaly && vibration > 1.2) return 'Vehicle Instability Detected';
    if (steering > 18) return 'Steering Control Warning';
    
    if (simMode === 'fatigue' || fatigue > 50) return 'Driver Fatigue Detected';
    if (simMode === 'harsh_braking' || brake > 70) return 'Emergency Braking Event';
    if (vibration > 1.5) return 'Minor Vehicle Instability';
    if (steering > 10) return 'Suspicious Weaving Pattern';
    
    return 'Cruising Normally';
  };

  const systemStatus = getSystemStatus();

  const getStatusColorClass = () => {
    if (systemStatus === 'Cruising Normally') return 'text-green-600 border-green-100 bg-green-50/50';
    if (
      systemStatus === 'Suspicious Weaving Pattern' || 
      systemStatus === 'Driver Fatigue Detected' || 
      systemStatus === 'Steering Control Warning' || 
      systemStatus === 'Minor Vehicle Instability'
    ) {
      return 'text-amber-600 border-amber-100 bg-amber-50/50';
    }
    return 'text-red-600 border-red-100 bg-red-50/50';
  };

  // 7. Realistic Weather / Rain Visualizations (Task 3)
  const rainPercent = telemetry ? telemetry.rainCondition : 0;
  
  let rainStreakCount = 0;
  if (rainPercent > 70) rainStreakCount = 18;
  else if (rainPercent > 30) rainStreakCount = 10;
  else if (rainPercent > 0) rainStreakCount = 4;

  const getRoadColor = () => {
    if (rainPercent > 70) return '#1A202C'; // Wet dark asphalt
    if (rainPercent > 30) return '#2D3748'; // Damp dark gray
    if (rainPercent > 0) return '#3E4E68'; // Damp blue-slate
    return '#374151'; // Normal dry gray
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-premium p-5 flex flex-col justify-between h-[380px] overflow-hidden relative">
      
      {/* Self-contained CSS Keyframes for High-Performance Animation rendering */}
      <style>{`
        @keyframes roadScrollLocal {
          0% { transform: translateY(-230px); }
          100% { transform: translateY(0px); }
        }
        @keyframes rainFallLocal {
          0% { transform: translateY(-40px); }
          100% { transform: translateY(270px); }
        }
      `}</style>

      {/* Header and status banner */}
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">TELEMETRY CANVAS</span>
          <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 mt-0.5">
            <Compass className="w-4 h-4 text-lifelink-green" />
            Autopilot Navigation Array
          </h3>
        </div>
        <div className={`flex items-center space-x-2 border px-3 py-1.5 rounded-lg transition-all ${getStatusColorClass()}`}>
          <span className="text-[9px] font-bold uppercase tracking-wider opacity-85">SYSTEM STATUS</span>
          <span className="font-extrabold text-xs tracking-tight">
            {systemStatus}
          </span>
        </div>
      </div>

      {/* Main road SVG canvas */}
      <div className="relative w-full h-[230px] rounded-lg overflow-hidden border border-gray-100 bg-[#F3F4F6] mt-4 flex items-center justify-center">
        {/* Base road canvas - Darkened dynamically based on rainCondition (Task 3) */}
        <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: getRoadColor() }} />
        
        {/* Left and Right Road Shoulders (Light grass) */}
        <div className="absolute top-0 bottom-0 left-0 w-[100px] bg-[#F3F4F6]" />
        <div className="absolute top-0 bottom-0 right-0 w-[100px] bg-[#F3F4F6]" />
        
        {/* Shoulder solid lines */}
        <div className="absolute top-0 bottom-0 left-[100px] w-[2px] bg-gray-300" />
        <div className="absolute top-0 bottom-0 right-[100px] w-[2px] bg-gray-300" />

        {/* Animated Scrolling Road Container (Simulating Forward Motion) */}
        <div 
          className="absolute top-0 left-[102px] right-[102px] h-[460px]"
          style={{ 
            animation: currentSpeed > 5 ? `roadScrollLocal ${laneAnimDuration} linear infinite` : 'none'
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 196 460" preserveAspectRatio="none">
            {/* Subtle Road Texture / Speed Lines (repeats seamlessly every 230px) */}
            <g opacity="0.12">
              <line x1="30" y1="0" x2="30" y2="460" stroke="#ffffff" strokeWidth="1" strokeDasharray="15 215" />
              <line x1="160" y1="0" x2="160" y2="460" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8 222" />
              <line x1="98" y1="0" x2="98" y2="460" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="25 205" />
            </g>

            {/* Center Lane Dividers (Repeating seamlessly every 230px, divisor is 46) */}
            <line x1="64" y1="0" x2="64" y2="460" className={`stroke-[2.5px] ${getLaneLineColor()}`} strokeDasharray="16 30" />
            <line x1="132" y1="0" x2="132" y2="460" className={`stroke-[2.5px] ${getLaneLineColor()}`} strokeDasharray="16 30" />
          </svg>
        </div>

        {/* Dynamic Interactive Rain Streaks Overlay (Task 3) */}
        {rainPercent > 0 && (
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
            {/* Dark wet surface overlay */}
            <div 
              className="absolute inset-0 bg-black transition-opacity duration-1000" 
              style={{ opacity: Math.min(0.35, (rainPercent / 100) * 0.35) }} 
            />
            {/* CSS Rain lines */}
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: rainStreakCount }).map((_, i) => {
                const x = 105 + ((i * 47) % 190);
                const yStart = -30 - ((i * 17) % 40);
                const length = 18 + (i % 6);
                const duration = 0.4 + ((i % 3) * 0.1);
                const delay = (i * 0.08) % 0.4;
                return (
                  <line
                    key={i}
                    x1={x}
                    y1={yStart}
                    x2={x - 1}
                    y2={yStart + length}
                    className="stroke-blue-100 stroke-[1.2px] opacity-50"
                    style={{
                      animation: `rainFallLocal ${duration}s linear infinite`,
                      animationDelay: `${delay}s`
                    }}
                  />
                );
              })}
            </svg>
          </div>
        )}

        {/* Warning Indicator Overlay Banner */}
        {simMode !== 'cruising' && (
          <div className="absolute top-2 left-2 z-20 animate-bounce">
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold shadow-md bg-white ${
              ['accident', 'severe_incident', 'high_risk'].includes(simMode) ? 'text-red-600 border-red-200 animate-pulse' : 'text-amber-600 border-amber-200'
            }`}>
              {['accident', 'severe_incident', 'high_risk'].includes(simMode) ? <AlertOctagon className="w-3.5 h-3.5 text-red-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
              <span>
                {simMode === 'fatigue' && 'WEAVING DRIFT'}
                {simMode === 'rain_risk' && 'POOR TRACTION'}
                {simMode === 'overspeed' && 'OVERSPEED'}
                {simMode === 'minor_incident' && 'VIBRATION SPIKE'}
                {simMode === 'harsh_braking' && 'HARSH DECELERATION'}
                {simMode === 'severe_incident' && 'COLLISION RISK'}
                {simMode === 'high_risk' && 'COMPOUND RISK'}
                {simMode === 'accident' && 'CRITICAL IMPACT'}
              </span>
            </div>
          </div>
        )}

        {/* GPS Location Overlay (Task 1) */}
        <div className="absolute bottom-2 left-2 z-20">
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 p-2 rounded-lg shadow-xl flex flex-col min-w-[140px]">
            <div className="flex items-center space-x-1 mb-1">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span className="text-[8px] font-extrabold text-blue-400 uppercase tracking-widest">LIVE LOCATION</span>
            </div>
            <span className="text-xs font-bold text-white truncate max-w-[150px]">{resolvedLocation || 'Location unavailable'}</span>
            <div className="text-[9px] text-gray-400 font-mono mt-0.5 tracking-tighter">
              {telemetry ? `${telemetry.gpsLat.toFixed(4)}N, ${telemetry.gpsLng.toFixed(4)}E` : '---'}
            </div>
          </div>
        </div>

        {/* Dynamic Car Positioning Layer (Task 1: Upright vertical orientation enforced) */}
        <div 
          className="absolute flex flex-col items-center justify-center z-20"
          style={{ 
            transform: `translateX(${visualOffset + visualJitter}px)`,
            bottom: simMode === 'harsh_braking' ? '45px' : simMode === 'accident' ? '60px' : '30px',
            transition: 'bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Shockwave Rings on Accident */}
          {simMode === 'accident' && (
            <div className="absolute w-24 h-24 rounded-full border border-red-500 bg-red-500/10 animate-ping" />
          )}

          {/* Dynamic Telemetry Icon based on vehicleType (Task 4) */}
          <div className={`relative p-3.5 rounded-full ${
            simMode === 'cruising' ? 'bg-lifelink-green/10' :
            simMode === 'fatigue' ? 'bg-amber-500/10 animate-pulse' :
            'bg-red-500/10'
          }`}>
            <VehicleIcon className={`w-8 h-8 ${
              ['accident', 'severe_incident'].includes(simMode) ? 'text-red-600' : 
              ['harsh_braking', 'high_risk'].includes(simMode) ? 'text-orange-500 animate-pulse' : 
              ['fatigue', 'minor_incident', 'rain_risk', 'overspeed'].includes(simMode) ? 'text-amber-500' : 'text-lifelink-green'
            }`} />
            
            {/* Brake lights glow */}
            {(simMode === 'harsh_braking' || simMode === 'accident') && (
              <>
                <span className="absolute bottom-1 left-2 w-2 h-1 bg-red-600 rounded-full blur-[1px] animate-ping" />
                <span className="absolute bottom-1 right-2 w-2 h-1 bg-red-600 rounded-full blur-[1px] animate-ping" />
              </>
            )}
          </div>

          {/* Registered Vehicle Name Display HUD Tag (Task 4) */}
          <span className="bg-gray-800/90 backdrop-blur-sm text-white font-extrabold text-[8px] px-2 py-0.5 rounded shadow mt-1 uppercase tracking-wider select-none leading-tight flex flex-col items-center min-w-[70px]">
            <span className="font-extrabold text-[8px] text-center">{simMode === 'accident' ? 'CRASH SITE' : primaryVehicleLabel}</span>
            {secondaryVehicleLabel && (
              <span className="text-[6.5px] text-gray-300 font-semibold tracking-normal mt-0.5">{secondaryVehicleLabel}</span>
            )}
          </span>
        </div>

        {/* Scanning sweep radar overlay */}
        {simMode === 'cruising' && (
          <div className="absolute inset-0 pointer-events-none radar-sweep-bg" />
        )}
        {simMode === 'fatigue' && (
          <div className="absolute inset-0 pointer-events-none radar-sweep-bg-warning" />
        )}
        {(simMode === 'harsh_braking' || simMode === 'accident') && (
          <div className="absolute inset-0 pointer-events-none radar-sweep-bg-critical" />
        )}
      </div>

      {/* Footer explainers */}
      <div className="flex items-center justify-between text-[9px] text-gray-400 font-medium z-10 border-t border-gray-50 pt-3">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-lifelink-green" />
          <span>Active Safety Monitoring Module Connected</span>
        </div>
        <span>Refresh rate: 60Hz</span>
      </div>
    </div>
  );
};

export default VehicleTelemetry;
