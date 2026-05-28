const mongoose = require('mongoose');

const AccidentLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phase1Result: { type: String, enum: ['NORMAL', 'ABNORMAL'], default: 'NORMAL' },
  phase2Result: { type: String, enum: ['NORMAL', 'MINOR', 'SEVERE', 'CRITICAL'], default: 'NORMAL' },
  impactForce: { type: Number, default: 0 },
  tiltAngle: { type: Number, default: 0 },
  movementStatus: { type: String, default: 'moving' },
  eyeBlinkState: { type: String, default: 'normal' },
  decisionReasoning: [{ type: String }],
  telemetrySnapshot: {
    speed: Number,
    steeringAngle: Number,
    brakeIntensity: Number,
    vibration: Number,
    deceleration: Number
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.AccidentLog || mongoose.model('AccidentLog', AccidentLogSchema);
