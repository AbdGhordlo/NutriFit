const express = require('express');
const {
  getProgressData,
  createOrUpdateProgressData,
  updateProgressData,
  getCompletedDaysCount,
  updateCompletedDaysCount,
  addMeasurement,
  getMeasurementsByType,
  editLastMeasurement,
  getPenaltyDaysCount,
  updatePenaltyDaysCount
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

// Route to add a new measurement for a user
router.post('/:userId/add-measurement', addMeasurement);

// Route to get all measurements of a specific type for a user
router.get('/:userId/measurements/:measurement_type', getMeasurementsByType);

// Route to edit (overwrite) the most recent measurement of a type within a 2-week window
router.put('/:userId/edit-measurement/:measurement_type', editLastMeasurement);

// Route to get penalty_days_count for a user
router.get('/:userId/penalty-days-count', getPenaltyDaysCount);

// Route to increment or decrement penalty_days_count for a user
router.put('/:userId/penalty-days-count', updatePenaltyDaysCount);

module.exports = router;
