const express = require('express');
const {
  getProgressData,
  createOrUpdateProgressData,
  updateProgressData,
  getCompletedDaysCount,
  updateCompletedDaysCount
} = require('../controllers/progressController');
const router = express.Router();

// Route to get progress data for a user
router.get('/:userId', getProgressData);

// Route to create or update progress data for a user
router.post('/:userId', createOrUpdateProgressData);

// Route to update specific progress data
router.put('/:userId/progress/:progressId', updateProgressData);

// Route to get completed_days_count for a user
router.get('/:userId/completed-days-count', getCompletedDaysCount);

// Route to increment or decrement completed_days_count for a user
router.put('/:userId/completed-days-count', updateCompletedDaysCount);

module.exports = router;
