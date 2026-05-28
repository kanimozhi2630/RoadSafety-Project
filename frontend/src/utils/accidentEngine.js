/**
 * Accident Detection Engine implementing simulated two-phase ML architecture.
 * Phase 1: Isolation Forest (Anomalous Event Detection)
 * Phase 2: Decision Tree (Impact Severity & Accident Confirmation)
 */

/**
 * Phase 1: Isolation Forest simulation for detecting abnormal vehicle behavior.
 * Evaluates multi-dimensional sensor features to flag out-of-bounds driving anomalies.
 * 
 * @param {Object} telemetry - Current vehicle sensor telemetry
 * @returns {Object} - Anomaly evaluation { status: 'NORMAL'|'ABNORMAL', anomalyScore: 0.0-1.0, features: [] }
 */
export const runIsolationForest = (telemetry) => {
  if (!telemetry) return { status: 'NORMAL', anomalyScore: 0.0, features: [] };

  const { speed, steeringAngle, brakeIntensity, vibration, acceleration } = telemetry;
  const features = [];
  let scoreSum = 0;

  // Brake Spike (Harsh deceleration)
  if (brakeIntensity > 70) {
    features.push('Severe Braking Spike');
    scoreSum += 0.35;
  }

  // Steering Deviation (Harsh swerving)
  if (Math.abs(steeringAngle) > 20) {
    features.push('Harsh Lateral Swerve');
    scoreSum += 0.25;
  }

  // High Vibration / Sudden vertical impulse (potential pothole or impact)
  if (vibration > 1.0) {
    features.push('High Vibration Impulse');
    scoreSum += 0.3;
  }

  // Rapid change in speed (deceleration)
  if (speed > 80 && brakeIntensity > 80) {
    features.push('High-Velocity Deceleration Spike');
    scoreSum += 0.25;
  }

  const anomalyScore = Math.min(1.0, scoreSum);
  const status = anomalyScore > 0.4 ? 'ABNORMAL' : 'NORMAL';

  return {
    status,
    anomalyScore: parseFloat(anomalyScore.toFixed(2)),
    features: features.length > 0 ? features : ['All sensors reporting within normal covariance limits.']
  };
};

/**
 * Phase 2: Decision Tree simulation for accident validation and severity assessment.
 * Confirms whether an anomaly was a minor road event, sudden brake, or true collision.
 * 
 * @param {Object} telemetry - Current vehicle sensor telemetry
 * @param {Object} phase1Result - Results from the Phase 1 Isolation Forest evaluation
 * @returns {Object} - Accident validation { isAccident: boolean, severity: 'NORMAL'|'MINOR'|'SEVERE'|'CRITICAL', reasoning: [] }
 */
export const runDecisionTree = (telemetry, phase1Result) => {
  if (!telemetry || !phase1Result || phase1Result.status === 'NORMAL') {
    return {
      isAccident: false,
      severity: 'NORMAL',
      decisionReasoning: ['Phase 1 reported NORMAL. Decision Tree short-circuits. No crash verified.']
    };
  }

  const { vibration, tiltAngle, vehicleMovement, eyeBlinkState } = telemetry;
  const decisionReasoning = [];

  decisionReasoning.push('↳ Root: Phase 1 Isolation Forest flagged ABNORMAL state.');

  // Decision Node 1: Impact Force (Vibration g-force)
  decisionReasoning.push(`↳ Node 1: Evaluating G-force impact sensor (Vibration = ${vibration}g)`);

  if (vibration >= 3.0) {
    decisionReasoning.push('  ➔ High G-force threshold tripped (>= 3.0g). Proceeding to Rollover Check.');
    
    // Decision Node 2: Rollover / Tilt Angle
    decisionReasoning.push(`  ↳ Node 2: Checking vehicle roll index (Tilt Angle = ${tiltAngle}°)`);
    
    if (Math.abs(tiltAngle) >= 30) {
      decisionReasoning.push('    ➔ Extreme roll angle detected (>= 30°). High probability of structural rollover.');
      
      // Decision Node 3: Post-Crash Driver Vitals
      decisionReasoning.push(`    ↳ Node 3: Analyzing driver wakefulness (Blink State = ${eyeBlinkState})`);
      
      if (eyeBlinkState === 'inactive') {
        decisionReasoning.push('      ➔ Unresponsive driver signature detected (eye blink inactive).');
        return {
          isAccident: true,
          severity: 'CRITICAL',
          decisionReasoning: [
            ...decisionReasoning,
            '🚨 Decision Matrix verified CRITICAL collision: High-energy rollover impact with unconscious occupant. Urgent dispatch triggered.'
          ]
        };
      } else {
        decisionReasoning.push('      ➔ Driver remains responsive (blinking active).');
        return {
          isAccident: true,
          severity: 'SEVERE',
          decisionReasoning: [
            ...decisionReasoning,
            '⚠️ Decision Matrix verified SEVERE collision: Severe structural rollover with responsive driver. Emergency dispatch active.'
          ]
        };
      }
    } else {
      decisionReasoning.push('    ➔ Standard vehicle orientation maintained. checking movement status.');
      
      // Decision Node 4: Post-Impact Motion
      decisionReasoning.push(`    ↳ Node 4: Assessing post-impact speed state (Movement = ${vehicleMovement})`);
      
      if (vehicleMovement === 'stationary') {
        decisionReasoning.push('      ➔ Vehicle has immediately seized post-impact (Stationary).');
        return {
          isAccident: true,
          severity: 'SEVERE',
          decisionReasoning: [
            ...decisionReasoning,
            '⚠️ Decision Matrix verified SEVERE collision: High G-force impact with instantaneous vehicle arrest. Dispatched SOS.'
          ]
        };
      } else {
        decisionReasoning.push('      ➔ Vehicle continues to roll (Moving). Potential controlled post-skid.');
        return {
          isAccident: true,
          severity: 'MINOR',
          decisionReasoning: [
            ...decisionReasoning,
            'ℹ️ Decision Matrix verified MINOR incident: High-vibration event but vehicle maintains momentum and orientation.'
          ]
        };
      }
    }
  } else {
    decisionReasoning.push('  ➔ Moderate G-force impulse (< 3.0g). Verifying harsh braking vs collision.');
    
    if (vibration >= 1.2 && vehicleMovement === 'stationary') {
      decisionReasoning.push('  ➔ Moderate impact followed by immediate vehicle stop.');
      return {
        isAccident: true,
        severity: 'MINOR',
        decisionReasoning: [
          ...decisionReasoning,
          'ℹ️ Decision Matrix verified MINOR incident: Frictional collision or low-speed fender-bender resulting in complete stop.'
        ]
      };
    } else {
      decisionReasoning.push('  ➔ Standard driving swerve, harsh pothole, or hard brake. No collision markers met.');
      return {
        isAccident: false,
        severity: 'NORMAL',
        decisionReasoning: [
          ...decisionReasoning,
          '✅ Decision Matrix concluded NORMAL behavior: Hard brake or pothole impact successfully navigated. No dispatch required.'
        ]
      };
    }
  }
};
