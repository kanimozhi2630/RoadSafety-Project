const Telemetry = require('../models/Telemetry');
const RiskLog = require('../models/RiskLog');
const AccidentLog = require('../models/AccidentLog');
const dbHelper = require('../config/db');
const mongoose = require('mongoose');

// Helper to create simulated ID in fallback mode
const generateId = () => new mongoose.Types.ObjectId().toString();

// Log Telemetry
exports.logTelemetry = async (req, res) => {
  const userId = req.user.id;
  const telemetryData = {
    userId,
    ...req.body,
    timestamp: new Date()
  };

  try {
    if (dbHelper.isFallback()) {
      const db = dbHelper.getFallbackData();
      const newLog = {
        _id: generateId(),
        ...telemetryData,
        timestamp: newLog?.timestamp?.toISOString() || new Date().toISOString()
      };
      db.telemetryLogs.push(newLog);
      dbHelper.saveFallbackData(db);
      res.status(201).json(newLog);
    } else {
      const newLog = new Telemetry(telemetryData);
      await newLog.save();
      res.status(201).json(newLog);
    }
  } catch (err) {
    console.error('Log telemetry error:', err.message);
    res.status(500).send('Server error');
  }
};

// Get Telemetry History
exports.getTelemetryHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    if (dbHelper.isFallback()) {
      const db = dbHelper.getFallbackData();
      const userLogs = db.telemetryLogs
        .filter(log => log.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 100);
      res.json(userLogs);
    } else {
      const logs = await Telemetry.find({ userId })
        .sort({ timestamp: -1 })
        .limit(100);
      res.json(logs);
    }
  } catch (err) {
    console.error('Get telemetry error:', err.message);
    res.status(500).send('Server error');
  }
};

// Log Risk Analysis
exports.logRisk = async (req, res) => {
  const userId = req.user.id;
  const riskData = {
    userId,
    ...req.body,
    timestamp: new Date()
  };

  try {
    if (dbHelper.isFallback()) {
      const db = dbHelper.getFallbackData();
      const newLog = {
        _id: generateId(),
        ...riskData,
        timestamp: new Date().toISOString()
      };
      db.riskLogs.push(newLog);
      dbHelper.saveFallbackData(db);
      res.status(201).json(newLog);
    } else {
      const newLog = new RiskLog(riskData);
      await newLog.save();
      res.status(201).json(newLog);
    }
  } catch (err) {
    console.error('Log risk error:', err.message);
    res.status(500).send('Server error');
  }
};

// Get Risk History
exports.getRiskHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    if (dbHelper.isFallback()) {
      const db = dbHelper.getFallbackData();
      const userLogs = db.riskLogs
        .filter(log => log.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50);
      res.json(userLogs);
    } else {
      const logs = await RiskLog.find({ userId })
        .sort({ timestamp: -1 })
        .limit(50);
      res.json(logs);
    }
  } catch (err) {
    console.error('Get risk error:', err.message);
    res.status(500).send('Server error');
  }
};

// Log Accident Event
exports.logAccident = async (req, res) => {
  const userId = req.user.id;
  const accidentData = {
    userId,
    ...req.body,
    timestamp: new Date()
  };

  try {
    if (dbHelper.isFallback()) {
      const db = dbHelper.getFallbackData();
      const newLog = {
        _id: generateId(),
        ...accidentData,
        timestamp: new Date().toISOString()
      };
      db.accidentLogs.push(newLog);
      dbHelper.saveFallbackData(db);
      res.status(201).json(newLog);
    } else {
      const newLog = new AccidentLog(accidentData);
      await newLog.save();
      res.status(201).json(newLog);
    }
  } catch (err) {
    console.error('Log accident error:', err.message);
    res.status(500).send('Server error');
  }
};

// Get Accident History
exports.getAccidentHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    if (dbHelper.isFallback()) {
      const db = dbHelper.getFallbackData();
      const userLogs = db.accidentLogs
        .filter(log => log.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50);
      res.json(userLogs);
    } else {
      const logs = await AccidentLog.find({ userId })
        .sort({ timestamp: -1 })
        .limit(50);
      res.json(logs);
    }
  } catch (err) {
    console.error('Get accident error:', err.message);
    res.status(500).send('Server error');
  }
};
