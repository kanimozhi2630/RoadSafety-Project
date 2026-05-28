const { Model: User, MockUser } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbHelper = require('../config/db');

const getUserModel = () => dbHelper.isFallback() ? MockUser : User;

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { user: { id: userId } },
    process.env.JWT_SECRET || 'lifelink_secret_key_2024',
    { expiresIn: '30d' }
  );
};

// Register User
exports.register = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    const Model = getUserModel();
    
    // Check if user already exists
    let existingUser;
    if (dbHelper.isFallback()) {
      existingUser = await MockUser.findOne({ email });
    } else {
      existingUser = await User.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    let user;
    if (dbHelper.isFallback()) {
      user = await MockUser.create({ name, email, password, mobile });
    } else {
      user = new User({ name, email, password, mobile });
      await user.save();
    }

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isOnboarded: user.isOnboarded,
        onboardingStep: user.onboardingStep
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).send('Server error');
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const Model = getUserModel();
    let user;

    if (dbHelper.isFallback()) {
      user = await MockUser.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    let isMatch = false;
    if (dbHelper.isFallback()) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = await user.comparePassword(password);
    }

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isOnboarded: user.isOnboarded,
        onboardingStep: user.onboardingStep
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
};

// Get Current User Info
exports.getUser = async (req, res) => {
  try {
    let user;
    if (dbHelper.isFallback()) {
      user = await MockUser.findById(req.user.id);
    } else {
      user = await User.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).send('Server error');
  }
};

// Update Onboarding Steps
exports.updateOnboarding = async (req, res) => {
  const { step, data } = req.body;
  const userId = req.user.id;

  try {
    let updateFields = {};

    if (step === 1) {
      // Step 1: Emergency Contact & Medical Info
      updateFields = {
        emergencyContact1: data.emergencyContact1,
        relationship1: data.relationship1,
        emergencyContact2: data.emergencyContact2,
        relationship2: data.relationship2,
        bloodGroup: data.bloodGroup,
        allergies: data.allergies,
        medicalNotes: data.medicalNotes,
        onboardingStep: 2
      };
    } else if (step === 2) {
      // Step 2: Vehicle Info
      updateFields = {
        vehicleType: data.vehicleType,
        vehicleModel: data.vehicleModel,
        vehicleColor: data.vehicleColor,
        plateNumber: data.plateNumber,
        onboardingStep: 3
      };
    } else if (step === 3) {
      // Step 3: User Profile
      updateFields = {
        age: data.age,
        gender: data.gender,
        licenseNumber: data.licenseNumber,
        profilePicture: data.profilePicture, // base64 string
        onboardingStep: 3,
        isOnboarded: true
      };
    } else {
      return res.status(400).json({ msg: 'Invalid step' });
    }

    let updatedUser;
    if (dbHelper.isFallback()) {
      updatedUser = await MockUser.findByIdAndUpdate(userId, updateFields);
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true }
      ).select('-password');
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Update onboarding error:', err.message);
    res.status(500).send('Server error');
  }
};

// Update Profile details
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    email,
    mobile,
    age,
    gender,
    licenseNumber,
    profilePicture,
    vehicleType,
    vehicleModel,
    vehicleColor,
    plateNumber,
    emergencyContact1,
    relationship1,
    emergencyContact2,
    relationship2,
    bloodGroup,
    allergies,
    medicalNotes
  } = req.body;

  try {
    // Check email uniqueness if email is changed
    if (email) {
      const Model = getUserModel();
      let existingUser;
      if (dbHelper.isFallback()) {
        existingUser = await MockUser.findOne({ email });
      } else {
        existingUser = await Model.findOne({ email });
      }
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ msg: 'Email is already in use by another user' });
      }
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (mobile !== undefined) updateFields.mobile = mobile;
    if (age !== undefined) updateFields.age = age;
    if (gender !== undefined) updateFields.gender = gender;
    if (licenseNumber !== undefined) updateFields.licenseNumber = licenseNumber;
    if (profilePicture !== undefined) updateFields.profilePicture = profilePicture;
    if (vehicleType !== undefined) updateFields.vehicleType = vehicleType;
    if (vehicleModel !== undefined) updateFields.vehicleModel = vehicleModel;
    if (vehicleColor !== undefined) updateFields.vehicleColor = vehicleColor;
    if (plateNumber !== undefined) updateFields.plateNumber = plateNumber;
    if (emergencyContact1 !== undefined) updateFields.emergencyContact1 = emergencyContact1;
    if (relationship1 !== undefined) updateFields.relationship1 = relationship1;
    if (emergencyContact2 !== undefined) updateFields.emergencyContact2 = emergencyContact2;
    if (relationship2 !== undefined) updateFields.relationship2 = relationship2;
    if (bloodGroup !== undefined) updateFields.bloodGroup = bloodGroup;
    if (allergies !== undefined) updateFields.allergies = allergies;
    if (medicalNotes !== undefined) updateFields.medicalNotes = medicalNotes;

    let updatedUser;
    if (dbHelper.isFallback()) {
      updatedUser = await MockUser.findByIdAndUpdate(userId, updateFields);
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true }
      ).select('-password');
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).send('Server error');
  }
};
