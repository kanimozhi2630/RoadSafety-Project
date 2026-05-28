/**
 * Generates realistic telemetry data based on current simulation mode.
 * Modes: 'cruising' (safe), 'fatigue' (drowsy driver warning), 'harsh_braking' (hazard), 'accident' (critical incident)
 * 
 * @param {string} mode - The active simulation mode
 * @param {Object} prevTelemetry - The previous telemetry state to ensure smooth transitions
 * @returns {Object} - Complete simulated sensor telemetry payload
 */
export const generateTelemetry = (mode = 'cruising', prevTelemetry = null) => {
  const randRange = (min, max) => Math.random() * (max - min) + min;
  const randElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Default coordinate center (Coimbatore area)
  const baseLat = 11.0168;
  const baseLng = 76.9558;

  let speed, steeringAngle, acceleration, brakeIntensity, tiltAngle, vibration, eyeBlinkState, fatigueLevel, rainCondition, gpsLat, gpsLng, motionAnomaly, vehicleMovement, riskLevel, eventType, description, actionTaken;

  // Keep coordinates drifting realistically or lock to crash site if in accident
  if (prevTelemetry && prevTelemetry.gpsLat) {
    if (mode === 'accident') {
      gpsLat = prevTelemetry.gpsLat;
      gpsLng = prevTelemetry.gpsLng;
    } else {
      // Small drift representing moving vehicle
      gpsLat = prevTelemetry.gpsLat + randRange(0.0001, 0.0003);
      gpsLng = prevTelemetry.gpsLng + randRange(0.0001, 0.0003);
    }
  } else {
    gpsLat = baseLat;
    gpsLng = baseLng;
  }

  // Set weather conditions (0 to 100% intensity)
  if (mode === 'rain_risk' || mode === 'high_risk') {
    rainCondition = prevTelemetry ? Math.min(100, prevTelemetry.rainCondition + randRange(5, 15)) : randRange(75, 95);
  } else {
    rainCondition = prevTelemetry ? prevTelemetry.rainCondition : Math.random() > 0.7 ? randRange(20, 80) : 0;
  }

  switch (mode) {
    case 'cruising':
      speed = prevTelemetry ? Math.max(50, Math.min(110, prevTelemetry.speed + randRange(-3, 3))) : randRange(75, 85);
      steeringAngle = randRange(-3, 3);
      acceleration = randRange(5, 20);
      brakeIntensity = randRange(0, 5);
      tiltAngle = randRange(-1, 1);
      vibration = randRange(0.1, 0.25);
      eyeBlinkState = 'normal';
      fatigueLevel = randRange(0, 15);
      motionAnomaly = false;
      vehicleMovement = 'moving';
      riskLevel = 'SAFE';
      eventType = 'CRUISING_NORMAL';
      description = 'Vehicle cruising normally on highway';
      actionTaken = 'None — monitoring active';
      break;

    case 'fatigue':
      speed = prevTelemetry ? Math.max(40, Math.min(80, prevTelemetry.speed + randRange(-5, 4))) : randRange(60, 70);
      // Sweeps side to side representing micro-sleep lane drifting
      steeringAngle = randRange(-12, 12);
      acceleration = randRange(2, 10);
      brakeIntensity = randRange(0, 10);
      tiltAngle = randRange(-2, 2);
      vibration = randRange(0.2, 0.4);
      eyeBlinkState = Math.random() > 0.4 ? 'drowsy' : 'normal';
      fatigueLevel = prevTelemetry ? Math.min(100, prevTelemetry.fatigueLevel + randRange(2, 5)) : randRange(55, 65);
      motionAnomaly = Math.random() > 0.6;
      vehicleMovement = 'moving';
      riskLevel = 'WARNING';
      eventType = 'DRIVER_DROWSINESS';
      description = 'Driver microsleep indicators & minor lane deviation detected';
      actionTaken = 'Triggering dashboard haptic and audio fatigue alerts';
      break;

    case 'harsh_braking':
      speed = prevTelemetry ? Math.max(20, prevTelemetry.speed - randRange(15, 25)) : randRange(40, 50);
      steeringAngle = randRange(-25, 25); // Sharp swerve
      acceleration = 0;
      brakeIntensity = randRange(75, 95);
      tiltAngle = randRange(-4, 4);
      vibration = randRange(0.8, 1.4);
      eyeBlinkState = 'normal';
      fatigueLevel = prevTelemetry ? prevTelemetry.fatigueLevel : randRange(10, 20);
      motionAnomaly = true;
      vehicleMovement = 'decelerating';
      riskLevel = 'DANGER';
      eventType = 'HARSH_BRAKING_EVENT';
      description = 'Severe deceleration event and sharp steering angle adjustment';
      actionTaken = 'Pre-charging brake calipers & tightening seatbelts';
      break;

    case 'accident':
      // Vehicle stops quickly in accident
      speed = prevTelemetry ? Math.max(0, prevTelemetry.speed - randRange(20, 40)) : 0;
      steeringAngle = randRange(-45, 45); // Extreme wheel angle
      acceleration = 0;
      brakeIntensity = 100; // Locked brakes
      tiltAngle = prevTelemetry && prevTelemetry.tiltAngle > 15 ? prevTelemetry.tiltAngle : randRange(25, 60); // High impact roll/tilt
      vibration = prevTelemetry && prevTelemetry.vibration > 3.0 ? randRange(0.0, 0.2) : randRange(3.5, 6.2); // Massive initial spike, then drops to 0
      eyeBlinkState = 'inactive'; // Driver unresponsive
      fatigueLevel = 100;
      motionAnomaly = true;
      vehicleMovement = 'stationary';
      riskLevel = 'DANGER';
      eventType = 'COLLISION_DETECTED';
      description = 'High G-force impact and rollover event detected';
      actionTaken = 'Activating emergency response, broadcasting SOS, and launching cockpit video feed';
      break;

    case 'rain_risk':
      speed = prevTelemetry ? Math.max(30, Math.min(70, prevTelemetry.speed + randRange(-4, 2))) : randRange(50, 60);
      steeringAngle = randRange(-4, 4);
      acceleration = randRange(2, 8);
      brakeIntensity = randRange(5, 15);
      tiltAngle = randRange(-2, 2);
      vibration = randRange(0.3, 0.6); // Slightly rougher due to rain
      eyeBlinkState = 'normal';
      fatigueLevel = prevTelemetry ? prevTelemetry.fatigueLevel : randRange(5, 15);
      motionAnomaly = false;
      vehicleMovement = 'moving';
      riskLevel = 'WARNING';
      eventType = 'ADVERSE_WEATHER';
      description = 'Wet road surface detected. Traction reduced.';
      actionTaken = 'Monitoring ESP and ABS systems';
      break;

    case 'overspeed':
      speed = prevTelemetry ? Math.max(90, Math.min(160, prevTelemetry.speed + randRange(2, 8))) : randRange(110, 130);
      steeringAngle = randRange(-6, 6);
      acceleration = randRange(10, 30);
      brakeIntensity = 0;
      tiltAngle = randRange(-3, 3);
      vibration = randRange(0.6, 1.2); // High speed vibration
      eyeBlinkState = 'normal';
      fatigueLevel = prevTelemetry ? prevTelemetry.fatigueLevel : randRange(5, 15);
      motionAnomaly = true;
      vehicleMovement = 'moving';
      riskLevel = 'WARNING';
      eventType = 'OVERSPEED_ALERT';
      description = 'Vehicle exceeding safe operating velocity parameters';
      actionTaken = 'Triggering audio-visual speed limit alerts';
      break;

    case 'high_risk':
      // Combination of rain, fatigue, and speed
      speed = prevTelemetry ? Math.max(80, Math.min(120, prevTelemetry.speed + randRange(-2, 5))) : randRange(90, 100);
      steeringAngle = randRange(-15, 15);
      acceleration = randRange(5, 15);
      brakeIntensity = randRange(0, 20);
      tiltAngle = randRange(-4, 4);
      vibration = randRange(0.5, 1.5);
      eyeBlinkState = 'drowsy';
      fatigueLevel = prevTelemetry ? Math.min(100, prevTelemetry.fatigueLevel + randRange(5, 10)) : randRange(60, 80);
      motionAnomaly = true;
      vehicleMovement = 'moving';
      riskLevel = 'DANGER';
      eventType = 'COMPOUND_HAZARD';
      description = 'Multiple high-risk indicators: Fatigue, Weather, and Velocity';
      actionTaken = 'Engaging active safety countermeasures';
      break;

    case 'minor_incident':
      speed = prevTelemetry ? Math.max(10, Math.min(40, prevTelemetry.speed - randRange(5, 15))) : randRange(20, 30);
      steeringAngle = randRange(-18, 18);
      acceleration = 0;
      brakeIntensity = randRange(40, 60);
      tiltAngle = randRange(-5, 5);
      vibration = randRange(1.2, 2.0); // Moderate bump
      eyeBlinkState = 'normal';
      fatigueLevel = prevTelemetry ? prevTelemetry.fatigueLevel : randRange(10, 20);
      motionAnomaly = true;
      vehicleMovement = 'decelerating';
      riskLevel = 'WARNING';
      eventType = 'MINOR_INCIDENT';
      description = 'Suspicious vibration spike and steering deviation';
      actionTaken = 'Logging event and monitoring for secondary impacts';
      break;

    case 'severe_incident':
      speed = prevTelemetry ? Math.max(0, prevTelemetry.speed - randRange(15, 30)) : randRange(10, 20);
      steeringAngle = randRange(-30, 30);
      acceleration = 0;
      brakeIntensity = randRange(80, 100);
      tiltAngle = randRange(-15, 15);
      vibration = randRange(2.5, 4.0); // Severe impact short of full critical crash
      eyeBlinkState = 'normal';
      fatigueLevel = prevTelemetry ? prevTelemetry.fatigueLevel : randRange(10, 20);
      motionAnomaly = true;
      vehicleMovement = 'stationary';
      riskLevel = 'DANGER';
      eventType = 'SEVERE_INCIDENT';
      description = 'Severe deceleration and impact force detected';
      actionTaken = 'Triggering pre-collision alert systems';
      break;

    default:
      speed = 60;
      steeringAngle = 0;
      acceleration = 10;
      brakeIntensity = 0;
      tiltAngle = 0;
      vibration = 0.15;
      eyeBlinkState = 'normal';
      fatigueLevel = 5;
      motionAnomaly = false;
      vehicleMovement = 'moving';
      riskLevel = 'SAFE';
      eventType = 'CRUISING_NORMAL';
      description = 'System online';
      actionTaken = 'Monitoring';
  }

  return {
    speed: Math.round(speed),
    steeringAngle: parseFloat(steeringAngle.toFixed(2)),
    acceleration: Math.round(acceleration),
    brakeIntensity: Math.round(brakeIntensity),
    tiltAngle: Math.round(tiltAngle),
    vibration: parseFloat(vibration.toFixed(2)),
    eyeBlinkState,
    fatigueLevel: Math.round(fatigueLevel),
    rainCondition: Math.round(rainCondition),
    gpsLat,
    gpsLng,
    motionAnomaly,
    vehicleMovement,
    riskLevel,
    eventType,
    description,
    actionTaken,
    timestamp: new Date().toISOString()
  };
};
