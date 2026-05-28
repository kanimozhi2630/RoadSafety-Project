const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dbHelper = require('../config/db');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  onboardingStep: { type: Number, default: 1 },
  isOnboarded: { type: Boolean, default: false },

  // Emergency Info (Step 1)
  emergencyContact1: { type: String, default: '' },
  relationship1: { type: String, default: '' },
  emergencyContact2: { type: String, default: '' },
  relationship2: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  allergies: { type: String, default: '' },
  medicalNotes: { type: String, default: '' },

  // Vehicle Info (Step 2)
  vehicleType: { type: String, default: '' },
  vehicleModel: { type: String, default: '' },
  vehicleColor: { type: String, default: '' },
  plateNumber: { type: String, default: '' },

  // User Profile (Step 3)
  age: { type: Number, default: null },
  gender: { type: String, default: '' },
  licenseNumber: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  preferredLanguage: { type: String, default: 'English' },

  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Fallback mock for when MongoDB is unavailable
const MockUser = {
  findOne: async (query) => {
    const db = dbHelper.getFallbackData();
    if (query.email) return db.users.find(u => u.email.toLowerCase() === query.email.toLowerCase()) || null;
    if (query._id) return db.users.find(u => u._id === query._id.toString()) || null;
    return null;
  },
  findById: async (id) => {
    const db = dbHelper.getFallbackData();
    return db.users.find(u => u._id === id.toString()) || null;
  },
  create: async (userData) => {
    const db = dbHelper.getFallbackData();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...userData,
      password: hashedPassword,
      onboardingStep: 1,
      isOnboarded: false,
      emergencyContact1: '', relationship1: '',
      emergencyContact2: '', relationship2: '',
      bloodGroup: '', allergies: '', medicalNotes: '',
      vehicleType: '', vehicleModel: '', vehicleColor: '', plateNumber: '',
      age: null, gender: '', licenseNumber: '', profilePicture: '',
      preferredLanguage: 'English',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    dbHelper.saveFallbackData(db);
    return newUser;
  },
  findByIdAndUpdate: async (id, updateData) => {
    const db = dbHelper.getFallbackData();
    const index = db.users.findIndex(u => u._id === id.toString());
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...updateData };
    dbHelper.saveFallbackData(db);
    return db.users[index];
  }
};

module.exports = {
  Model: mongoose.models.User || mongoose.model('User', UserSchema),
  MockUser
};
