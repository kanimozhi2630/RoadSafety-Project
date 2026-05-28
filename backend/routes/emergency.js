const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const auth = require('../middleware/auth');

// @route   POST api/emergency/trigger
// @desc    Trigger emergency response workflow (simulations + SMS)
// @access  Private
router.post('/trigger', auth, emergencyController.triggerEmergency);

// @route   POST api/emergency/cancel
// @desc    Cancel active emergency SOS
// @access  Private
router.post('/cancel', auth, emergencyController.cancelEmergency);

// @route   GET api/emergency/history
// @desc    Get recent emergency logs
// @access  Private
router.get('/history', auth, emergencyController.getEmergencyHistory);

module.exports = router;
