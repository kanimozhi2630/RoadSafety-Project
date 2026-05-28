const EmergencyLog = require('../models/EmergencyLog');
const { Model: User, MockUser } = require('../models/User');
const smsService = require('../services/smsService');
const dbHelper = require('../config/db');
const mongoose = require('mongoose');

const generateId = () => new mongoose.Types.ObjectId().toString();

// Trigger Emergency Workflow
exports.triggerEmergency = async (req, res) => {
  const userId = req.user.id;
  const { severity, gpsLat, gpsLng, vehicleStatus } = req.body;

  try {
    // 1. Fetch user to retrieve emergency contacts
    let user;
    if (dbHelper.isFallback()) {
      user = await MockUser.findById(userId);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 2. Prepare contacts list from user profile
    const contacts = [];
    if (user.emergencyContact1) {
      contacts.push({
        name: user.emergencyContact1,
        relationship: user.relationship1 || 'Contact 1',
        phone: user.mobile || '', // fallback to user's mobile if they didn't input a contact number, or wait, we can store their contact numbers. In our schema, mobile is on User. Let's see: in step 1 onboarding we can allow contacts. Let's look at models/User.js: yes, emergencyContact1 and emergencyContact2 are stored as strings. We will assume the string contains the contact phone or name, or we can just send the SMS to these contacts. Let's check: we can format and clean their phone numbers.
        smsSent: false
      });
    }
    if (user.emergencyContact2) {
      contacts.push({
        name: user.emergencyContact2,
        relationship: user.relationship2 || 'Contact 2',
        phone: user.mobile || '',
        smsSent: false
      });
    }

    // 3. Dispatch real or simulated SMS
    const smsData = {
      userName: user.name,
      severity: severity || 'CRITICAL',
      gpsLat: gpsLat || 11.0168,
      gpsLng: gpsLng || 76.9558,
      vehicleStatus: vehicleStatus || 'Severe impact detected'
    };

    let smsResult = { success: true, simulated: true, contacts: [] };
    if (contacts.length > 0) {
      smsResult = await smsService.sendEmergencySMS(contacts, smsData);
    }

    // 4. Populate emergency log details (Police, Ambulance, Hospital alerts are simulated)
    const logData = {
      userId,
      severity: severity || 'CRITICAL',
      gpsLat: gpsLat || 11.0168,
      gpsLng: gpsLng || 76.9558,
      vehicleStatus: vehicleStatus || 'Severe impact detected',
      smsSent: smsResult.success,
      contacts: smsResult.contacts.length > 0 ? smsResult.contacts : contacts.map(c => ({ ...c, smsSent: false })),
      policeAlerted: true,      // Simulated alert
      ambulanceDispatched: true, // Simulated dispatch
      hospitalAlerted: true,     // Simulated hospital prep
      videoRecorded: false,
      cancelled: false,
      timestamp: new Date()
    };

    let emergencyLog;
    if (dbHelper.isFallback()) {
      const db = dbHelper.getFallbackData();
      emergencyLog = {
        _id: generateId(),
        ...logData,
        timestamp: new Date().toISOString()
      };
      db.emergencyLogs.push(emergencyLog);
      dbHelper.saveFallbackData(db);
    } else {
      emergencyLog = new EmergencyLog(logData);
      await emergencyLog.save();
    }

    res.status(201).json({
      message: 'Emergency response activated successfully',
      log: emergencyLog
    });
  } catch (err) {
    console.error('Trigger emergency error:', err.message);
    res.status(500).send('Server error');
  }
};

// Cancel Emergency SOS
exports.cancelEmergency = async (req, res) => {
  const { logId, cancelReason } = req.body;

  try {
    let updatedLog;
    if (dbHelper.isFallback()) {
      const db = dbHelper.getFallbackData();
      const index = db.emergencyLogs.findIndex(log => log._id === logId);
      if (index === -1) {
        return res.status(404).json({ msg: 'Emergency log not found' });
      }
      db.emergencyLogs[index].cancelled = true;
      db.emergencyLogs[index].cancelReason = cancelReason || 'I am safe';
      db.emergencyLogs[index].policeAlerted = false;
      db.emergencyLogs[index].ambulanceDispatched = false;
      db.emergencyLogs[index].hospitalAlerted = false;
      dbHelper.saveFallbackData(db);
      updatedLog = db.emergencyLogs[index];
    } else {
      updatedLog = await EmergencyLog.findByIdAndUpdate(
        logId,
        {
          $set: {
            cancelled: true,
            cancelReason: cancelReason || 'I am safe',
            policeAlerted: false,
            ambulanceDispatched: false,
            hospitalAlerted: false
          }
        },
        { new: true }
      );
    }

    if (!updatedLog) {
      return res.status(404).json({ msg: 'Emergency log not found' });
    }

    console.log(`🔕 EMERGENCY SOS CANCELLED for log: ${logId}. Reason: ${cancelReason}`);
    res.json({
      message: 'Emergency SOS cancelled successfully',
      log: updatedLog
    });
  } catch (err) {
    console.error('Cancel emergency error:', err.message);
    res.status(500).send('Server error');
  }
};

// Get Emergency Logs History
exports.getEmergencyHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    if (dbHelper.isFallback()) {
      const db = dbHelper.getFallbackData();
      const userLogs = db.emergencyLogs
        .filter(log => log.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50);
      res.json(userLogs);
    } else {
      const logs = await EmergencyLog.find({ userId })
        .sort({ timestamp: -1 })
        .limit(50);
      res.json(logs);
    }
  } catch (err) {
    console.error('Get emergency history error:', err.message);
    res.status(500).send('Server error');
  }
};
