const express = require('express');
const {
  getAdoptedExercisePlanByUser,
  generateExercisePlan,
  saveExercisePlan,
  saveAndAdoptExercisePlan,
  adoptExercisePlan,
  getAllExercisePlansByUser,
  removeSavedPlan,
} = require('../controllers/exercisePlannerController');

const router = express.Router();

// Fetch the adopted exercise plan for a user
router.get('/:userId/adopted', getAdoptedExercisePlanByUser);

// Fetch all exercise plans for a user (only plan info, no exercises)
router.get('/:userId/all', getAllExercisePlansByUser);

// Save an exercise plan
router.post('/save-exercise-plan', saveExercisePlan);

// Save and adopt an exercise plan
router.post('/save-and-adopt-exercise-plan', saveAndAdoptExercisePlan);

// Adopt a specific exercise plan (by ID)
router.post('/adopt-exercise-plan', adoptExercisePlan);

// Generate an exercise plan using AI
router.post('/:userId/generate-exercise-plan', generateExercisePlan);

router.delete('/remove-exercise-plan', removeSavedPlan);

module.exports = router;