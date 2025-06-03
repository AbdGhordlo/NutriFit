const express = require('express');
const {
  getAdoptedExercisePlanByUser,
  generateExercisePlan,
  saveExercisePlan,
  saveAndAdoptExercisePlan,
  adoptExercisePlan,
  getAllExercisePlansByUser,
  removeSavedPlan,
  regenerateDay,
  regenerateExercise,
  getFavoriteExercises,
  addFavoriteExercise,
  removeFavoriteExercise,
  replaceExerciseWithFavorite,
} = require('../controllers/exercisePlannerController');

const router = express.Router();

// Fetch the adopted exercise plan for a user
router.get('/adopted/:userId', getAdoptedExercisePlanByUser);

// Fetch all exercise plans for a user (only plan info, no exercises)
router.get('/all/:userId', getAllExercisePlansByUser);

// Save an exercise plan
router.post('/save-exercise-plan', saveExercisePlan);

// Save and adopt an exercise plan
router.post('/save-and-adopt-exercise-plan', saveAndAdoptExercisePlan);

// Adopt a specific exercise plan (by ID)
router.post('/adopt-exercise-plan', adoptExercisePlan);

// Generate an exercise plan using AI
router.post('/generate-exercise-plan', generateExercisePlan);

router.delete('/remove-exercise-plan', removeSavedPlan);

// --------------------------- Edit Routes
router.get('/favorites/:userId', getFavoriteExercises);
router.post('/favorites', addFavoriteExercise);
router.delete('/favorites', removeFavoriteExercise);

router.post('/regenerate-day', regenerateDay);
router.post('/regenerate-exercise', regenerateExercise);
router.post('/replace-with-favorite', replaceExerciseWithFavorite);

module.exports = router;