const express = require('express');
const auth = require('../middleware/auth');
const {
  getMealProgress,
  upsertMealProgress,
  getExerciseProgress,
  upsertExerciseProgress
} = require('../controllers/homeController');

const router = express.Router();

// Meals
router.get('/meal',     auth, getMealProgress);
router.post('/meal',    auth, upsertMealProgress);

// Exercises
router.get('/exercise', auth, getExerciseProgress);
router.post('/exercise',auth, upsertExerciseProgress);

module.exports = router;
