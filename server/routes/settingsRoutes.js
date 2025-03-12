const express = require('express');
const { 
  getUserSettings, 
  updateUserSettings, 
  updateUserProfile,
  updateUserPassword 
} = require('../controllers/settingsController');
const router = express.Router();

// Get user settings
router.get('/:userId', getUserSettings);

// Update user settings
router.put('/:userId', updateUserSettings);

// Update user profile
router.put('/:userId/profile', updateUserProfile);

// Update user password
router.put('/:userId/password', updateUserPassword);

module.exports = router;
