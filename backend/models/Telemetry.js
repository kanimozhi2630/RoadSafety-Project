const mongoose = require('mongoose');

const TelemetrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  speed: { type: Number, default: 0 },
  steeringAngle: { type: Number, default: 0 },
  acceleration: { type: Number, default: 0 },
  brakeIntensity: { type: Number, default: 0 },
  tiltAngle: { type: Number, default: 0 },
  vibration: { type: Number, default: 0 },
  eyeBlinkState: { type: String, enum: ['normal', 'drowsy', 'inactive'], default: 'normal' },
  fatigueLevel: { type: Number, default: 0 },
  rainCondition: { type: Number, default: 0 },
  gpsLat: { type: Number, default: 11.0168 },
  gpsLng: { type: Number, default: 76.9558 },
  motionAnomaly: { type: Boolean, default: false },
  vehicleMovement: { type: String, enum: ['moving', 'stationary', 'decelerating'], default: 'moving' },
  riskLevel: { type: String, enum: ['SAFE', 'WARNING', 'DANGER'], default: 'SAFE' },
  eventType: { type: String, default: '' },
  description: { type: String, default: '' },
  actionTaken: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Telemetry || mongoose.model('Telemetry', TelemetrySchema);
