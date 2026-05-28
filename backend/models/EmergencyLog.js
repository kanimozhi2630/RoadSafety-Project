const mongoose = require('mongoose');

const EmergencyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  severity: { type: String, enum: ['MINOR', 'SEVERE', 'CRITICAL'], required: true },
  gpsLat: { type: Number, default: 11.0168 },
  gpsLng: { type: Number, default: 76.9558 },
  vehicleStatus: { type: String, default: '' },
  smsSent: { type: Boolean, default: false },
  contacts: [{
    name: String,
    relationship: String,
    phone: String,
    smsSent: Boolean
  }],
  policeAlerted: { type: Boolean, default: false },
  ambulanceDispatched: { type: Boolean, default: false },
  hospitalAlerted: { type: Boolean, default: false },
  videoRecorded: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false },
  cancelReason: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.EmergencyLog || mongoose.model('EmergencyLog', EmergencyLogSchema);
