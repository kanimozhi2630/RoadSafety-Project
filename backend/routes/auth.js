const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/user
// @desc    Get current user details
// @access  Private
router.get('/user', auth, authController.getUser);

// @route   PUT api/auth/onboarding
// @desc    Update onboarding details
// @access  Private
router.put('/onboarding', auth, authController.updateOnboarding);

// @route   PUT api/auth/profile
// @desc    Update user profile, emergency, vehicle details
// @access  Private
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
