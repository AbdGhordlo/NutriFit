const express = require('express');
const auth = require('../middleware/auth');
const {
  getMealProgress,
  upsertMealProgress,
  resetDailyMealProgress,
  getExerciseProgress,
  upsertExerciseProgress,
  resetDailyExerciseProgress
} = require('../controllers/homeController');

const router = express.Router();

// Meals
router.get('/meal', auth, getMealProgress);
router.post('/meal', auth, upsertMealProgress);
router.delete('/meal/today', auth, resetDailyMealProgress);

// Exercises
router.get('/exercise', auth, getExerciseProgress);
router.post('/exercise',auth, upsertExerciseProgress);
router.delete('/exercise/today', auth, resetDailyExerciseProgress);

module.exports = router;
