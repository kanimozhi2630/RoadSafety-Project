const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isFallbackMode = false;
const fallbackDbPath = path.join(__dirname, '../data/fallback_db.json');

const dataDir = path.dirname(fallbackDbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const getFallbackData = () => {
  try {
    if (fs.existsSync(fallbackDbPath)) {
      const fileData = fs.readFileSync(fallbackDbPath, 'utf8');
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Error reading fallback database:', error);
  }
  return { users: [], vehicles: [], telemetryLogs: [], riskLogs: [], accidentLogs: [], emergencyLogs: [] };
};

const saveFallbackData = (data) => {
  try {
    fs.writeFileSync(fallbackDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing fallback database:', error);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ MongoDB Connected — IntelSOS Database Active');
    isFallbackMode = false;
  } catch (err) {
    console.warn('⚠️  MongoDB Connection Failed — Activating Local JSON Fallback');
    isFallbackMode = true;

    if (!fs.existsSync(fallbackDbPath)) {
      saveFallbackData({ users: [], vehicles: [], telemetryLogs: [], riskLogs: [], accidentLogs: [], emergencyLogs: [] });
    }
  }
};

module.exports = {
  connectDB,
  isFallback: () => isFallbackMode,
  getFallbackData,
  saveFallbackData
};
