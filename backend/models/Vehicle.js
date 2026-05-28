const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleType: { type: String, enum: ['Car', 'Truck', 'Motorcycle'], default: 'Car' },
  vehicleModel: { type: String, default: '' },
  vehicleColor: { type: String, default: '' },
  plateNumber: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);
