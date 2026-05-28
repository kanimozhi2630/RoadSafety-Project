const mongoose = require('mongoose');

const RiskLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  overallRisk: { type: Number, default: 0 },
  riskBreakdown: {
    rain: { type: Number, default: 0 },
    fatigue: { type: Number, default: 0 },
    overspeed: { type: Number, default: 0 },
    roadStability: { type: Number, default: 0 },
    steeringInstability: { type: Number, default: 0 }
  },
  prediction: { type: String, default: '' },
  warnings: [{ type: String }],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.RiskLog || mongoose.model('RiskLog', RiskLogSchema);
