const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');
const auth = require('../middleware/auth');

// @route   POST api/telemetry/log
// @desc    Log telemetry data point
// @access  Private
router.post('/log', auth, telemetryController.logTelemetry);

// @route   GET api/telemetry/history
// @desc    Get recent telemetry logs
// @access  Private
router.get('/history', auth, telemetryController.getTelemetryHistory);

// @route   POST api/telemetry/risk
// @desc    Log risk analysis score and breakdown
// @access  Private
router.post('/risk', auth, telemetryController.logRisk);

// @route   GET api/telemetry/risk-history
// @desc    Get recent risk logs
// @access  Private
router.get('/risk-history', auth, telemetryController.getRiskHistory);

// @route   POST api/telemetry/accident
// @desc    Log accident event
// @access  Private
router.post('/accident', auth, telemetryController.logAccident);

// @route   GET api/telemetry/accident-history
// @desc    Get recent accident logs
// @access  Private
router.get('/accident-history', auth, telemetryController.getAccidentHistory);

module.exports = router;
