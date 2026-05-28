/**
 * Simulates a Random Forest model evaluating road safety risk level.
 * Takes current telemetry inputs and assigns risk weights to calculate an
 * explainable hazard risk score from 0% to 100%.
 * 
 * @param {Object} telemetry - Current vehicle sensor telemetry
 * @returns {Object} - Risk evaluation with overall score, individual breakdown, and warnings
 */
export const calculateSafetyRisk = (telemetry) => {
  if (!telemetry) return { overallRisk: 0, breakdown: {}, level: 'SAFE', warnings: [] };

  const {
    speed,
    steeringAngle,
    brakeIntensity,
    fatigueLevel,
    rainCondition,
    vibration,
    motionAnomaly
  } = telemetry;

  // 1. Calculate individual risk factor scores (0 to 100 scale)
  
  // Speed risk: increases above 90 km/h, highly critical above 120 km/h
  const speedRisk = speed > 120 ? 100 : speed > 90 ? ((speed - 90) / 30) * 80 + 20 : (speed / 90) * 20;

  // Rain/weather road slickness risk
  const rainRisk = rainCondition;

  // Driver drowsiness/fatigue level risk
  const fatigueRisk = fatigueLevel;

  // Road surface stability risk (vibration/g-force anomalies)
  const roadStabilityRisk = Math.min(100, (vibration / 2.5) * 80 + (motionAnomaly ? 20 : 0));

  // Steering angular volatility risk (high deviation at high speeds)
  const absSteering = Math.abs(steeringAngle);
  const steeringRisk = speed > 60 
    ? Math.min(100, (absSteering / 15) * 75 + (absSteering > 10 ? 25 : 0))
    : Math.min(100, (absSteering / 30) * 40);

  // 2. Weighted Random Forest calculation
  // Weights: fatigue (25%), speed (20%), rain/weather (15%), steering volatility (15%), road stability (15%), auxiliary g-force anomaly (10%)
  const overallRisk = Math.round(
    (fatigueRisk * 0.25) +
    (speedRisk * 0.20) +
    (rainRisk * 0.15) +
    (steeringRisk * 0.15) +
    (roadStabilityRisk * 0.15) +
    ((motionAnomaly ? 100 : 0) * 0.10)
  );

  // 3. Determine overall state label
  let level = 'SAFE';
  if (overallRisk >= 70) {
    level = 'DANGER';
  } else if (overallRisk >= 40) {
    level = 'WARNING';
  }

  // 4. Generate explainable actionable warning notifications
  const warnings = [];
  if (speed > 100) warnings.push('Overspeeding: Please reduce velocity below 100 km/h.');
  if (fatigueLevel > 50) warnings.push('High Driver Fatigue: Drowsiness indicators active. Pullover and rest.');
  if (rainCondition > 40 && speed > 70) warnings.push('Hydroplane Danger: Wet conditions, slow down to maintain traction.');
  if (absSteering > 12 && speed > 50) warnings.push('Steering Instability: Avoid sudden swerves or rapid lane changes.');
  if (vibration > 1.2) warnings.push('Road Hazard: Severe road surface vibrations detected.');
  if (motionAnomaly && level === 'DANGER') warnings.push('Erratic Maneuver: Highly abnormal driving pattern flagged.');

  if (warnings.length === 0) {
    warnings.push('All parameters within standard safe operating limits.');
  }

  return {
    overallRisk: Math.min(100, Math.max(0, overallRisk)),
    breakdown: {
      rain: Math.round(rainRisk),
      fatigue: Math.round(fatigueRisk),
      overspeed: Math.round(speedRisk),
      roadStability: Math.round(roadStabilityRisk),
      steeringInstability: Math.round(steeringRisk)
    },
    level,
    prediction: level === 'DANGER' ? 'HIGH ACCIDENT PROBABILITY' : level === 'WARNING' ? 'MODERATE HAZARD DETECTED' : 'LOW RISK ENVIRONMENT',
    warnings,
    timestamp: new Date().toISOString()
  };
};
