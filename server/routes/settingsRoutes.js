const express = require('express');
const { 
  getUserSettings, 
  updateUserSettings, 
  updateUserProfile,
  updateUserPassword,
  toggleMealReminders,
  toggleExerciseReminders,
  toggleWaterIntakeReminder,
  getMealReminders,
  getExerciseReminders,
  getWaterIntakeReminder
} = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user settings
router.get('/:userId', getUserSettings);

// Update user settings
router.put('/:userId', updateUserSettings);

// Update user profile
router.put('/:userId/profile', updateUserProfile);

// Update user password
router.put('/:userId/password', updateUserPassword);

// Toggle notification settings
router.patch('/:userId/meal-reminders', auth, toggleMealReminders);
router.patch('/:userId/exercise-reminders', auth, toggleExerciseReminders);
router.patch('/:userId/water-intake-reminder', auth, toggleWaterIntakeReminder);

// Get state of individual notification settings
router.get('/:userId/meal-reminders', auth, getMealReminders);
router.get('/:userId/exercise-reminders', auth, getExerciseReminders);
router.get('/:userId/water-intake-reminder', auth, getWaterIntakeReminder);

module.exports = router;
